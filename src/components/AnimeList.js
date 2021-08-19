import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import AnimeCard from './AnimeCard'
import './AnimeList.css'

function AnimeList() {
    const [lists, setLists] = useState([])
    const [listOwner, setListOwner] = useState()
    const {listOwnerName} = useParams()

    useEffect(() => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()

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
                                            romaji
                                        }
                                        coverImage {
                                            medium
                                            large
                                        }
                                        episodes
                                        popularity
                                        averageScore
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
            }, {
                cancelToken: source.token
            }).catch(function (error) {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log(error.response.data)
                  console.log(error.response.status)
                  console.log(error.response.headers)
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log(error.request)
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message)
                }
                console.log(error.config)
            })
            if (response) {
                setListOwner(response.data.data.User)
            }
        }
        getListOwner()

        return () => source.cancel()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()

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
                                        romaji
                                    }
                                    id
                                    coverImage {
                                        medium
                                        large
                                    }
                                    episodes
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
            }, {
                cancelToken: source.token
            }).catch(function (error) {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log(error.response.data)
                  console.log(error.response.status)
                  console.log(error.response.headers)
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log(error.request)
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message)
                }
                console.log(error.config)
            })
            if (response) {
                setLists(response.data.data.MediaListCollection.lists)
            }
        }

        getLists()

        return () => source.cancel()
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
                return (
                    <AnimeCard key={show.id} result={show}
                        progress={listEntry.progress} userScore={listEntry.score}
                    />
                )
            })
        )
    }

    return (
        <div>
            <div className='list-head'>
                <img className='banner-image' src={listOwner.bannerImage} />
                <img className='userlist-avatar' src={listOwner.avatar.medium} alt='user'/>
                <div className='userlist-title title'>{listOwner.name}'s list</div>
            </div>
            <div className='container'>
                <div className='listTitle'>Watching</div>
                <div className='cardList'>
                    {renderList(lists[lists.findIndex((list) => list.name === 'Watching')].entries)} 
                </div>
            </div>
            <div className='container'>
                <div className='listTitle'>Completed</div>
                <div className='cardList'>
                    {renderList(lists[lists.findIndex((list) => list.name === 'Completed')].entries)}
                </div>
            </div>
            <div className='container'>
                <div className='listTitle'>Watch List</div>
                <div className='cardList'>
                    {renderList(lists[lists.findIndex((list) => list.name === 'Planning')].entries)}
                </div>
            </div>
        </div>
    )
}

export default AnimeList