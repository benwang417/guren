import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import SearchResult from './SearchResult'
// import Dropdown from './Dropdown'
import './Search.css'
import {ThemeContext} from '../ThemeContext'
import {useLocation, useHistory} from 'react-router-dom'

function Search() {
    const {theme} = useContext(ThemeContext)
    const searchParams = new URLSearchParams(useLocation().search)
    let history = useHistory()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        const getSearchResults = async () => {
            const query = `
                query ($page: Int, $perPage: Int, $search: String) {
                    Page (page: $page, perPage: $perPage) {
                        pageInfo {
                            total
                            currentPage
                            lastPage
                            hasNextPage
                            perPage
                        }
                        media (type: ANIME, search: $search, sort: SCORE_DESC) {
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
                            format
                            seasonYear
                            isAdult
                        }
                    }
                }
            `

            const variables = {
                search: searchTerm,
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
            })
            setSearchResults(response.data.data.Page.media)
        }

        const getDefaultResults = async () => {
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
                            format
                            seasonYear
                            isAdult
                        }
                    }
                }
            `

            const variables = {
                query,
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
            })
            setSearchResults(response.data.data.Page.media)
        }

        if (!searchTerm) {
            getDefaultResults() // load top anime when there is no search term
        } else if (searchTerm && !searchResults.length){
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

    const onInputChange = (e) => {
        setSearchTerm(e.target.value)
        if (e.target.value) {
            history.push(`/search?search=${e.target.value}`)
        } else {
            history.push(`/search`)
        }

    }

    const renderedSearchResults = searchResults.map((result) => {
        // possible issue caused by only native or romaji title being available, instead: check for english, then romaji, then native, then return if all null
        if (result.title.english === null || result.title.description === null || result.isAdult) {
            return
        }
        // console.log(result)

        return (
            <SearchResult key={result.id} searchData={result}/>
        )
    })
    
    if (!searchResults.length) {
        return (
            <div className='searchPage'>
                <div className='filtersWrapper'>
                    <div className='filterContainer'>
                        <div className='filter'>
                            <div className='filterTitle'>search</div>
                            <div className={`inputWrap ${theme}`}>
                                <input className='searchBar'
                                    value={searchTerm}
                                    onChange={onInputChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                No Search Results: Please enter valid search term
            </div>
        )
    }

    //TODO: add black background to bottom of screen when only a few search results are show, currently
    //there is a large white area in dark mode
    //TODO: add X button to clear search
    //TODO: add other search filters: year, season, genre, etc

    return (
        <div>
            <div className='mainContainer'>
                <div className='filtersWrapper'>
                    <div className='filterContainer'>
                        <div className='filter'>
                            <div className='filterTitle'>search</div>
                            <div className={`inputWrap ${theme}`}>
                                <input className='searchBar'
                                    value={searchTerm}
                                    onChange={onInputChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='searchContainer'>
                    {renderedSearchResults}
                </div>
            </div>
        </div>
    )
}

export default Search