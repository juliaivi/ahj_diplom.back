const http = require('http');
const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body').default;
const cors = require('@koa/cors');
const Router = require('koa-router');
const { faker } = require('@faker-js/faker');
const koaStatic = require('koa-static');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = new Koa();
const router = new Router(); 
const pub = path.join(__dirname, '/public'); 
app.use(koaStatic(pub));
const WebSocketServer = require('ws').Server;

const WebSocket = require('./WS');

const Users = require('./Users');
const users1 = new Users();

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

let ws = null;

  router.post("/new-user", async (ctx) => {
    if (Object.keys(ctx.request.body).length === 0) {
        const result = {
        status: "error",
        message: "This name is already taken!",
      };
      ctx.response.body = result;
    }
    const { name } = ctx.request.body;
    const isExist = users1.userState.find((user) => user.name === name);
    if (!isExist) { 
      const newUser = {
        id: uuidv4(),
        name: name,
      };
      users1.adduserState(newUser);
      const result = {
        status: "ok",
        user: newUser,
      };
      ctx.response.body = result;
      users1.addUsers({userName:name, ws})
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
const wsServer = new WebSocketServer({server}); 
WebSocket.WebSocket(wsServer, users1.userState, users1.users, ws)

server.listen(port); 