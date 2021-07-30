import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import SearchResult from './SearchResult'
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

    //check for isAdult, only render non adult content

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
        if (result.title.english === null || result.title.description === null ) {
            return
        }
        

        return (
            <SearchResult key={result.id} searchData={result}/>
        )
    })
    
    if (!searchResults.length) {
        return <div className='searchPage'></div>
    }

    //TODO: Render search bar if no results show up, currently invalid search empties the page
    //TODO: convert searches into query param that is added to url

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