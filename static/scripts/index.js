import {Register, CreateRoom, EnterRoom, LeaveRoom, RemoveRoom,
        SendMessage, CreateMessageDiv, CreateRoomLi, EmptyChat}
from "./back-front.js";

document.addEventListener("DOMContentLoaded", function () {

    const loginSection = document.querySelector(".login");
    const chatRoomSection = document.querySelector(".chat-room");
    const chatSection = document.querySelector(".chat");
    const registerButton = document.getElementById("register");
    const usernameInput = document.getElementById("username-input");
    const chatRoomItems = document.querySelectorAll(".chat-room__item");

    const chatMessages = document.querySelector(".chat__messages");
    const chatForm = document.querySelector(".chat__form");
    const chatInput = document.getElementById("chat-input");

    // Esconde as seções de escolha de chat-room e o chat
    chatRoomSection.style.display = "none";
    chatSection.style.display = "none";

    // Lógica para o login
    registerButton.addEventListener("click", function (event) {
        event.preventDefault();

        const username = usernameInput.value.trim();

        if (username === "") {
            alert("Por favor, digite seu nome");
            return;
        }

        localStorage.setItem("chatUsername", username);

        loginSection.style.display = "none";
        chatRoomSection.style.display = "block";

        Register(localStorage.getItem("chatUsername"));
    });

    /*
    // Lógica de seleção do chat
    chatRoomItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const selectedRoom = item.getAttribute("data-room");
            localStorage.setItem("selectedRoom", selectedRoom);

            chatRoomSection.style.display = "none";
            chatSection.style.display = "block";

            location.reload()

            //EnterRoom(selectedRoom.getAttribute("data-room"));
        });
    });
    */

    // Lógica do envio de mensagens
    chatForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const username = localStorage.getItem("chatUsername") || "Usuário";
        
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const time = `[${hours}:${minutes}]`;


        const messageText = chatInput.value.trim();
        if (messageText === "") {
            return;
        }

        // TODO: obter file e inserir no CreateMessageDiv

        // Criando Mensagem
        CreateMessageDiv(username, messageText, time);

        chatMessages.scrollTop = chatMessages.scrollHeight;

        chatInput.value = "";

        SendMessage(messageText, null, null, time);
    });

    const createRoomBtn = document.getElementById('create-room');
    const createRoomSection = document.querySelector('.create-room');
    const cancelCreateBtn = document.getElementById('cancel-create');

    createRoomBtn.addEventListener('click', () => {
        chatRoomSection.style.display = "none"; 
        createRoomSection.classList.remove('hidden');
    });

    cancelCreateBtn.addEventListener('click', () => {
        createRoomSection.classList.add('hidden'); 
        chatRoomSection.style.display = "block"; 
    });

    const createRoomForm = document.getElementById('create-room-form');
    
    /* const roomList = document.querySelector('.chat-room__list'); */

    createRoomForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const roomName = document.getElementById('room-name').value.trim();
        if (roomName === "") return;

        createRoomSection.classList.add('hidden');
        createRoomForm.reset();

        /* localStorage.setItem("selectedRoom", roomId); */
        chatRoomSection.style.display = "none";
        chatSection.style.display = "block";

        CreateRoom(roomName);
    });

    // Saindo do chat
    document.getElementById("exit-room").addEventListener("click", function () {        
        localStorage.setItem("roomId", "");

        document.querySelector(".chat").style.display = "none";
        document.querySelector(".chat-room").style.display = "block";

        EmptyChat();
        LeaveRoom();
    });

    const scrollScreen = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
            });
    }

});

