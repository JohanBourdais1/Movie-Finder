import React from 'react'

function Popup({ selected, selectedTMDB, closePopup, }) {
  if ((!selectedTMDB || Object.keys(selectedTMDB).length === 0) || !selected) return null;
  return (
    <section className='popup'>
      <div className='content'>
        <h2>{selectedTMDB.title} <span>({selected.Year})</span></h2>
        <br />
        <div className='plot'>
            <img src={`https://image.tmdb.org/t/p/original${selectedTMDB.poster_path}`} alt={selected.Title}/>
            <div className='details'>
                <p>Type: {selected.Type}</p>
                <p>Genre: {selected.Genre}</p>
                {selected.Type === "movie" && <p>Runtime: {selected.Runtime}</p>}
                {selected.Type === "series" && <p>Total Seasons: {selected.totalSeasons}</p>}
                <p>Director: {selected.Director}</p>
                <p>Actors: {selected.Actors}</p>
                <p>Country: {selected.Country}</p>
                <p>Language: {selected.Language}</p>
                <p>{selected.Plot.length > selectedTMDB.overview.length ? selected.Plot : selectedTMDB.overview}</p>
            </div>
        </div>
        <img id='backprop_img' src={selectedTMDB.backdrop_path !== null ? `https://image.tmdb.org/t/p/original${selectedTMDB.backdrop_path}` : null} alt={selected.Title}/>
        <button className='close' onClick={closePopup}>Close</button>
      </div>
    </section>
  )
}

export default Popup