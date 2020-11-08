# Console Against Humans 

## About
Console Against Humans is a web-console game that you can play with your friends. The goal of Console Against Humans is to make the most funniest answer to a prompt. Console Against Humans uses [Node.js](https://nodejs.org/) and [Socket.io](https://socket.io) with a really basic web frontend. 

----
## Setup
- Download Node js and setup Node js if you don't have it already 
- Clone this github repo (Dowload the code)
- Open a terminal or command prompt and cd into the repo folder
- Run 'npm install' to get all the packages for this project
- Open the config.json file and make sure you have PORT and Public set to what you want, save it then close it 
- Using the terminal or command prompt do 'npm start' to start the game
- Then copy the url from the terminal or command prompt and send it to your friends
> **Note:** Public options in the config.json allows you to play the game with people who are not on the same network as you.
---

## How to Play
> **Note:** The game works kind of better if everyone is in a call using something like discord. Also put quotation marks (ex: ' ' or " ") around any text input and try to keep your answers short. All of this info is also on the web frontend. Press [f12] to open the console and read chat

*   **clear()**, clear console for you
    
*   **msg(' text input ')**, send a normal message to chat
    
*   **win(' socket id of player you picked (text input) ')**, if you are the text-reader then you use win() to pick the best answer to a prompt
    
*   **answer(' text input ')**, if you are NOT the text-reader use this function. Note: if the prompt has more then one answer, please label your answer using numbers, ex: (1) example text (2) example text
    
*   **score()**, gives you back the score of each player
    
*   **list\_player()**, gives you a list of all the players who have joined the game
    
*   **ideas()**, if you can't think of any ideas for an answer
---
## Thanks
**Big Thanks** to the creator of https://crhallberg.com/cah/ 

---
## Social 
>Reddit: [@Guuzzeji](https://www.reddit.com/user/guuzzeji) 

>Discord: [@Guuzzeji#2245](https://discordapp.com/users/2245/)
