import React, {useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import './SearchResult.css'
import Modal from './Modal'
import generateUrl from '../generateUrl'
import { ThemeContext } from '../ThemeContext'

function SearchResult({searchData, userLists}) {
    const {theme} = useContext(ThemeContext)
    const [modalOpen, setModalOpen] = useState(false)

    const renderedGenres = searchData.genres.map((genre) => {
        return <Link to='/' className='genre' key={genre}>{genre}</Link>
    })

    const url = generateUrl(searchData.title.english, searchData.id)
    return (
        <div className='searchWrapper'>
            <div className={`searchResult ${theme}`}>
                <Link to={url}><img loading='lazy' className='searchImage' src={searchData.coverImage.large} alt=''/></Link>
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
                        <Modal show={searchData} modalOpen={modalOpen} 
                            setModalOpen={setModalOpen} userLists={userLists} isOnCard={false}
                        />
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