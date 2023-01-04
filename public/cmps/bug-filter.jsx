const { useState } = React

import { bugService } from "../services/bug.service.js"

export function BugFilter({ onSearch }) {

    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    function handleInput({ target }) {
        const { value, name: field } = target
        setFilterBy(prevFilter => {
            onSearch({ ...prevFilter, [field]: value })
            return { ...prevFilter, [field]: value }
        })
    }

    return <section className="bug-filter">
        <input name="searchStr" onChange={handleInput} type="text" value={filterBy.searchStr} placeholder="Search bug" />
        <label htmlFor="sort-by">Sort by date </label>
        <select onChange={handleInput} name="date" id="sort-by">
            <option value="new">New</option>
            <option value="old">Old</option>
        </select>
    </section>
}