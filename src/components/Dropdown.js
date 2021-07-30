import React, { useState } from 'react'
import './Dropdown.css'

function Dropdown({filterTitle, options, selection, setSelection}) {
    const [open, setOpen] = useState(false)

    const renderedOptions = options.map((option) => {
        return (
            <div className='menu-item' key={option} onClick={() => setSelection(option)}>
                {option}
            </div>
        )
    })

    return (
        <div className='filterContainer'>
            <div className='filter'>
                <div className='filterTitle'>{filterTitle}</div>
                <div className={`inputWrap`}>
                    <div className='selection'>
                        {selection}
                    </div>
                </div>
                <div className={`menu ${open ? 'active' : 'hidden'}`}>
                    {renderedOptions}
                </div>
            </div>
        </div>
    )
}

export default Dropdown