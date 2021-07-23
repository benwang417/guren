import React from 'react'
import { Link } from 'react-router-dom'
import './SearchResult.css'
import generateUrl from '../generateUrl'

function SearchResult({searchData}) {
    
    const url = generateUrl(searchData.title.english, searchData.id)
    return (
        
        <div className='search'>
            <Link to={url}><img className='searchImage' src={searchData.coverImage.medium} /></Link>
            <Link to={url}><h1 className='searchTitle'>{searchData.title.english}</h1></Link>
        </div>
        
    )
}

export default SearchResult