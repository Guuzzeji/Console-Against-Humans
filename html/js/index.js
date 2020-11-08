console.log('%c== Welcome to Chat ==', 'font-size: 20px; color: #c13bff; font-family:Comic Sans MS;');

const socket = io('/');
let name = null;

function send_data(input_data){
    if(name != null){
        socket.emit('chat_input', input_data);
    }else{
        console.error('%c Error: Set a Username', 'font-size: 14px');
    };
    return null
};

function set_name(){
    if(document.getElementById('Username').value != ''){
        document.getElementById('name_btn').style.display = 'none';
        name = document.getElementById('Username').value;
        name = name.trim();
        document.getElementById('Username').disabled = true;
        document.getElementById('socket_id').innerText = 'Socket ID: '+ socket.id;
        socket.emit('name', {username: name});
    };
};

document.getElementById('name_btn').addEventListener('click', set_name);
document.getElementById('Username').addEventListener('keyup', function(e){
    if(e.key === 'Enter'){
        set_name();
    };
});

//func for chat user to use
function msg(text){
    send_data({text, username: name});
};

function ready(){
    send_data({text: '!ready', username: name});
};

function score(){
    send_data({text: '!score', username: name});
};

function answer(text_answer){
    send_data({text: '!answer', answer: text_answer, username: name, id: socket.id});
};

function win(socket_id){
    send_data({text: `!winner`, winner: socket_id, username: name});
};

function list_player(){
    send_data({text: `!list`, username: name});
};

function ideas(){
    send_data({text: `!suggestion`, username: name});
};

//LOGS
socket.on('chat_feed', function(data){
    console.log('%c'+data, 'font-size: 14px; font-family: Arial;');
});

socket.on('chat_score', function(data){
    console.log('%c'+data, 'font-size: 16px; font-family: Arial; color: #c13bff; font-weight: bold');
});

socket.on('chat_winner', function(data){
    console.log('%c'+data, 'font-size: 16px; font-family: Arial; color: #00db21; font-weight: bold');
});

socket.on('chat_server', function(data){
    console.log('%c'+data, 'font-size: 16px; font-family: Arial; color: #c7006a; font-weight: bold');
});

socket.on('chat_answer', function(data){
    console.log('%c'+data, 'font-size: 16px; font-family: Arial; color: #02a5d6; font-weight: bold');
});
