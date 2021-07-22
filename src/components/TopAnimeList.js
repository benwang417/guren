import React, { useEffect } from 'react'
import axios from 'axios'

function TopAnimeList() {

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
            } )
            console.log(response)
        }

        getAnimePreview()
        
    }, [])

    return (
        <div>
            top anime list
        </div>
    )
}

export default TopAnimeList