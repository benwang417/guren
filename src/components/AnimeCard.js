import React from 'react'
import {Link} from 'react-router-dom'
import generateUrl from '../generateUrl'
import './AnimeCard.css'

function AnimeCard({result}) {
    const url = generateUrl(result.title.english, result.id)

    // if (!result) {
    //     <div className='card'>
    //         <div className='cardContent'>
    //             <h2 className='cardTitle'></h2>
    //         </div>
    //     </div>   
    // } else {
        
    // }
    // return (
    //     <Link className='cardLink' to={url}>
    //             <div className='card' style={{backgroundImage: `url(${result.coverImage.large})`}}>
    //                 <div className='cardContent'>
    //                     <h2 className='cardTitle'>{result.title.english}</h2>
    //                 </div>
    //             </div>
    //     </Link>
    // )

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