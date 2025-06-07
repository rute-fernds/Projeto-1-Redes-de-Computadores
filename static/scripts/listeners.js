import {CreateRoomLi, SetRoomName, ListUsers, CreateMessageDiv,
        CreateImgMessageDiv, CreateFileMessageDiv, EmptyRoomList, 
        EmptyChat, EnterRoom}
from './back-front.js';

export var socketio = io();


// listeners

socketio.on("enter_new_room", (roomId) => {
    EnterRoom(roomId);
});

socketio.on("get_rooms", (rooms) => {
    EmptyRoomList();

    rooms.forEach((room) => {
        CreateRoomLi(room["id"], room["name"], room["clients"]);
    });
});

socketio.on("load_room", (roomData) => {
    console.log(roomData["messages"]);
    EmptyChat();
    //SetRoomName(roomData["name"]);
    //ListUsers(roomData["clients"]);
    
    roomData["messages"].forEach((message) => {
        CreateMessageDiv(message["author"], message["text"], message["time"]); // , message["file_buffer"]
    });
});


socketio.on("get_message", (message) => {
    CreateMessageDiv(message["author"], message["text"], message["time"]);
    if (message["type"] == "txt") {
    }
    // n vai rolar arquivos :(
    else if (message["type"] == "img") {
        let imgBuffer = new Uint8Array(message["file_buffer"]);
        var blob = new Blob([imgBuffer], {type : "image/jpg"});

        var imgUrl = URL.createObjectURL(blob);

        CreateImgMessageDiv(message["author"], imgUrl, message["time"]);
    }
    else {
        let buffer = new Uint8Array(message["file_buffer"]);
        var blob = new Blob([buffer]); // TODO: definir tipo ?

        var fileUrl = URL.createObjectURL(blob);

        CreateFileMessageDiv(message["author"], fileUrl, message["time"]);
    }
});
