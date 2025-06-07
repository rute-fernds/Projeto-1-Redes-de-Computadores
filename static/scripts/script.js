import {Register, CreateRoom, EnterRoom, LeaveRoom,
        RemoveRoom, SendMessage}
from "./back-front.js";

// TODO: arrumar o import (tá quebrando o script)

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

        // Register(username);
    });

    // Lógica de seleção do chat
    chatRoomItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const selectedRoom = item.getAttribute("data-room");
            localStorage.setItem("selectedRoom", selectedRoom);

            chatRoomSection.style.display = "none";
            chatSection.style.display = "block";
        });
    });

    // Lógica do envio de mensagens
    chatForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const messageText = chatInput.value.trim();

        if (messageText === "") {
            return;
        }

        const username = localStorage.getItem("chatUsername") || "Usuário";

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const time = `[${hours}:${minutes}]`;

        // Criando Mensagem
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat__message", "message--self"); 

        messageDiv.innerHTML = `
            <span class="message__time">${time}</span>
            <span class="message__user">${username}:</span>
            <span class="message__text">${messageText}</span>
        `;

        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;

        chatInput.value = "";
    });

    const createRoomBtn = document.getElementById('new-room');
    const createRoomSection = document.querySelector('.new-room');
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
    const roomList = document.querySelector('.chat-room__list');

    createRoomForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const roomName = document.getElementById('room-name').value.trim();
        if (roomName === "") return;

        const roomId = Date.now();

        // Criando Nova Sala
        const newRoom = document.createElement('li');
        newRoom.classList.add('chat-room__item');
        newRoom.setAttribute('data-room', roomId);
        newRoom.innerHTML = `
            <span class="chat-room__name">${roomName}</span>
            <button class="chat-room__delete" data-room="${roomId}">
                <img src="img/delete.png" alt="">
            </button>
        `;
        roomList.appendChild(newRoom);

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

        createRoomSection.classList.add('hidden');
        createRoomForm.reset();

        localStorage.setItem("selectedRoom", roomId);
        chatRoomSection.style.display = "none";
        chatSection.style.display = "block";

    });

    // Saindo do chat
    document.getElementById("exit-room").addEventListener("click", function () {
        document.querySelector(".chat").style.display = "none";

        document.querySelector(".chat-room").style.display = "block";
    });

    const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
        })
    }

});

