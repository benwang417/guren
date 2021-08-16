import React from 'react'
import './SearchResult.css'

function SearchResult({title, image}) {
    return (
        <div className='search-result'>
            <img src={image} />
            {title}
        </div>
    )
}

export default SearchResult
