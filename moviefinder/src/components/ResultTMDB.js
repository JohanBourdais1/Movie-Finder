import React from 'react'

function ResultTMDB({ openPopup, result, type }) {
  return (
    <div className='result' onClick={() => openPopup(type === "tv" ? result.original_name : result.title, result.id, type)}>
        <img src={`https://image.tmdb.org/t/p/original${result.poster_path}`} alt={type === "tv" ? result.original_name : result.title} />
        <h3>{type === "tv" ? result.original_name : result.title}</h3>
        <h5>{type === "tv" ? result.name : result.original_title}</h5>
    </div>
  )
}

export default ResultTMDB