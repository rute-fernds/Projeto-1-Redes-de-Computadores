import { createRoomDiv, setRoomName, listClients, createMessageDiv,
         createImgMessageDiv, createFileMessageDiv }
from './index.js';


var socketio = io();

const client = {name : "", roomId : "" };


// listeners

socketio.on("get_rooms", (rooms) => {
    rooms.forEach((room) => {
        createRoomDiv(room["id"], room["name"], room["clients"]);
    });
});


socketio.on("load_room", (roomData) => {
    setRoomName(roomData["name"]);
    listClients(roomData["clients"]);
    
    roomData["messages"].forEach((message) => {
        createMessageDiv(message["author"], message["text"], message["file"], message["timeStamp"]);
    });
});


socketio.on("get_message", (message) => {
    if (message["type"] == "txt") {
        createMessageDiv(message["author"], message["text"], message["timeStamp"]);
    }
    else if (message["type"] == "img") {
        let imgBuffer = new Uint8Array(message["file_buffer"]);
        var blob = new Blob([imgBuffer], {type : "image/jpg"});

        var imgUrl = URL.createObjectURL(blob);

        createImgMessageDiv(message["author"], imgUrl, message["timeStamp"]);
    }
    else {
        let buffer = new Uint8Array(message["file_buffer"]);
        var blob = new Blob([buffer]); // TODO: definir tipo ?

        var fileUrl = URL.createObjectURL(blob);

        createFileMessageDiv(message["author"], fileUrl, message["timeStamp"]);
    }
});


// funções de emissão de mensagens ao servidor

function Register(clientName) {
    client.name = clientName;
    socketio.emit("register", {client_name : client.name});
}

function CreateRoom(roomName) {
    socketio.emit("create_room", {room_name : roomName});
}

function EnterRoom(roomId) {
    client.roomId = roomId;
    socketio.emit("enter_room", {room_id : client.roomId});
}

function LeaveRoom() {
    client.roomId = "";
    socketio.send("leave_room");
}

function RemoveRoom() {
    socketio.emit("remove_room", {room_id : client.roomId});
}

function SendMessage(type, msgText=null, fileData=null) {
    if (type == "txt") {
        socketio.emit("send_message", {type: "txt", text : msgText});
    }
    else {
        var imgBuffer = fileData.arrayBuffer; // ArrayBuffer(fileData) ?
        socketio.emit("send_message", {type : msgFile.type, file_buffer : imgBuffer});
    }
}
