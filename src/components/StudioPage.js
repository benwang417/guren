import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import generateUrl from '../generateUrl'

function StudioPage() {
    const {id} = useParams()
    const [studio, setStudio] = useState()

    useEffect(() => {
        const getStudio = async () => {
            const query = `
                query ($id: Int) {
                    Studio (id: $id) {
                        id
                        name 
                        media (sort: POPULARITY_DESC){
                            edges {
                                node {
                                    popularity
                                    id
                                    title {
                                        english
                                    }
                                    coverImage {
                                        medium
                                    }
                                }
                            }
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
            setStudio(response.data.data.Studio)
            
        }

        getStudio()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!studio) {
        return (
            <div></div>
        )
    }

    const renderedShows = studio.media.edges.map((show) => {
        const anime = show.node

        const showURL = anime.title.english ? generateUrl(anime.title.english, anime.id) : ''
        //TODO: show romaji title if english not available

        return (
            <div key={anime.id}>
                <Link to={showURL}>
                    <div>{anime.title.english}</div>
                    <img loading='lazy' src={anime.coverImage.medium} alt='show'/>
                </Link>
                {anime.popularity}
            </div>
        )
    })

    //TODO: sort shows by score, year released, popularity etc
    console.log(studio)
    return (
        <div>
            <h1>{studio.name}</h1>
            {renderedShows}
        </div>
    )
}

export default StudioPage