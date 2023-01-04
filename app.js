const express = require('express')
const cookieParser = require('cookie-parser')
const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

const PORT = process.env.PORT || 3030
const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// BUG ROUTES
app.get('/api/bug', (req, res) => {
    const searchStr = req.query.searchStr
    const date = req.query.date
    const pageIdx = req.query.pageIdx
    bugService.query(searchStr, date, pageIdx).then(bugs => {
        res.send(bugs)
    })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const visitedBugs = req.cookies.visitedBugs ? JSON.parse(req.cookies.visitedBugs) : []
    if (visitedBugs.length === 3) return res.status(401).send('Wait for a bit')
    visitedBugs.push(bugId)
    bugService.get(bugId).then(bug => {
        res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 1000 * 7 })
        res.send(bug)
    })
})

app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const bug = req.body
    bugService.save(bug, loggedinUser).then(savedBug => {
        res.send(savedBug)
    })
})

app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const bug = req.body
    bugService.save(bug, loggedinUser).then(savedBug => {
        res.send(savedBug)
    })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete bug')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser).then(() => {
        res.send({ msg: 'Bug removed successfully', bugId })
    })
})

// USER ROUTES
app.get('/api/user/:userId', (req, res) => {
    userService.getById(req.params.userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Failed to find user')
        })
})

app.get('/api/user/:userId/bug', (req, res) => {
    userService.getUserBugs(req.params.userId)
        .then(userBugs => {
            res.send(userBugs)
        })
        .catch(err => {
            console.log(err)
            res.status(400).send('Failed to fetch bugs')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const user = req.body
    userService.signup(user)
        .then(user => {
            res.cookie('loginToken', userService.getLoginToken(user))
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Failed to signup')
        })
})

app.post('/api/auth/login', (req, res) => {
    const user = req.body
    userService.login(user)
        .then(user => {
            res.cookie('loginToken', userService.getLoginToken(user))
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Failed to login')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))