import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import Dropdown from './Dropdown'
import CardPlaceholder from './CardPlaceholder'
import AnimeCard from './AnimeCard'
import './Search.css'
import {UserListContext} from '../UserListContext'
import {useLocation, useHistory} from 'react-router-dom'

const yearCollection = [2021, 2020, 2019, 2018, 2017, 2016, 
    2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006]
const seasonCollection = ['Winter', 'Spring', 'Summer', 'Fall']
const sortCollection = ['Score', 'Popularity', 'Trending']

function Search() {
    const [isLoading, setIsLoading] = useState(true)
    const {userLists} = useContext(UserListContext)
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
        if (genreSelection !== 'Any') {
            searchParams.set('genre', genreSelection)
        } else if (searchParams.has('genre')) {
            searchParams.delete('genre')
        }
        if (yearSelection !== 'Any') {
            searchParams.set('year', yearSelection)
        } else if (searchParams.has('year')) {
            searchParams.delete('year')
        }
        if (seasonSelection !== 'Any') {
            searchParams.set('season', seasonSelection)
        } else if (searchParams.has('season')) {
            searchParams.delete('season')
        }
        if (searchParams.toString() !== '') {
            history.push(`/search?${searchParams.toString()}`)
        } else {
            history.push('/search')
        }   
        function mapSort() {
            if (sortSelection === 'Score') {
                return 'SCORE_DESC'
            } 
            if (sortSelection === 'Popularity') {
                return 'POPULARITY_DESC'
            } 
            if (sortSelection === 'Trending') {
                return 'TRENDING_DESC'
            } 
        }

        const getSearchResults = async () => {
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
                        media (type: ANIME, isAdult: false, ${searchTerm ? `search: "${searchTerm}"` : ''}, sort: ${mapSort()},
                            ${genreSelection !== 'Any' ? `genre: "${genreSelection}"` : ''},
                            ${yearSelection !== 'Any' ? `seasonYear: ${yearSelection}` : ''},
                            ${seasonSelection !== 'Any' ? `season: ${seasonSelection.toUpperCase()}` : ''}
                            ) {
                            id
                            title {
                                english
                                romaji
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

            const variables = {
                search: searchTerm,
                page: 1,
                perPage: 40
            }

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            setIsLoading(true)
            const response = await axios.post('https://graphql.anilist.co', {
                query,
                variables,
                headers
            })
            // console.log(response.data)
            setIsLoading(false)
            setSearchResults(response.data.data.Page.media)
            setGenreCollection(response.data.data.GenreCollection)
        }

        if (!searchResults.length){
            getSearchResults()
        } else {
            const timeoutId = setTimeout( () => {
                getSearchResults()
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
        if (result.title.english === null && result.title.romaji === null) {
            console.log('error', result)
            return
        }
        return (
            <AnimeCard key={result.id} result={result} progress={null}/>
        )
    })

    return (
        <div>
            <div className='mainContainer'>
                <div className='filtersWrapper'>
                    <div className='filterContainer'>
                        <div className='filter'>
                            <div className='filterTitle'>search</div>
                            <div className='inputWrap'>
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
                        canBeEmpty={true}
                    />
                    <Dropdown 
                        options={yearCollection} filterTitle='year' 
                        selection={yearSelection} setSelection={setYearSelection}
                        canBeEmpty={true}
                    />
                    <Dropdown 
                        options={seasonCollection} filterTitle='season' 
                        selection={seasonSelection} setSelection={setSeasonSelection}
                        canBeEmpty={true}
                    />
                    <Dropdown 
                        options={sortCollection} filterTitle='sort by' 
                        selection={sortSelection} setSelection={setSortSelection}
                        canBeEmpty={false}
                    />
                </div>
                {isLoading === false ? 
                <div className='search-results'>
                    {renderedSearchResults}
                </div>
                 :
                <div className='search-results'>
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                </div> }
            </div>
        </div>
    )
}

export default Search