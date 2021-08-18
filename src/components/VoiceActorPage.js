import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import generateUrl from '../generateUrl'
import CharacterCard from './CharacterCard'
import AnimeCard from './AnimeCard'

function VoiceActorPage() {
    const {id} = useParams()
    const [voiceActor, setVoiceActor] = useState()
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const getVoiceActor = async () => {
            const query = `
                query ($id: Int) {
                    Staff (id: $id) {
                        name {
                            full
                        }
                        image {
                            medium
                            large
                        }
                        description (asHtml: true)
                        age
                        gender
                        dateOfBirth {
                            year
                            month
                            day
                        }
                        favourites
                        characters (sort: FAVOURITES_DESC){
                            edges {
                                node {
                                    id
                                    name {
                                        full
                                    }
                                    image {
                                        medium
                                        large
                                    }
                                    favourites
                                }
                                media {
                                    id
                                    title {
                                        english
                                        romaji
                                    }
                                    coverImage {
                                        medium
                                        large
                                    }
                                    popularity
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
            setVoiceActor(response.data.data.Staff)
            
        }

        getVoiceActor()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!voiceActor) {
        return (
            <div></div>
        )
    }

    const renderedCards = voiceActor.characters.edges.map((character) => {
        const char = character.node

        return (
            <CharacterCard character={char} />
        )

    })

    console.log(voiceActor)

    return (
        <div className='anime-page'>
            <div className='title small-screen'>{voiceActor.name.full}</div>
            <div className='primary-content'>
                <div className='img-container'>
                    <img className='cover-img' src={voiceActor.image.large} alt=''/>
                </div>
                <div className='content-body'>
                    <div className='title large-screen'>{voiceActor.name.full}</div>
                    <div className='show-stats'>
                        <div className='show-info'>
                            <div className='info-title'>favorites</div>  
                            <div className='info'>{voiceActor.favourites}</div>  
                        </div>
                        <div className='show-info'>
                            <div className='info-title'>age</div>  
                            <div className='info'>{voiceActor.age}</div>  
                        </div>
                        <div className='show-info'>
                            <div className='info-title'>birthday</div>  
                            <div className='info'>{voiceActor.dateOfBirth.month}/{voiceActor.dateOfBirth.day}/{voiceActor.dateOfBirth.year}</div>  
                        </div>
                        <div className='show-info'>
                            <div className='info-title'>gender</div>  
                            <div className='info'>{voiceActor.gender}</div>  
                        </div>
                    </div>
                    <div className={`description-large large-screen ${!showMore ? 'show-more' : ''}`} dangerouslySetInnerHTML={{__html: voiceActor.description}}></div>
                    { !showMore ? 
                    <div className='large-screen' onClick={() => setShowMore(true)} style={{cursor: 'pointer', width: 'max-content', marginLeft: '1em'}}>show more</div>
                    : <div  className='large-screen' onClick={() => setShowMore(false)} style={{cursor: 'pointer', width: 'max-content', marginLeft: '1em'}}>show less</div>
                    }
                </div>
            </div>
            <div className={`description small-screen ${!showMore ? 'show-more' : ''}`} dangerouslySetInnerHTML={{__html: voiceActor.description}}></div>
            { !showMore ? 
            <div className='small-screen' onClick={() => setShowMore(true)} style={{cursor: 'pointer'}}>show more</div>
            : <div className='small-screen' onClick={() => setShowMore(false)} style={{cursor: 'pointer'}}>show less</div>
            }
            <div className='container'>
                <div className='listTitle'>Characters</div>
                <div className='cardList'>
                    {renderedCards}
                </div>
            </div>
        </div>
    )
}

export default VoiceActorPage