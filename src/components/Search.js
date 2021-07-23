import React, {useEffect, useState} from 'react'
import axios from 'axios'
import SearchResult from './SearchResult'

function Search() {
    const [searchTerm, setSearchTerm] = useState('')
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

        if (searchTerm && !searchResults.length){
            getSearchResults()

        } else {
            const timeoutId = setTimeout( () => {
                if (searchTerm) {
                    //only searches if term is not empty
                    getSearchResults()
                }
            }, 500)
            return () => {
                clearTimeout(timeoutId)
            }
        }
    }, [searchTerm])


    //console.log(searchResults)
    const renderedSearchResults = searchResults.map((result) => {
        if (result.title.english === null || result.title.description === null ) {
            return
        }
        

        return (
            // <Link to={`/anime/${result.title.english.replace(/\s/g , "-")}`}>
            //     <SearchResult key={result.id} searchData={result}/>
            // </Link>
            <SearchResult key={result.id} searchData={result}/>
        )
    })


    return (
        <div>
            <div>
                <label>search</label>
                <input 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                {renderedSearchResults}
            </div>
        </div>
    )
}

export default Search