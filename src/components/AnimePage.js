import React, {useState, useEffect, useContext} from 'react'
import {Route, Link, useRouteMatch, useParams} from 'react-router-dom'
import axios from 'axios'
// import './AnimePage.css'
import {ThemeContext} from '../ThemeContext'
import Watch from './animePageComponents/Watch'
import Characters from './animePageComponents/Characters'
import Stats from './animePageComponents/Stats'
import Staff from './animePageComponents/Staff'
import { UserContext } from '../UserContext'

function AnimePage() {
    const {user} = useContext(UserContext)
    const {theme} = useContext(ThemeContext)
    const [anime, setAnime] = useState()
    let {id} = useParams()
    const {path, url} = useRouteMatch()

    // console.log(url)
    // console.log(path)

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

    console.log(user)
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
                                <Link to={`/studios/${getStudioId()}/${getStudioName().replace(/\s/g , "-")}`}>{getStudioName()}</Link>
                            </div>
                        </div>
                        <p className='mainText'>{anime.description.replace(/(<([^>]+)>)/gi, "")}</p>
                    </div>
                    <div className='contentImg'>
                        <img className='coverImg' src={anime.coverImage.extraLarge} alt=''/>
                        <button className='button'>add to my list</button>
                    </div>
                </div>
            </div>
            <div className='secondaryContent'>
                <div className='selectionBar'>
                    <ul className='navlinks'>
                        <li><Link to={`${url}`} className='link'>watch</Link></li>
                        <li><Link to={`${url}/characters`} className='link'>characters</Link></li>
                        <li><Link to={`${url}/stats`} className='link'>stats</Link></li>
                        <li><Link to={`${url}/staff`} className='link'>staff</Link></li>
                    </ul>
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