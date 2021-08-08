import React from 'react'
import {Link} from 'react-router-dom'
import './AnimeCard.css'

function CharacterCard({character, isVoiceActor}) {
    const URL = ( !isVoiceActor ? `/characters/${character.id}/${character.name.full.replace(/\s/g , "-")}`
        : `/va/${character.id}/${character.name.full.replace(/\s/g , "-")}`
    )
    return (
        <Link className='card' to={URL}>
            <div className='card-img-container'>
                <img className='card-img' src={character.image.large} alt='character'/>
            </div>
            <div className='card-body'>
                <h2 className='card-title'>{character.name.full}</h2>
                <div className='card-info'>
                    <div className='card-score'>{character.favourites} favorites</div>
                </div>
            </div>
        </Link>
    )
}

export default CharacterCard