import React from 'react'

function SearchResult({title, image}) {
    return (
        <div>
            <img src={image} />
            {title}
        </div>
    )
}

export default SearchResult
