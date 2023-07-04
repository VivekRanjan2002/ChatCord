const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const Userlist = document.getElementById('Users');
const botName = 'chatCord Bot';

//GET USERNAME AND ROOM FROM URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


// Join Chatroom
socket.emit('joinRoom', { username, room });

// Get room and Users
socket.on('roomUsers', ({ room, users })=> {
    outputRoomName(room);
    outputUsers(users);
});

//Message from server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

// chatform input message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get message text
    const message = e.target.elements.msg.value;

    // emit message to the server
    socket.emit('chatMessage', message);

    // clear inputs
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

    
});

//output message to the DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =`	<p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`
    document.querySelector('.chat-messages').appendChild(div);
    
};

// display corresponding room name
function outputRoomName(val) {
    roomName.textContent = val;
}

// display all the current users 
function outputUsers(userarr) {
    Userlist.innerHTML = "";
    userarr.map(user => {
        Userlist.innerHTML += `<li>${user.username}</li>`;
    });
   
 }