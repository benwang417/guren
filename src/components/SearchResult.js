import React from 'react'
import { Link } from 'react-router-dom'
import './SearchResult.css'
import generateUrl from '../generateUrl'

function SearchResult({searchData}) {
    
    const url = generateUrl(searchData.title.english, searchData.id)
    return (
        <div className='searchWrapper'>
            <div className='search'>
                <Link to={url}><img className='searchImage' src={searchData.coverImage.large} /></Link>
                <Link to={url} className='searchTitle'><h1>{searchData.title.english}</h1></Link>
            </div>
        </div>
        
    )
}

export default SearchResult