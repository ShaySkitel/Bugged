
const { useEffect, useState } = React
const { useParams, useNavigate } = ReactRouterDOM

import { bugService } from "../services/bug.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"

import { BugList } from "../cmps/bug-list.jsx"

export function UserDetails() {
    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState([])
    const { userId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        userService.getById(userId)
            .then(setUser)
            .catch(() => {
                navigate('/')
                showErrorMsg('Failed to load user')
            })

        userService.getUserBugs(userId)
            .then(setUserBugs)
    }, [userId])

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = userBugs.filter(bug => bug._id !== bugId)
                setUserBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = userBugs.map(currBug => (currBug._id === savedBug._id) ? savedBug : currBug)
                setUserBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        user &&
        <section className="user-details">
            <h2>{user.fullname}</h2>
            {userBugs[0] &&
                <BugList bugs={userBugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            }
            {!userBugs[0] && 
                <h3>No bugs to show 😔</h3>
            }
        </section>
    )
}