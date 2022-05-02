const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const all_users = document.getElementById("users");

// get username and room name from localstorage 
let username = null, room = null, userId = null;
if (localStorage.length > 0) {
    username = localStorage.getItem("username");
    room = localStorage.getItem("room");
    userId = localStorage.getItem("userId");
}

if (username === null || room === null) {
    window.location.replace(location.origin);
} else {

    localStorage.setItem("username", username);
    localStorage.setItem("room", room);

    // send it to server for joining
    socket.emit("joinRoom", { username, room, userId });

    // get userid from server 
    socket.on("userSocketId", id => {
        localStorage.setItem("userId", id);
    })

    // get room and users 
    socket.on("roomUsers", ({ room, users }) => {
        outputRoomName(room);
        outputUsers(users);
    });

    // get emitted message from server  
    socket.on("message", message => {
        outputMessage(message);

        // scroll down to new message 
        chatMessages.scrollTop = chatMessages.scrollHeight;

    })

    // message submit to server for emitting everyone 
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const msg = e.target.elements.msg.value;

        // emitting message to server 
        socket.emit("chatMessage", msg);
        e.target.elements.msg.value = "";
        e.target.elements.msg.focus();

    })

    function outputMessage(message) {

        const div = document.createElement("div");
        if (message.username == username) {
            div.classList.add("you");
            div.innerHTML = `<p class="text"> ${message.text}</p>
                        <p class="meta">You <span>${message.time}</span></p>`;

        } else {
            div.classList.add("message");
            div.innerHTML = `<p class="text"> ${message.text}</p>
                        <p class="meta">${message.username} <span>${message.time}</span></p>`;
        }
        // insert in html 
        chatMessages.appendChild(div);
    }

    // show in html (sidebar)
    function outputRoomName(room) {
        roomName.innerText = room;
    }

    function outputUsers(users) {
        all_users.innerHTML = `
    ${users.map(user => `<li> ${user.username} </li>`).join('')}
    `;
    }


}
// leave the chat 
document.getElementById("leave_chat").addEventListener("click", () => {
    localStorage.clear();
    location.assign(location.origin);
})

// menu handler 
$("#menuBtn").click(function(){
    $(".chat-sidebar").toggle(500);
  });