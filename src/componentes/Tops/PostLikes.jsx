import { useEffect, useState } from "react"
import clienteAxios from "../../../config/axios"
import { NavLink } from "react-router-dom"

const PostLikes = () => {
    const [data,guardarData] =useState([])

    useEffect(() => {

        const mostrarData = async() => {

            try {
                const res = await clienteAxios.get('/top-post-likes')
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

  return (
    <div className="users_top">
            <h1>Publicaciones con más likes</h1>
            <table className="tabla">
    <tbody>
    <tr>
          <th className="tabla_header"></th>
          <th className="tabla_header">Publicación</th>
          <th className="tabla_header">Likes</th>
        </tr>
      {data.map((post,i) => (
        <tr key={post.publicacion_id}>
          <th>{i+1}</th>
          <th><NavLink className="enlace"
          to={`/post/${post.publicacion_id}`}>{post.titulo}</NavLink></th>
          <th>{post.total_likes}</th>
        </tr>
      ))}
    </tbody>
  </table>
    </div>
  )
}

export default PostLikes