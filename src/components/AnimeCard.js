import React, {useState, useContext} from 'react'
import {Link} from 'react-router-dom'
import generateUrl from '../generateUrl'
import './AnimeCard.css'
import Modal from './Modal'
import { UserListContext } from '../UserListContext'

function AnimeCard({result}) {
    const {userLists} = useContext(UserListContext)
    const [modalOpen, setModalOpen] = useState(false)
    const url = generateUrl(result.title.english, result.id)

    return (
        <Link className='card' to={url}>
            <div className='card-img-container'>
                <img className='card-img' src={result.coverImage.large} />
                <Modal className='card-modal' 
                    show={result} modalOpen={modalOpen} 
                    setModalOpen={setModalOpen} userLists={userLists}
                    isOnCard={true}
                />
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