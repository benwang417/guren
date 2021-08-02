import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import generateUrl from '../generateUrl'

function AnimeList() {
    const [lists, setLists] = useState([])
    const [completed, setCompleted] = useState([])
    const [planned, setPlanned] = useState([])
    const [watching, setWatching] = useState([])
    const [user, setUser] = useState()
    const {userName, userId} = useParams()

    useEffect(() => {
        const getUser = async () => {
            const query = `
                query {
                    User (name: "${userName}") {
                        id
                        name
                        avatar {
                            medium
                        }
                        bannerImage
                        favourites {
                            anime (page: 25) {
                                edges {
                                    node {
                                        id
                                        title {
                                            english
                                        }
                                        coverImage {
                                            medium
                                        }
                                    }
                                }
                            }
                            characters (page: 25) {
                                edges {
                                    node {
                                        id
                                        name {
                                            full
                                        }
                                        image {
                                            medium
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `

            const variables = {
                userName
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
            setUser(response.data.data.User)
            
        }

        getUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!user) {
            return
        }
        const getLists = async () => {
            const query = `
                query {
                    MediaListCollection (userId: ${user.id}, type: ANIME) {
                        lists {
                            name
                            status
                            entries {
                                media {
                                title {
                                    english
                                }
                                id
                                coverImage {
                                    medium
                                    }
                                }
                                score
                                progress
                                status
                            }
                        }
                    }
                }
            `

            const variables = {
                userId
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
            setLists(response.data.data.MediaListCollection.lists)
            
        }

        getLists()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    console.log(lists)

    if (!user || !lists.length) {
        return (
            <div></div>
        )
    }

    //TODO: refactor into one function that is passed one list
    const renderedListCompleted = lists[0].entries.map((listEntry) => {
        const show = listEntry.media
        const showURL = show.title.english ? generateUrl(show.title.english, show.id) : ''
        //TODO: sort list by score
        return (
            <div key={show.id} style={{}}>
                <Link to={showURL}>
                    <div>{show.title.english}</div>
                    <img src={show.coverImage.medium} alt='show'/>
                </Link>
                <div>
                    Score: {listEntry.score}
                </div>
            </div>
        )
    })
    const renderedListWatching = lists[2].entries.map((listEntry) => {
        const show = listEntry.media
        const showURL = show.title.english ? generateUrl(show.title.english, show.id) : ''
        //TODO: sort list by score
        return (
            <div key={show.id} style={{}}>
                <Link to={showURL}>
                    <div>{show.title.english}</div>
                    <img src={show.coverImage.medium} alt='show'/>
                </Link>
                <div>
                    Score: {listEntry.score}
                </div>
            </div>
        )
    })
    const renderedListPlanned = lists[1].entries.map((listEntry) => {
        const show = listEntry.media
        const showURL = show.title.english ? generateUrl(show.title.english, show.id) : ''
        //TODO: sort list by score
        return (
            <div key={show.id} style={{}}>
                <Link to={showURL}>
                    <div>{show.title.english}</div>
                    <img src={show.coverImage.medium} alt='show'/>
                </Link>
                <div>
                    Score: {listEntry.score}
                </div>
            </div>
        )
    })

    // console.log(lists[0])
    return (
        <div>
            <h1>{userName}</h1>
            <img src={user.avatar.medium}/>
            <h2>watching</h2>
            {renderedListWatching}
            <h2>completed</h2>
            {renderedListCompleted}
            <h2>plan to watch</h2>
            {renderedListPlanned}
        </div>
    )
}

export default AnimeList