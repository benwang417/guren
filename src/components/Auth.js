import React, {useContext, useEffect, useState} from 'react'
import {useLocation, useParams } from 'react-router-dom'
// import {AuthContext} from '../AuthContext'
// import {UserContext} from '../UserContext'
import axios from 'axios'

function Auth() {
    // const {token, setToken} = useContext(AuthContext)
    // const {user, setUser} = useContext(UserContext)
    const [user, setUser] = useState()
    const location = useLocation()
    // let params = useParams()
    // console.log(params)
    var hash = window.location.hash.substr(1);
    const result = hash.split('&').reduce(function (res, item) {
        var parts = item.split('=')
        res[parts[0]] = parts[1]
        return res
    }, {})


    
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

    console.log(user)
    return (
        <div>
            Hello {user.name}    
        </div>
    )
}

export default Auth