import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Characters ({id}) {
    const [characters, setCharacters] = useState([])

    useEffect(() => {
        const getCharacters = async () => {
            const query = `
                query ($id: Int) {
                    Media (id: $id, type: ANIME) {
                        title {
                            english
                        }
                        characters (page: 1) {
                            edges {
                                node {
                                    name {
                                        first
                                        last
                                    }
                                    id
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
    }, [])


    const renderedChars = characters.map((char) => {
        const firstName = char.node.name.first
        const lastName = char.node.name.last

        const url = lastName ? `/characters/${id}/${firstName}-${lastName}` : `/characters/${id}/${firstName}`
        return (
            <Link to={url} key={char.node.id}>
                <div>{firstName} {lastName}</div>
            </Link>
        )
    })

    // console.log(characters)

    if (!characters) {
        return (
            <div>
                
            </div>
        )
    }

    return (
        <div>
            <h1>Chars</h1>
            {renderedChars}
        </div>
    )
}

export default Characters