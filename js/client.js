const socket = io('http://localhost:8000');

// html form 
const form = document.getElementById("#form_container");
// input box 
const message_box = document.getElementById("#message_input");
// show message container 
const message_show_box = document.querySelector(".chat_body");

// new user to join 
const username = prompt("Enter your name to join the live chat ");
console.log("user ",username)
socket.emit('new-user-joined', username);
