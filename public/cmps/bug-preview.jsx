

export function BugPreview({bug}) {

    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>{bug.description}</p>
        <small>Owner: {bug.creator.fullname}</small>
        <p>Severity: <span>{bug.severity}</span></p>
    </article>
}