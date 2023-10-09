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
const WebSocket = require('./WS');

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
    userName = null;
    if (!isExist) { 
      console.log('11')
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
      console.log('userName', userName)
      initializeWebSocket();
      
    } else {
      console.log('22')
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
console.log('pusk', server)

function initializeWebSocket() {
WebSocket.WebSocket({ server }, userState, userName);

}

server.listen(port); 