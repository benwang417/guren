import React from 'react'
import { Link } from 'react-router-dom'
import './SearchResult.css'

function SearchResult({title, image, url, setSearchBarOpen}) {
    return (
        <Link to={url} className='search-result' onClick={() => setSearchBarOpen(false)}>
            {image ? <img className='result-img' src={image} /> : null}
            <div className='result-title'>{title}</div>
        </Link>
    )
}

export default SearchResult
