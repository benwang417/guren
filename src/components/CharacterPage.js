import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function CharacterPage() {
    const {id} = useParams()
    const [character, setCharacter] = useState()

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
                            medium
                        }
                        description (asHtml: true)
                        age
                        favourites
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
    }, [])
    if (!character) {
        return (
            <div></div>
        )
    }

    //TODO: parse description and hide spoilers
    console.log(character)
    return (
        <div>
            <h1>{character.name.full}</h1>
            <img src={character.image.medium} alt=''/>
            <div dangerouslySetInnerHTML={{__html: character.description}}></div>
        </div>
    )
}

export default CharacterPage