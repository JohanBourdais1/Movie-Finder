import React from 'react'

function FilterIcon( {  filters, removeFilter } ) {
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
            table.push({key: f, value: filters["genreName"], icon: "🍿"});
        }
        else if (f === "sort") {
            if (filters[f] === "popularity.desc") {
                table.push({key: f, value: "Popularity ↓", icon: "🔀"});
            }
            else if (filters[f] === "popularity.asc") {
                table.push({key: f, value: "Popularity ↑", icon: "🔀"});
            }
            else if (filters[f] === "release_date.desc") {
                table.push({key: f, value: "Release Date ↓", icon: "📆"});
            }
            else if (filters[f] === "release_date.asc") {
                table.push({key: f, value: "Release Date ↑", icon: "📆"});
            }
            else if (filters[f] === "vote_average.desc") {
                table.push({key: f, value: "Vote Average ↓", icon: "⭐"});
            }
            else if (filters[f] === "vote_average.asc") {
                table.push({key: f, value: "Vote Average ↑", icon: "⭐"});
            }
            else if (filters[f] === "title.desc") {
                table.push({key: f, value: "Title ↓", icon: "🔤"});
            }
            else if (filters[f] === "title.asc") {
                table.push({key: f, value: "Title ↑", icon: "🔤"});
            }
            else {
                table.push({key: f, value: filters[f], icon: "🔀"});
            }
        }
    });
    console.log(filters);
  return (
    <div className="active-filters">
        
        {table.map(f => (f.value !== "" || f.key === "genre" || f.key === "sort") && (
            <div key={f.key} className="filter-chip">
            <span className="icon">{f.icon}</span>
            <span className="label">{f.key === "genre" && f.value === "" ? "All" : f.key === "sort" && f.value === "" ? "Popularity ↓" : f.value}</span>
            <span className="remove" onClick={() => removeFilter(f.key)}>✖</span>
            </div>
        ))}
    </div>
  )
}

export default FilterIcon