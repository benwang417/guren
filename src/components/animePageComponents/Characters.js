import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

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
                                    }
                                    favourites
                                }
                                voiceActors {
                                    id
                                    name {
                                        full
                                    }
                                    image {
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
        const charName = char.name.full
        const voiceActor = character.voiceActors[0]
        const voiceActorName = voiceActor ? voiceActor.name.full : null

        const charURL = `/characters/${char.id}/${charName.replace(/\s/g , "-")}`
        const vaURL = voiceActor ? `/va/${voiceActor.id}/${voiceActorName.replace(/\s/g , "-")}` : ''
        return (
            <div key={char.id} style={{display: 'flex'}}>
                <Link to={charURL}>
                    <div>{charName}</div>
                    <img src={char.image.medium} alt='character'/>
                </Link>
                { voiceActor ? 
                <Link to={vaURL}>
                    <div>{voiceActorName}</div>
                    <img src={voiceActor.image.medium} alt='voice actor'/>
                </Link> : <div></div>}
                {char.favourites}
            </div>
        )
    })

    console.log(characters)

    return (
        <div>
            <h1>Characters</h1>
            {renderedChars}
        </div>
    )
}

export default Characters