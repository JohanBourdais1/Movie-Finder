import React, { useState } from 'react';
import axios from 'axios';
import Search from './components/Search';
import Results from './components/Results';
import Popup from './components/Popup';
import Reset from './components/Reset';

function App() {
  const [state, setState] = useState({
    s: "",
    results: JSON.parse(localStorage.getItem('results')) || [],
    selected: JSON.parse(localStorage.getItem('selected')) || {}
  });

  const apiurl = "http://www.omdbapi.com/?apikey=d1ac231";

  const search = (e) => {
    if (e.key === "Enter") {
      axios(apiurl + "&s=" + state.s).then(({ data }) => {
        let results = data.Search;
        setState(prevState => {
          return { ...prevState, results: results }
        });
        localStorage.setItem('results', JSON.stringify(results));
        console.log(data);
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
    axios(apiurl + "&i=" + id).then(({ data }) => {
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
      selected: {}
    });
    localStorage.removeItem('results');
    localStorage.removeItem('selected');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie Database</h1>
      </header>
      <main>
        <Search handleInput={handleInput} search={search} />
        <Results results={state.results} openPopup={openPopup} />
        {(typeof state.selected.Title != "undefined") ? <Popup selected={state.selected} closePopup={closePopup} /> : false}
        { state.results.length > 0 && <Reset resetApp={resetApp} />}
      </main>
    </div>
  );
}

export default App;
