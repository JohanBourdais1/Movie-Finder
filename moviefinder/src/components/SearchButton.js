import React from 'react'

function SearchButton( {search} ) {
  return (
    <section className='search-button-wrap'>
      <button id='search-button' className='search-button' onClick={search}>Search</button>
    </section>
  )
}

export default SearchButton