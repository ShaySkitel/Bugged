const fs = require('fs')
const Cryptr = require('cryptr')
const cryptr = new Cryptr('this-is-a-long-ass-secret-but-it-doesnt-matter-tbh')

const bugService = require('./bug.service')
let users = require('../data/user.json')

module.exports = {
    signup,
    getLoginToken,
    login,
    getById,
    getUserBugs,
    validateToken
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    const userToSend = {
        username: user.username,
        fullname: user.fullname
    }
    return Promise.resolve(userToSend)
}

function getUserBugs(userId) {
    const bugs = bugService.getAllBugs()
    const userBugs = bugs.filter(bug => bug.creator._id === userId)
    return Promise.resolve(userBugs)
}

function login(credentials) {
    const user = users.find(currUser => currUser.username === credentials.username && currUser.password === credentials.password)
    if (!user) return Promise.reject('Can\'t find user')
    return Promise.resolve(user)
}

function signup(user) {
    user._id = _makeId()
    user.createdAt = Date.now()
    users.unshift(user)

    return _writeToFile().then(() => user)
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function _makeId(length = 6) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _writeToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) return rej(err)
            res()
        })
    })
}