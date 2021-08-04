import React, { useState } from 'react'
import './Dropdown.css'

function Dropdown({filterTitle, options, selection, setSelection}) {
    const [open, setOpen] = useState(true)

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
                <div className={`inputWrap`} onClick={() => setOpen(!open)}>
                    <div className='selection' style={{display: 'flex', justifyContent: 'space-between'}}>
                        {selection}
                        {filterTitle !== 'sort by' ?
                        <div className='x' onClick={() => setSelection('Any')}>
                        X 
                        </div> : null
                        }
                    </div>
                    
                </div>
                <div>
                    {open ? renderedOptions : null}
                </div>
            </div>
        </div>
    )
}

export default Dropdown