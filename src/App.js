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
        <div className="App">
            <Header />
            <Route path='/' exact component={TopAnimeList}/>
        </div>
    )
}

export default App
