import React, { useContext, useEffect, useState } from 'react'
import './Header.css'
import { FiMenu } from 'react-icons/fi'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../ThemeContext'
import { UserContext } from '../UserContext'
import SearchBar from './SearchBar'

function Header({searchBarOpen, setSearchBarOpen}) {
    const {theme, setTheme} = useContext(ThemeContext)
    const {user} = useContext(UserContext)
    const [burgerOpen, setBurgerOpen] = useState(false)
    // const [searchBarOpen, setSearchBarOpen] = useState(false)

    const toggleTheme = (() => {
        if (theme === 'light') {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    })

    useEffect(() => {
        if (theme === 'dark') {
            document.body.style.backgroundColor = 'rgb(19, 19, 19)'
        } else {
            document.body.style.backgroundColor = '#f8f8f8'
        }
        
        localStorage.setItem('theme', theme)
        return () => {
            document.body.style.backgroundColor = null
        }
    }, [theme])

    return (
        <div className='header'>
            <div className='nav'>
                <h4>
                    <Link to='/' onClick={() => setSearchBarOpen(false)} className='logo'>guren | ぐれん</Link>
                </h4>
                <div className='nav-links'>
                    <AiOutlineSearch className={`burger ${searchBarOpen ? 'active' : ''}`}  onClick={() => setSearchBarOpen(!searchBarOpen)}/>
                    <Link onClick={() => setSearchBarOpen(false)} to='/' className='link'>home</Link>
                    <Link onClick={() => setSearchBarOpen(false)} to='/search' className='link'>top anime</Link>
                    { !user ? 
                    <a className='link' href='https://anilist.co/api/v2/oauth/authorize?client_id=6197&response_type=token'>login</a>
                     :
                    <Link to={`/user/${user.name}/animelist`} className='link' onClick={() => setSearchBarOpen(false)}>my list</Link>
                    }
                    { user ?
                    <img src={user.avatar.medium} className='avatar'/>
                     : null
                    }
                    { theme === 'dark' ? 
                        <FaMoon onClick={toggleTheme} className='theme-toggle'/>
                        :
                        <FaSun onClick={toggleTheme} className='theme-toggle'/>
                    }
                </div>
                <div className='mobile-nav'>
                <AiOutlineSearch className={`burger ${searchBarOpen ? 'active' : ''}`} onClick={() => setSearchBarOpen(!searchBarOpen)} />
                { user ?
                <Link to={`/user/${user.name}/animelist`} className='user-link'>
                    <img src={user.avatar.medium} className='avatar'/>
                </Link>
                : null }
                <FiMenu className={burgerOpen ? 'burger active' : 'burger'} onClick={() => setBurgerOpen(!burgerOpen)} />
                </div>
            </div>
            {burgerOpen ? 
            <div className='mobile-menu'>
                <Link to='/' className='link' onClick={() => setSearchBarOpen(false)}>home</Link>
                <Link to='/search' className='link' onClick={() => setSearchBarOpen(false)}>top anime</Link>
                { !user ? 
                <a className='link' href='https://anilist.co/api/v2/oauth/authorize?client_id=6197&response_type=token'>login with AniList</a>
                 :
                <Link to={`/user/${user.name}/animelist`} className='link' onClick={() => setSearchBarOpen(false)}>my list</Link>
                }
                <div onClick={toggleTheme} className='link' style={{display: 'flex', alignItems: 'center'}}>
                    change theme
                    { theme === 'dark' ? 
                        <FaMoon onClick={toggleTheme} className='theme-toggle'/>
                        :
                        <FaSun onClick={toggleTheme} className='theme-toggle'/>
                    }</div>
            </div> : null
            }
        </div>
    )
}

export default Header