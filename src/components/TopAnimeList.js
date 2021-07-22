import React, { useState, useEffect } from 'react'
import axios from 'axios'

const TopAnimeList = () => {
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
                        media (type: ANIME, sort: SCORE_DESC) {
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
            <div key={result.id}>
                {result.title.english}
            </div>
        )
    })

    return (
        <div>
            <h2>Top Rated</h2>
            {renderedResults}
        </div>
    )
}

export default TopAnimeList