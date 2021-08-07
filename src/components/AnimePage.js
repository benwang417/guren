import React, {useState, useEffect, useContext} from 'react'
import {Route, Link, useRouteMatch, useParams} from 'react-router-dom'
import axios from 'axios'
// import './AnimePage.css'
import {ThemeContext} from '../ThemeContext'
import Watch from './animePageComponents/Watch'
import Characters from './animePageComponents/Characters'
import Stats from './animePageComponents/Stats'
import Staff from './animePageComponents/Staff'
import Modal from './Modal'
import { UserListContext } from '../UserListContext'

function AnimePage() {
    const {userLists} = useContext(UserListContext)
    const {theme} = useContext(ThemeContext)
    const [anime, setAnime] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    let {id} = useParams()
    const {path, url} = useRouteMatch()

    // instead of using getStudio, refactor query to filter by studio: isMain
    function getStudioName() {
        const studio = anime.studios.edges.find(node => node.isMain)
        if (studio === undefined) {
            return 
        }
        return studio.node.name
    }

    function getStudioId() {
        const studio = anime.studios.edges.find(node => node.isMain)
        if (studio === undefined) {
            return 
        }
        return studio.node.id
    }

    function getRank() {
        const rank = anime.rankings.find(ranking => ranking.allTime && ranking.type === 'POPULAR')
        if (rank === undefined) {
            return 
        } 
        return rank.rank
    }

    useEffect(() => {
        const getAnime = async () => {
            const query = `
                query ($id: Int) {
                    Media (id: $id, type: ANIME) {
                        id
                        title {
                            english
                        }
                        description
                        coverImage {
                            extraLarge
                            large
                            medium
                        }
                        averageScore
                        popularity
                        genres
                        episodes
                        studios {
                            edges {
                                isMain
                                node {
                                    name
                                    id
                                }
                            }
                        }
                        rankings {
                            rank
                            type
                            allTime
                        }
                    }
                }
            `

            const variables = {
                id: id
            }

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

            const response = await axios.post('https://graphql.anilist.co', {
                query,
                variables,
                headers
            })
            setAnime(response.data.data.Media)
        }
        getAnime()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!anime) {
        return <div className='animePage'></div>
    }

    return (
        <div className='animePage'>
            <div className='contentWrapper'>
                <div className={`overviewContainer ${theme}`}> 
                    <div className='contentBody'>
                        <div className='topBar'>overview</div>
                        <h1 className='title'>{anime.title.english}</h1>
                        <div>
                            <div className='showInfo'> 
                                <div>Rating: {anime.averageScore}<p>{anime.popularity} users</p></div>
                                <div className='middleInfo'>#{getRank()} most popular</div>
                                <Link to={`/studios/${getStudioId()}/${getStudioName().replace(/\s/g , "-")}`}>{getStudioName()}</Link>
                            </div>
                        </div>
                        <p className='mainText'>{anime.description.replace(/(<([^>]+)>)/gi, "")}</p>
                    </div>
                    <div className='contentImg'>
                        <img className='coverImg' src={anime.coverImage.extraLarge} alt=''/>
                        <Modal show={anime} modalOpen={modalOpen} 
                            setModalOpen={setModalOpen} userLists={userLists} isOnCard={false}
                         />
                    </div>
                </div>
            </div>  
            <div className='secondaryContent'>
                <div className='selectionBar' style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <Link to={`${url}`} className=''>watch</Link>
                    <Link to={`${url}/characters`} className=''>characters</Link>
                    <Link to={`${url}/stats`} className=''>stats</Link>
                    <Link to={`${url}/staff`} className=''>staff</Link>
                </div>
                <div>
                    <Route path={`${path}/`} exact>
                        <Watch />
                    </Route>
                    <Route path={`${path}/characters`}>
                        <Characters id={id} />
                    </Route>
                    <Route path={`${path}/stats`}>
                        <Stats id={id} />
                    </Route>
                    <Route path={`${path}/staff`}>
                        <Staff id={id} />
                    </Route>
                </div>
            </div>
        </div>
    )
    
}

export default AnimePage