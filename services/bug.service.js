const fs = require('fs')
const PAGE_SIZE = 5
let bugs = require('../data/bugs.json')

module.exports = {
    query,
    save,
    get,
    remove,
    getAllBugs
}

function getAllBugs() {
    return bugs
}

function query(searchStr, date, pageIdx) {
    let filteredBugs = date === 'old' ? bugs.slice().reverse() : bugs
    filteredBugs = filteredBugs.filter(({ title, description, severity }) => {
        severity = severity + ''
        return title.toLowerCase().includes(searchStr) || description.toLowerCase().includes(searchStr) || severity.includes(searchStr)
    })
    const startIdx = pageIdx * PAGE_SIZE
    return Promise.resolve(filteredBugs.slice(startIdx, startIdx + PAGE_SIZE))
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function save(bug, user) {
    if (bug._id) {
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        if (!user.isAdmin && bugToUpdate.creator._id !== user._id) return Promise.reject('No permission')
        bugToUpdate.title = bug.title
        bugToUpdate.description = bug.description
        bugToUpdate.severity = bug.severity
    } else {
        bug._id = _makeId()
        bug.createdAt = Date.now()
        bug.creator = { _id: user._id, fullname: user.fullname }
        bugs.unshift(bug)
    }
    return _writeToFile().then(() => bug)
}

function remove(bugId, user) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('Bug does not exist')
    const bug = bugs[bugIdx]
    if (!user.isAdmin && bug.creator._id !== user._id) return Promise.reject('No permission')
    bugs.splice(bugIdx, 1)
    return _writeToFile()
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
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return rej(err)
            res()
        })
    })
}