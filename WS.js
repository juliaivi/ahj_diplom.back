const WebSocketServer = require('ws').Server;
const WS = require('ws')

function WebSocket({server}, userState, userName) {
    const wsServer = new WebSocketServer({server});
    const allMessages = [];
    let users = [];
    wsServer.on("connection", (ws) => {
    users.push({userName , ws})
    console.log(users)


    ws.on("message", (msg, isBinary) => {
        const receivedMSG = JSON.parse(msg);
        const obj = {
        message: receivedMSG,
        dataId: receivedMSG.dataId,
        }

        allMessages.push(obj);

        if (receivedMSG.type === "exit") {
        const idx = userState.findIndex(
            (user) => user.name === receivedMSG.name);
        userState.splice(idx, 1);
        [...wsServer.clients]
            .filter((o) => o.readyState === WS.OPEN)
            .forEach((o) => o.send(JSON.stringify(userState)));
        return;
        }
        
        if (receivedMSG.type === "send") {
        [...wsServer.clients]
            .filter((o) => o.readyState === WS.OPEN)
            .forEach((o) => o.send(msg, { binary: isBinary }));
        }

        if (receivedMSG.type === "sendAll") {
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

    [...wsServer.clients]
        .filter((o) => o.readyState === WS.OPEN)
        .forEach((o) => o.send(JSON.stringify(userState)));
    });

}

module.exports = {
    WebSocket,
}