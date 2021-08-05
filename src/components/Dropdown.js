import React, { useState } from 'react'
import './Dropdown.css'

function Dropdown({filterTitle, options, selection, setSelection, canBeEmpty}) {
    const [open, setOpen] = useState(false)

    const renderedOptions = options.map((option) => {
        return (
            <option className='menu-item' key={option} onClick={() => {
                setSelection(option)
                setOpen(!open)
                }}>
                {option}
            </option>
        )
    })

    return (
        <div className='filterContainer'>
            <div className='filter'>
                <div className='filterTitle'>{filterTitle}</div>
                <div className={`inputWrap`} style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className='selection' onClick={() => setOpen(!open)}>
                        {selection}
                    </div>
                    {canBeEmpty ?
                    <div className='x' onClick={() => setSelection('Any')}>
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