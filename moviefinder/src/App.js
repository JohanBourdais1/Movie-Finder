import React, { useState } from 'react';
import axios from 'axios';
import Search from './components/Search';
import Results from './components/Results';
import Popup from './components/Popup';
import Reset from './components/Reset';
import Filter from './components/Filter';
import SearchButton from './components/SearchButton';
import FilterIcon from './components/FilterIcon';
import Pagination from './components/Pagination';

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
      genre: "",
      genreName: "All",
      state: 0
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
      genre: (localStorage.getItem('genre') !== undefined && localStorage.getItem('genre')) || "All",
      genreName: (localStorage.getItem('genreName') !== undefined && localStorage.getItem('genreName')) || "All",
    },
    total_pages: (localStorage.getItem('total_pages') !== undefined && localStorage.getItem('total_pages')) || 0,
    current_page: (localStorage.getItem('current_page') !== undefined && localStorage.getItem('current_page')) || 1
  });

  const apiurlOMDB = "http://www.omdbapi.com/?apikey=" + process.env.REACT_APP_OMDB_API_KEY;
  const apiurlTMDB = "https://api.themoviedb.org/3";

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + process.env.REACT_APP_TMDB_AUTH_TOKEN
    }
  };

  const search = (e) => {
    if ((e.key === "Enter" || e.target.className === "search-button") && (state.filters.state === 1 || state.s.trim() !== "" || state.total_pages !== 0)) {
      console.log("filters", state.filters);
      console.log(state.filters);
      if (state.s.trim() === "") {
        console.log(apiurlTMDB + "/discover/" + state.filters.movie_type.toLowerCase() + 
          ((state.filters.genre !== "All" && state.filters.genre !== "") || state.total_pages || state.filters.directorID || state.filters.release_year !== "" || state.filters.release_before !== "" || state.filters.release_after !== "" || state.filters.actorID ? "?" : "") + 
          (state.filters.genre !== "All" && state.filters.genre !== "" ? "&with_genres=" + state.filters.genre : "") + 
          (state.filters.release_before !== "" ? (state.filters.movie_type === "Movie" ? "&primary_release_date.lte=" : "&first_air_date.lte=") + state.filters.release_before : "") + 
          (state.filters.release_after !== "" ? (state.filters.movie_type === "Movie" ? "&primary_release_date.gte=" : "&first_air_date.gte=") + state.filters.release_after : "") + 
          (state.filters.actorID && state.filters.movie_type === "Movie" ? "&with_cast=" + state.filters.actorID : "") + 
          (state.filters.directorID && state.filters.movie_type === "Movie" ? "&with_crew=" + state.filters.directorID : "") + 
          (state.filters.release_year !== "" ? (state.filters.movie_type === "Movie" ? "&primary_release_year=" : "&first_air_date_year=") + state.filters.release_year : "") + 
          (state.total_pages !== 0 ? "&page=" + state.current_page : ""));

        axios(apiurlTMDB + "/discover/" + state.tmpFilters.movie_type.toLowerCase() + 
          ((state.tmpFilters.genre !== "All" && state.tmpFilters.genre !== "") || state.total_pages || state.tmpFilters.directorID || state.tmpFilters.release_year !== "" || state.tmpFilters.release_before !== "" || state.tmpFilters.release_after !== "" || state.tmpFilters.actorID ? "?" : "") + 
          (state.tmpFilters.genre !== "All" && state.tmpFilters.genre !== "" ? "&with_genres=" + state.tmpFilters.genre : "") + 
          (state.tmpFilters.release_before !== "" ? (state.tmpFilters.movie_type === "Movie" ? "&primary_release_date.lte=" : "&first_air_date.lte=") + state.tmpFilters.release_before : "") + 
          (state.tmpFilters.release_after !== "" ? (state.tmpFilters.movie_type === "Movie" ? "&primary_release_date.gte=" : "&first_air_date.gte=") + state.tmpFilters.release_after : "") + 
          (state.tmpFilters.actorID && state.tmpFilters.movie_type === "Movie" ? "&with_cast=" + state.tmpFilters.actorID : "") + 
          (state.tmpFilters.directorID && state.tmpFilters.movie_type === "Movie" ? "&with_crew=" + state.tmpFilters.directorID : "") + 
          (state.tmpFilters.release_year !== "" ? (state.tmpFilters.movie_type === "Movie" ? "&primary_release_year=" : "&first_air_date_year=") + state.tmpFilters.release_year : "" ) +
          (state.total_pages !== 0 ? "&page=" + state.current_page : "")
          , options).then(({ data }) => {
          let tmdbResults = data.results;
          console.log("TMDB Results:", tmdbResults);
          setState(prevState => {
            return { ...prevState, resultsTMDB: tmdbResults, total_pages: data.total_pages, current_page: data.page }
          });
          localStorage.setItem('resultsTMDB', JSON.stringify(tmdbResults));
          localStorage.setItem("total_pages", data.total_pages);
          localStorage.setItem("current_page", data.page);
        });
      }
      else {
        console.log(apiurlTMDB + "/search/" + state.tmpFilters.movie_type.toLowerCase() + "?query=" + state.s + (state.total_pages !== 0 ? "&page=" + state.current_page : ""));
        axios(apiurlTMDB + "/search/" + state.tmpFilters.movie_type.toLowerCase() + "?query=" + state.s + (state.total_pages !== 0  ? "&page=" + state.current_page : ""), options).then(({ data }) => {
          if (data.Response === "False") {
            console.error("Error:", data.Error);
            setState(prevState => {
              return { ...prevState, resultsTMDB: [], total_pages: 0, current_page: 1 }
            });
            localStorage.setItem('resultsTMDB', JSON.stringify([]));
            return;
          }
          let results = data.results;
          setState(prevState => {
            return { ...prevState, resultsTMDB: results, total_pages: data.total_pages, current_page: data.page }
          });
          localStorage.setItem('resultsTMDB', JSON.stringify(results));
          localStorage.setItem("total_pages", data.total_pages);
          localStorage.setItem("current_page", data.page);
        });
      }
      setState(prevState => {
        return {
          ...prevState,
          filters: {
            ...prevState.filters,
            state: 0
          }
        }
      });
    }
  }

  const handleInput = (e) => {
    let s = e.target.value.replace(/[ ]/g, '+').replace(/[:]/g, '%3A');
    setState(prevState => {
      return { ...prevState, s: s }
    });
  }

  const openPopupTMDB = ( id, type) => {
    axios(apiurlTMDB + "/" + type.toLowerCase() + "/" + id, options).then(({ data }) => {
      let result = data;
      setState(prevState => {
        return { ...prevState, selectedTMDB: result}
      });
      localStorage.setItem('selectedTMDB', JSON.stringify(result));
      axios(apiurlOMDB + "&i=" + result.imdb_id + "&plot=full").then(({ data }) => {
      result = data;
      console.log("Fetched OMDB details:", result);
      setState(prevState => {
        return { ...prevState, selected: result}
      });
      localStorage.setItem('selected', JSON.stringify(result));
    });
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
        genre: "",
        genreName: "All",
        state: 0
      },
      total_pages: 0,
      current_page: 1
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
    localStorage.removeItem('genreName');
    localStorage.removeItem('selectedTMDB');
    localStorage.removeItem("current_page");
    localStorage.removeItem("total_pages");
    document.getElementById('search-bar').value = "";
  }

  const applyFilters = () => {
    setState(prevState => {
      return {
        ...prevState,
        filters: {
          ...prevState.tmpFilters,
          state: 1
        }
      }
    });
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
              actorID: actorId,
              actors: actors
            }
          }
        });
      } else {
        console.log("No actor found with the name:", actors);
      }
    } catch (error) {
      console.error("Error fetching actor:", error);
    }
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
              directorID: directorID,
              director: director
            }
          }
        });
      } else {
        console.log("No director found with the name:", director);
      }
    } catch (error) {
      console.error("Error fetching director:", error);
    }
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
    localStorage.setItem('genreName', e.target.options[e.target.selectedIndex].text);
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
          genre: "All",
          genreName: "All"
        },
        current_page: 1,
        total_pages: 0
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
    localStorage.removeItem('genreName');
    localStorage.setItem("current_page", 1);
    localStorage.setItem("total_pages", 0);
    document.getElementById('actors_filter').value = "";
    document.getElementById('director_filter').value = "";
    document.getElementById('genre_filter').value = "All";
    document.getElementById('movie_type_filter').value = "Movie";
    document.getElementById('release_before_filter').value = "";
    document.getElementById('release_after_filter').value = "";
    document.getElementById('release_year_filter').value = "";
  }

  const setPage = (n) => {
    if ((n === -1 && state.current_page === 1) || (n === 1 && state.current_page === state.total_pages)) {
      return;
    }
    setState(prevState => {
      return {
        ...prevState,
        current_page: prevState.current_page + n
      }
    });
    localStorage.setItem("current_page", state.current_page + n);
  }

  React.useEffect(() => {
    console.log("Filters state changed:", state.filters);
    if (state.filters.state === 0) return;
    document.getElementById('search-button').click();
    window.scrollTo(0, 0);
  }, [state.filters]);

  React.useEffect(() => {
    if (state.total_pages === 0) return;
    document.getElementById('search-button').click();
    window.scrollTo(0, 0);
  }, [state.current_page, state.total_pages]);

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
        {(state.resultsTMDB.length !== 0) && <Pagination totalPages={state.total_pages} page={state.current_page} setPage={setPage} />}
      </main>
    </div>
  );
}

export default App;
