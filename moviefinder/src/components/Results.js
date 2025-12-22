import React from 'react'

import Result from './Result'
import ResultTMDB from './ResultTMDB'

function Results({ results, openPopup, resultsTMDB, openPopupTMDB }) {
    const uniqueResults = results.reduce((acc, current) => {
        if (!acc.find(item => item.imdbID === current.imdbID) && current.Poster !== "N/A") {
            acc.push(current)
        }
        return acc
    }, [])
    return (
        <section className='results'>
        {resultsTMDB.length > 0 && resultsTMDB.map(result => (
            <ResultTMDB result={result} key={result.title} openPopup={openPopupTMDB}/>
        ))}
        {uniqueResults.length > 0 && uniqueResults.map(result => (
            <Result result={result} key={result.imdbID} openPopup={openPopup}/>
        ))}
        </section>
    )
}

export default Results