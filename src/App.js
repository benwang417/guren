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
import Auth from './components/Auth'
import { ThemeContext } from './ThemeContext'
import { UserContext } from './UserContext'

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [user, setUser] = useState()
    let token = (localStorage.getItem('token') || '')

    //only runs when there is not a user in userContext
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

    // console.log(user)
    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <UserContext.Provider value={{user, setUser}}>
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
            </UserContext.Provider>
        </ThemeContext.Provider>
    )
}

export default App
