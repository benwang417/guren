import React, {useState, useEffect, useContext} from 'react'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import './AnimePage.css'
import {ThemeContext} from '../ThemeContext'

function AnimePage() {
    const {theme} = useContext(ThemeContext)
    const [anime, setAnime] = useState()
    const location = useLocation()
    const components = location.pathname.split('/')
    const id = components[3] //pulls the id off of the url

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
    
    console.log(anime)
    
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
                        <div className='button'>add to my list</div>
                    </div>
                </div>
                
            </div>
        </div>
    )
    
}

export default AnimePage