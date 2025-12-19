import React from 'react'

function Popup({ selected, closePopup }) {
  return (
    console.log(selected),
    <section className='popup'>
      <div className='content'>
        <h2>{selected.Title} <span>({selected.Year})</span></h2>
        <p className='rating'> Rating IMDB: {selected.imdbRating}/10</p>
        <div className='plot'>
            <img src={selected.Poster} alt={selected.Title} />
            <div className='details'>
                <p>Type: {selected.Type}</p>
                <p>Genre: {selected.Genre}</p>
                {selected.Type === "movie" && <p>Runtime: {selected.Runtime}</p>}
                {selected.Type === "series" && <p>Total Seasons: {selected.totalSeasons}</p>}
                <p>Director: {selected.Director}</p>
                <p>Actors: {selected.Actors}</p>
                <p>Country: {selected.Country}</p>
                <p>Language: {selected.Language}</p>
                <p>{selected.Plot}</p>
            </div>
        </div>
        <button className='close' onClick={closePopup}>Close</button>
      </div>
    </section>
  )
}

export default Popup