import { NavLink, useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import clienteAxios from "../../config/axios"
import { useContext, useEffect, useState } from "react"
import { ContextoUsuario } from "../../context/AuthContext"

const Inbox = () => {

    const navigate = useNavigate()
    const { userId } = useParams()
    const { autenticarUser,usuario } = useContext(ContextoUsuario)
    const [chat,guardarChat]=useState([])
    const [mensaje,setMensaje]=useState('')
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;
    const [hayMasPaginas, setHayMasPaginas] = useState(false); 

  

    useEffect(() => {

        if(!usuario){
          autenticarUser()
        }

        const mostrarInbox = async() => {
          try {
              const res = await clienteAxios.get(`/mostrar-chat/${userId}?pagina=${paginaActual}&elementosPorPagina=${elementosPorPagina}`,{
                 withCredentials:true
               })
               guardarChat(res.data)
  
                // Verificar si hay más datos
      const resSiguiente = await clienteAxios.get(`/mostrar-chat/${userId}?pagina=${paginaActual + 1}&elementosPorPagina=${elementosPorPagina}`,
      {
       withCredentials:true
      });
      setHayMasPaginas(resSiguiente.data.length > 0);
      
         } catch (e) {
           console.log(e)
           Swal.fire({
               title: '',
               text: e.res.data.msg,
               icon: 'error',
             })
         }
  
      }
        mostrarInbox()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[usuario,autenticarUser,paginaActual])

    const leerMensaje = e => setMensaje(e.target.value)

    const enviarMensaje = async e => {
      e.preventDefault()

      if(!mensaje.length){
          return;
      } 

      try {
          const res = await clienteAxios.post(`/enviar-mensaje/${userId}`,{
              mensaje
          },{
              withCredentials:true
            });
          
          if(res.status === 200) {
              Swal.fire(
                '',
                res.data.msg,
                'success'
              )  
          }
          navigate("/mensajes") 
      } catch (e) {
          console.log(e)
          Swal.fire({
              title: '',
              text: e.response.data.msg,
              icon: 'error',
            })
      }
      

  }

  const eliminarMensaje = async(mensajeId) => {
        try {
            const res = await clienteAxios.delete(`/eliminar-mensaje/${mensajeId}`,{
            withCredentials:true
            })
            if(res.status === 200) {
              Swal.fire(
                '',
                res.data.msg,
                'success'
              )  
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

  const irAPagina = (pagina) => setPaginaActual(pagina)


  return (
    <>
      <h1 className="bandeja_title">Bandeja de mensajes</h1>
    <div className="listado_mensajes_user">
        { chat.map(msg => (
            <li key={msg.mensaje_id} className="listado_usuario_msg">
              <div className="content_msg">
              {usuario.id === msg.user_envia ? <span className="link your">
              <img src={msg.avatar} alt="avatar"/>  
                Tú:</span> :
              <NavLink to={`/usuario/${msg.enviado_por}`} className="link"> 
              <img src={msg.avatar} alt="avatar"/>            
              {msg.enviado_por}: 
              </NavLink>
            }
              <span> {msg.contenido} </span>
              </div>
              <div className="delete_msg">
              <small> {msg.fecha_enviado.split(".")[0].replace("T"," a las ")} </small>
    {usuario.id === msg.user_envia &&
           <svg
    xmlns="http://www.w3.org/2000/svg"
    onClick={()=> eliminarMensaje(msg.mensaje_id)}
    width="22"
    height="22"
    fill="#FF0083"
    viewBox="0 0 24 24"
      >
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z" />
      </svg>
         }
              </div>

            </li>
        ))

        }

<div className="buttons_message">
      <button onClick={() => irAPagina(paginaActual - 1)} 
    disabled={paginaActual === 1}
    className="button_message"> Anterior </button>
      <button onClick={() => irAPagina(paginaActual + 1)}
      className="button_message" disabled={!hayMasPaginas}>Siguiente</button>
    </div>

           <form
             method="POST" 
             action="/enviar-mensaje" 
             onSubmit={enviarMensaje}>
                <textarea className="msg_input group_msg" 
                placeholder={usuario?.id === chat[0]?.user_envia && 
                  `Enviar mensaje a @${chat[0]?.recibido_por}` || null}
                onChange={leerMensaje}>

                </textarea>
                <input type="submit" 
                value="Enviar Mensaje" 
                className="btn_msg"
                />
            </form>

    </div>
 
    </>
  )
}

export default Inbox