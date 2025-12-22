import React, { useState } from 'react';
import axios from 'axios';
import Search from './components/Search';
import Results from './components/Results';
import Popup from './components/Popup';
import Reset from './components/Reset';
import Filter from './components/Filter';
import Alert from '@mui/material/Alert';


function App() {
  const [state, setState] = useState({
    s: "",
    results: (localStorage.getItem('results') !== undefined && JSON.parse(localStorage.getItem('results'))) || [],
    selected: (localStorage.getItem('selected') && JSON.parse(localStorage.getItem('selected'))) || {},
    resultsTMDB: (localStorage.getItem('resultsTMDB') && JSON.parse(localStorage.getItem('resultsTMDB'))) || [],
    filters:{
      movieType: "movie",
      releaseBefore: "",
      releaseAfter: "",
      actors: "",
      actorID: 0,
      genre: "all"
    },
  });

  const apiurlOMDB = "http://www.omdbapi.com/?apikey=d1ac231";
  const apiurlTMDB = "https://api.themoviedb.org/3";

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YjQ5NGU4YmI4ZGIzYjI3NGE1NDU2N2Q0OTJjNTE4YSIsIm5iZiI6MTc2NjE0MzM5Mi40NDYsInN1YiI6IjY5NDUzNWEwOTQwNDFhMDE5MjgxMTdiYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xr0bJTD8lkcBs3uUtR1ZSEgl8SgCYStsSXTtH1Ze8xA'
    }
  };

  const search = (e) => {
    if (e.key === "Enter") {
      axios(apiurlOMDB + "&s=" + state.s).then(({ data }) => {
        if (data.Response === "False") {
          console.error("Error:", data.Error);
          setState(prevState => {
            return { ...prevState, results: [] }
          });
          localStorage.setItem('results', JSON.stringify([]));
          return;
        }
        let results = data.Search;
        setState(prevState => {
          return { ...prevState, results: results }
        });
        localStorage.setItem('results', JSON.stringify(results));
      });
    }
  }

  const handleInput = (e) => {
    let s = e.target.value;
    setState(prevState => {
      return { ...prevState, s: s }
    });
  }

  const openPopup = (id) => {
    axios(apiurlOMDB + "&i=" + id + "&plot=full").then(({ data }) => {
      let result = data;

      setState(prevState => {
        return { ...prevState, selected: result }
      });
      localStorage.setItem('selected', JSON.stringify(result));
    });
  }

  const openPopupTMDB = (title) => {
    const t = title.replace(' ', '+').replace(':', '%3A');
    axios(apiurlOMDB + "&t=" + t + "&plot=full").then(({ data }) => {
      let result = data;

      setState(prevState => {
        return { ...prevState, selected: result }
      });
      localStorage.setItem('selected', JSON.stringify(result));
    });
  }

  const closePopup = () => {
    setState(prevState => {
      return { ...prevState, selected: {} }
    });
    localStorage.removeItem('selected');
  }

  const resetApp = () => {
    setState({
      s: "",
      results: [],
      selected: {},
      resultsTMDB: [],
      filters:{
        movieType: "movie",
        releaseBefore: "",
        releaseAfter: "",
        actors: "",
        actorID: 0,
        genre: "all"
      },
    });
    localStorage.clear();
  }

  const applyFilters = async () => {
    console.log(apiurlTMDB + "/discover/" + state.filters.movieType + (state.filters.genre !== "all" || state.filters.releaseBefore !== "" || state.filters.releaseAfter !== "" || state.filters.actorID ? "?" : "") + (state.filters.genre !== "all" ? "with_genres=" + state.filters.genre : "") + (state.filters.releaseBefore !== "" ? "&primary_release_date.lte=" + state.filters.releaseBefore : "") + ( state.filters.releaseAfter !== "" ? "&primary_release_date.gte=" + state.filters.releaseAfter : "") + (state.filters.actorID ? "&with_cast=" + state.filters.actorID : ""));
    axios(apiurlTMDB + "/discover/" + state.filters.movieType + (state.filters.genre !== "all" || state.filters.releaseBefore !== "" || state.filters.releaseAfter !== "" || state.filters.actorID ? "?" : "") + (state.filters.genre !== "all" ? "with_genres=" + state.filters.genre : "") + (state.filters.releaseBefore !== "" ? "&primary_release_date.lte=" + state.filters.releaseBefore : "") + ( state.filters.releaseAfter !== "" ? "&primary_release_date.gte=" + state.filters.releaseAfter : "") + (state.filters.actorID ? "&with_cast=" + state.filters.actorID : ""), options).then(({ data }) => {
      let tmdbResults = data.results;
      console.log("TMDB Results:", tmdbResults);
      setState(prevState => {
        return { ...prevState, resultsTMDB: tmdbResults }
      });
      localStorage.setItem('resultsTMDB', JSON.stringify(tmdbResults));
    });
  }

  const handleMovieType = (e) => {
    const movieType = e.target.value;
    setState(prevState => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          movieType: movieType
        }
      }
    });
  }

  const handleReleaseBefore = (e) => {
    const releaseBefore = e.target.value;
    
      console.log("Release before filter cleared");
    
    setState(prevState => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          releaseBefore: releaseBefore+"-01-01"
        }
      }
    });
  }

  const handleReleaseAfter = (e) => {
    const releaseAfter = e.target.value;
    setState(prevState => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          releaseAfter: releaseAfter + "-12-31"
        }
      }
    });
  }

  const handleActors = async (e) => {
    const actors = e.target.value;
    actors.trim().replace(' ', '%20');
    try {
      const { data } = await axios(apiurlTMDB + "/search/person?query=" + actors, options);
      if(data.results && data.results.length > 0) {
        const actorId = data.results.reduce((prev, current) => prev.popularity > current.popularity ? prev : current).id;
        console.log("Found actor IDs:", actorId);
        setState(prevState => {
          return {
            ...prevState,
            filters: {
              ...prevState.filters,
              actorID: actorId
            }
          }
        });
      } else {
        console.log("No actor found with the name:", actors);
        <Alert severity="error">No actor named {actors} found.</Alert>
      }
    } catch (error) {
      console.error("Error fetching actor:", error);
    }
    setState(prevState => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          actors: actors
        }
      }
    });
  }

  const handleGenre = (e) => {
    const genre = e.target.value;
    setState(prevState => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          genre: genre
        }
      }
    });
  }



  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie Database</h1>
      </header>
      <main>
        <Search handleInput={handleInput} search={search} />
        <Results results={state.results} openPopup={openPopup} resultsTMDB={state.resultsTMDB} openPopupTMDB={openPopupTMDB} />
        {(typeof state.selected.Title != "undefined") ? <Popup selected={state.selected} closePopup={closePopup} /> : false}
        { (state.results.length > 0 || state.resultsTMDB.length > 0) && <Reset resetApp={resetApp} />}
        { (state.results.length === 0 && state.resultsTMDB.length === 0) && <Filter applyFilters={applyFilters}  handleMovieType={handleMovieType}  handleReleaseBefore={handleReleaseBefore} handleReleaseAfter={handleReleaseAfter} handleActors={handleActors} handleGenre={handleGenre} /> }
      </main>
    </div>
  );
}

export default App;
