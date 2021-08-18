import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import AnimeCard from './AnimeCard'

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
                                        large
                                    }
                                    averageScore
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
    }, [id])

    if (!studio) {
        return (
            <div></div>
        )
    }

    const renderedShows = studio.media.edges.map((show) => {
        const anime = show.node

        return (
            <AnimeCard key={anime.id} result={anime} progress={null}/>
        )
    })

    //TODO: sort shows by score, year released, popularity etc
    console.log(studio)
    return (
        <div className='container'>
            <div className='listTitle'>{studio.name}</div>
            <div className='cardList'>
                {renderedShows} 
            </div>
        </div>
    )
}

export default StudioPage