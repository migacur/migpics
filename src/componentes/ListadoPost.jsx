import { useEffect, useState } from "react"
import clienteAxios from "../../config/axios"
import { useNavigate, useParams } from "react-router-dom"
import Spinner from "./Spinner"

const ListadoPost = () => {

    const [listado,guardarListado]=useState([])
    const [datos,cargarDatos]=useState(false)
    const navigate = useNavigate()
    const { username } = useParams()
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 15;
    const [hayMasPaginas, setHayMasPaginas] = useState(false);

    const mostrarListado = async() => {

        try {
        const res = await clienteAxios.get(`/listado-post/${username}?pagina=${paginaActual}&elementosPorPagina=${elementosPorPagina}`)
        guardarListado(res.data)
        cargarDatos(true)
        setHayMasPaginas(res.data.length > elementosPorPagina);
        } catch (error) {
            console.log(error)
        }
        
    }


    useEffect(() => {
        mostrarListado()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[paginaActual])

    const capturarImg = id => navigate(`/post/${id}`)
    
    const irAPagina = (pagina) => {
      setPaginaActual(pagina);
    };

    if(!datos) return <Spinner/> 
    
  return (
    <div className="div-images">
      { listado.length > 0 ?  <h1>Publicaciones de {username} </h1> : 
        <p className="not_post">El usuario {username} no tiene publicaciones </p>
      }
   
    <div className="show_post">
      
          { listado.map(post => (
            post ?
            <div className="card_image" key={post.publicacion_id} onClick={()=>capturarImg(post.publicacion_id)}>
              <img src={post.imagen} alt={post.titulo} />
              <div className="post_info">
                    <div className="info_hover">
                      <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24"><path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"/></svg>
                    </div>
                    <span>{post.likes_totales}</span> 
                   </div>
                  </div>
            </div>
            :
            <Spinner key={post.publicacion_id}/>
          ))

          }
    </div>
    <div className="buttons_page">
    <button onClick={() => irAPagina(paginaActual - 1)} 
    disabled={paginaActual === 1}
    className="button_page">Anterior</button>
      <span className="page">Página {paginaActual}</span>
      <button onClick={() => irAPagina(paginaActual + 1)}
      className="button_page" disabled={!hayMasPaginas}>Siguiente</button>
    </div>
   
    
</div>
  )
}

export default ListadoPost