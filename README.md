<h1 align="center">
  <a href="https://github.com/sopra-fs24-group-23"><img src="public/Images/logo.png" alt="GlobalGuess" width="200"></a>
  <br>
  GlobalGuess Frontend
</h1>

<div align="center">

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=sopra-fs24-group-23_sopra24_client&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=sopra-fs24-group-23_sopra24_client)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=sopra-fs24-group-23_sopra24_client&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=sopra-fs24-group-23_sopra24_client)

</div>

## Technologies
This repository relies on the [React](https://react.dev/) framework. We use the [Axios](https://axios-http.com/docs/intro) library to handle HTTP-Requests and the [stompjs](https://stomp-js.github.io/api-docs/latest/index.html) library to handle websocket connection and communication. It does not suppport websocket fallbacks using SockJS, as [websocket-support](https://caniuse.com/?search=websockets) has become ubiquitous.
Further, we use React's [context API](https://react.dev/reference/react/hooks#context-hooks) to store and retrieve information between views.

## High-Level Components
All code not pertaining to project building/deployment is located in the /src directory.

### State Management
Our application uses React's [context API](https://react.dev/reference/react/hooks#context-hooks) to create four specific contexts, each with it's corresponding providers:
1. **Websocket Context:** This context is responsible for managing WebSocket connections, including connecting, disconnecting, and sending messages to the backend.
2. **GameSettings Context:** This context manages the game settings. It provides a way for child components to access and update the game settings without having to pass the settings and the update function down through props.
3. **User Context:** This context is used to maintain the user's information across different components, ensuring that user-specific data and functionality are correctly displayed and executed.
4. **GamePhase Context:** This context is responsible for managing the state of the game and retrieving the current state in different components.

### Websocket Connection
All websocket related functionality is provided by the [WebSocketProvider](/src/components/WebSocketProvider.tsx). It allows connecting to and disconnecting from the backend via websockets without requiring client code to store any references to a client. The context also provides functions to un-/subscribe to STOMP topics and queues as well as functions to send STOMP messages to app-destinations in the backend. Again, the component abstracts away the need for clients to store e.g. references to websocket connections, allowing for seamless transitions between views.

### Styling
For styling our components we use [MUI component library](https://mui.com/material-ui/).

## Launch & Deployment
### Running the Project Locally
To run our app locally follow these steps:
1. Clone both this repository and the [server repository](https://github.com/sopra-fs24-group-23/sopra24_server/).
2. Open two terminals at the server directory, either manually or by using IDE-integrated terminals.
3. With your terminals in the server directory, use the command "./gradlew build" in terminal one, and "./gradlew bootRun" in the other.
4. The server should now be running locally on port 8000, navigate to [https://localhost:8000/](https://localhost:8000/) to verify.
5. Now open a terminal in the client directory, again, either manually or by using an IDE-integrated terminal.
6. Use the command "npm install" to install all necessary dependencies.
7. Once the dependencies have been installed, use the command "npm run dev" to run the client locally on port 3000. This should automatically open a browser window at [https://localhost:3000/](https://localhost:3000/)
8. You're done 🚀 The project should now be running locally. You should be able to set breakpoints in your IDE, that will halt if you trigger them by interacting with your local frontend.

### Running Tests
You can run the test suite in the server directory. Either directly from your IDE, or by running "./gradlew build", both should work fine. The latter will provide you with a link in your terminal to a more detailed report on passing/failing tests and thrown exceptions and errors.

### Deploying to Google Cloud
The webapp is automatically deployed to google cloud whenever you push to the **main** branch. This should not require any additional setup on your part.

## Illustrations
Unregistered or logged-out users land on the [login page](https://sopra-fs24-group-23-client.oa.r.appspot.com/login). Logged-in users land on the [homepage](https://sopra-fs24-group-23-client.oa.r.appspot.com/homepage). From there, users can edit their username, and color, view a global leaderboard and host or join a lobby.

**insert leaderboard & homepage screenshots**

### Game Flow
#### Lobby
Users can only enter lobbies that are not full (i.e. the max-player count is not reached yet), and that are not yet running. The lobbies main components are a playerlist, a chat-box, a settings option and a "Start Game" button.

<img src="public/Images/Lobby_Screenshot.png" alt="Lobby Screenshot" width="700">

#### Scoreboard
Each round begins with the scoreboard screen, this allows users to prepare for quick typing, and displays the current scores. The timer can be skipped if all users press "Ready".

<img src="public/Images/Scoreboard_Screenshot.png" alt="Scoreboard Screenshot" width="700">

#### Input
Next, users are prompted to input terms from specific categories. The screen offers tooltips to inform on the exact requirements for answers (e.g. use english country-names). Each round, players can use _one_ joker for an answer they are not sure about. As soon as one player has written an answer for every input field, they can press "Done", closing the inputs for all other players. 

<img src="public/Images/Input_Screenshot.png" alt="Input Screenshot" width="700">

#### Voting / Doubting
After inputting answers, players are shown all the answers other players have given. In this screen, they get the chance to doubt other players' answers, which they suspect of being joker-answers. If a joker answer is doubted, the joker no longer applies, i.e. the answer is checked against an API just like all the others. If an answer is wrongfully doubted, i.e. if it was not a joker, the wrongfully accused player receives 5 extra points, even if the answer was wrong or empty. This allows for bluffing with joker (e.g. leave a field empty, make it a joker) but disincentivises overusing the doubting feature.

<img src="public/Images/Doubting_Screenshot.png" alt="Doubting Screenshot" width="700">

#### Voting Results
The next screen displays the round results. It shows if answers were jokers, doubted, unique, duplicate and whether they were correct or incorrect. Alongside, the amount of points awarded for an answer is displayed. A ?-Icon in the navbar at the top shows a legend of all symbols.

<img src="public/Images/VotingResults_Screenshot.png" alt="VotingResults Screenshot" width="700">

#### Endscreen
Finally, an endscreen is displayed, ranking the players and showing they respective scores.

<img src="public/Images/Endscreen_Screenshot.png" alt="Endscreen Screenshot" width="700">

## Roadmap

Possible future features could be: 

#### Allow players to distribute points
There can be situations where an answer that is correct, is evaluated as wrong by the API. <br/>
An example could be a tiny city that does indeed exist, but is not listed on the API because it might not be big/known enough.<br/>
The player that got their answer marked as wrong, could ask in the chat, whether other players would still allow them to get points for the answer.<br/>
We imagine a functionality where the player can mark the wrongly evaluated answer as such and allow other players to agree.<br/>
If all players agree, the player is given a certain amount of points for their answer. 

#### Pause button
Especially if the first feature (Allow players to distribute points) has been implemented it makes sense to give the players an option to pause the game as each view is limited by a timer.<br/>
This would of course not be beneficial in the input page (players should have only a limited time to answer the categories) but it would make sense in the voting-results screen.<br/>
Of course players must then also be given the functionality to resume the game.

#### Unlock new categories with progression
To additionaly motivate players to keep playing the game, they could unlock new categories by achieving the next level.<br/>
That way, if a player has reached a level to unlock a new category and they are the host, they can set that new category for their next game.<br/>

#### Allow minor spelling mistakes in player answers
We know that the game is stressful for players. In a normal paper-and-pen based categories game, spelling mistakes don't matter.<br/>
Players would just communicate their answers to other players, regardless of their spelling.<br/>
Integrating this feature into the GlobalGuess game would certainly improve player's satisfaction, as they are not punished with zero points for spelling mistakes.<br/>
We imagine that the answers would still be checked as correct even if there are one or two letters that don't fit the word exactly.<br/>

#### Add sounds
We believe that by adding sounds, GlobalGuess could be even more enjoyable.<br/>
That could include sounds for clicking a button, background music during a game etc.<br/>


## Authors and acknowledgement
- Franziska Geiger, [fr4n715k4](https://github.com/fr4n715k4)
- Nilaksan Selliah, [nilaksan97](https://github.com/nilaksan97)
- Nils Hegetschweiler, [nilshgt](https://github.com/nilshgt)
- Jonas Krumm, [dedphish](https://github.com/Dedphish)

We thank Stefan Schuler ([Steesch](https://github.com/steesch)) for supporting us as our TA throughout the project.

Further, we thank [royru](https://github.com/royru), [isicu](https://github.com/isicu), [marcoleder](https://github.com/marcoleder), [v4lentin1879](https://github.com/v4lentin1879), [luis-tm](https://github.com/luis-tm) and [SvenRingger](https://github.com/SvenRingger) for creating and providing us with a template upon which we built this project. 

## License
[GNU GPLv3](https://github.com/sopra-fs24-group-23/sopra24_server/blob/main/LICENSE)

GlobalGuess is a game about finding terms with a common starting letter as quickly as possible
Copyright (C) 2024  Franziska Geiger, Nilaksan Selliah, Nils Hegetschweiler, Jonas Krumm

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
