import React, {useState} from 'react'
import Header from './components/Header'
import Search from './components/Search'
import AnimePage from './components/AnimePage'
import './App.css'
import {
    Route
} from 'react-router-dom'
import TopAnimeList from './components/TopAnimeList'
import { ThemeContext } from './ThemeContext'

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <div className={`App ${theme}`}>
                <Header />
                <div className='lists'>
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
                </div>
            </div>
        </ThemeContext.Provider>
    )
}

export default App
