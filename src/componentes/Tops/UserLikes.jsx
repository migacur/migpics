import { useEffect, useState } from "react"
import clienteAxios from "../../../config/axios"
import { NavLink } from "react-router-dom"

const UserLikes = () => {

    const userLogin = JSON.parse(localStorage.getItem("user"));
    const [data,guardarData] =useState([])

    useEffect(() => {

        const mostrarData = async() => {

            try {
                const res = await clienteAxios.get('/top-user-likes')
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
//user?.id === comentario.idUser && user?.username === comentario.username &&
  return (
    <div className="users_top">
            <h1>Usuarios con más Likes</h1>
            <table className="tabla">
    <tbody>
    <tr>
          <th className="tabla_header"></th>
          <th className="tabla_header">Usuario</th>
          <th className="tabla_header">Likes</th>
        </tr>
      {data.map((user,i) => (
        <tr key={user.user_id}>
          <th>{i+1}</th>
          <th><NavLink to={userLogin?.username === user.username &&
                           userLogin.id === user.user_id? `/mi-cuenta` :
           `/usuario/${user.username}`} className="link_top">{user.username}</NavLink></th>
          <th>{user.likes_totales}</th>
        </tr>
      ))}
    </tbody>
  </table>
    </div>
  )
}

export default UserLikes