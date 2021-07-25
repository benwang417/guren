import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import './AnimePage.css'

function AnimePage() {
    const [anime, setAnime] = useState()
    const location = useLocation()
    const components = location.pathname.split('/')
    const id = components[3] //pulls the id off of the url

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
        return <div></div>
    }

    return (
        <div className='animePage'>
            <div className='contentWrapper'>
                <div className='overviewContainer'> 
                    <div className='contentBody'>
                        <div className='topBar'>overview</div>
                        <h1 className='title'>{anime.title.english}</h1>
                        <div>
                            <div className='showInfo'> 
                                <div>Rating: {anime.averageScore}<p># users</p></div>
                                <div className='middleInfo'>#{} most popular</div>
                                <div>studio</div>
                            </div>
                        </div>
                        <p className='mainText'>{anime.description.replace(/(<([^>]+)>)/gi, "")}</p>
                    </div>
                    <div className='contentImg'>
                        <img className='coverImg' src={anime.coverImage.extraLarge}/>
                    </div>
                </div>
                
            </div>
        </div>
    )
    
}

export default AnimePage