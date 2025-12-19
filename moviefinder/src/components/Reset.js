import React from 'react'

function Reset( {resetApp} ) {
  return (
    <button className='reset-button' onClick={resetApp}>Clear search</button>
  )
}

export default Reset