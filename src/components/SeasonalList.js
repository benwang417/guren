import React, { useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './TopAnimeList.css'
import AnimeCard from './AnimeCard'
import CardPlaceholder from './CardPlaceholder'

const SeasonalList = ({season, year, title}) => {
    const [results, setResults] = useState([])

    useEffect(() => {
        const getAnimePreview = async () => {
            const query = `
                query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
                    Page (page: $page, perPage: $perPage) {
                        pageInfo {
                            total
                            currentPage
                            lastPage
                            hasNextPage
                            perPage
                        }
                        media (type: ANIME, season: $season, seasonYear: $seasonYear sort: POPULARITY_DESC) {
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
                        }
                    }
                }
            `

            const variables = {
                search: query,
                page: 1,
                perPage: 14,
                season: season,
                seasonYear: year
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
    console.log(results)

    //TODO: add error check for no internet to api request
    //TODO: move axios calls to a seperate file
    
    const renderedResults = results.map((result) => {
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
            <Link to='/anime' className='listTitle'>{title}</Link>
            <div className='cardList'>
                {renderedResults} 
            </div>
        </div>
    )
}

export default SeasonalList