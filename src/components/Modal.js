import React, { useState } from 'react'
import axios from 'axios'

const watchStatus = ['CURRENT', 'PLANNED', 'COMPLETED', 'DROPPED', 'PAUSED', 'REPEATING']

function Modal({show, setModalOpen}) {
    const token = localStorage.getItem('token')
    const [score, setScore] = useState(0)
    const [status, setStatus] = useState('COMPLETED')
    
    const scoreIsValid = () => {
        if (typeof(score) !== 'number') {
            setScore(0)
        }
    }

    const submit = async () => {
        scoreIsValid() //check if score is num between 0-100
        const query = `
                mutation ($mediaId: Int, $status: MediaListStatus, $score: Float) {
                    SaveMediaListEntry (mediaId: $mediaId, status: $status, score: $score) {
                        id
                        status
                    }
                }
            `

        const variables = {
            mediaId: show.id,
            status: 'COMPLETED',
            score: score
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        const response = await axios.post('https://graphql.anilist.co', {
            query,
            variables
        }, {
            headers
        })
        console.log(response)
        setModalOpen(false)
    }

    console.log(show)
    return (
        <div>
            modal
            <input
                value={score}
                onChange={(e) => setScore(e.target.value)}
            />
            <div onClick={() => setModalOpen(false)}>
                close
            </div>
            <button onClick={submit}>
                submit
            </button>
        </div>
    )
}

export default Modal