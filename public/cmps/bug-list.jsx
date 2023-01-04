const { Link } = ReactRouterDOM

import { userService } from "../services/user.service.js"

import { BugPreview } from "./bug-preview.jsx"

export function BugList({ bugs, onRemoveBug, onEditBug }) {
    const currUser = userService.getCurrUser()
    return <ul className="bug-list">
        {bugs.map(bug =>
            <li className="bug-preview" key={bug._id}>
                <BugPreview bug={bug} />
                {(currUser && currUser._id === bug.creator._id || currUser.isAdmin) &&
                    <div>
                        <button onClick={() => { onRemoveBug(bug._id) }}>x</button>
                        <button onClick={() => { onEditBug(bug) }}>Edit</button>
                    </div>
                }
                <Link to={`/bug/${bug._id}`}>Details</Link>
            </li>)}
    </ul>
}