import React, {useState, useContext, useEffect} from 'react'
import { Link } from 'react-router-dom'
import './SearchResult.css'
import Modal from './Modal'
import generateUrl from '../generateUrl'
import { ThemeContext } from '../ThemeContext'
import { UserContext } from '../UserContext'

function SearchResult({searchData, userLists}) {
    const {theme} = useContext(ThemeContext)
    const {user} = useContext(UserContext)
    const [entryId, setEntryId] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)

    const findInLists = () => {
        return userLists.map((collection) => {
            return collection.entries.filter((entry) => searchData.id === entry.media.id)
        }).filter((list) => list.length)[0]
    }

    useEffect(() => {
        if (userLists && findInLists()) {
            setEntryId(findInLists()[0].id)
        }
    }, [])

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
                        {user && userLists ? 
                        <button onClick={() => setModalOpen(true)} className='addButton'>
                            {findInLists() ? 'edit' : 'add to my list'}
                        </button>
                        : null}
                        {modalOpen ? 
                        <Modal show={searchData} setModalOpen={setModalOpen} entryId={entryId} /> : null
                        }
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