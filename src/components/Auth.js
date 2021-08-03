import React, {useContext, useEffect, useState} from 'react'
import {useLocation, useParams, Redirect } from 'react-router-dom'
import {UserContext} from '../UserContext'
import axios from 'axios'

function Auth() {
    const {user, setUser} = useContext(UserContext)
    var hash = window.location.hash.substr(1);
    const result = hash.split('&').reduce(function (res, item) {
        var parts = item.split('=')
        res[parts[0]] = parts[1]
        return res
    }, {})
    localStorage.setItem('token', result.access_token)

    
    useEffect(() => {
        if (!result.access_token) {
            console.log('returned')
            return
        }
        const getCurrentUser = async () => {
            const query = `
                query {
                    Viewer {
                       id
                       name
                       avatar {
                           medium
                       }
                    }
                }
            `
            const headers = {
                'Authorization': `Bearer ${result.access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            const response = await axios.post('https://graphql.anilist.co', {
                query
            }, {
                headers
            })
            setUser(response.data.data.Viewer)
        }

        getCurrentUser()
    }, [])

    if (!user) {
        return (
            <div></div>
        )
    }

    return (
        <div>
            <Redirect to='/' />
        </div>
    )
}

export default Auth