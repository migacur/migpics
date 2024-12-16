import { useContext, useEffect, useState } from "react"
import clienteAxios from "../../config/axios"
import { PostContexto } from "../../context/PostContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const Buscador = () => {

  const [resultado,guardarResultado]=useState([])
  const { realizarBusqueda } = useContext(PostContexto)
  const navigate = useNavigate()

  const mostrarResultados = async() => {

    try {
      const res = await clienteAxios.get(`/buscar-post/${realizarBusqueda}`)
      if(res.status === 200){
        guardarResultado(res.data)
      } 
    } catch (e) {
      console.log(e)
      Swal.fire({
        title: 'Ha ocurrido un error',
        text: e.response.data.msg,
        icon: 'error',
      })
      navigate("/")
    }
  }

  useEffect(()=> {

    if(!realizarBusqueda) return navigate("/")

      mostrarResultados()
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[realizarBusqueda])

  const goPost = postId => navigate(`/post/${postId}`)

  return (
    <div className="div-images">
        {resultado.length ?
        <p className="results">Se encontraron {resultado.length} resultado(s) con la palabra: <span>{realizarBusqueda}</span></p>
        :
        <p className="no_results">No se encontraron resultados con la palabra: <span>{realizarBusqueda}</span></p>}
        <div className="show_post">
         { resultado.map(post => (
            <div className="card_image" key={post.publicacion_id}
            onClick={()=>goPost(post.publicacion_id)}>
            <img src={post.imagen} alt={post.titulo} />
            <div className="post_info">
                  <div className="info_hover">
                    <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24"><path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"/></svg>
                  </div>
                  <span>{post.total_likes}</span> 
                 </div>
                </div>
          </div>
              ))

              }
    </div>
    </div>
  )
}

export default Buscador