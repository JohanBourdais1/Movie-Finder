import React from 'react'

function Search( {handleInput, search} ) {
  return (
    <section className='searchbow-wrap'>
      <input 
        id='search-bar'
        type="text"
        className='search-box'
        placeholder='Search for a movie...'
        onChange={handleInput}
        onKeyDown={search}
      />
    </section>
  )
}

export default Search