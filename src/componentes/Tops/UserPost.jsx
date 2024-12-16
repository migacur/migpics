import { useEffect, useState } from "react"
import clienteAxios from "../../../config/axios"
import { NavLink } from "react-router-dom"

const UserPost = () => {

    const userLogin = JSON.parse(localStorage.getItem("user"));
    const [data,guardarData] =useState([])

    useEffect(() => {

        const mostrarData = async() => {

            try {
                const res = await clienteAxios.get('/top-user-post')
                guardarData(res.data)
            } catch (error) {
                console.log(error)
            }

        }

        mostrarData()

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

    },[])
console.log(data)
  return (
    <div className="users_top">
            <h1>Usuarios con más publicaciones</h1>
            <table className="tabla">
    <tbody>
    <tr>
          <th className="tabla_header primay"></th>
          <th className="tabla_header">Usuario</th>
          <th className="tabla_header">Publicaciones</th>
        </tr>
      {data.map((user,i) => (
        <tr key={user.id}>
          <th className="primary">{i+1}</th>
          <th><NavLink to={userLogin?.username === user.usuario &&
                           userLogin?.id === user.id ? 
            `/mi-cuenta` : `/usuario/${user.usuario}`} className="link_top">{user.usuario}</NavLink></th>
          <th>{user.total_post}</th>
        </tr>
      ))}
    </tbody>
  </table>
    </div>
  )
}

export default UserPost