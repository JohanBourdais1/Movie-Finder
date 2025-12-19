import React from 'react'

import Result from './Result'

function Results({ results, openPopup }) {
    const uniqueResults = results.reduce((acc, current) => {
        if (!acc.find(item => item.imdbID === current.imdbID) && current.Poster !== "N/A") {
            acc.push(current)
        }
        return acc
    }, [])
    return (
        <section className='results'>
        {uniqueResults.map(result => (
            <Result result={result} key={result.imdbID} openPopup={openPopup}/>
        ))}
        </section>
    )
}

export default Results