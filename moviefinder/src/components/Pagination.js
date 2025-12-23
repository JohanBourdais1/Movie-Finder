import React from 'react'

function Pagination( {totalPages, page, setPage} ) {
  return (
    <div className="pagination">
        <button
            disabled={page === 1}
            onClick={() => setPage(-1)}
        >
            ← Précédent
        </button>

        <span>Page {page}/{totalPages}</span>

        <button
            disabled={page === totalPages}
            onClick={() => setPage(1)}
        >
            Suivant →
        </button>
    </div>
  )
}

export default Pagination