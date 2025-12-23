import React from 'react'

import ResultTMDB from './ResultTMDB'

function Results({ resultsTMDB, openPopupTMDB, type }) {
    return (
        <section className='results'>
        {resultsTMDB.length > 0 && type === "Movie" && resultsTMDB.map(result => ( result.poster_path &&
            <ResultTMDB result={result} key={result.id} openPopup={openPopupTMDB} type={type}/>
        ))}
        {resultsTMDB.length > 0 && type === "Tv" && resultsTMDB.map(result => ( result.poster_path &&
            <ResultTMDB result={result} key={result.id} openPopup={openPopupTMDB} type={type}/>
        ))}

        </section>
    )
}

export default Results