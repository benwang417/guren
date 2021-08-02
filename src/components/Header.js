import React, { useContext, useEffect } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../ThemeContext'


function Header() {
    const {theme, setTheme} = useContext(ThemeContext)

    const toggleTheme = (() => {
        if (theme === 'light') {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    })

    useEffect(() => {
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
            <div className={`nav ${theme}`}>
                <h4>
                    <Link to='/' className='logo'>guren | ぐれん</Link>
                </h4>
                <ul className='nav-links'>
                    <li>
                        <Link to='/' className={`link ${theme}`}>home</Link>
                    </li>
                    <li>
                        <Link to='/anime' className={`link ${theme}`}>top anime</Link>
                    </li>
                    <li>
                        <Link to='/search' className={`link ${theme}`}>search</Link>
                    </li>
                    <li>
                        <a className={`link ${theme}`} href='https://anilist.co/api/v2/oauth/authorize?client_id=6197&response_type=token'>login with AniList</a>
                    </li>
                    <li>
                        <Link to='/user/Benjiman/animelist' className={`link ${theme}`}>my list</Link>
                    </li>
                    <li>
                        <button onClick={toggleTheme} className='themeButton'>{theme === 'light' ? 'dark mode' : 'light mode'}</button>
                    </li>
                </ul>
            </div>
    )
}

export default Header