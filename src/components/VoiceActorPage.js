import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import generateUrl from '../generateUrl'

function VoiceActorPage() {
    const {id} = useParams()
    const [voiceActor, setVoiceActor] = useState()

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
                        }
                        description (asHtml: true)
                        age
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

    //TODO: sort characters by popularity
    const renderedChars = voiceActor.characters.edges.map((character) => {
        const char = character.node
        const charName = char.name.full
        const show = character.media[0]

        const charURL = `/characters/${char.id}/${charName.replace(/\s/g , "-")}`
        const showURL = show.title.english ? generateUrl(show.title.english, show.id) : generateUrl(show.title.romaji, show.id)
        return (
            <div key={char.id} style={{display: 'flex'}}>
                <Link to={charURL}>
                    <div>{charName}</div>
                    <img loading='lazy' src={char.image.medium} alt='character'/>
                </Link>
                <Link to={showURL}>
                    <div>{show.title.english ? show.title.english : show.title.romaji}</div>
                    <img loading='lazy' src={show.coverImage.medium} alt='show'/>
                </Link>
                {char.favourites}
            </div>
        )
    })

    console.log(voiceActor)

    //TODO: parse description
    return (
        <div>
            <h1>{voiceActor.name.full}</h1>
            <img src={voiceActor.image.medium} alt=''/>
            <div dangerouslySetInnerHTML={{__html: voiceActor.description}}></div>
            <h3>Characters</h3>
            {renderedChars}
        </div>
    )
}

export default VoiceActorPage