const { useState } = React
const { useNavigate } = ReactRouterDOM

import { showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"

export function SignUp({ setUser }) {
    const [credentials, setCredentials] = useState(userService.getEmptyCreds())
    const navigate = useNavigate()

    function handleInput({ target }) {
        let { value, name: field } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    function handleSignup(ev) {
        ev.preventDefault()
        userService.signup(credentials)
            .then((user) => {
                setUser(user)
                navigate('/bug')
            })
            .catch(err => {
                showErrorMsg(err.response.data || 'Error logging in')
            })
    }

    return (
        <form onSubmit={handleSignup} className="login-signup flex column">
            <label htmlFor="fullname">Full name</label>
            <input name="fullname" onChange={handleInput} id="fullname" value={credentials.fullname} type="text" placeholder="Fullname" />

            <label htmlFor="username">Username</label>
            <input name="username" onChange={handleInput} id="username" value={credentials.username} type="text" placeholder="Username" />

            <label htmlFor="password">Password</label>
            <input name="password" onChange={handleInput} id="password" value={credentials.password} type="password" placeholder="Password" />

            <button>Login</button>
        </form>
    )
}