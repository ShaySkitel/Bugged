const API_PREFIX = '/api/auth/'

export const userService = {
    getEmptyCreds,
    login,
    getCurrUser,
    logout,
    signup,
    getById,
    getUserBugs
}

function getById(userId) {
    return axios.get('/api/user/' + userId).then(res => res.data)
}

function login(credentials) {
    return axios.post(API_PREFIX + 'login', credentials)
        .then(res => res.data)
        .then(user => {
            _saveLoggedinUser(user)
            return user
        })
}

function getUserBugs(userId) {
    return axios.get('/api/user/' + userId + '/bug').then(res => res.data)
}

function signup(credentials) {
    return axios.post(API_PREFIX + 'signup', credentials)
        .then(res => res.data)
        .then(user => {
            _saveLoggedinUser(user)
            return user
        })
}

function logout() {
    return axios.post(API_PREFIX + 'logout')
        .then(() => {
            _clearLoggedinUser()
        })
}

function getEmptyCreds() {
    return { username: '', password: '', fullname: '' }
}

function getCurrUser() {
    const user = JSON.parse(sessionStorage.getItem('loggedinUser'))
    if (!user || !user.username) return null
    return user
}

function _saveLoggedinUser(user) {
    sessionStorage.setItem('loggedinUser', JSON.stringify(user))
}

function _clearLoggedinUser() {
    sessionStorage.removeItem('loggedinUser')
}