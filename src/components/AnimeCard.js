import React from 'react'
import {Link} from 'react-router-dom'
import generateUrl from '../generateUrl'
import './AnimeCard.css'

function AnimeCard({result}) {
    const url = generateUrl(result.title.english, result.id)

    return (
        <Link className='cardLink' to={url}>
                <div className='card' style={{backgroundImage: `url(${result.coverImage.large})`}}>
                    <div className='cardContent'>
                        <h2 className='cardTitle'>{result.title.english}</h2>
                    </div>
                </div>
        </Link>
    )
}

export default AnimeCard