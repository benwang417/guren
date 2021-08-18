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
            <SearchResult key={show.id} title={title} image={show.coverImage.medium} url={url} setSearchBarOpen={setSearchBarOpen} />
        )
    })
    const renderedChars = charResults.map((char) => {
        const url = `/characters/${char.id}/${char.name.full.replace(/\s/g , "-")}`
        return (
            <SearchResult key={char.id} title={char.name.full} image={char.image.medium} url={url} setSearchBarOpen={setSearchBarOpen}/>
        )
    })
    const renderedStudios = studioResults.map((studio) => {
        const url = `/studios/${studio.id}/${studio.name.replace(/\s/g , "-")}`
        return (
            <SearchResult key={studio.id} title={studio.name} image={null} url={url} setSearchBarOpen={setSearchBarOpen}/>
            )
    })

    return (
        <div className='search-container'>
            <div className='search-bar'>
                <div className='search-wrap'>
                    <input 
                        placeholder='search guren'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='input'
                    />
                </div>
            </div>
            <div className='results-container'> 
                { showResults.length ?
                <div>
                    <div className='section-name'>Anime</div>
                    {renderedShows}
                </div> : null }
                { charResults.length ?
                <div>
                <div className='section-name'>Characters</div>
                {renderedChars}
                </div> : null }
                { studioResults.length ?
                <div>
                <div className='section-name'>Studios</div>
                {renderedStudios}
                </div> : null }
            </div>
        </div>
    )
}

export default SearchBar
