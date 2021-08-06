import React, { useContext, useEffect, useState } from 'react'
import './Header.css'
import { FiMenu } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../ThemeContext'
import { UserContext } from '../UserContext'


function Header() {
    const {theme, setTheme} = useContext(ThemeContext)
    const {user} = useContext(UserContext)
    const [burgerOpen, setBurgerOpen] = useState(false)

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
        <div className='header'>
            <div className={`nav ${theme}`}>
                <h4>
                    <Link to='/' className='logo'>guren | ぐれん</Link>
                </h4>
                <div className='nav-links'>
                    <Link to='/' className={`link ${theme}`}>home</Link>
                    <Link to='/anime' className={`link ${theme}`}>top anime</Link>
                    <Link to='/search' className={`link ${theme}`}>search</Link>
                    { !user ? 
                    <a className={`link ${theme}`} href='https://anilist.co/api/v2/oauth/authorize?client_id=6197&response_type=token'>login</a>
                     :
                    <Link to={`/user/${user.name}/animelist`} className={`link ${theme}`}>my list</Link>
                    }
                    { user ?
                    <img src={user.avatar.medium} style={{height: 'auto', width: '60px'}}/>
                     : null
                    }
                    <button onClick={toggleTheme} className='themeButton'>{theme === 'light' ? 'dark mode' : 'light mode'}</button>
                </div>
                <FiMenu className={burgerOpen ? 'burger active' : 'burger'} onClick={() => setBurgerOpen(!burgerOpen)} />
                {/* { user ?
                    <img src={user.avatar.medium} style={{height: 'auto', width: '60px'}}/>
                 : null
                } */}
            </div>
            {burgerOpen ? 
            <div className='mobile-menu'>
                    <Link to='/' className={`link ${theme}`}>home</Link>
                    <Link to='/search' className={`link ${theme}`}>top anime</Link>
                { !user ? 
                    <a className={`link ${theme}`} href='https://anilist.co/api/v2/oauth/authorize?client_id=6197&response_type=token'>login with AniList</a>
                 :
                    <Link to={`/user/${user.name}/animelist`} className={`link ${theme}`}>my list</Link>
                }
            </div> : null
            }
        </div>
    )
}

export default Header