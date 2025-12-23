import React, {useState, useEffect} from 'react'

import axios from 'axios';

function Filter( {applyFilters, handleMovieType, handleReleaseYear, handleReleaseBefore, handleReleaseAfter, handleActors, handleDirector, handleGenre, defaultType, defaultReleaseAfter, defaultReleaseBefore, defaultReleaseYear, defaultActors, defaultDirector, defaultGenre, resetFilters} ) {
    const [state, setState] = useState({
        genresList: []
    });

    const apiurlTMDB = "https://api.themoviedb.org/3";

    useEffect(() => {
        const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + process.env.REACT_APP_TMDB_AUTH_TOKEN
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
        Type: <select id='movie_type_filter' onChange={handleMovieType} defaultValue={defaultType}>
          <option key={"Movie"} value="Movie">Movie</option>
          <option key={"Tv"} value="Tv">Series</option>
        </select>
    </p>
    <p>
        Release year: <input id='release_year_filter' type="number" placeholder='e.g. 2020' min="1950" max={new Date().getFullYear()} onChange={handleReleaseYear} defaultValue={defaultReleaseYear}/>
    </p>
    <p>
        Released after: <input id='release_after_filter' type="number" placeholder='e.g. 2020' min="1950" max={new Date().getFullYear()} onChange={handleReleaseAfter} defaultValue={defaultReleaseAfter}/>
    </p>
    <p>
        Released before: <input  id='release_before_filter' type="number" placeholder='e.g. 2020' min="1950" max={new Date().getFullYear()} onChange={handleReleaseBefore} defaultValue={defaultReleaseBefore} />
    </p>
    <p>
        Actors: <input id='actors_filter' type="text" placeholder='e.g. Robert Downey Jr.' onChange={handleActors} defaultValue={defaultActors} />
    </p>
    <p>
        Director: <input id='director_filter' type="text" placeholder='e.g. Steven Spielberg' onChange={handleDirector} defaultValue={defaultDirector} />
    </p>
    <p>
        Genre: <select id='genre_filter' onChange={handleGenre} value={defaultGenre}>
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