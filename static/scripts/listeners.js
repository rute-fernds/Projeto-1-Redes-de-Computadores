import { createRoomDiv, setRoomName, listUsers, createMessageDiv,
         createImgMessageDiv, createFileMessageDiv }
from './back-front.js';

// TODO: arrumar o import (tá quebrando o script)

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
    listUsers(roomData["clients"]);
    
    roomData["messages"].forEach((message) => {
        createMessageDiv(message["author"], message["text"], message["file_buffer"], message["timeStamp"]);
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
