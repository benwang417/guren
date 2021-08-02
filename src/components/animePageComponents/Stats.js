import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Stats ({id}) {
    const [stats, setStats] = useState()

    useEffect(() => {
        const getStats = async () => {
            const query = `
                query ($id: Int) {
                    Media (id: $id, type: ANIME) {
                        title {
                            english
                        }
                        averageScore
                        popularity
                        favourites
                        genres
                        rankings {
                            rank
                            type
                            allTime
                            id
                            year
                        }
                        studios (isMain: true) {
                            nodes {
                                name
                                id
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
            setStats(response.data.data.Media)
        }

        getStats()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(stats)

    if (!stats) {
        return <div></div>
    }

    const renderedRankings = stats.rankings.map((ranking) => {

        return (
            <div key={ranking.id}>
                #{ranking.rank} most {ranking.type}
            </div>
        )
    })

    const renderedGenres = stats.genres.map((genre) => {
        return (
            <div key={genre}>{genre}</div>
        )
    })

    return (
        <div>
            <h1>stats</h1>
            <div>studio: {stats.studios.nodes[0].name}</div>
            <div>popularity: {stats.popularity} users</div>
            <div>score: {stats.averageScore}</div>
            <div>favorites: {stats.favourites}</div>
            <div><h2>rankings:</h2>
            {renderedRankings}
            </div>
            <h2>genres:</h2>
            {renderedGenres}
        </div>
    )
}

export default Stats