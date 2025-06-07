import {Register, CreateRoom, EnterRoom, LeaveRoom,
        RemoveRoom, SendMessage}
from "./back-front.mjs";


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

    // Esconde as seções de escolha de chat-room e chat
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

            // TODO: EnterRoom(_roomId);
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

        // TODO: SendMessage(_type, messageText, _file);
    });

    const createRoomBtn = document.getElementById('create-room');
    const createRoomSection = document.querySelector('.create-room');
    const cancelCreateBtn = document.getElementById('cancel-create');

    createRoomBtn.addEventListener('click', () => {
        createRoomSection.classList.remove('hidden');
    });

    cancelCreateBtn.addEventListener('click', () => {
        newRoomSection.classList.add('hidden');
    });

});
