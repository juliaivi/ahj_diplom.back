const WS = require('ws');
const { v4: uuidv4 } = require('uuid');

function WebSock() {

const WebSocketServer = new WS.Server({ noServer: true });

const allMessages = [];
const userState = [];
let userName = null;

let users = [];

WebSocketServer.on("connection", (ws) => {
users.push({ userName, ws });

ws.on("message", (msg, isBinary) => {
const receivedMSG = JSON.parse(msg);

const obj = {
  message: receivedMSG,
  dataId: receivedMSG.dataId,
}

allMessages.push(obj);

if (receivedMSG.type === "exit") {
  // дописать код
  const idx = userState.findIndex(
    (user) => user.name === receivedMSG.name);
    userState.splice(idx, 1);
    [...wsServer.clients]
    .filter((o) => o.readyState === WS.OPEN)
    .forEach((o) => o.send(JSON.stringify(userState)));
return;
}

if (receivedMSG.type === "send") {
  // дописать код
  [...wsServer.clients]
  .filter((o) => o.readyState === WS.OPEN)
  .forEach((o) => o.send(msg, { binary: isBinary }));
}

if (receivedMSG.type === "sendAll") {
  // дописать код
  let indexElem = allMessages.map((el) => el.dataId).indexOf(Number(receivedMSG.dataId));
  let listMessege = allMessages.slice(0, indexElem);
  let userPosition = users.map((el) => el.userName).indexOf(receivedMSG.name);
  let message = listMessege;
  if (listMessege.length > 10) {
      message = listMessege.slice(-10);
  }
  let newMessageBlok = message.reverse();
  users[userPosition].ws.send(JSON.stringify({type: 'allsms', message: newMessageBlok}));

}
});

[...WebSocketServer.clients]
.filter((o) => o.readyState === WS.OPEN)
.forEach((o) => o.send(JSON.stringify(userState)));
});
}
module.exports = {WebSock};


















// const WebSocketServer = require('ws').Server;
// const WS = require('ws')

// function WebSocket({server}, userState, userName) {
//     console.log('ws 1')
//     console.log('ws 1' , userState)
//     console.log('ws 1', userName)
//     // let oldserver =null;
//     // let wsServer;
//     // if (oldserver == null || oldserver !== server ) {
//     //     oldserver = server}
//     const wsServer = new WebSocketServer({server}); 
    

//     const allMessages = [];
//     let users = [];
//     wsServer.on("connection", (ws) => {
//     console.log("connection")
//     users.push({userName , ws})
//     console.log(users)// приходит 1 , а должен 2


//     ws.on("message", (msg, isBinary) => {
//         console.log('msg')
//         const receivedMSG = JSON.parse(msg);
//         const obj = {
//         message: receivedMSG,
//         dataId: receivedMSG.dataId,
//         }

//         allMessages.push(obj);

//         if (receivedMSG.type === "exit") {
//         const idx = userState.findIndex(
//             (user) => user.name === receivedMSG.name);
//         userState.splice(idx, 1);
//         [...wsServer.clients]
//             .filter((o) => o.readyState === WS.OPEN)
//             .forEach((o) => o.send(JSON.stringify(userState)));
//         return;
//         }
        
//         if (receivedMSG.type === "send") {
//         [...wsServer.clients]
//             .filter((o) => o.readyState === WS.OPEN)
//             .forEach((o) => o.send(msg, { binary: isBinary }));
//         }

//         if (receivedMSG.type === "sendAll") {
//         let indexElem = allMessages.map((el) => el.dataId).indexOf(Number(receivedMSG.dataId));
//         let listMessege = allMessages.slice(0, indexElem);
//         let userPosition = users.map((el) => el.userName).indexOf(receivedMSG.name);
//         let message = listMessege;
//         if (listMessege.length > 10) {
//             message = listMessege.slice(-10);
//         }
//         let newMessageBlok = message.reverse();
//         users[userPosition].ws.send(JSON.stringify({type: 'allsms', message: newMessageBlok}));
//         }    
//     });

//     [...wsServer.clients]
//         .filter((o) => o.readyState === WS.OPEN)
//         .forEach((o) => o.send(JSON.stringify(userState)));
//     });

// }

// module.exports = {
//     WebSocket,
// }