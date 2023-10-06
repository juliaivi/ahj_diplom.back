const combineRouters = require('koa-combine-routers');

const newUser = require('./newUser/index.js');

const router = combineRouters(
    newUser,
);

module.exports = router;
