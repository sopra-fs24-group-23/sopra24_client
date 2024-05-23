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

## Roadmap

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
