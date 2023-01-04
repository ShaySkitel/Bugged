const { useState } = React
const { useNavigate } = ReactRouterDOM

import { showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"

export function Login({ setUser }) {
    const [credentials, setCredentials] = useState(userService.getEmptyCreds())
    const navigate = useNavigate()

    function handleInput({ target }) {
        let { value, name: field } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    function handleLogin(ev) {
        ev.preventDefault()
        userService.login(credentials)
            .then((user) => {
                setUser(user)
                navigate('/bug')
            })
            .catch(err => {
                showErrorMsg(err.response.data || 'Error logging in')
            })
    }

    return (
        <form onSubmit={handleLogin} className="login-signup flex column">
            <label htmlFor="username">Username</label>
            <input name="username" onChange={handleInput} id="username" value={credentials.username} type="text" placeholder="username" />

            <label htmlFor="password">Password</label>
            <input name="password" onChange={handleInput} id="password" value={credentials.password} type="password" placeholder="password" />

            <button>Login</button>
        </form>
    )
}