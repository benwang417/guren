import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import SearchResult from './SearchResult'
import Dropdown from './Dropdown'
import './Search.css'
import {ThemeContext} from '../ThemeContext'
import {useLocation, useHistory} from 'react-router-dom'

const yearCollection = [2021, 2020, 2019, 2018, 2017, 2016, 
    2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006]
const seasonCollection = ['WINTER', 'SPRING', 'SUMMER', 'FALL']
const sortCollection = ['SCORE_DESC', 'POPULARITY_DESC', 'TRENDING_DESC']

function Search() {
    const {theme} = useContext(ThemeContext)
    const searchParams = new URLSearchParams(useLocation().search)
    let history = useHistory()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [searchResults, setSearchResults] = useState([])
    const [genreCollection, setGenreCollection] = useState([])
    const [genreSelection, setGenreSelection] = useState(searchParams.get('genre') || 'Any')
    const [yearSelection, setYearSelection] = useState(searchParams.get('year') || 'Any')
    const [seasonSelection, setSeasonSelection] = useState(searchParams.get('season') || 'Any')
    const [sortSelection, setSortSelection] = useState(sortCollection[0])

    useEffect(() => {
        const getSearchResults = async () => {
            const query = `
                query ($page: Int, $perPage: Int, $search: String) {
                    GenreCollection
                    Page (page: $page, perPage: $perPage) {
                        pageInfo {
                            total
                            currentPage
                            lastPage
                            hasNextPage
                            perPage
                        }
                        media (type: ANIME, search: $search, sort: ${sortSelection},
                            ${`${genreSelection !== 'Any' ? `genre: ${`"${genreSelection}"`}` : ''}`},
                            ${`${yearSelection !== 'Any' ? `seasonYear: ${`${yearSelection}`}` : ''}`},
                            ${`${seasonSelection !== 'Any' ? `season: ${`${seasonSelection}`}` : ''}`}
                            ) {
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
                            season
                        }
                    }
                }
            `
            // console.log(query)

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
            console.log(response)
            setGenreCollection(response.data.data.GenreCollection)
        }

        const getDefaultResults = async () => {
            const query = `
                query ($page: Int, $perPage: Int) {
                    GenreCollection
                    Page (page: $page, perPage: $perPage) {
                        pageInfo {
                            total
                            currentPage
                            lastPage
                            hasNextPage
                            perPage
                        }
                        media (type: ANIME, sort: ${sortSelection},
                            ${`${genreSelection !== 'Any' ? `genre: ${`"${genreSelection}"`}` : ''}`},
                            ${`${yearSelection !== 'Any' ? `seasonYear: ${`${yearSelection}`}` : ''}`},
                            ${`${seasonSelection !== 'Any' ? `season: ${`${seasonSelection}`}` : ''}`}
                            ) {
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
            setGenreCollection(response.data.data.GenreCollection)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, genreSelection, yearSelection, seasonSelection, sortSelection])

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
            return null
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
    //TODO: add search filters to query params: year, season, genre,

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
                    <Dropdown 
                        options={genreCollection.filter(e => e !== 'Hentai')} filterTitle='genre' 
                        selection={genreSelection} setSelection={setGenreSelection}
                    />
                    <Dropdown 
                        options={yearCollection} filterTitle='year' 
                        selection={yearSelection} setSelection={setYearSelection}
                    />
                    <Dropdown 
                        options={seasonCollection} filterTitle='season' 
                        selection={seasonSelection} setSelection={setSeasonSelection}
                    />
                    <Dropdown 
                        options={sortCollection} filterTitle='sort by' 
                        selection={sortSelection} setSelection={setSortSelection}
                    />
                </div>
                <div className='searchContainer'>
                    {renderedSearchResults}
                </div>
            </div>
        </div>
    )
}

export default Search