import React from 'react'

function Pagination( {totalPages, page, setPage, handlePageInput, id, idPage} ) {
  return (
    <div className="pagination" id={idPage}>
        <button
            disabled={page === 1}
            onClick={() => setPage(-1, false)}
        >
            ← Précédent
        </button>

        <input id={id} value={page} type='number' min={1} max={500} onKeyDown={e => {
            if (e.key === 'Enter') {
                let p = parseInt(e.target.value);
                if (isNaN(p) || p < 1) {
                    p = page;
                } else if (p > 500) {
                    p = 500;
                }
                setPage(p, true);
            }
        }} onChange={handlePageInput}/>
        
        /500

        <button
            disabled={page === totalPages}
            onClick={() => setPage(1, false)}
        >
            Suivant →
        </button>
    </div>
  )
}

export default Pagination