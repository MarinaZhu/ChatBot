"use strict";
window.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.querySelector('.chat-button'),
        chatBox = document.querySelector('.chat-box'),
        closeChatBox = chatBox.querySelector('.chat-box-header .close'),
        chatBoxBody = chatBox.querySelector('.chat-box-body'),
        sendBtn = chatBox.querySelector('.chat-footer .send'),
        inputField = chatBox.querySelector('.chat-footer input');

    //Initializes the greeting message
    function init() {
        let msg_reply = document.createElement('div')
        msg_reply.innerHTML = `<p>Hello, how can I help you?</p>
                               <span>${new Date().getHours()}:${new Date().getMinutes()}</span>`;
        msg_reply.classList.add('chat-box-body-message', 'receive');
        chatBoxBody.appendChild(msg_reply);
    }
    init();

    //Opens the chat box
    chatBtn.addEventListener('click', () => {
        chatBtn.classList.add('hide');
        chatBox.classList.remove('hide');
    });

    //Closes the chat box
    closeChatBox.addEventListener('click', () => {
        chatBox.classList.add('hide');
        chatBtn.classList.remove('hide');
    });

    //Adds a zero to the time if it is less than 10
    function getZero(num){
        return (num >= 0 && num < 10) ? '0' + num : num;
    }

    //Sends the message to the server
    async function sendMsg() {
        let msg = chatBox.querySelector('.chat-footer input').value;
        if (msg != '' && msg !=undefined && msg.trim() !== '') {
            let resp = "";

            //Creates the message that the user sent
            let msg_send = document.createElement('div');
            msg_send.innerHTML = `<p>${msg}</p>
                                  <span>${getZero(new Date().getHours())}:${getZero(new Date().getMinutes())}</span>`;
            msg_send.classList.add('chat-box-body-message', 'send');
            chatBoxBody.appendChild(msg_send);
            chatBox.querySelector('.chat-footer input').value = '';

            // Disable sending
            sendBtn.removeEventListener('click', sendMsg);
            inputField.removeEventListener("keypress", handleKeyPress);

            //Displays a typing indicator while waiting for a response from the server
            let msg_reply = document.createElement('div');
            msg_reply.innerHTML = `<div class="typing-indicator">
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                  </div>`;
            msg_reply.classList.add('chat-box-body-message', 'receive');
            chatBoxBody.appendChild(msg_reply);
            chatBoxBody.scrollTop = chatBoxBody.scrollHeight;

            //Sends the message to the server
            try {
                const res = await axios.post('/api/chat', { message: msg });
                resp = res.data;
            } catch (error) {
                console.error(error);
            }

            //Displays the response from the server
            msg_reply.querySelector('.typing-indicator').remove();
                msg_reply.innerHTML = `<p>${resp}</p>
                                  <span>${getZero(new Date().getHours())}:${getZero(new Date().getMinutes())}</span>`;
                chatBoxBody.scrollTop = chatBoxBody.scrollHeight;

            // Enable sending
            sendBtn.addEventListener('click', sendMsg);
            inputField.addEventListener("keypress", handleKeyPress);
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            sendMsg();
        }
    }

    // Event listeners for send button click
    sendBtn.addEventListener('click', sendMsg);
    inputField.addEventListener("keypress", handleKeyPress);

});