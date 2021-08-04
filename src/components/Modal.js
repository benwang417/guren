import React, { useState } from 'react'
import axios from 'axios'
import Dropdown from './Dropdown'

const watchStatus = ['CURRENT', 'PLANNED', 'COMPLETED', 'DROPPED', 'PAUSED', 'REPEATING']

function Modal({show, setModalOpen}) {
    const token = localStorage.getItem('token')
    const [score, setScore] = useState(0)
    const [progress, setProgress] = useState(0)
    const [statusSelection, setStatusSelection] = useState('COMPLETED')
    
    const scoreIsValid = () => {
        if (typeof(score) !== 'number') {
            setScore(0)
        }
    }

    const progressIsValid = () => {
        if (typeof(progress) !== 'number') {
            setProgress(0)
        }
        if (progress > show.episodes) {
            setProgress(show.episodes)
        }

    }

    const submit = async () => {
        scoreIsValid() //check if score is num between 0-100
        progressIsValid() //check if progress is num between 0 and numEpisodes
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
            <h1>modal</h1>
            <div>
                score
                <input
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                />
                <Dropdown 
                        options={watchStatus} filterTitle='status' 
                        selection={statusSelection} setSelection={setStatusSelection}
                        canBeEmpty={false}
                />
                progress
                <input
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                />
                / {show.episodes}
            </div>
            <div style={{display: 'flex'}}>
                <div onClick={() => setModalOpen(false)}>
                    cancel
                </div>
                <button onClick={submit}>
                    submit
                </button>
            </div>
            
        </div>
    )
}

export default Modal