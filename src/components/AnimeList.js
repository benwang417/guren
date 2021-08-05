import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import generateUrl from '../generateUrl'
import { UserContext } from '../UserContext'

function AnimeList() {
    const {user} = useContext(UserContext)
    const [lists, setLists] = useState([])
    const [completed, setCompleted] = useState([])
    const [planned, setPlanned] = useState([])
    const [watching, setWatching] = useState([])
    const [listOwner, setListOwner] = useState()
    const {listOwnerName} = useParams()

    useEffect(() => {

        const getListOwner = async () => {
            const query = `
                query {
                    User (name: "${listOwnerName}") {
                        id
                        name
                        avatar {
                            medium
                        }
                        bannerImage
                        favourites {
                            anime (page: 1) {
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
                            characters (page: 1) {
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
                listOwnerName
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
            setListOwner(response.data.data.User)
        }
        getListOwner()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!listOwner) {
            return
        }
        const getLists = async () => {
            const query = `
                query {
                    MediaListCollection (userId: ${listOwner.id}, type: ANIME) {
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
                listOwner
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
    }, [listOwner])

    console.log(listOwner)
    console.log(lists)

    if (!listOwner || !lists.length) {
        return (
            <div></div>
        )
    }

    function renderList(list) {
        return (
            [...list].sort((a,b) => a.score > b.score ? -1 : 1).map((listEntry) => {
                const show = listEntry.media
                const showURL = show.title.english ? generateUrl(show.title.english, show.id) : ''
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
        )
    }

    return (
        <div>
            <h1>{listOwnerName}</h1>
            <img src={listOwner.avatar.medium}/>
            <h2>watching</h2>
            {renderList(lists[lists.findIndex((list) => list.name === 'Watching')].entries)}
            <h2>completed</h2>
            {renderList(lists[lists.findIndex((list) => list.name === 'Completed')].entries)}
            <h2>plan to watch</h2>
            {renderList(lists[lists.findIndex((list) => list.name === 'Planning')].entries)}
        </div>
    )
}

export default AnimeList