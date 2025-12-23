import React, { useState } from 'react';
import axios from 'axios';
import Search from './components/Search';
import Results from './components/Results';
import Popup from './components/Popup';
import Reset from './components/Reset';
import Filter from './components/Filter';
import Alert from '@mui/material/Alert';
import SearchButton from './components/SearchButton';
import FilterIcon from './components/FilterIcon';

function App() {
  const [state, setState] = useState({
    s: "",
    selected: (localStorage.getItem('selected') !== undefined && JSON.parse(localStorage.getItem('selected'))) || {},
    resultsTMDB: (localStorage.getItem('resultsTMDB') !== undefined && JSON.parse(localStorage.getItem('resultsTMDB'))) || [],
    selectedTMDB: (localStorage.getItem('selectedTMDB') !== undefined && JSON.parse(localStorage.getItem('selectedTMDB'))) || {},
    filters:{
      movie_type: "Movie",
      release_year: "",
      release_before: "",
      release_after: "",
      actors: "",
      director: "",
      directorID: 0,
      actorID: 0,
      genre: ""
    },
    tmpFilters:{
      movie_type: (localStorage.getItem('movie_type') !== undefined && localStorage.getItem('movie_type')) || "Movie",
      release_year: (localStorage.getItem('release_year') !== undefined && localStorage.getItem('release_year')) || "",
      release_before: (localStorage.getItem('release_before') !== undefined && localStorage.getItem('release_before')) || "",
      release_after: (localStorage.getItem('release_after') !== undefined && localStorage.getItem('release_after')) || "",
      actors: (localStorage.getItem('actors') !== undefined && localStorage.getItem('actors')) || "",
      director: (localStorage.getItem('director') !== undefined && localStorage.getItem('director')) || "",
      directorID: (localStorage.getItem('directorID') !== undefined && localStorage.getItem('directorID')) || 0,
      actorID: (localStorage.getItem('actorID') !== undefined && localStorage.getItem('actorID')) || 0,
      genre: (localStorage.getItem('genre') !== undefined && localStorage.getItem('genre')) || "All"
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
    setState(prevState => {
      return {
        ...prevState,
        filters: {
          ...prevState.tmpFilters
        }
      }
    });
    console.log(e);
    if (e.key === "Enter" || e.target.className === "search-button") {
      console.log("filters", state.filters);
      console.log(state.tmpFilters);
      if (state.s.trim() === "") {
        console.log(apiurlTMDB + "/discover/" + state.tmpFilters.movie_type.toLowerCase() + 
          ((state.tmpFilters.genre !== "All" && state.tmpFilters.genre !== "") || state.tmpFilters.directorID || state.tmpFilters.release_year !== "" || state.tmpFilters.release_before !== "" || state.tmpFilters.release_after !== "" || state.tmpFilters.actorID ? "?" : "") + 
          (state.tmpFilters.genre !== "All" && state.tmpFilters.genre !== "" ? "with_genres=" + state.tmpFilters.genre : "") + 
          (state.tmpFilters.release_before !== "" ? (state.tmpFilters.movie_type === "Movie" ? "&primary_release_date.lte=" : "&first_air_date.lte=") + state.tmpFilters.release_before : "") + 
          (state.tmpFilters.release_after !== "" ? (state.tmpFilters.movie_type === "Movie" ? "&primary_release_date.gte=" : "&first_air_date.gte=") + state.tmpFilters.release_after : "") + 
          (state.tmpFilters.actorID && state.tmpFilters.movie_type === "Movie" ? "&with_cast=" + state.tmpFilters.actorID : "") + 
          (state.tmpFilters.directorID && state.tmpFilters.movie_type === "Movie" ? "&with_crew=" + state.tmpFilters.directorID : "") + 
          (state.tmpFilters.release_year !== "" ? (state.tmpFilters.movie_type === "Movie" ? "&primary_release_year=" : "&first_air_date_year=") + state.tmpFilters.release_year : ""));

        axios(apiurlTMDB + "/discover/" + state.tmpFilters.movie_type.toLowerCase() + 
          ((state.tmpFilters.genre !== "All" && state.tmpFilters.genre !== "") || state.tmpFilters.directorID || state.tmpFilters.release_year !== "" || state.tmpFilters.release_before !== "" || state.tmpFilters.release_after !== "" || state.tmpFilters.actorID ? "?" : "") + 
          (state.tmpFilters.genre !== "All" && state.tmpFilters.genre !== "" ? "with_genres=" + state.tmpFilters.genre : "") + 
          (state.tmpFilters.release_before !== "" ? (state.tmpFilters.movie_type === "Movie" ? "&primary_release_date.lte=" : "&first_air_date.lte=") + state.tmpFilters.release_before : "") + 
          (state.tmpFilters.release_after !== "" ? (state.tmpFilters.movie_type === "Movie" ? "&primary_release_date.gte=" : "&first_air_date.gte=") + state.tmpFilters.release_after : "") + 
          (state.tmpFilters.actorID && state.tmpFilters.movie_type === "Movie" ? "&with_cast=" + state.tmpFilters.actorID : "") + 
          (state.tmpFilters.directorID && state.tmpFilters.movie_type === "Movie" ? "&with_crew=" + state.tmpFilters.directorID : "") + 
          (state.tmpFilters.release_year !== "" ? (state.tmpFilters.movie_type === "Movie" ? "&primary_release_year=" : "&first_air_date_year=") + state.tmpFilters.release_year : ""), options).then(({ data }) => {
          let tmdbResults = data.results;
          console.log("TMDB Results:", tmdbResults);
          setState(prevState => {
            return { ...prevState, resultsTMDB: tmdbResults }
          });
          localStorage.setItem('resultsTMDB', JSON.stringify(tmdbResults));
        });
      }
      else {
        axios(apiurlTMDB + "/search/" + state.tmpFilters.movie_type.toLowerCase() + "?query=" + state.s, options).then(({ data }) => {
          if (data.Response === "False") {
            console.error("Error:", data.Error);
            setState(prevState => {
              return { ...prevState, resultsTMDB: [] }
            });
            localStorage.setItem('resultsTMDB', JSON.stringify([]));
            return;
          }
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
    axios(apiurlTMDB + "/" + type.toLowerCase() + "/" + id, options).then(({ data }) => {
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
        movie_type: "Movie",
        release_year: "",
        release_before: "",
        release_after: "",
        actors: "",
        actorID: 0,
        director: "",
        directorID: 0,
        genre: ""
      }
    }));
    localStorage.removeItem('resultsTMDB');
    localStorage.removeItem('selected');
    localStorage.removeItem('movie_type');
    localStorage.removeItem('release_year');
    localStorage.removeItem('release_before');
    localStorage.removeItem('release_after');
    localStorage.removeItem('actors');
    localStorage.removeItem('actorID');
    localStorage.removeItem('director');
    localStorage.removeItem('directorID');
    localStorage.removeItem('genre');
    localStorage.removeItem('selectedTMDB');
    document.getElementById('search-bar').value = "";
  }

  const applyFilters = () => {
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
    const movie_type = e.target.value;
    setState(prevState => {
      return {
        ...prevState,
        tmpFilters: {
          ...prevState.tmpFilters,
          movie_type: movie_type
        }
      }
    });
    localStorage.setItem('movie_type', movie_type);
  }

  const handleReleaseYear = (e) => {
    const release_year = e.target.value;
    setState(prevState => {
      return {
        ...prevState,
        tmpFilters: {
          ...prevState.tmpFilters,
          release_year: release_year
        }
      }
    });
    localStorage.setItem('release_year', release_year);
  }

  const handleReleaseBefore = (e) => {
    const release_before = e.target.value;
    setState(prevState => {
      return {
        ...prevState,
        tmpFilters: {
          ...prevState.tmpFilters,
          release_before: release_before+"-01-01"
        }
      }
    });
    localStorage.setItem('release_before', release_before);
  }

  const handleReleaseAfter = (e) => {
    const release_after = e.target.value;
    setState(prevState => {
      return {
        ...prevState,
        tmpFilters: {
          ...prevState.tmpFilters,
          release_after: release_after + "-12-31"
        }
      }
    });
    localStorage.setItem('release_after', release_after);
  }

  const handleActors = async (e) => {
    const actors = e.target.value;
    actors.trim().replace(' ', '%20');
    try {
      const { data } = await axios(apiurlTMDB + "/search/person?query=" + actors, options);
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

  const handleDirector = async (e) => {
    const director = e.target.value;
    director.trim().replace(' ', '%20');
    try {
      const { data } = await axios(apiurlTMDB + "/search/person?query=" + director, options);
      if(data.results && data.results.length > 0) {
        const directorID = data.results.reduce((prev, current) => prev.popularity > current.popularity ? prev : current).id;
        localStorage.setItem('directorID', directorID);
        setState(prevState => {
          return {
            ...prevState,
            tmpFilters: {
              ...prevState.tmpFilters,
              directorID: directorID
            }
          }
        });
      } else {
        console.log("No director found with the name:", director);
        <Alert severity="error">No director named {director} found.</Alert>
        setState(prevState => {
          return {
            ...prevState,
            tmpFilters: {
              ...prevState.tmpFilters,
              directorID: 0
            }
          }
        });
      }
    } catch (error) {
      console.error("Error fetching director:", error);
    }
    setState(prevState => {
      return {
        ...prevState,
        tmpFilters: {
          ...prevState.tmpFilters,
          director: director
        }
      }
    });
    localStorage.setItem('director', director);
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
          movie_type: "Movie",
          release_before: "",
          release_year: "",
          release_after: "",
          actors: "",
          actorID: 0,
          director: "",
          directorID: 0,
          genre: ""
        }
      }
    });
    localStorage.removeItem('movie_type');
    localStorage.removeItem('release_before');
    localStorage.removeItem('release_after');
    localStorage.removeItem('release_year');
    localStorage.removeItem('actors');
    localStorage.removeItem('actorID');
    localStorage.removeItem('director');
    localStorage.removeItem('directorID');
    localStorage.removeItem('genre');
    document.getElementById('actors_filter').value = "";
    document.getElementById('director_filter').value = "";
    document.getElementById('genre_filter').value = "All";
    document.getElementById('movie_type_filter').value = "Movie";
    document.getElementById('release_before_filter').value = "";
    document.getElementById('release_after_filter').value = "";
    document.getElementById('release_year_filter').value = "";
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie Database</h1>
      </header>
      <main>
        <Search handleInput={handleInput} search={search} s={state.s}/>
        <SearchButton search={search} />
        <FilterIcon filters={state.filters}/>
        <Results resultsTMDB={state.resultsTMDB} openPopupTMDB={openPopupTMDB} type={state.filters.movie_type}/>
        {(typeof state.selected.Title != "undefined") ? <Popup selected={state.selected} selectedTMDB={state.selectedTMDB} closePopup={closePopup} /> : false}
        { (state.resultsTMDB.length > 0) && <Reset resetApp={resetApp} />}
        {(typeof state.selected.Title === "undefined") ? <Filter applyFilters={applyFilters}  handleMovieType={handleMovieType} handleReleaseYear={handleReleaseYear} handleReleaseBefore={handleReleaseBefore} handleReleaseAfter={handleReleaseAfter} handleDirector={handleDirector} handleActors={handleActors} handleGenre={handleGenre} defaultType={state.tmpFilters.movie_type} defaultrelease_year={state.tmpFilters.release_year} defaultrelease_after={state.tmpFilters.release_after} defaultrelease_before={state.tmpFilters.release_before} defaultActors={state.tmpFilters.actors} defaultDirector={state.tmpFilters.director} defaultGenre={state.tmpFilters.genre} resetFilters={resetFilters} /> : false}
        
      </main>
    </div>
  );
}

export default App;
