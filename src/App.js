import React, {useState} from 'react'
import Header from './components/Header'
import Search from './components/Search'
import AnimePage from './components/AnimePage'
import Hero from './components/Hero'
import './App.css'
import {
    Route
} from 'react-router-dom'
import TopAnimeList from './components/TopAnimeList'
import Auth from './components/Auth'
import { AuthContext } from './AuthContext'
import { UserContext } from './UserContext' 
import { ThemeContext } from './ThemeContext'

function App() {
    const [token, setToken] = useState('')
    const [user, setUser] = useState()
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    return (
        <AuthContext.Provider value={{token, setToken}}>
            <UserContext.Provider value={{user, setUser}}>
                <ThemeContext.Provider value={{theme, setTheme}}>
                    <div className={`App ${theme}`}>
                        <Header />
                        <div className='lists'>
                            <Route path='/' exact>
                                <Hero />
                            </Route>
                            <Route path='/auth' exact>
                                <Auth />
                            </Route>
                            <Route path='/anime' exact>
                                <TopAnimeList sortTerm='SCORE_DESC' title='Top Rated'/>
                                <TopAnimeList sortTerm='POPULARITY_DESC' title='Most Popular'/>
                                <TopAnimeList sortTerm='TRENDING_DESC' title='Trending'/>
                            </Route>
                            <Route path='/search' exact>
                                <Search />
                            </Route>
                            <Route path='/anime/series/:id/:title'>
                                <AnimePage />
                            </Route>
                        </div>
                    </div>
                </ThemeContext.Provider>
            </UserContext.Provider>
        </AuthContext.Provider>
    )
}

export default App
