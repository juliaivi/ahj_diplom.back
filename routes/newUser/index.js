const Router = require('koa-router');
const { v4: uuidv4 } = require('uuid');
const router = new Router();
const WebSocketServer =  require('../../WS');
/////
const userState = []; 
let userName = null;
///
router.post("/new-user", async (ctx) => {
// дописать код
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
        // WebSocketServer.WebSock(); не заходит и выбивает ошибку, что не функция
        // WebSocketServer.WebSock; // заходит, но выдает ошибку ws

        // WebSocketServer заходит, но выдает ошибку ws (если не оборачивать в функцию)
      } else {
        const result = {
          status: "error",
          message: "This name is already taken!",
        };
        ctx.response.body = result;
      }
});


module.exports = router;


// const Router = require('koa-router');
// const router = new Router(); 
// const { v4: uuidv4 } = require('uuid');
// // const WebSocket = require('../../WS');

// const userState = []; 
// let userName = null;


// router.post("/new-user", async (ctx) => {
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
//     //   WebSocket.WebSocket({ server }, userState, userName);

//       ctx.response.body = result;
//     } else {
//       const result = {
//         status: "error",
//         message: "This name is already taken!",
//       };
//       ctx.response.body = result;
//     }
//   });

//   module.exports = router;