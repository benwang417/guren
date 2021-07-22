import React, { useState, useEffect } from 'react'
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
                perPage: 10
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
            <div key={result.id} className='card' style={{backgroundImage: `url(${result.coverImage.extraLarge})`}}>
                <div className='cardContent'>
                    <h2 className='cardTitle'>{result.title.english}</h2>
                    <p className='cardBody'>
                        {result.description}
                    </p>
                </div>
            </div>
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