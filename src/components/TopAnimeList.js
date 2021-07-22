import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './TopAnimeList.css'

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
                            }
                            description
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
            `

            const variables = {
                search: query,
                page: 1,
                perPage: 9
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
    }, [])
    console.log(results)
    
    const renderedResults = results.map((result) => {
        return (
            <Link to={`/anime/${result.title.english.replace(/\s/g , "-")}`}>
                <div key={result.id} className='card' style={{backgroundImage: `url(${result.coverImage.large})`}}>
                    <div className='cardContent'>
                        <h2 className='cardTitle'>{result.title.english}</h2>
                        <p className='cardBody'>
                            {result.description.replace(/(<([^>]+)>)/gi, "")}
                        </p>
                    </div>
                </div>
            </Link>
        )
    })

    return (
        <div>
            <h2 className='listTitle'>{title}</h2>
            <div className='cardList'>
                {renderedResults}
            </div>
        </div>
    )
}

export default TopAnimeList