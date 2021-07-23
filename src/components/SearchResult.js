import React from 'react'
import { Link } from 'react-router-dom'
import './SearchResult.css'

function SearchResult({searchData}) {
    
    //TODO: Remove ':' from all url's 
    const hyphenatedUrl = `/anime/${searchData.title.english.replace(/\s/g , "-")}` //replace spaces with hyphen in urls
    const url = hyphenatedUrl.replace(/:/g,'')  // remove ':' from urls
    return (
        
        <div className='search'>
            <Link to={url}><img className='searchImage' src={searchData.coverImage.medium} /></Link>
            <Link to={url}><h1 className='searchTitle'>{searchData.title.english}</h1></Link>
        </div>
        
    )
}

export default SearchResult