import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'



function Header() {

    return (
            <div className='nav'>
                <h4>
                    <Link to='/' className='logo'>guren | ぐれん</Link>
                </h4>
                <ul className='nav-links'>
                    <li>
                        <Link to='/' className='link'>home</Link>
                    </li>
                    <li>
                        <Link to='/anime' className='link'>top anime</Link>
                    </li>
                    <li>
                        <Link to='/login' className='link'>log in</Link>
                    </li>
                    <li>
                        <Link to='/register' className='link'>sign up</Link>
                    </li>
                </ul>
                <div className='burger'>
                    <div className='line1'></div>
                    <div className='line2'></div>
                    <div className='line3'></div>
                </div>
            </div>
    )
}

export default Header