import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './TopAnimeList.css'
import AnimeCard from './AnimeCard'
import CardPlaceholder from './CardPlaceholder'
import { UserListContext } from '../UserListContext'
import { UserContext } from '../UserContext'

const WatchList = () => {
    const {user} = useContext(UserContext)
    const {userLists} = useContext(UserListContext)
    const [watchList, setWatchList] = useState([])

    useEffect(() => {
        const getWatchList = () => {
            const watching = userLists.filter((list) => list.name === 'Watching')
            if (watching.length) {
                setWatchList(watching[0].entries)
            }
        }

        if (userLists) {
            getWatchList()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLists])
    console.log(watchList)

    //TODO: add error check for no internet to api request
    //TODO: move axios calls to a seperate file
    

    if (!user) {
        return (
            <div className='container'>
                <Link to='' className='listTitle'>Your Watchlist</Link>
                <div className='cardList'>
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                    <CardPlaceholder />
                </div>
            </div>
        )
    }
    
    if (!watchList.length) {
        return (
            <div className='container'>
                <Link to='' className='listTitle'>Your Watchlist</Link>
                <div className='cardList'>
                    Your List is empty :(
                </div>
            </div>
        )
    }

    console.log('ready')
    const renderedList = watchList.map((entry) => {
        return (
            <AnimeCard key={entry.media.id} result={entry.media} progress={entry.progress}/>
        )
    })

    return (
        <div className='container'>
            <Link to={`/user/${user.name}/animelist`} className='listTitle'>Your Watchlist</Link>
            <div className='cardList'>
                {renderedList} 
            </div>
        </div>
    )
}

export default WatchList