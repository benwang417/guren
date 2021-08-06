import React from 'react'
import {Link} from 'react-router-dom'
import generateUrl from '../generateUrl'
import './AnimeCard.css'

function AnimeCard({result}) {
    const url = generateUrl(result.title.english, result.id)

    return (
        <Link className='card' to={url}>
            <div className='card-img-container'>
                <img className='card-img' src={result.coverImage.large} />
            </div>
            <div className='card-body'>
                <h2 className='card-title'>{result.title.english}</h2>
                <div className='card-info'>
                    <div className='card-score'>{result.averageScore}</div>
                    <div className='card-popularity'>{result.popularity} users</div>
                </div>
            </div>
        </Link>
    )
}

export default AnimeCard