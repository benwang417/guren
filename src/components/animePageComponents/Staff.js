import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Staff ({id}) {
    const [staff, setStaff] = useState([])

    useEffect(() => {
        const getStaff = async () => {
            const query = `
                query ($id: Int) {
                    Media (id: $id, type: ANIME) {
                        title {
                            english
                        }
                        staff (page: 1) {
                            edges {
                                node {
                                    name {
                                        first
                                        last
                                    }
                                    id
                                    image {
                                        medium
                                    }
                                }
                            }
                        }
                    }
                }
            `

            const variables = {
                id: id
            }

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

            const response = await axios.post('https://graphql.anilist.co', {
                query,
                variables,
                headers
            })
            setStaff(response.data.data.Media.staff.edges)
        }

        getStaff()
    }, [])

    const renderedStaff = staff.map((staff) => {
        const firstName = staff.node.name.first
        const lastName = staff.node.name.last

        const url = lastName ? `/staff/${id}/${firstName}-${lastName}` : `/staff/${id}/${firstName}`
        return (
            <Link to={url} key={staff.node.id}>
                <div>{firstName} {lastName}</div>
            </Link>
        )
    })
    console.log(staff)

    if (!staff) {
        return (
            <div>
                
            </div>
        )
    }

    return (
        <div>
            <h1>Staff</h1>
            {renderedStaff}
        </div>
    )
}

export default Staff