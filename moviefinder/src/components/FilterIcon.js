import React from 'react'

function FilterIcon( {  filters } ) {
    let table = [];
    Object.keys(filters).forEach( (f) => {
        if (f === "movie_type") {
            table.push({key: f, value: filters[f], icon: "🎬"});
        }
        else if (f === "release_year") {
            table.push({key: f, value: filters[f], icon: "📅"});
        }
        else if (f === "release_after") {
            table.push({key: f, value: filters[f], icon: "⏩"});
        }
        else if (f === "release_before") {
            table.push({key: f, value: filters[f], icon: "⏪"});
        }
        else if (f === "actors") {
            table.push({key: f, value: filters[f], icon: "🤵"});
        }
        else if (f === "director") {
            table.push({key: f, value: filters[f], icon: "🎥"});
        }
        else if (f === "genre") {
            table.push({key: f, value: filters[f], icon: "🍿"});
        }
    });
  return (
    <div className="active-filters">
        
        {table.map(f => (f.value !== "" || f.key === "genre") && (
            <div key={f.key} className="filter-chip">
            <span className="icon">{f.icon}</span>
            <span className="label">{f.value === "" ? "All" : f.value}</span>
            </div>
        ))}
    </div>
  )
}

export default FilterIcon