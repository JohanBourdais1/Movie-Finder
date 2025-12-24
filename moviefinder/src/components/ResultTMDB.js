import React from 'react'

function ResultTMDB({ openPopup, result, type }) {
  return (
    <div className='result' onClick={() => openPopup(result.id, type)}>
        <img src={`https://image.tmdb.org/t/p/original${result.poster_path}`} alt={type === "Tv" ? result.original_name : result.title} />
        <h3>{type === "Tv" ? result.original_name : result.title}</h3>
        <h5>{type === "Tv" ? result.name : result.original_title}</h5>
    </div>
  )
}

export default ResultTMDB