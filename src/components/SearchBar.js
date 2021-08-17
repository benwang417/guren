import React, {useState, useEffect} from 'react'
import './SearchBar.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import generateUrl from '../generateUrl'
import SearchResult from './SearchResult'

function SearchBar({setSearchBarOpen}) {
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
        getSearchResults()
    }, [searchTerm])

    const renderedShows = showResults.map((show) => {
        const title = show.title.english ? show.title.english : show.title.romaji
        const url = generateUrl(title, show.id)
        return (
            <Link onClick={() => setSearchBarOpen(false)} key={show.id} to={url}><SearchResult title={title} image={show.coverImage.medium} /></Link>
        )
    })
    const renderedChars = charResults.map((char) => {
        const url = `/characters/${char.id}/${char.name.full.replace(/\s/g , "-")}`
        return (
            <Link onClick={() => setSearchBarOpen(false)} key={char.id} to={url}><SearchResult title={char.name.full} image={char.image.medium} /></Link>
        )
    })
    const renderedStudios = studioResults.map((studio) => {
        const url = `/studios/${studio.id}/${studio.name.replace(/\s/g , "-")}`
        return (
            <Link onClick={() => setSearchBarOpen(false)} key={studio.id} to={url}><SearchResult title={studio.name} image={null} /></Link>
        )
    })
    // console.log(showResults)
    // console.log(charResults)
    // console.log(studioResults)
    return (
        <div className='search-container'>
            SearchBar
            <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className='results-container'> 
                { showResults.length ?
                <div>
                    Anime
                    {renderedShows}
                </div> : null }
                { charResults.length ?
                <div>
                Characters
                {renderedChars}
                </div> : null }
                { studioResults.length ?
                <div>
                Studios
                {renderedStudios}
                </div> : null }
            </div>
        </div>
    )
}

export default SearchBar
