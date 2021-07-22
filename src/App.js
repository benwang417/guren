import React from 'react'
import Header from './components/Header'
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
            <Route path='/' exact render={(props) => <TopAnimeList sortTerm='SCORE_DESC' title='Top Rated'/>}/>
            <Route path='/' exact render={(props) => <TopAnimeList sortTerm='TRENDING_DESC' title='Trending'/>}/>
            <Route path='/' exact render={(props) => <TopAnimeList sortTerm='POPULARITY_DESC' title='Most Popular'/>}/>
        </div>
    )
}

export default App
