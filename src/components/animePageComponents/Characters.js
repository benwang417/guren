import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CharacterCard from '../CharacterCard'
import './Characters.css'

function Characters ({id}) {
    const [characters, setCharacters] = useState([])

    useEffect(() => {
        const getCharacters = async () => {
            //TODO: add staff to query and filter by role : voice actor
            const query = `
                query ($id: Int) {
                    Media (id: $id, type: ANIME) {
                        title {
                            english
                        }
                        characters (sort: FAVOURITES_DESC) {
                            edges {
                                node {
                                    name {
                                        first
                                        last
                                        full
                                    }
                                    id
                                    image {
                                        medium
                                        large
                                    }
                                    favourites
                                }
                                voiceActors (language: JAPANESE){
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
            setCharacters(response.data.data.Media.characters.edges)
            
        }

        getCharacters()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!characters) {
        return (
            <div>
                
            </div>
        )
    }

    const renderedChars = characters.map((character) => {
        const char = character.node
        const voiceActor = character.voiceActors[0]

        return (
            <div className='card-pair' key={char.id}>
                <CharacterCard character={char} />
                { voiceActor ? <CharacterCard character={voiceActor} isVoiceActor={true} /> : null}
            </div>
        )

    })

    return (
        <div className='char-container'>
            {renderedChars}
        </div>
    )
}

export default Characters