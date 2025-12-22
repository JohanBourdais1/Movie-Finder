import React, {useState, useEffect} from 'react'

import axios from 'axios';

function Filter( {applyFilters, handleMovieType, handleReleaseBefore, handleReleaseAfter, handleActors, handleGenre, defaultType, defaultReleaseAfter, defaultReleaseBefore, defaultActors, defaultGenre, resetFilters} ) {
    const [state, setState] = useState({
        genresList: []
    });

    const apiurlTMDB = "https://api.themoviedb.org/3";

    useEffect(() => {
        const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YjQ5NGU4YmI4ZGIzYjI3NGE1NDU2N2Q0OTJjNTE4YSIsIm5iZiI6MTc2NjE0MzM5Mi40NDYsInN1YiI6IjY5NDUzNWEwOTQwNDFhMDE5MjgxMTdiYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xr0bJTD8lkcBs3uUtR1ZSEgl8SgCYStsSXTtH1Ze8xA'
    }
  };
    axios.get(apiurlTMDB + '/genre/movie/list', options).then(({ data }) => {
        let genresList = data.genres;
        setState(prevState => {
          return { ...prevState, genresList: genresList }
        });
      });
    }, []);
  return (
    <section className='filter'>
    <h3>Filter options</h3>
    <p>
        Type: <select id='movie-type' onChange={handleMovieType} defaultValue={defaultType}>
          <option key={"movie"} value="movie">Movie</option>
          <option key={"tv"} value="tv">Series</option>
        </select>
    </p>
    <p>
        Release year after: <input id='release-after' type="number" placeholder='e.g. 2020' min="1950" max={new Date().getFullYear()} onChange={handleReleaseAfter} defaultValue={defaultReleaseAfter}/>
    </p>
    <p>
        Release year before: <input  id='release-before' type="number" placeholder='e.g. 2020' min="1950" max={new Date().getFullYear()} onChange={handleReleaseBefore} defaultValue={defaultReleaseBefore} />
    </p>
    <p>
        Actors: <input id='actors' type="text" placeholder='e.g. Robert Downey Jr.' onChange={handleActors} defaultValue={defaultActors} />
    </p>
    <p>
        Genre: <select id='genre' onChange={handleGenre} value={defaultGenre}>
          <option value="all">All</option>
            {state.genresList.map( (genre) => (
                <option value={genre.id} key={genre.id}>{genre.name}</option>
            ))}
        </select>
    </p>
    <p>
        <button id='apply-filters' onClick={applyFilters}>Apply Filters</button>
    </p>
    <p>
        <button id='reset-filters' onClick={resetFilters}>Reset</button>
    </p>
    </section>
  )
}

export default Filter