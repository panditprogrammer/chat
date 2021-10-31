const socket = io('http://localhost:8080');


// html form 
const form = document.getElementById("form_container");
// input box 
const message_box = document.getElementById("message_input");
// show message container 
const message_show_box = document.querySelector(".message_container");

const add_html = (message, css_position)=>{
    const message_show_span = document.createElement('span');
    message_show_span.innerText = message;
    message_show_span.classList.add(css_position);
    message_show_box.append(message_show_span);
}

// send message 
form.addEventListener('submit',(e)=>{
    e.preventDefault();

    const message_value = message_box.value;
    add_html(`${message_value}`,'right');
    socket.emit('send',message_value);
    message_box.value = "";
})

// name of user 
let username = null;

do
{
     username = prompt("Enter your name to join the live chat ");
}while(username == null);

// new user to join 
console.log("user ",username)
socket.emit('new-user-joined', username);

socket.on('user-joined',username=>{
    add_html(`${username} Joined the chat`, 'left');
})

// show message in chat_body 
socket.on('receive', user_and_msg=>{
    add_html(`${user_and_msg.username} - ${user_and_msg.message}`,'left');
})

// show message in chat_body 
if(username !== null )
socket.on('left', username=>{
    add_html(`${username}  left...` ,'left');
})

