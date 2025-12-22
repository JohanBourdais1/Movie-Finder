import React from 'react'

function ResultTMDB({ openPopup, result }) {
  return (
    <div className='result' onClick={() => openPopup(result.title)}>
        <img src={`https://image.tmdb.org/t/p/original${result.backdrop_path}`} alt={result.title} />
        <h3>{result.title}</h3>
    </div>
  )
}

export default ResultTMDB