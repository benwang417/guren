import React, {useState, useEffect, useContext} from 'react'
import {Route, Link, useRouteMatch, useParams} from 'react-router-dom'
import axios from 'axios'
import './AnimePage.css'
import {ThemeContext} from '../ThemeContext'
import Watch from './animePageComponents/Watch'
import Characters from './animePageComponents/Characters'

function AnimePage() {
    const {theme} = useContext(ThemeContext)
    const [anime, setAnime] = useState()
    let {id} = useParams()
    let {title} = useParams()
    const {path, url} = useRouteMatch()

    // console.log(url)
    // console.log(path)
    // console.log(id)
    // console.log(title)


    function getStudio() {
        const studio = anime.studios.edges.find(node => node.isMain)
        if (studio === undefined) {
            return 
        }
        return studio.node.name
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
                        studios {
                            edges {
                                isMain
                                node {
                                    name
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
                                <div className={`middleInfo ${theme}`}>#{getRank()} most popular</div>
                                <div>{getStudio()}</div>
                            </div>
                        </div>
                        <p className='mainText'>{anime.description.replace(/(<([^>]+)>)/gi, "")}</p>
                    </div>
                    <div className='contentImg'>
                        <img className='coverImg' src={anime.coverImage.extraLarge}/>
                        <button className='button'>add to my list</button>
                    </div>
                </div>
            </div>
            <div className='secondaryContent'>
                <div className='selectionBar'>
                    <ul className='navlinks'>
                        <li><Link to={`/anime/series/${id}/${title}/`}>watch</Link></li>
                        <li><Link to={`/anime/series/${id}/${title}/characters`}>characters</Link></li>
                        <li><Link to={`/anime/series/${id}/${title}/stats`}>stats</Link></li>
                        <li><Link to={`/anime/series/${id}/${title}/staff`}>staff</Link></li>
                    </ul>
                </div>
                <div>
                    <Route path={`/anime/series/${id}/${title}/`}>
                        <Watch />
                    </Route>
                    <Route path={`/anime/series/${id}/${title}/characters`}>
                        <Characters />
                    </Route>
                </div>
            </div>
        </div>
    )
    
}

export default AnimePage