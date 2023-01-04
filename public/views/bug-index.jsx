import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'

const { useState, useEffect } = React

export function BugIndex() {

    const [bugs, setBugs] = useState([])
    const [pageIdx, setPageIdx] = useState(0)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [pageIdx])

    console.log(bugs.length)

    function loadBugs() {
        bugService.query(filterBy, pageIdx).then(bugs => {
            setBugs(bugs)
            if(!bugs.length) setPageIdx(0)
        })
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            description: prompt('Description?'),
            severity: +prompt('Bug severity?'),
            labels: prompt('Labels (comma seperated)').split(',')
        }
        bugService.save(bug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                // setBugs([...bugs, savedBug])
                loadBugs()
                showSuccessMsg('Bug added')
            })
            .catch(err => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map(currBug => (currBug._id === savedBug._id) ? savedBug : currBug)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onSearch(filterBy) {
        console.log(filterBy)
        setPageIdx(0)
        filterBy.searchStr = filterBy.searchStr.toLowerCase()
        setFilterBy({...filterBy})
        bugService.query(filterBy, pageIdx).then(bugs => {
            setBugs(bugs)
        })
    }

    function onChangePage(diff) {
        if(pageIdx + diff < 0 && diff === -1) return
        else if(bugs.length < 5 && diff === 1) return setPageIdx(0)
        setPageIdx(prevIdx => prevIdx + diff)
    }

    return (
        <section className="bug-index">
            <h3>Bugs App</h3>
            <button onClick={onAddBug}>Add bug</button>
            <BugFilter onSearch={onSearch} />
            <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            <div>
                <button onClick={() => onChangePage(-1)}>Previous</button>
                <button onClick={() => onChangePage(1)}>Next</button>
            </div>
        </section>
    )


}
