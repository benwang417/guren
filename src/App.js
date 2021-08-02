import React, {useState} from 'react'
import Header from './components/Header'
import Search from './components/Search'
import AnimePage from './components/AnimePage'
import './App.css'
import {
    Route
} from 'react-router-dom'
import TopAnimeList from './components/TopAnimeList'
import StudioPage from './components/StudioPage'
import VoiceActorPage from './components/VoiceActorPage'
import CharacterPage from './components/CharacterPage'
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
        </ThemeContext.Provider>
    )
}

export default App
