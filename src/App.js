import React, {useState, useEffect} from 'react'
import { Route } from 'react-router-dom'
import axios from 'axios'
import Header from './components/Header'
import Search from './components/Search'
import AnimePage from './components/AnimePage'
import './App.css'
import TopAnimeList from './components/TopAnimeList'
import StudioPage from './components/StudioPage'
import VoiceActorPage from './components/VoiceActorPage'
import CharacterPage from './components/CharacterPage'
import AnimeList from './components/AnimeList'
import CharacterList from './components/CharacterList'
import Auth from './components/Auth'
import { ThemeContext } from './ThemeContext'
import { UserContext } from './UserContext'
import { UserListContext } from './UserListContext'

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [user, setUser] = useState()
    const [userLists, setUserLists] = useState([])
    let token = (localStorage.getItem('token') || '')

    useEffect(() => {
        if (user || !token) {
            return 
        }

        const getCurrentUser = async () => {
            const query = `
                query {
                    Viewer {
                        id
                        name
                        avatar {
                            medium
                        }
                    }
                }
            `
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            const response = await axios.post('https://graphql.anilist.co', {
                query
            }, {
                headers
            })
            setUser(response.data.data.Viewer)
        }

        getCurrentUser()
        // return () => {
        //     cleanup
        // }
    }, [])

    useEffect(() => {
        const getLists = async () => {
            const query = `
                query ($userId: Int){
                    MediaListCollection (userId: $userId, type: ANIME) {
                        lists {
                            name
                            status
                            entries {
                                id
                                media {
                                    id
                                }
                            }
                            
                        }
                    }
                }
            `

            const variables = {
                userId: user.id
            }

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

            const response = await axios.post('https://graphql.anilist.co', {
                query,
                variables
            }, {
                headers
            })
            setUserLists(response.data.data.MediaListCollection.lists)
        }
        if (user) {
            getLists()
        }
    }, [user])

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <UserContext.Provider value={{user, setUser}}>
                <UserListContext.Provider value={{userLists, setUserLists}}>
                    <div className={`App ${theme}`}>
                        <Header />
                        <div className='lists'>
                            <Route path='/user/:listOwnerName/animelist'>
                                <AnimeList />
                            </Route>
                            <Route path='/auth'>
                                <Auth />
                            </Route>
                            <Route path='/' exact>
                                <TopAnimeList sortTerm='SCORE_DESC' title='Top Rated'/>
                                <TopAnimeList sortTerm='POPULARITY_DESC' title='Most Popular'/>
                                <TopAnimeList sortTerm='TRENDING_DESC' title='Trending'/>
                                <CharacterList />
                            </Route>
                            <Route path='/search'>
                                <Search />
                            </Route>
                            <Route path='/anime/series/:id/:title'>
                                <AnimePage />
                            </Route>
                            <Route path='/characters/:id/:charName'>
                                <CharacterPage />
                            </Route>
                            <Route path='/studios/:id/:studioName'>
                                <StudioPage />
                            </Route>
                            <Route path='/va/:id/:vaName'>
                                <VoiceActorPage />
                            </Route>
                        </div>
                    </div>
                </UserListContext.Provider>
            </UserContext.Provider>
        </ThemeContext.Provider>
    )
}

export default App
