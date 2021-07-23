import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './TopAnimeList.css'
import generateUrl from '../generateUrl'

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

    //TODO: add error check for no internet to api request
    //TODO: move axios calls to a seperate file
    
    const renderedResults = results.map((result) => {
        if (result.title.english === null || result.title.description === null ) {
            return
        }
        
        const url = generateUrl(result.title.english, result.id)
        return (
            <Link key={result.id} to={url}>
                <div className='card' style={{backgroundImage: `url(${result.coverImage.large})`}}>
                    <div className='cardContent'>
                        <h2 className='cardTitle'>{result.title.english}</h2>
                    </div>
                </div>
            </Link>
        )
    })

    return (
        <div className='container'>
            <Link to='/anime' className='listTitle'>{title}</Link>
            <div className='cardList'>
                {renderedResults}
            </div>
        </div>
    )
}

export default TopAnimeList