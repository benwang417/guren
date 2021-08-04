import axios from 'axios'
import React from 'react'


function Modal({show, setModalOpen}) {
    const token = localStorage.getItem('token')

    const submit = async () => {
        const query = `
                mutation ($mediaId: Int, $status: MediaListStatus) {
                    SaveMediaListEntry (mediaId: $mediaId, status: $status) {
                        id
                        status
                    }
                }
            `

        const variables = {
            mediaId: show.id,
            status: 'COMPLETED'
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