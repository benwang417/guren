import React from 'react'

function CardPlaceholder() {
    return (
        <div className='card'>
            <div className='card-img-container placeholder'>
            </div>
            <div className='card-body'>
                <h2 className='card-title placeholder placeholder-text'></h2>
                <div className='card-info'>
                    <div className='card-score placeholder placeholder-text bot'></div>
                </div>
            </div>
        </div>
    )
}

export default CardPlaceholder
