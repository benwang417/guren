import React from 'react'

function Modal({setModalOpen}) {

    return (
        <div>
            modal
            <div onClick={() => setModalOpen(false)}>
                close
            </div>
        </div>
    )
}

export default Modal