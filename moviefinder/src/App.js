import React, { useState } from 'react';
import axios from 'axios';
import Search from './components/Search';
import Results from './components/Results';
import Popup from './components/Popup';
import Reset from './components/Reset';
import Filter from './components/Filter';
import Alert from '@mui/material/Alert';
import SearchButton from './components/SearchButton';

function App() {
  const [state, setState] = useState({
    s: "",
    selected: (localStorage.getItem('selected') !== undefined && JSON.parse(localStorage.getItem('selected'))) || {},
    resultsTMDB: (localStorage.getItem('resultsTMDB') !== undefined && JSON.parse(localStorage.getItem('resultsTMDB'))) || [],
    selectedTMDB: (localStorage.getItem('selectedTMDB') !== undefined && JSON.parse(localStorage.getItem('selectedTMDB'))) || {},
    filters:{
      movieType: "movie",
      releaseBefore: "",
      releaseAfter: "",
      actors: "",
      actorID: 0,
      genre: ""
    },
    tmpFilters:{
      movieType: (localStorage.getItem('movieType') !== undefined && localStorage.getItem('movieType')) || "movie",
      releaseBefore: (localStorage.getItem('releaseBefore') !== undefined && localStorage.getItem('releaseBefore')) || "",
      releaseAfter: (localStorage.getItem('releaseAfter') !== undefined && localStorage.getItem('releaseAfter')) || "",
      actors: (localStorage.getItem('actors') !== undefined && localStorage.getItem('actors')) || "",
      actorID: (localStorage.getItem('actorID') !== undefined && localStorage.getItem('actorID')) || 0,
      genre: (localStorage.getItem('genre') !== undefined && localStorage.getItem('genre')) || "all"
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
    if (e.key === "Enter" || e.target.className === "search-button") {
      console.log("Searching for:", state.s);
      console.log("With filters:", state.tmpFilters);
      console.log(state.filters);
      if (state.s.trim() === "") {
        console.log(apiurlTMDB + "/discover/" + state.tmpFilters.movieType + ((state.tmpFilters.genre !== "all" && state.tmpFilters.genre !== "") || state.tmpFilters.releaseBefore !== "" || state.tmpFilters.releaseAfter !== "" || state.tmpFilters.actorID ? "?" : "") + (state.tmpFilters.genre !== "all" && state.tmpFilters.genre !== "" ? "with_genres=" + state.tmpFilters.genre : "") + (state.tmpFilters.releaseBefore !== "" ? "&primary_release_date.lte=" + state.tmpFilters.releaseBefore : "") + ( state.tmpFilters.releaseAfter !== "" ? "&primary_release_date.gte=" + state.tmpFilters.releaseAfter : "") + (state.tmpFilters.actorID ? "&with_cast=" + state.tmpFilters.actorID : ""));
        axios(apiurlTMDB + "/discover/" + state.tmpFilters.movieType + ((state.tmpFilters.genre !== "all" && state.tmpFilters.genre !== "") || state.tmpFilters.releaseBefore !== "" || state.tmpFilters.releaseAfter !== "" || state.tmpFilters.actorID ? "?" : "") + (state.tmpFilters.genre !== "all" && state.tmpFilters.genre !== "" ? "with_genres=" + state.tmpFilters.genre : "") + (state.tmpFilters.releaseBefore !== "" ? "&primary_release_date.lte=" + state.tmpFilters.releaseBefore : "") + ( state.tmpFilters.releaseAfter !== "" ? "&primary_release_date.gte=" + state.tmpFilters.releaseAfter : "") + (state.tmpFilters.actorID ? "&with_cast=" + state.tmpFilters.actorID : ""), options).then(({ data }) => {
          let tmdbResults = data.results;
          console.log("TMDB Results:", tmdbResults);
          setState(prevState => {
            return { ...prevState, resultsTMDB: tmdbResults }
          });
          localStorage.setItem('resultsTMDB', JSON.stringify(tmdbResults));
        });
      }
      else {
        axios(apiurlTMDB + "/search/" + state.tmpFilters.movieType + "?query=" + state.s + '&include_adult=true', options).then(({ data }) => {
          if (data.Response === "False") {
            console.error("Error:", data.Error);
            setState(prevState => {
              return { ...prevState, resultsTMDB: [] }
            });
            localStorage.setItem('resultsTMDB', JSON.stringify([]));
            return;
          }
          console.log("TMDB Data:", data);
          let results = data.results;
          setState(prevState => {
            return { ...prevState, resultsTMDB: results }
          });
          localStorage.setItem('resultsTMDB', JSON.stringify(results));
        });
      }
    }
  }

  const handleInput = (e) => {
    let s = e.target.value;
    setState(prevState => {
      return { ...prevState, s: s }
    });
  }

  const openPopupTMDB = async (title, id, type) => {
    const t = title.replace(' ', '+').replace(':', '%3A');
    axios(apiurlOMDB + "&t=" + t + "&plot=full").then(({ data }) => {
      let result = data;
      setState(prevState => {
        return { ...prevState, selected: result}
      });
      localStorage.setItem('selected', JSON.stringify(result));
    });
    axios(apiurlTMDB + "/" + type + "/" + id, options).then(({ data }) => {
      let result = data;
      console.log("Fetched TMDB details:", result);
      setState(prevState => {
        return { ...prevState, selectedTMDB: result}
      });
      localStorage.setItem('selectedTMDB', JSON.stringify(result));
    });
  }

  const closePopup = () => {
    setState(prevState => {
      return { ...prevState, selected: {} }
    });
    localStorage.removeItem('selected');
  }

  const resetApp = () => {
    setState(prevState => ({
      ...prevState,
      s: "",
      selected: {},
      selectedTMDB: {},
      resultsTMDB: [],
      filters:{
        movieType: "movie",
        releaseBefore: "",
        releaseAfter: "",
        actors: "",
        actorID: 0,
        genre: ""
      }
    }));
    localStorage.removeItem('resultsTMDB');
    localStorage.removeItem('selected');
    localStorage.removeItem('movieType');
    localStorage.removeItem('releaseBefore');
    localStorage.removeItem('releaseAfter');
    localStorage.removeItem('actors');
    localStorage.removeItem('actorID');
    localStorage.removeItem('genre');
    localStorage.removeItem('selectedTMDB');
    document.getElementById('search-bar').value = "";
  }

  const applyFilters = async () => {
    setState(prevState => {
      return {
        ...prevState,
        filters: {
          ...prevState.tmpFilters
        }
      }
    });
    document.getElementById('search-button').click();
  }

  const handleMovieType = (e) => {
    const movieType = e.target.value;
    setState(prevState => {
      return {
        ...prevState,
        tmpFilters: {
          ...prevState.tmpFilters,
          movieType: movieType
        }
      }
    });
    localStorage.setItem('movieType', movieType);
  }

  const handleReleaseBefore = (e) => {
    const releaseBefore = e.target.value;
    setState(prevState => {
      return {
        ...prevState,
        tmpFilters: {
          ...prevState.tmpFilters,
          releaseBefore: releaseBefore+"-01-01"
        }
      }
    });
    localStorage.setItem('releaseBefore', releaseBefore);
  }

  const handleReleaseAfter = (e) => {
    const releaseAfter = e.target.value;
    setState(prevState => {
      return {
        ...prevState,
        tmpFilters: {
          ...prevState.tmpFilters,
          releaseAfter: releaseAfter + "-12-31"
        }
      }
    });
    localStorage.setItem('releaseAfter', releaseAfter);
  }

  const handleActors = async (e) => {
    const actors = e.target.value;
    actors.trim().replace(' ', '%20');
    try {
      const { data } = axios(apiurlTMDB + "/search/person?query=" + actors, options);
      if(data.results && data.results.length > 0) {
        const actorId = data.results.reduce((prev, current) => prev.popularity > current.popularity ? prev : current).id;
        localStorage.setItem('actorID', actorId);
        setState(prevState => {
          return {
            ...prevState,
            tmpFilters: {
              ...prevState.tmpFilters,
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
        tmpFilters: {
          ...prevState.tmpFilters,
          actors: actors
        }
      }
    });
    localStorage.setItem('actors', actors);
  }

  const handleGenre = (e) => {
    const genre = e.target.value;
    setState(prevState => {
      return {
        ...prevState,
        tmpFilters: {
          ...prevState.tmpFilters,
          genre: genre
        }
      }
    });
    localStorage.setItem('genre', genre);
  }

  const resetFilters = () => {
    setState(prevState => {
      return {
        ...prevState,
        tmpFilters: {
          movieType: "movie",
          releaseBefore: "",
          releaseAfter: "",
          actors: "",
          actorID: 0,
          genre: ""
        }
      }
    });
    localStorage.removeItem('movieType');
    localStorage.removeItem('releaseBefore');
    localStorage.removeItem('releaseAfter');
    localStorage.removeItem('actors');
    localStorage.removeItem('actorID');
    localStorage.removeItem('genre');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie Database</h1>
      </header>
      <main>
        <Search handleInput={handleInput} search={search} s={state.s}/>
        <SearchButton search={search} />
        <Results resultsTMDB={state.resultsTMDB} openPopupTMDB={openPopupTMDB} type={state.filters.movieType}/>
        {console.log("Current selected movie:", state.selectedTMDB)}
        {(typeof state.selected.Title != "undefined") ? <Popup selected={state.selected} selectedTMDB={state.selectedTMDB} closePopup={closePopup} /> : false}
        { (state.resultsTMDB.length > 0) && <Reset resetApp={resetApp} />}
        {(typeof state.selected.Title === "undefined") ? <Filter applyFilters={applyFilters}  handleMovieType={handleMovieType}  handleReleaseBefore={handleReleaseBefore} handleReleaseAfter={handleReleaseAfter} handleActors={handleActors} handleGenre={handleGenre} defaultType={state.tmpFilters.movieType} defaultReleaseAfter={state.tmpFilters.releaseAfter} defaultReleaseBefore={state.tmpFilters.releaseBefore} defaultActors={state.tmpFilters.actors} defaultGenre={state.tmpFilters.genre} resetFilters={resetFilters} /> : false}
      </main>
    </div>
  );
}

export default App;
