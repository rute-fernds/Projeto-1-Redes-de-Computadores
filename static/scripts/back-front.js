// funções chamadas pelo frontend para emissão de mensagens ao servidor

export function Register(clientName) {
    client.name = clientName;
    socketio.emit("register", {client_name : client.name});
}

export function CreateRoom(roomName) {
    socketio.emit("create_room", {room_name : roomName});
}

export function EnterRoom(roomId) {
    client.roomId = roomId;
    socketio.emit("enter_room", {room_id : client.roomId});
}

export function LeaveRoom() {
    client.roomId = "";
    socketio.send("leave_room");
}

export function RemoveRoom() {
    socketio.emit("remove_room", {room_id : client.roomId});
}

export function SendMessage(type, msgText=null, fileData=null) {
    if (type == "txt") {
        socketio.emit("send_message", {type: "txt", text : msgText});
    }
    else {
        var fileBuffer = fileData.arrayBuffer; // ArrayBuffer(fileData) ?
        socketio.emit("send_message", {type : msgFile.type, file_buffer : fileBuffer});
    }
}


// funções chamadas pelo backend para atualizar o HTML

/* cria um li na lista de salas, como nome, */
export function createRoomLi (roomId, roomName, roomClients) {

}

/* define o nome que vai aparecer no topo da página da sala */
export function setRoomName () {

}

/* lista os nomes dos usuários presentes na sala no topo da página da sala */
export function listUsers () {

}

/* cria uma div para uma nova mensagem */
export function createMessageDiv () {

}

/* cria uma  div para uma nova mensagem com imagem */
export function createImgMessageDiv () {

}

/* cria uma div para uma nova mensagem com um botão de download de aquivo */
export function createFileMessageDiv () {

}
