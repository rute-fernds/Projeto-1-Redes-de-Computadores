from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, send
from uuid import uuid4

# import mimetypes
# mimetypes.add_type('application/javascript', '.js')

app = Flask(__name__)
app.config["SECRET_KEY"] = "secreta!"
socketio = SocketIO(app)

# TODO: testar suporte para mensagens com arquivo
# TODO: resolução de nomes (opcional)


class Message:
    def __init__(self, author:str, text:str="", fileType=None, fileBuffer=None, time:str=""):
        self.author :str = author
        self.text :str = text
        #self.fileType :str = fileType
        #self.fileBuffer = fileBuffer
        self.time :str = time

    def formatMessage(self) -> dict:
        return {
                "author"      : self.author,
                "text"        : self.text,
                #"file_type"   : self.fileType,
                #"file_buffer" : self.fileBuffer,
                "time"        : self.time
        }
        

    def getAuthor(self) -> str:
        return self.author

    def getText(self):
        return self.text


class Client:
    def __init__(self, sid:str, name:str):
        self.id :str = str(uuid4())
        self.sid :str = sid
        self.name :str = name
        self.room_id : str = ""
    
    def getSID(self) -> str:
        return self.sid

    def getRoomId(self) -> str:
        return self.room_id

    def enterRoom(self, room_id:str):
        if getChatRoom(room_id):
            self.room_id = room_id

    def leaveRoom(self):
        self.room_id = ""


class ChatRoom:
    def __init__(self, name:str, owner:Client):
        self.id = str(uuid4())
        self.name :str = name
        self.owner :str = owner.name
        self.clients :list[str] = []
        self.messages :list[Message] = []

    def addClient(self, client:Client):
        self.clients.append(client.id)
        client.enterRoom(self.id)

    def removeClient(self, client_id:str):
        client_index = -1
        for client_index in range(len(self.clients)):
            if self.clients[client_index] == client_id:
                break
        self.clients.pop(client_index)

    def addMessage(self, message:Message):
        self.messages.append(message)



# dicionário com todos as salas
chatrooms :dict[str, ChatRoom] = {}
# dicionário com todos os clientes conectados
clients :dict[str, Client] = {}


# checa se existe cliente com o nome dado
def verifyClientName(client_name:str) -> bool:
    for client in clients.values():
        if client.name == client_name:
            return True

    return False

# checa se existe sala com o nome dado
def verifyRoomName(room_name:str) -> bool:
    for room in chatrooms.values():
        if room.name == room_name:
            return True

    return False

# puxa de clients o objeto Client com o id dado
def getClient(client_id:str) -> Client | None:
    if client_id in clients.keys():
        return clients[client_id]
    else:
        return None

def getClientBySID(sid:str) -> Client | None:
    for client in clients.values():
        if client.getSID() == sid:
            return client
    return None

# puxa de chatrooms o objeto ChatRoom com o id dado
def getChatRoom(room_id:str) -> ChatRoom | None:
    if room_id in chatrooms:
        return chatrooms[room_id]
    else:
        return None

# lista as salas no formato [(nome, lista_ids_de_clientes)]
def listRooms() -> list[dict]:
    return [{
        "id"      : room.id,
        "name"    : room.name,
        "clients" : room.clients} for room in chatrooms.values()]

# retorna as mensagens da sala no formato [(nome_autor, conteúdo, time)]
def getRoomMessages(room_id) -> list:
    messages = []
    if room_id in chatrooms:
        room = getChatRoom(room_id)
        if room:
            for message in room.messages:
                messages.append(message.formatMessage())
    return messages

# retorna dicionário os dados da sala {nome, dono, ids_dos_clientes, mensagens}
def getRoomData(room_id:str) -> dict | None:
    room = getChatRoom(room_id)
    if room:
        return {
            "name" : room.name,
            "owner" : room.owner,
            "clients" : room.clients,
            "messages" : getRoomMessages(room_id)
        }
    else:
        return None

# função padrão para atualizar a lista de salas pro cliente
def broadcastGetRooms():
    for client_id in clients.keys():
        referent_client = getClient(client_id)
        if referent_client:
            emit("get_rooms", listRooms(), to=referent_client.getSID())


# rotas e páginas

@app.route("/")
def index():
    return render_template("index.html")


# listeners

@socketio.on("register")
def register_client(data):
    if verifyClientName(data["client_name"]):
        send("user_already_exists")
        return

    newClient = Client(request.sid, data["client_name"])
    clients[newClient.id] = newClient

    # NOTE: deve mandar apenas para o cliente específico
    broadcastGetRooms()
    print(f"Cliente \"{newClient.name}\" foi registrado!")


@socketio.on("create_room")
def createRoom(data):
    if verifyRoomName(data["room_name"]):
        send("room_already_exists")
        return

    client = getClientBySID(request.sid)
    if client:
        newRoom = ChatRoom(data["room_name"], client)
        chatrooms[newRoom.id] = newRoom

        broadcastGetRooms()
        emit("enter_new_room", newRoom.id)
        print(f"Sala \"{newRoom.name}\" criada!")


@socketio.on("enter_room")
def loadRoom(data):
    room = getChatRoom(data["room_id"])
    client = getClientBySID(request.sid)

    if not room:
        send("invalid_room")
    elif not client:
        send("invalid_user")
    else:
        if client.getRoomId() != "":
            send("user_already_in_room")
            return

        room.addClient(client)
        client.enterRoom(data["room_id"])

        emit("load_room", getRoomData(room.id))
        print(f"\"{client.name}\" entrou na sala \"{room.name}\"")


@socketio.on("leave_room")
def leaveRoom():
    client = getClientBySID(request.sid)
    if not client:
        send("invalid_user")
    else:
        room = getChatRoom(client.getRoomId())
        if not room:
            send("invalid_room")
        else:
            room.removeClient(client.id)
            client.leaveRoom()

            emit("get_rooms", listRooms())
            print(f"\"{client.name}\" saiu da sala \"{room.name}\"")


@socketio.on("remove_room")
def removeRoom(data):
    client = getClientBySID(request.sid)
    if not client:
        send("invalid_user")
    else:
        room = getChatRoom(data["room_id"])
        if not room:
            send("invalid_room")
        else:
            if len(room.clients) != 0:
                send("room_not_empty")
            else:
                del chatrooms[room.id]

                broadcastGetRooms()
                print(f"Sala \"{room.name}\" removida")


@socketio.on("send_message")
def onClientMessage(data):
    client = getClientBySID(request.sid)
    if not client:
        send("invalid_user")
    else:
        room = getChatRoom(client.getRoomId())
        if not room:
            send("invalid_room")
        else:
            msg = Message(client.name, text=data["text"], time=data["time"]) # fileType=data["file_type"], fileBuffer=data["file_buffer"]

            room.addMessage(msg)

            print(f"\"{client.name}\" mandou mensagem na sala \"{room.name}\"")
            
            # broadcast pra todos os clientes na sala
            for client_id in room.clients:
                if client.id == client_id:
                    continue
                referent_client = getClient(client_id)
                emit("get_message", msg.formatMessage(), to=referent_client.getSID())




if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
