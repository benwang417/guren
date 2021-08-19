import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { MdEdit} from 'react-icons/md'
import { BiPlus} from 'react-icons/bi'
import Dropdown from './Dropdown'
import { UserContext } from '../UserContext'
import { ThemeContext } from '../ThemeContext'
import './Modal.css'

const watchStatus = [
    'current', 'planning', 'completed', 'dropped', 'paused', 'repeating'
]


function Modal({show, modalOpen, setModalOpen, userLists, isOnCard}) {
    const {user} = useContext(UserContext)
    const {theme} = useContext(ThemeContext)
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
        console.log(progress)
        if (typeof(progress) !== 'number') {
            setProgress(0)
        } else if (progress > show.episodes) {
            setProgress(show.episodes)
        } else if (progress < 0) {
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
                mutation ($mediaId: Int, $status: MediaListStatus, $score: Float, $progress: Int) {
                    SaveMediaListEntry (${entryId !== 0 ? `id: ${entryId},` : ''} mediaId: $mediaId, status: $status, score: $score, progress: $progress) {
                        id
                        status
                    }
                }
            `
        const variables = {
            mediaId: show.id,
            status: statusSelection.toUpperCase(),
            score: score,
            progress: progress
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
        console.log(response)
        setEntryId(0)
        setModalOpen(!modalOpen)
    }

    useEffect(() => {
        if (findInLists()) {
            // console.log(findInLists())
            const entry = findInLists()[0]
            setEntryId(entry.id)
            setProgress(entry.progress)
            setScore(entry.score)
            setStatusSelection(entry.status.toLowerCase())
        } 
    }, [userLists])

    const handleClick = e => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        setModalOpen(true)
    }

    if (!modalOpen) {
        if (!user) {
            return (
                <div></div>
            )
        }

        if (isOnCard === false) {
            return (
                <button onClick={() => setModalOpen(true)} className='addButton'>
                    {entryId !== 0 ? `${statusSelection.toLowerCase()}` : 'add to my list'}
                </button> 
            )
        } else {
            return (
                <>
                { entryId === 0 ?
                <BiPlus onClick={handleClick} className='card-modal' />
                : 
                <MdEdit onClick={handleClick} className='card-modal' />
                }
                </>
            )
        }
    }

    const handleClickAnywhere = e => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }

    console.log(show)
    return ReactDOM.createPortal(
        <div className='overlay' onClick={handleClickAnywhere}>
            <div className={`modal ${theme === 'light' ? 'light' : 'dark'}`}>
                <div>
                    <div className='filter' style={{marginBottom: '2em'}}>
                        <div className='filterTitle'>score</div>
                        <div className='inputWrap'>
                            <input
                                className='searchBar accent'
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                            />
                        </div>
                    </div>
                    <Dropdown 
                            options={watchStatus} filterTitle='status' 
                            selection={statusSelection} setSelection={setStatusSelection}
                            canBeEmpty={false}
                    />
                    <div className='filter' style={{marginTop: '2em', marginBottom: '2em'}}>
                        <div className='filterTitle'>progress</div>
                        <div className='inputWrap' style={{position: 'relative'}}>
                            <input
                            className='progress-input accent'
                            value={progress}
                            onChange={(e) => setProgress(e.target.value)}
                            />
                            <span className='progress-label'>/{show.episodes} episodes</span>
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex'}}>
                    <button className='modal-button' onClick={() => setModalOpen(false)}>
                        cancel
                    </button>
                    <button  className='modal-button' onClick={submit}>
                        save
                    </button>
                    {entryId !== 0 ?
                    <button  className='modal-button delete' onClick={deleteEntry}>
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