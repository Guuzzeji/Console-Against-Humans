const config = require('./config.json');
const express = require('express');
const ngrok = require('ngrok');
const chalk = require('chalk');

//net working finding local ip
const localip = require('./src/get_localnet').getLocalIP;

//Setting Up
const app = express();
const server = app.listen(config.PORT, function(){
    console.log(chalk.green.bold('== Sever is live on:', 'http://localhost:'+config.PORT+' =='));
    console.log(chalk.green.bold('== Local Network Url: http://'+localip()+':'+config.PORT+' =='));
});

const io = require('socket.io')(server);
app.use(express.static('./html'));

//Online url gen
async function online_url(){
    const url = await ngrok.connect(config.PORT);
    console.log(chalk.green.bold('== Public Url:', url, '=='));
};

if(config.Public == true){
    online_url();
};

//id system
io.engine.generateId = function(req){
    let id_num = '#';
    for(let x = 0; x < 5; x++){
        let num = Math.floor(Math.random()*10);
        id_num += num;
    }
    return id_num
};

//Src imports
const search = require('./src/search');
const random_sorter = require('./src/random_sort');

//Game VAR
let total_players = 3;
let answers = [];
let rounds = 0;
let players_arr = [];
let rng_ply_list = null;
let game_state = 'ide'; //ide (not playing) || playing (round in play)
let readylist = [];
let rngplylist_index = 0;

//Game
io.on('connection', function(socket){
    console.log(chalk.magenta('User Connected,', socket.id));
    socket.emit('chat_feed', '==[ Connected to Sever ]==');

    //Add to name
    socket.on('name', function(data){
        console.log(chalk.magenta(`Socket ${socket.id} set name to ${data.username}`));
        players_arr.push({username: data.username, id: socket.id, score: 0});
        io.sockets.emit('chat_server', `=== Player has join the server: ${data.username} | ${socket.id} ===`);
    });

    //Chat
    socket.on('chat_input', function(data){
        console.log(chalk.magenta(data, socket.id));
        let term0 = search.break(data.text);

        //test
        if(term0 == '!test'){
            socket.emit('chat_feed', 'Doing Good');

        //ready
        }else if(term0 == '!ready' && game_state == 'ide'){
            for(let x = 0; x < readylist.length; x++){
                if(socket.id == readylist[x]){
                    console.log(socket.id);
                    return null
                };
            };
            readylist.push(socket.id);
            io.sockets.emit('chat_server', `${data.username} {${socket.id}}: READY!`);
            if(readylist.length == total_players){
                rounds+= 1;
                game_state = 'playing';
                readylist = [];

                io.sockets.emit('chat_server', `=== Round ${rounds} ===`);
                if(rounds == 1){
                    rng_ply_list = random_sorter.rng_list(players_arr);
                };

                if(rngplylist_index > rng_ply_list.length){
                    rngplylist_index = 0;
                }else{
                    rngplylist_index++;
                };

                io.sockets.emit('chat_server', `=== Text-Reader: ${rng_ply_list[rngplylist_index].username}, {${rng_ply_list[rngplylist_index].id}} ===`);
                io.sockets.emit('chat_server', `=== Prompt: ${random_sorter.rng_text_qs().text} ===`);
            }

        //answer
        }else if(term0 == '!answer' && game_state == 'playing'){
            if(socket.id != rng_ply_list[rngplylist_index].id){
                io.to(rng_ply_list[rngplylist_index].id).emit('chat_answer', `=== Answer to Pick: ${data.answer} | ${data.username} [ID]${socket.id} ===`);
                answers.push(data);
            };

        //suggestion
        }else if(term0 == '!suggestion'){
            socket.emit('chat_feed', `=== Suggestion: ${random_sorter.rng_text_ideas()} ===`);

        //winner
        }else if(term0 == '!winner' && game_state == 'playing'){
            if(socket.id == rng_ply_list[rngplylist_index].id){
                for(let x = 0; x < players_arr.length; x++){
                    if(players_arr[x].id == data.winner){
                        players_arr[x].score += 1;
                    };
                };

                for(let y = 0; y < answers.length; y++){
                    if(answers[y].id == data.winner){
                        io.sockets.emit('chat_winner', `=== *[WIN]* Answer: ${answers[y].answer} | ${answers[y].username}[-]${answers[y].id} ===`);
                    }else{
                        io.sockets.emit('chat_winner', `=== Answer: ${answers[y].answer} | ${answers[y].username}[-]${answers[y].id} ===`);
                    };
                };

                answers = [];
                game_state = 'ide';
            }

        //score
        }else if(term0 == '!score'){
            for(let x = 0; x < players_arr.length; x++){
                socket.emit('chat_score', `=== [${x}] List-Score: ${players_arr[x].username} | [ID] ${players_arr[x].id} | Score: ${players_arr[x].score} ===`);
            };

        //List
        }else if(term0 == '!list'){
            for(let x = 0; x < players_arr.length; x++){
                socket.emit('chat_score', `=== [${x}] List: ${players_arr[x].username} | [ID] ${players_arr[x].id} ===`);
            };
        }

        //send msg
        else{
            io.sockets.emit('chat_feed', `${data.username}[-]{ ${socket.id} }: ${data.text}`);
        }
    });

    //disconnection
    socket.on('disconnect', function(){
        //remove player from list
        for(let x = 0; x < players_arr.length; x++){
            if(socket.id == players_arr[x].id){
                console.log(chalk.red.bold('Leaving...', socket.id));
                io.sockets.emit('chat_server', `== Leaving: ${players_arr[x].username}, {${socket.id}} ==`);
                players_arr.splice(0, x);
            };
        };

        //only for vote arr
        if(game_state == 'ide'){
            for(let x = 0; x < readylist.length; x++){
                if(socket.id == readylist[x]){
                    readylist.splice(0, x);
                };
            };
        };
    });
    
})