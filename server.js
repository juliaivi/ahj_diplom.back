const http = require('http');
const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body').default;
const cors = require('@koa/cors');
const Router = require('koa-router');;
const { faker } = require('@faker-js/faker');
const koaStatic = require('koa-static');
const fs = require('fs');
const WS = require('ws');
const { v4: uuidv4 } = require('uuid');
const WebSocketServer = require('ws').Server;

const app = new Koa();
const router = new Router();
const pub = path.join(__dirname, '/public');
app.use(koaStatic(pub));

app.use(cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
)

app.use(koaBody({
   urlencoded: true,
   multipart: true,
   json: true, 
  }));

const allMessages = [];
const userState = []; 
let userName = null;

  router.post("/new-user", async (ctx) => {
    if (Object.keys(ctx.request.body).length === 0) {
        const result = {
        status: "error",
        message: "This name is already taken!",
      };
      ctx.response.body = result;
    }
    const { name } = ctx.request.body;
    const isExist = userState.find((user) => user.name === name);
    if (!isExist) { 
      userName = name;
      const newUser = {
        id: uuidv4(),
        name: name,
      };
      userState.push(newUser);
      const result = {
        status: "ok",
        user: newUser,
      };
      ctx.response.body = result;
    } else {
      const result = {
        status: "error",
        message: "This name is already taken!",
      };
      ctx.response.body = result;
    }
  });

app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 3000;
const server = http.createServer(app.callback());
const wsServer = new WebSocketServer({ server });

let users = [];
wsServer.on("connection", (ws) => {
  users.push({userName , ws})

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

server.listen(port);









// const http = require('http');
// const path = require('path');
// const Koa = require('koa');
// const koaBody = require('koa-body').default;
// const cors = require('@koa/cors');
// const Router = require('koa-router');
// const { faker } = require('@faker-js/faker');
// const koaStatic = require('koa-static');
// const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');
// const app = new Koa();
// const router = new Router(); 
// const pub = path.join(__dirname, '/public'); 
// app.use(koaStatic(pub));
// const WebSocket = require('./WS');

// app.use(cors({
//     origin: '*',
//     credentials: true,
//     'Access-Control-Allow-Origin': true,
//     allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   })
// )

// app.use(koaBody({
//    urlencoded: true,
//    multipart: true,
//    json: true, 
//   }));

// const userState = []; 
// let userName = null;

//   router.post("/new-user", async (ctx) => {
//     if (Object.keys(ctx.request.body).length === 0) {
//         const result = {
//         status: "error",
//         message: "This name is already taken!",
//       };
//       ctx.response.body = result;
//     }
//     const { name } = ctx.request.body;
//     const isExist = userState.find((user) => user.name === name);
//     if (!isExist) { 
//       userName = name;
//       const newUser = {
//         id: uuidv4(),
//         name: name,
//       };
//       userState.push(newUser);
//       const result = {
//         status: "ok",
//         user: newUser,
//       };
// // WebSocket.WebSocket({ server }, userState, userName);
//       ctx.response.body = result;
//     } else {
//       const result = {
//         status: "error",
//         message: "This name is already taken!",
//       };
//       ctx.response.body = result;
//     }
//   });



// app.use(router.routes()).use(router.allowedMethods()) 

// const port = process.env.PORT || 3000;
// const server = http.createServer(app.callback());
// console.log('userName', userName)
// console.log('userState', userState)

//   WebSocket.WebSocket({ server }, userState, userName);


// server.listen(port); 