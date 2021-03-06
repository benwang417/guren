import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import AnimeCard from './AnimeCard'

function CharacterPage() {
    const {id} = useParams()
    const [character, setCharacter] = useState()
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const getCharacter = async () => {
            //TODO: add staff to query and filter by role : voice actor
            const query = `
                query ($id: Int) {
                    Character (id: $id) {
                        name {
                            full
                        }
                        image {
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
                        media (type: ANIME, sort: POPULARITY_DESC) {
                            nodes {
                                id
                                title {
                                    english
                                    romaji
                                }
                                description
                                bannerImage
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
            setCharacter(response.data.data.Character)
        }

        getCharacter()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
    if (!character) {
        return (
            <div></div>
        )
    }

    //TODO: parse description and hide spoilers
    console.log(character)

    const renderedShows = character.media.nodes.map((result) => {
        return (
            <AnimeCard key={result.id} result={result} progress={null}/>
        )
    })

    return (
        <div className='anime-page'>
            <div className='title small-screen'>{character.name.full}</div>
            <div className='primary-content'>
                <div className='img-container'>
                    <img className='cover-img' src={character.image.large} alt=''/>
                </div>
                <div className='content-body'>
                    <div className='title large-screen'>{character.name.full}</div>
                    <div className='show-stats'>
                        <div className='show-info'>
                            <div className='info-title'>favorites</div>  
                            <div className='info'>{character.favourites}</div>  
                        </div>
                        {character.age ?
                        <div className='show-info'>
                            <div className='info-title'>age</div>  
                            <div className='info'>{character.age}</div>  
                        </div> : null}
                        {character.dateOfBirth.day && character.dateOfBirth.month ? 
                        <div className='show-info'>
                            <div className='info-title'>birthday</div>  
                            <div className='info'>{character.dateOfBirth.month}/{character.dateOfBirth.day}{character.dateOfBirth.year ? `/${character.dateOfBirth.year}` : null}</div>  
                        </div> : null}
                        {character.gender ?
                        <div className='show-info'>
                            <div className='info-title'>gender</div>  
                            <div className='info'>{character.gender}</div>  
                        </div> : null}
                    </div>
                    <div className={`description-large large-screen ${!showMore ? 'show-more' : ''}`} dangerouslySetInnerHTML={{__html: character.description}}></div>
                    { !showMore ? 
                    <div className='large-screen' onClick={() => setShowMore(true)} style={{cursor: 'pointer', width: 'max-content', marginLeft: '1em'}}>show more</div>
                    : <div  className='large-screen' onClick={() => setShowMore(false)} style={{cursor: 'pointer', width: 'max-content', marginLeft: '1em'}}>show less</div>
                    }
                </div>
            </div>
            <div className={`description small-screen ${!showMore ? 'show-more' : ''}`} dangerouslySetInnerHTML={{__html: character.description}}></div>
            { !showMore ? 
            <div className='small-screen' onClick={() => setShowMore(true)} style={{cursor: 'pointer'}}>show more</div>
            : <div className='small-screen' onClick={() => setShowMore(false)} style={{cursor: 'pointer'}}>show less</div>
            }
            <div className='container'>
                <div className='listTitle'>Appears In</div>
                <div className='cardList'>
                    {renderedShows}
                </div>
            </div>
        </div>
    )
}

export default CharacterPage