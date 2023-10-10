module.exports = class Users {
    constructor () {
        this.userState = [];
        this.users = [];
    }

    addUsers(el) {
        this.users.push(el)
    }

    adduserState(el) {
        this.userState.push(el)
    }
}
