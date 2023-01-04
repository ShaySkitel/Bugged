const Router = ReactRouterDOM.HashRouter
const { useState } = React
const { Route, Routes } = ReactRouterDOM
import routes from './routes.js'

import { userService } from './services/user.service.js'

import { AppHeader } from './cmps/app-header.jsx'
import { AppFooter } from './cmps/app-footer.jsx'
import { UserMsg } from './cmps/user-msg.jsx'
import { Login } from './views/login.jsx'
import { SignUp } from './views/sign-up.jsx'
import { UserDetails } from './views/user-details.jsx'
import { UserIndex } from './views/user-index.jsx'

export function App() {

    const [currUser, setCurrUser] = useState(userService.getCurrUser())

    return <Router>
        <div className='main-container main-layout'>
            <AppHeader user={currUser} setUser={setCurrUser} />
            <main>
                <Routes>
                    {routes.map(route =>
                        <Route key={route.path} element={<route.component />} path={route.path} />
                    )}
                    <Route element={<Login setUser={setCurrUser} />} path='/login' />
                    <Route element={<SignUp setUser={setCurrUser} />} path='/signup' />
                    <Route element={<UserIndex />} path='/user' />
                    <Route element={<UserDetails />} path='/user/:userId' />
                </Routes>
            </main>
            <AppFooter />
            <UserMsg />
        </div>
    </Router>

}


