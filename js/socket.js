require("dotenv").config();
const { SERVER_URL } = process.env;
import io from "socket.io-client";

document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    const socket = io(SERVER_URL, {
        // transports: ["websocket", "polling", "flashsocket"],
        transports: ["polling", "flashsocket", "websocket"],
    });
    const chatPopup = document.querySelector("#chat-popup");
    const chatCloseButton = document.querySelector("#close-chat-btn");
    const chatPopupButton = document.querySelector("#chat-popup-button");
    const inputText = document.querySelector("#input-text");
    const sendMessageButton = document.querySelector("#send-message-btn");

    // console.log(CUSTOM_MSG);
    let messages = [];

    let userObject = {};
    // localStorage.removeItem("mm-chat-userId");
    if (!localStorage.getItem("mm-chat-userId")) {
        userObject.sender_id = userObject.id = generateUniqueId();
        localStorage.setItem("mm-chat-userId", JSON.stringify(userObject));
    } else {
        userObject = JSON.parse(localStorage.getItem("mm-chat-userId"));
    }
    console.log(userObject);

    socket.on("message", (message) => {
        messages.push(message);
        loadMessagesToDom(messages, userObject);
        console.log(message);
    });
    // loadMessagesToDom(CUSTOM_MSG, userObject);
    loadMessagesToDom(messages, userObject);

    chatCloseButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (!chatPopup.classList.contains("hidden")) {
            chatPopup.classList.add("hidden");
        }
        if (chatPopupButton.classList.contains("hidden")) {
            chatPopupButton.classList.remove("hidden");
        }
        socket.emit("leaveRoom", userObject.id);
        const chatBox = document.querySelector("#chat-box");
        chatBox.innerHTML = "";
    });

    chatPopupButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (chatPopup.classList.contains("hidden")) {
            chatPopup.classList.remove("hidden");
            chatPopupButton.classList.add("hidden");

            socket.emit("join-room", { name: userObject.id });
            socket.on("previous-messages", (msgs) => {
                messages = [];
                if (Array.isArray(msgs) && msgs.length > 0) {
                    msgs.forEach((x) => {
                        messages.push(x);
                        loadMessagesToDom(messages, userObject);
                    });
                }
            });
            loadMessagesToDom(messages, userObject);
        }
    });

    sendMessageButton.addEventListener("click", (e) => {
        e.preventDefault();
        // console.log(inputText.value);
        if (String(inputText.value).trim().length < 1) {
            return;
        } else {
            socket.emit("chat message", {
                room: userObject.id,
                message: inputText.value,
                sender_id: userObject.sender_id,
            });

            inputText.value = "";
        }
    });
});

function loadMessagesToDom(messages, userObject) {
    console.log(messages);
    const chatBox = document.querySelector("#chat-box");
    chatBox.innerHTML = "";
    messages.forEach((m) => {
        console.log(m);
        console.log(userObject.id);
        let select1 = document.createElement("section");
        if (m.sender_id != userObject.id) {
            select1.className = "col-start-1 col-end-9 p-1 rounded-lg";
            select1.innerHTML = `
			<section
			class="relative ml-3 text-sm bg-[#037dd6] text-white p-2 rounded-t-lg rounded-br-lg rounded-bl-none"
			>
			<span>${m.message}</span>
			</section>`;
        } else {
            select1.className = "col-start-6 col-end-13 p-1 rounded-lg";
            select1.innerHTML = `
			<section
			class="relative mr-3 text-sm border border-[#037dd6] p-2 rounded-t-lg rounded-bl-lg rounded-br-none"
			>
			<span>${m.message}</span>
			</section>`;
        }
        chatBox.appendChild(select1);
    });
}

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}
