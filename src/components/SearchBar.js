import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('')
    const [showResults, setShowResults] = useState([])
    const [charResults, setCharResults] = useState([])
    const [studioResults, setStudioResults] = useState([])

    useEffect(() => {
        const getSearchResults = async () => {
            let query = `
                query ($page: Int, $perPage: Int, $search: String) {
                    Page (page: $page, perPage: $perPage) {
                        pageInfo {
                            total
                            currentPage
                            lastPage
                            hasNextPage
                            perPage
                        }
                        media (type: ANIME, isAdult: false, search: $search, sort: POPULARITY_DESC) {
                            id
                            title {
                                english
                                romaji
                            }
                            coverImage {
                                large
                                medium
                            }
                            seasonYear
                            isAdult
                            season
                        }
                    }
                } 
            `
            const variables = {
                search: searchTerm,
                page: 1,
                perPage: 5
            }

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            const responseShows = await axios.post('https://graphql.anilist.co', {
                query,
                variables,
                headers
            })
            setShowResults(responseShows.data.data.Page.media)
            query = `
                query ($page: Int, $perPage: Int, $search: String) {
                    Page (page: $page, perPage: $perPage) {
                        pageInfo {
                            total
                            currentPage
                            lastPage
                            hasNextPage
                            perPage
                        }
                        characters (search: $search, sort: FAVOURITES_DESC) {
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
            `
            const responseChars = await axios.post('https://graphql.anilist.co', {
                query,
                variables,
                headers
            })
            setCharResults(responseChars.data.data.Page.characters)
            query = `
                query ($page: Int, $perPage: Int, $search: String) {
                    Page (page: $page, perPage: $perPage) {
                        pageInfo {
                            total
                            currentPage
                            lastPage
                            hasNextPage
                            perPage
                        }
                        studios (search: $search, sort: FAVOURITES_DESC) {
                            id
                            name
                        }
                    }
                } 
            `
            const responseStudios = await axios.post('https://graphql.anilist.co', {
                query,
                variables,
                headers
            })
            setStudioResults(responseStudios.data.data.Page.studios)
        }
        if (searchTerm && (!showResults || !charResults || !studioResults)){
            getSearchResults()
        } else {
            const timeoutId = setTimeout( () => {
                if (searchTerm) {
                    getSearchResults()
                }
            }, 500)
            return () => {
                clearTimeout(timeoutId)
            }
        }
    }, [searchTerm])

    const renderedShows = showResults.map((show) => {
        const title = show.title.english ? show.title.english : show.title.romaji
        return (
            <div>{title}</div>
        )
    })
    const renderedChars = charResults.map((char) => {
        return (
            <div>{char.name.full}</div>
        )
    })
    const renderedStudios = studioResults.map((studio) => {
        return (
            <div>{studio.name}</div>
        )
    })
    // console.log(showResults)
    // console.log(charResults)
    // console.log(studioResults)
    return (
        <div>
            SearchBar
            <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {renderedShows}
            {renderedChars}
            {renderedStudios}
        </div>
    )
}

export default SearchBar
