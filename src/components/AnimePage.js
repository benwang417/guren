import React, {useState, useEffect, useContext} from 'react'
import {Route, Link, useRouteMatch, useParams} from 'react-router-dom'
import axios from 'axios'
import './AnimePage.css'
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
    const [showMore, setShowMore] = useState(false)

    // instead of using getStudio, refactor query to filter by studio: isMain
    function getSeason(season) {
        if (season === 'SPRING') {
            return 'Spring'
        }
        if (season === 'SUMMER') {
            return 'Summer'
        }
        if (season === 'FALL') {
            return 'Fall'
        }
        if (season === 'WINTER') {
            return 'Winter'
        }
    }

    function getStudioName() {
        const studio = anime.studios.edges.find(node => node.isMain)
        if (studio === undefined) {
            return ''
        }
        return studio.node.name
    }

    function getStudioId() {
        const studio = anime.studios.edges.find(node => node.isMain)
        if (studio === undefined) {
            return ''
        }
        return studio.node.id
    }

    function getRank() {
        const rank = anime.rankings.find(ranking => ranking.allTime && ranking.type === 'POPULAR')
        if (rank === undefined) {
            return null
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
                            romaji
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
                        seasonYear
                        season
                        format
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
        return <div className='anime-page'></div>
    }

    const renderedGenres = anime.genres.map((genre) => {
        return <Link to='/' className='anime-genre' key={genre}>{genre}</Link>
    })
    //TODO: add checks for undefined properties
    return (
        <div className='anime-page'>
            <div className='content-container'>
            <div className='title small-screen'>{anime.title.english ? anime.title.english : anime.title.romaji}</div>
                <div className='primary-content'>
                    <div className='img-container'>
                        <img className='cover-img' src={anime.coverImage.extraLarge} alt=''/>
                        <Modal show={anime} modalOpen={modalOpen} 
                            setModalOpen={setModalOpen} userLists={userLists} isOnCard={false}
                        />
                    </div>
                    <div className='content-body'>
                        <div className='title large-screen'>{anime.title.english ? anime.title.english : anime.title.romaji}</div>
                        <div className='show-stats'>
                            <div className='show-info'>
                                <div className='info-title'>score</div>
                                <div className='info'>{anime.averageScore}</div>
                            </div>
                            <div className='show-info'>
                                <div className='info-title'>format</div>
                                <div className='info'>{anime.format} ({anime.episodes} eps)</div>
                            </div>
                            <div className='show-info'>
                                <div className='info-title'>aired</div>
                                <div className='info'>{getSeason(anime.season)} {anime.seasonYear}</div>
                            </div>
                            <div className='show-info'>
                                <div className='info-title'>rank</div>
                                <div className='info'>{getRank() ? `#${getRank()} most popular` : ''}</div>
                            </div>
                            <div className='show-info'>
                                <div className='info-title'>studio</div>
                                <Link className='standard-link info' to={`/studios/${getStudioId()}/${getStudioName().replace(/\s/g , "-")}`}>{getStudioName()}</Link>
                            </div>
                            <div className='show-info'>
                                <div className='info-title'>genres</div>
                                <div className='info' style={{display: 'flex', flexWrap: 'wrap', width: '80%'}}>{renderedGenres}</div>
                            </div>
                        </div>
                        <div className='section-title large-screen'>description</div>
                        <div className={`description-large large-screen ${!showMore ? 'show-more' : ''}`}>{anime.description.replace(/(<([^>]+)>)/gi, "")}</div>
                        { !showMore ? 
                        <div className='large-screen' onClick={() => setShowMore(true)} style={{cursor: 'pointer', width: 'max-content', marginLeft: '1em'}}>show more</div>
                        : <div  className='large-screen' onClick={() => setShowMore(false)} style={{cursor: 'pointer', width: 'max-content', marginLeft: '1em'}}>show less</div>
                        }
                    </div>
                </div> 
            </div>
            <div className='small-screen'>description</div>
            <div className={`description small-screen ${!showMore ? 'show-more' : ''}`}>{anime.description.replace(/(<([^>]+)>)/gi, "")}</div>
            { !showMore ? 
            <div className='small-screen' onClick={() => setShowMore(true)} style={{cursor: 'pointer'}}>show more</div>
            : <div className='small-screen' onClick={() => setShowMore(false)} style={{cursor: 'pointer'}}>show less</div>
            }<div className='secondary-content'>
                <div className='selection-bar'>
                    <Link to={`${url}`} className='standard-link'>watch</Link>
                    <Link to={`${url}/characters`} className='standard-link'>characters</Link>
                    <Link to={`${url}/stats`} className='standard-link'>stats</Link>
                    <Link to={`${url}/staff`} className='standard-link'>staff</Link>
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