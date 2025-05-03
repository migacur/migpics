import { useContext, useEffect, useRef, useState } from "react"
import clienteAxios from "../../config/axios"
import Swal from "sweetalert2";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Spinner from './Spinner';
import Delete from "./Icons/Delete";
import Close from "./Icons/Close";
import ListadoLikes from "./ListadoLikes";
import { ContextoUsuario } from "../../context/AuthContext";

const Post = () => {

  const { autenticarUser,usuario } = useContext(ContextoUsuario)
const { postId } = useParams();
 const campoComentario = useRef()
 const [data,guardarData]=useState([])
 const [showComments,setShowComments]=useState(false)
 const [inputComentario,setInputComentario]=useState('')
 const [listadoComentarios,setListadoComentarios]=useState([])
 const [like,guardarLike]=useState()
 const [clase,guardarClase]=useState()
 const [contadorComentarios,setContadorComentarios]=useState()
 const [mostrarMensaje, setMostrarMensaje] = useState(false);
 const [isCharge,setIsCharge]=useState(false)
 const [quote,setQuote]=useState(false)
 const [infoRespuesta,setInfoRespuesta]=useState([])
 const [showRespuestas,setShowRespuestas]=useState(false)
 const [listadoRespuestas,guardarListadoRespuestas]=useState([])
 const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
 const [isFav,setIsFav]=useState()
 const [mostrarAvisoFav,setMostrarAvisoFav]=useState(false)
 const [isExpanded, setIsExpanded] = useState(false);
 const [showLikes,setShowLikes]=useState(false)
 const [load,isLoad]=useState(false)
 const navigate = useNavigate()


 useEffect(() => {
  if(!usuario){
    const verificarUsuario = async() => {
      const autenticado = await autenticarUser();
      return autenticado ? autenticarUser() : navigate("/unauthorized")
     }
     verificarUsuario()
  }
 },[usuario,autenticarUser,navigate])

 useEffect(() => {
  const obtenerDatos = async() => {

    try { 
      const res = await clienteAxios.get(`/post/${postId}`, {
        withCredentials:true
      });
      if(res.status === 200){
        const { data } = res;
        guardarData(data);
        guardarLike(data.likes_count)
        guardarClase(data.verificacion_usuario)
        setContadorComentarios(data.comentarios_count+data.respuestas_count)
        setIsFav(data.verificacion_favorito)
        setIsCharge(true)
        
      }
        } catch (e) {
          console.log(e)
      
            Swal.fire({
              title: 'Ha ocurrido un error',
              text: e.response.data.msg,
              icon: 'error',
            })
           return navigate("/unauthorized")
          }
  }
  obtenerDatos()
 },[postId,navigate])




  // dar y quitar likes a publicación
  const darLike = async postId => {

    if(!usuario){
      Swal.fire({
        title: 'Ocurrió un error',
        text: 'Tienes que estar logueado para realizar esta acción',
        icon: 'error',
      })
      return;
    }


    try {
      const res = await clienteAxios.post(`/dar-like/${postId}`, {data:usuario}, {
        withCredentials:true
      } )

      if(res.status === 200){
        Swal.fire(
          '',
           res.data.msg,
          'success'
        )

        if(res.data.isLiked){
          guardarLike(like+1)
          guardarClase(true)
         }else{
          guardarLike(like-1)
          guardarClase(false)
         }
      }

    } catch (e) {
      console.log(e)
      Swal.fire({
        title: '',
        text: e.response.data.msg,
        icon: 'error',
      })
    }
  }

  // Ingresar a los comentarios
  const obtenerComentarios = async(postId) => {

    setShowComments(!showComments)
   
    try {
      const res = await clienteAxios.get(`/mostrar-comentarios/${postId}`, {
       withCredentials:true
      } )
      setListadoComentarios(res.data)
     } catch (e) {
      Swal.fire({
        title: '',
        text: e.response.data.msg,
        icon: 'error',
      })
     }
  
  
  }
 
  // Leer campo del comentario
  const leerInput = e => setInputComentario(e.target.value)

  // Agregar comentario
  const sendComentario = async e => {

    e.preventDefault()

    if(inputComentario.length === 0 || data.length === 0 || !usuario){
      Swal.fire({
        title: 'Error al enviar',
        text: 'No has escrito tu comentario',
        icon: 'error',
      })
      return;
    }
    
    const postId = data.publicacion_id;
    const idUser = usuario.id

    if(quote){
      console.log(infoRespuesta)
        try {
          const res = await clienteAxios.post('/agregar-respuesta',{
            infoRespuesta,
            respuesta: inputComentario
          },{
            withCredentials:true
          });

          if(res.status === 200){
            Swal.fire(
              '',
               res.data.msg,
              'success'
            )
            setQuote(false)
            setShowRespuestas(false)
            obtenerComentarios()
            campoComentario.current.value = ''
            setContadorComentarios(contadorComentarios+1)
            return;
           }
        } catch (e) {
          console.log(e)
          Swal.fire({
            title: '',
            text: e.res.data.msg,
            icon: 'error',
          })
        }
        return;
    }
    
      try {
        const res = await clienteAxios.post(`/agregar-comentario/${postId}`,
        {id:idUser, comentario: inputComentario}, {
        withCredentials:true
       });
      
        if(res.status === 200){
         Swal.fire(
           '',
            res.data.msg,
           'success'
         )
         setQuote(false)
         obtenerComentarios()
         campoComentario.current.value = ''
         setContadorComentarios(contadorComentarios+1)
        }
   
       } catch (e) {
         console.log(e)
         Swal.fire({
           title: '',
           text: e.response.data.msg,
           icon: 'error',
         })
       }
   
    
   

  }

  //Borrar Comentario
  const borrarComentario = async id => {

    try {
      const res = await clienteAxios.delete(`/borrar-comentario/${id}`, {
        withCredentials:true
      } )
      if(res.status === 200){
        Swal.fire(
          '',
           res.data.msg,
          'success'
        )
        setContadorComentarios(contadorComentarios-1)
       }
  
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: '',
        text: error.response.data.msg,
        icon: 'error',
      })
    }
  }

  const eliminarPost = async (postId, imagenId,usuarioId) => {
    isLoad(true)
    try {
      const result = await Swal.fire({
        title: '¿Eliminar Publicación?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#FF0083',
        cancelButtonColor: '#4d4d4d'
      });
      if (result.isConfirmed) {
        const res = await clienteAxios.delete(`/eliminar-post/${postId}`, {
         withCredentials:true,
          data: { imagenId, usuarioId }
        });
        
  
        if (res.status === 200) {
          Swal.fire(
            'Publicación Eliminada',
            'La publicación ha sido eliminada exitosamente',
            'success'
          );
          isLoad(false)
          setTimeout(()=> { navigate(-1) },2000)
        }
      } 
    } catch (e) {
      console.log(e);
      Swal.fire({
        title: '',
        text: e.response.data.msg,
        icon: 'error',
      })
    }
  }

  const editarPost = postId => navigate(`/editar-post/${postId}`)

  const handleMouseEnter = () =>  setMostrarMensaje(true);
  const handleMouseLeave = () =>  setMostrarMensaje(false);
  

  const citarComentario = (comentarioId,idUser,nickname) => { 
      console.log(comentarioId,idUser,nickname)
    setInfoRespuesta([{
      comentarioId,
      idUser,
      nickname
    }])
    setQuote(true)
  }



  const mostrarRespuestas = async(comentarioId) => {
    setShowRespuestas(!showRespuestas)
    setComentarioSeleccionado(comentarioId)

    try {
      const res = await clienteAxios.get(`/mostrar-respuestas/${comentarioId}`)
      guardarListadoRespuestas(res.data)

    } catch (e) {
      console.log(e)
    }

  }

  const borrarRespuesta = async id => {

      try {
        const res = await clienteAxios.delete(`/borrar-respuesta/${id}`)

        if(res.status === 200)
        Swal.fire(
          'Comentario Eliminado',
          'Se ha eliminado el comentario exitosamente',
          'success'
        );
        setContadorComentarios(contadorComentarios-1)
        obtenerComentarios()
      } catch (e) {
        console.log(e)
        Swal.fire({
          title: '',
          text: e.response.data.msg,
          icon: 'error',
        })
      }
  }

  const descargarImagenPost = async (postId, url) => {
    try {
      const confirmacion = await Swal.fire({
        title: '',
        text: '¿Descargar la imagen de esta publicación?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, descargar',
        cancelButtonText: 'Cancelar',
      });
  
      if (confirmacion.isConfirmed) {
    
        const res = await clienteAxios.post(`/descargar-imagen/${postId}`, { url }, {
          responseType: 'blob', // ⚠️ Indica que la respuesta es un archivo binario
        });
  
        // 2. Crear un Blob con la respuesta
        const blob = new Blob([res.data], { type: res.headers['content-type'] });
  
        // 3. Crear un enlace temporal para descargar el archivo
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
  
        // Extraer el nombre del archivo desde el header (opcional)
        const contentDisposition = res.headers['content-disposition'];
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : `imagen-${postId}.${url.split('.').pop()}`;
  
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
  
        // 4. Limpiar recursos
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(link);

      }
    } catch (e) {
      Swal.fire({
        title: '',
        text: e.response?.data?.msg || 'Error al descargar la imagen',
        icon: 'error',
      });
    }
  };

  const addFavorite = async postId => {

    if(!usuario){
      Swal.fire({
        title: 'Ocurrió un error',
        text: 'Tienes que estar logueado para realizar esta acción',
        icon: 'error',
      })
      return;
    }

    try {
      const res = await clienteAxios.post(`/agregar-favoritos/${postId}`, {data:usuario}, {
       withCredentials:true
      } )
      if(res.status === 200)
      Swal.fire(
        '',
        res.data.msg,
        'success'
      );
      if(res.data.isFavorite){
        setIsFav(true)
       }else{
        setIsFav(false)
       }
    } catch (e) {
      Swal.fire({
        title: '',
        text: e.response.data.msg,
        icon: 'error',
      })
    
    }
  }

  const handleClick = () =>  {
    setIsExpanded(!isExpanded);
    setShowLikes(false)
  }

  const cerrarVentana = () => setShowLikes(false)
 

  return (
  
        <div className="card">

                <div className="post_card" key={data.publicacion_id}>
                  <div className="picture"
                  onClick={handleClick}
                >
                  {isCharge ? 
                  <img src={data.imagen} alt={data.titulo} className="image" />
                      :
                      <div className="box_spinner">
                      <Spinner/>
                      <p>Cargando Imagen...</p>
                      </div>
                  }
           
                  {isExpanded && (
        <div className="expanded-image-container"
        >
   
     <img src={data.imagen} alt="Imagen" className="expanded-image" />
 
           
        </div>
      )}
                  </div>
                  <div className="card_informacion">
                  <div className="card_box">
                  <h1 className="card_title"> {data.titulo} </h1>
                  <p className="card_descripcion"> {data.descripcion || 
                  "El usuario no agregó una descripción"  } </p>
                  <div className="card_buttons">
                  <div className="post_count">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="#FF0083" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
                  <span className="card_count">{data.visitas} </span>
                  </div>
                  <div className="post_likes"
                  onClick={()=> darLike(data.publicacion_id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" 
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="icon icon-tabler icon-tabler-heart" 
                  width="24px" height="24px"
                  fill={clase? "#FF0083" : "none"}
                  viewBox="0 0 24 24" strokeWidth="1.2" stroke="#FF0083" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
    </svg>
                  {/* <span className="card_likes"></span> */}
                  {mostrarMensaje && <p className="aviso_likes">{
                    clase ? 'Te ha gustado este post' : '¿Dar like a este post?'
                   }</p>}
                  </div>
                  <div className="post_comments" onClick={()=>obtenerComentarios(data.publicacion_id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0062DC" viewBox="0 0 24 24"><path d="M20 2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h3v3.766L13.277 18H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14h-7.277L9 18.234V16H4V4h16v12z"/><circle cx="15" cy="10" r="2"/><circle cx="9" cy="10" r="2"/></svg>
                  <span className="card_comments">{contadorComentarios}</span>
                  </div>
                  <div className="post_download" 
                  onClick={()=> descargarImagenPost(data.publicacion_id,data.imagen)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#08964f" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 8zM4 19h16v2H4z"/></svg>
                  {/* <span className="card_comments">{data.descargas}</span> */}
                  </div>
                  <div className="post_fav" onClick={()=> addFavorite(data.publicacion_id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" 
                  className={isFav ? "isfavorite" : "notisfavorite"}
                  onMouseEnter={()=> setMostrarAvisoFav(true)}
                  onMouseLeave={()=> setMostrarAvisoFav(false)}
                  width="24" height="24" viewBox="0 0 24 24"><path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"/></svg>
                  {mostrarAvisoFav && <p className="aviso_fav">{
                    isFav ? 'Agregado a favoritos' : '¿Agregar a favoritos?'
                   }</p>}
                    <span className="card_comments">{data.contador_favoritos}</span>
                  </div>
                  </div>
                  <div className="cantidad_likes">
                  <button className="btn_megusta" onClick={()=> setShowLikes(true)}
                  > {like && `${like}`} {like > 1 ? 'Me gustas' : 'Me gusta'}</button>
                  </div>
                  <ListadoLikes clase={showLikes} 
                                postId={data.publicacion_id} 
                                cerrarVentana={cerrarVentana}/>
                  <div className="caja_comentarios" >
                      { showComments &&
                        <>
                        <div className="seccion_comentarios">
                  
                        </div>
                       { data.comentarios_count === 0 ? <p className="nothing">Sé el primero en comentar...</p>  
                       
                       :
                       <div className="comentarios_users">
                      <ul>
  {
    listadoComentarios.map(comentario => (
      <div key={comentario.comentario_id}>
      <li className="comentario_barra">
        <p>
          <span>
            <NavLink
              to={
                usuario?.id === comentario.idUser &&
                usuario?.username === comentario.username
                  ? '/mi-cuenta'
                  : `/usuario/${comentario.username}`
              }
              className="user"
            >
              <img src={comentario.avatar} className="avatar_min" alt="avatar usuario"/>
              {comentario.username}:
            </NavLink>
          </span>
          {comentario.comentario}
        </p>
        <div className="div_comment">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="quote"
            width="23"
            height="23"
            onClick={() =>
              citarComentario(
                comentario.comentario_id,
                usuario.id,
                comentario.username
              )
            }
            viewBox="0 0 24 24"
          >
            <path d="M4 18h2v4.081L11.101 18H16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2z" />
            <path d="M20 2H8c-1.103 0-2 .897-2 2h12c1.103 0 2 .897 2 2v8c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z" />
          </svg>
        
          {usuario?.id === comentario.idUser && usuario?.username === comentario.username && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => borrarComentario(comentario.comentario_id)}
              className="delete_comment"
              width="22"
              height="22"
              fill="#FF0083"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z" />
            </svg>
          )}
        </div>
      </li>
    
     
  
     {comentario.respuestas && (
  <button className="btn_res" onClick={() => mostrarRespuestas(comentario.comentario_id)}>
    {showRespuestas && comentario.comentario_id === comentarioSeleccionado ? 
     "- Ocultar Respuestas -" : `Ver Respuestas (${comentario.respuestas.split("|||").length})`}
  </button>
)}

{showRespuestas && comentarioSeleccionado === comentario.comentario_id &&
    listadoRespuestas.map((res) => (
      <li key={res.respuesta_id} className="respuesta_comentario"> 
        <p>
          <span>
            <NavLink
              to={
                usuario?.id === res.idUser &&
                usuario?.username === res.username
                  ? '/mi-cuenta'
                  : `/usuario/${res.username}`
              }
              className="user"
            >
               <img src={res.avatar} className="avatar_min" alt="avatar usuario"/>
              {res.username}:
            </NavLink>
            
          </span> 
          {res.contenido}
        </p> 
        <div className="div_comment">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="quote"
            width="23"
            height="23"
            onClick={() =>
              citarComentario(
                res.idComentario,
                usuario.id,
                res.username
              )
            }
            viewBox="0 0 24 24"
          >
            <path d="M4 18h2v4.081L11.101 18H16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2z" />
            <path d="M20 2H8c-1.103 0-2 .897-2 2h12c1.103 0 2 .897 2 2v8c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z" />
          </svg>
          {usuario?.id === res.idUser && usuario?.username === res.username && (
            <Delete
            borrarRespuesta={() => borrarRespuesta(res.respuesta_id)}
            resId={res.respuesta_id}
            />
          )}
        </div>
      </li>
    ))
  }
       
      </div>
    ))
  }
</ul>

                       </div>
                       
                       }
                      { usuario ?
                      <form
                         method="POST" 
                         action="/agregar-comentario" 
                         className="formulario"
                         onSubmit={sendComentario}>
                          <textarea name="comentario" className="comentario_input" 
                          ref={campoComentario} minLength="0" maxLength="150"
                          placeholder={quote ? `Responder a @${infoRespuesta[0]?.nickname}` : "Deja tu comentario..."}
                          onChange={leerInput}></textarea>
                          { quote &&
                      <button className="btn_cancel" onClick={()=> setQuote(false)}>Cancelar Respuesta</button>
                          }   
                        {load && <Spinner/>}
                        <input type="submit" className="btn-comentario" 
                        value={quote? "Enviar Respuesta" : "Enviar Comentario"}/>
                        </form>
                        :
                      <p className="nothing">Regístrate o Ingresa para comentar...</p>
                      }
                        </>
                      }
                 {usuario?.username && data.creador_avatar && <p className="post_by">Publicado {data?.fecha_publicacion && data.fecha_publicacion
                                                  .split(".")[0].replace("T"," a las ")} por:
                 <NavLink to={usuario?.username === data.creador_username &&
                              usuario?.id? 
            `/mi-cuenta` : `/usuario/${data.creador_username}`} className="post_url">
                 <img src={data?.creador_avatar} className="avatar_min" alt="avatar"/>
                  {data?.creador_username}</NavLink></p>}
                  {usuario?.id === data?.idUsuario && usuario?.username === data?.creador_username && 
                  <div className="button_post">
                  <button className="delete_post" 
                  onClick={()=>eliminarPost(data.publicacion_id,data.imagen,data.idUsuario)}>Eliminar</button>
                  <button className="delete_post edit" 
                  onClick={()=>editarPost(data.publicacion_id)}>Editar</button>
                       
                  </div>
                  }
                  </div>
                  </div>
              <NavLink to="/" className="close_post" onClick={()=> navigate(-1)}>
                  <Close/>
              </NavLink>
                </div>
                </div>
            
                   
    </div>
  
  )
}

export default Post;