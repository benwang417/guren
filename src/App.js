import React from 'react'
import Header from './components/Header'
import Search from './components/Search'
import AnimePage from './components/AnimePage'
import './App.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom'
import TopAnimeList from './components/TopAnimeList'

function App() {
    return (
        <div className='App'>
            <Header />
            <div className='lists'>
                <Route path='/anime' exact>
                    <TopAnimeList sortTerm='SCORE_DESC' title='Top Rated'/>
                    <TopAnimeList sortTerm='POPULARITY_DESC' title='Most Popular'/>
                    <TopAnimeList sortTerm='TRENDING_DESC' title='Trending'/>
                </Route>
                <Route path='/search' exact>
                    <Search />
                </Route>
                <Route path='/anime/series'>
                    <AnimePage />
                </Route>
            </div>

        </div>
    )
}

export default App
