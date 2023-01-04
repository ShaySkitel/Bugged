const { useNavigate } = ReactRouterDOM
const { useEffect } = React

import { userService } from "../services/user.service.js"

export function UserIndex() {
    const navigate = useNavigate()

    const currUser = userService.getCurrUser()

    useEffect(() => {
        if (!currUser || !currUser.isAdmin) {
            return navigate('/')
        }
    }, [])

    if (!currUser || !currUser.isAdmin) return
    
    return <h2>ADMIN USER INDEX SECRET PAGE :O</h2>
}