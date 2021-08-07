import React from 'react'
import {Link} from 'react-router-dom'
import './AnimeCard.css'

function CharacterCard({character}) {
    const charURL = `/characters/${character.id}/${character.name.full.replace(/\s/g , "-")}`

    return (
        <Link className='card' to={charURL}>
            <div className='card-img-container'>
                <img className='card-img' src={character.image.large} />
            </div>
            <div className='card-body'>
                <h2 className='card-title'>{character.name.full}</h2>
                <div className='card-info'>
                    <div className='card-score'>{character.favourites} favourites</div>
                </div>
            </div>
        </Link>
    )
}

export default CharacterCard