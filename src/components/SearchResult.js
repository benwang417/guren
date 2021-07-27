import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import './SearchResult.css'
import generateUrl from '../generateUrl'
import { ThemeContext } from '../ThemeContext'

function SearchResult({searchData}) {
    const {theme} = useContext(ThemeContext)

    const url = generateUrl(searchData.title.english, searchData.id)
    return (
        <div className='searchWrapper'>
            <div className={`searchResult ${theme}`}>
                <Link to={url}><img className='searchImage' src={searchData.coverImage.large} /></Link>
                <Link to={url} className={`searchTitle ${theme}`}><h1>{searchData.title.english}</h1></Link>
            </div>
        </div>
        
    )
}

export default SearchResult