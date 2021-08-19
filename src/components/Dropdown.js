import React, { useState } from 'react'
import './Dropdown.css'

function Dropdown({filterTitle, options, selection, setSelection, canBeEmpty}) {
    const [open, setOpen] = useState(false)

    const renderedOptions = options.map((option) => {
        return (
            <div className='menu-item' key={option} onClick={() => {
                setSelection(option)
                setOpen(!open)
                }}>
                {option}
            </div>
        )
    })

    return (
        <div className='filterContainer'>
            <div className='filter'>
                <div className='filterTitle'>{filterTitle}</div>
                <div className='inputWrap' style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className={`selection accent ${selection !== 'Any' && canBeEmpty === true  ? 'selected' : ''}`} onClick={() => setOpen(!open)}>
                        {selection}
                    </div>
                    {canBeEmpty && selection !== 'Any' ?
                    <div className='x' onClick={() => {
                        setSelection('Any')
                        setOpen(false)
                    }}>
                    X 
                    </div> : null
                    }
                </div>
                <div>
                    {open ? renderedOptions : null}
                </div>
            </div>
        </div>
    )
}

export default Dropdown