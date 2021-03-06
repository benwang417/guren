import React, { useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './TopAnimeList.css'
import AnimeCard from './AnimeCard'
import CardPlaceholder from './CardPlaceholder'

const TopAnimeList = ({sortTerm, title}) => {
    const [results, setResults] = useState([])

    useEffect(() => {
        const getAnimePreview = async () => {
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
                        media (type: ANIME, sort: ${sortTerm}) {
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
                            episodes
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
            setResults(response.data.data.Page.media)
        }

        getAnimePreview()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const renderedResults = results.map((result) => {
        console.log(result)

        return (
            <AnimeCard key={result.id} result={result} progress={null}/>
        )
    })

    if (!results.length) {
        return (
            <div className='container'>
                <Link to='/anime' className='listTitle'>{title}</Link>
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
            <Link to='/' className='listTitle'>{title}</Link>
            <div className='cardList'>
                {renderedResults} 
            </div>
        </div>
    )
}

export default TopAnimeList