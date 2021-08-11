import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './TopAnimeList.css'
import CharacterCard from './CharacterCard'
import CardPlaceholder from './CardPlaceholder'

const CharacterList = () => {
    const [characters, setCharacters] = useState([])

    useEffect(() => {
        const getCharacters = async () => {
            const query = `
                query ($page: Int, $perPage: Int) {
                    Page (page: $page, perPage: $perPage) {
                        pageInfo {
                            total
                            currentPage
                            lastPage
                            hasNextPage
                            perPage
                        }
                        characters (sort: FAVOURITES_DESC) {
                            name {
                                full
                            }
                            id
                            image {
                                large
                            }
                            favourites
                        }
                    }
                }
            `

            const variables = {
                search: query,
                page: 1,
                perPage: 12
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
            setCharacters(response.data.data.Page.characters)
        }

        getCharacters()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const renderedResults = characters.map((character) => {
        return (
            <CharacterCard key={character.id} character={character}/>
        )
    })

    if (!characters.length) {
        return (
            <div className='container'>
                <Link to='/anime' className='listTitle'>Top Characters</Link>
                <div className='cardList'>
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                </div>
            </div>
        )
    }

    return (
        <div className='container'>
            <Link to='/anime' className='listTitle'>Top Characters</Link>
            <div className='cardList'>
                {renderedResults}
            </div>
        </div>
    )
}

export default CharacterList