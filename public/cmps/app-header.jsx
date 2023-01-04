const { Fragment } = React
const { NavLink, useNavigate } = ReactRouterDOM

import { userService } from "../services/user.service.js"

export function AppHeader({ user, setUser }) {
    const navigate = useNavigate()

    function onLogout() {
        console.log('t')
        userService.logout()
            .then(() => {
                setUser(null)
                navigate('/')
            })
    }

    return (
        <header className='full main-layout'>
            <div className='flex space-between align-center'>
                <h1>Bugged</h1>
                <nav>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/bug">Bugs</NavLink>
                    <NavLink to="/about">About</NavLink>
                    {!user &&
                        <Fragment>
                            <NavLink to="/login">Login</NavLink>
                            <NavLink to="/signup">Signup</NavLink>
                        </Fragment>
                    }
                    {user && user.isAdmin &&
                        <NavLink to={`/user`}>Users</NavLink>
                    }
                    {user &&
                        <Fragment>
                            <NavLink to={`/user/${user._id}`}>{user.username}</NavLink>
                            <a onClick={onLogout} href="#">Logout</a>
                        </Fragment>
                    }

                </nav>
            </div>
        </header>
    )
}
