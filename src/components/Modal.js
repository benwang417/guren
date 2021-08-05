import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import Dropdown from './Dropdown'
import { UserContext } from '../UserContext'

const watchStatus = [
    'current', 'planning', 'completed', 'dropped', 'paused', 'repeating'
]

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '50px',
    zIndex: 1000
}

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: '1000'
}

function Modal({show, modalOpen, setModalOpen, userLists}) {
    const {user} = useContext(UserContext)
    const token = localStorage.getItem('token')
    const [score, setScore] = useState(0)
    const [progress, setProgress] = useState(0)
    const [statusSelection, setStatusSelection] = useState('completed')
    const [entryId, setEntryId] = useState(0)
    
    const scoreIsValid = () => {
        if (typeof(score) !== 'number') {
            setScore(0)
        }
        if (score > 100) {
            setScore(100)
        }
        if (score < 0) {
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
        if (progress < 0) {
            setProgress(0)
        }

    }

    const findInLists = () => {
        if (!userLists || !show) {
            return
        }
        return userLists.map((collection) => {
            return collection.entries.filter((entry) => show.id === entry.media.id)
        }).filter((list) => list.length)[0]
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
            status: statusSelection.toUpperCase(),
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
        setEntryId(response.data.data.SaveMediaListEntry.id)
        setModalOpen(!modalOpen)
    }

    const deleteEntry = async () => {
        //add second modal to ask if user is sure if they want to delete
        const query = `
                mutation ($id: Int) {
                    DeleteMediaListEntry (id: $id) {
                        deleted
                    }
                }
            `

        const variables = {
            id: entryId
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
        setEntryId(0)
        setModalOpen(!modalOpen)
    }

    useEffect(() => {
        if (findInLists()) {
            console.log(findInLists())
            setEntryId(findInLists()[0].id)
        } 
    }, [userLists])

    // console.log(entryId)

    if (!modalOpen) {
        if (!user) {
            return (
                <div></div>
            )
            // <a className='addButton' href='https://anilist.co/api/v2/oauth/authorize?client_id=6197&response_type=token'>add to my list</a>

        }
        return (
            <button onClick={() => setModalOpen(true)} className='addButton'>
                {entryId !== 0 ? 'edit' : 'add to my list'}
            </button>
        )
    }

    return ReactDOM.createPortal(
        <div style={OVERLAY_STYLES}>
            <div style={MODAL_STYLES}>
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
                        save
                    </button>
                    {entryId !== 0 ?
                    <button onClick={deleteEntry}>
                        delete
                    </button> : null
                    }
                </div>
            </div>
        </div>,
        document.getElementById('portal')
    )
}

export default Modal