import React from 'react'
import './SearchResult.css'

function SearchResult({title, image}) {
    return (
        <div className='search-result'>
            <img className='result-img' src={image} />
            <div className='result-title'>{title}</div>
        </div>
    )
}

export default SearchResult
