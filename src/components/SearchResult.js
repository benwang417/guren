import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import './SearchResult.css'
import generateUrl from '../generateUrl'
import { ThemeContext } from '../ThemeContext'

function SearchResult({searchData}) {
    const {theme} = useContext(ThemeContext)


    const renderedGenres = searchData.genres.map((genre) => {
        return <Link to='/' className='genre' key={genre}>{genre}</Link>
    })

    // onClick() {
    //     return 
    // }

    console.log(searchData)
    const url = generateUrl(searchData.title.english, searchData.id)
    return (
        <div className='searchWrapper'>
            <div className={`searchResult ${theme}`}>
                <Link to={url}><img className='searchImage' src={searchData.coverImage.large} /></Link>
                <div className='searchBody'>
                    <div className='searchHeader'>
                        <div className='top'>
                            <Link to={url} className={`searchTitle ${theme}`}><h1>{searchData.title.english}</h1></Link>
                            <h2 className='stats'>Rating: {searchData.averageScore}</h2>
                            <h2 className='stats'>{searchData.popularity} users</h2>
                        </div>
                        <p className='subhead'>{searchData.format} {searchData.seasonYear}</p>
                    </div>
                    {/* <div className='description'>
                        {searchData.description.replace(/(<([^>]+)>)/gi, "")}
                    </div> */}
                    <div className='footer'>
                        <button className='addButton'>add to my list</button>
                        <div className='genres'>
                            {renderedGenres}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default SearchResult