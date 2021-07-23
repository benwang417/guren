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
        <div>
            <div className='main'>   
                <h1 className='title'>{anime.title.english}</h1>
                <p className='mainText'>Average Rating: {anime.averageScore}</p>
                <img className='coverImg' src={anime.coverImage.extraLarge}/>
                <p className='mainText'>{anime.description.replace(/(<([^>]+)>)/gi, "")}</p>
            </div>
        </div>
    )
    
}

export default AnimePage