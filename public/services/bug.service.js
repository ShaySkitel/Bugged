import { userService } from "./user.service.js"

const API_PREFIX = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query({searchStr, date}, pageIdx) {
    return axios.get(API_PREFIX + `?searchStr=${searchStr}&date=${date}&pageIdx=${pageIdx}`).then(res => res.data)
}

function getById(bugId) {
    return axios.get(API_PREFIX + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(API_PREFIX + bugId)
}

function save(bug) {
    // const currUser = userService.getCurrUser()
    const url = bug._id ? `${API_PREFIX}${bug._id}` : API_PREFIX
    const method = bug._id ? 'put' : 'post'
    return axios[method](url, bug).then(res => res.data)
}

function getDefaultFilter() {
    return { searchStr: '', date: 'new' }
}