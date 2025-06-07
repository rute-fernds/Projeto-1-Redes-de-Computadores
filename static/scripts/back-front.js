import { socketio } from "./listeners.js";

// funções chamadas pelo frontend para emissão de mensagens ao servidor

export function Register(username) {
    socketio.emit("register", {client_name : username});
}

export function CreateRoom(roomName) {
    socketio.emit("create_room", {room_name : roomName});
}

export function EnterRoom(roomId) {
    socketio.emit("enter_room", {room_id : roomId});
}

export function LeaveRoom() {
    socketio.send("leave_room");
}

export function RemoveRoom(roomId) {
    socketio.emit("remove_room", {room_id : roomId});
}

export function SendMessage(msgText=null, fileType=null, fileData=null) {
    if (fileType && fileData) {
        var fileBuffer = fileData.arrayBuffer; // ArrayBuffer(fileData) ?
    }
    socketio.emit("send_message", {text : msgText, file_type : fileType, file_buffer : fileBuffer});
}


// funções chamadas pelo backend para atualizar o HTML

export function EmptyRoomList() {
    const roomList = document.querySelector('.chat-room__list');
    roomList.innerHTML = "";
}

/* cria um li na lista de salas, como nome, */
export function CreateRoomLi (roomId, roomName) {
    const chatRoomSection = document.querySelector(".chat-room");
    const chatSection = document.querySelector(".chat");

    const roomList = document.querySelector('.chat-room__list');


    const newRoom = document.createElement('li');
    newRoom.classList.add('chat-room__item');
    // newRoom.setAttribute('data-room', roomId); // receber roomId do servidor
    newRoom.innerHTML = `
        <span class="chat-room__name">${roomName}</span>
        <button class="chat-room__delete" data-room="${roomId}">
            <img src="../img/delete.png" alt="">
        </button>
    `;

    // Evento para entrar na sala criada
    newRoom.addEventListener("click", function (event) {
        if (event.target.closest('.chat-room__delete')) return;

        localStorage.setItem("selectedRoom", roomId);
        chatRoomSection.style.display = "none";
        chatSection.style.display = "block";
    });

    // Evento para deletar sala
    newRoom.querySelector(".chat-room__delete").addEventListener("click", function (event) {
        event.stopPropagation();
        newRoom.remove();
    });

    roomList.appendChild(newRoom);
}

/* define o nome que vai aparecer no topo da página da sala */
export function SetRoomName () {

}

/* lista os nomes dos usuários presentes na sala no topo da página da sala */
export function ListUsers () {

}


export function EmptyChat() {
    const chatMessages = document.querySelector(".chat__messages");
    chatMessages.innerHTML = "";
}


/* cria uma div para uma nova mensagem */
export function CreateMessageDiv(username, messageText, fileType, file, time) {
    const chatMessages = document.querySelector(".chat__messages");
    
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat__message", "message--self"); 

    messageDiv.innerHTML = `
        <span class="message__time">${time}</span>
        <span class="message__user">${username}:</span>
        <span class="message__text">${messageText}</span>
    `;

    chatMessages.appendChild(messageDiv);
}

/* cria uma  div para uma nova mensagem com imagem */
export function CreateImgMessageDiv () {

}

/* cria uma div para uma nova mensagem com um botão de download de aquivo */
export function CreateFileMessageDiv () {

}
