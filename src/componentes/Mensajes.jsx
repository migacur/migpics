import { useEffect, useState } from "react"
import clienteAxios from "../../config/axios"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"



const Mensajes = () => {

    const { userId } = useParams()
    const navigate = useNavigate()
    const [usuario,guardarUsuario]=useState([])
    const [mensaje,setMensaje]=useState('') 
    const [error,setError]=useState(false)
  
    
    useEffect(() => {
      const dataUsuario = async() => {
        try {
          const res = await clienteAxios.get(`/usuario-mensaje/${userId}`,{
            withCredentials:true
          })
          guardarUsuario(res.data)
        } catch (e) {
          console.log(e)
        }
      }
      dataUsuario()
    
    }, [userId]); 

    
    const leerMensaje = e => setMensaje(e.target.value)

    const enviarMensaje = async e => {
        e.preventDefault()

        if(!mensaje.length){
            setError(true)
            return;
        } 

        try {
            const res = await clienteAxios.post(`/enviar-mensaje/${userId}`,{
                mensaje,
                username: usuario.username
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
        setError(false)
        

    }



  return (
    <>
      <h1 className="bandeja_title">Enviar mensaje</h1>
    
    <div className="bandeja">
            <div className="info_usuario">
            <div className="avatar_usuario">
                <img src={usuario.avatar} alt="avatar"/>
            </div>
            <div className="usuario">
                <p>Enviar mensaje a  
                      <NavLink to={`/usuario/${usuario.username}`} className="link">
                        <span>{usuario.username}</span>
                      </NavLink>
            </p>
            </div>
            </div>
            <form
             method="POST" 
             action="/enviar-mensaje" 
             onSubmit={enviarMensaje}>
            
                <textarea className="msg_input" 
                placeholder={`Enviar mensaje a @${usuario.username}`}
                onChange={leerMensaje}>

                </textarea>
                {error && <p className="aviso_error">No puedes enviar el mensaje en blanco</p>}
                <input type="submit" 
                value="Enviar Mensaje" 
                className="btn_msg"/>
            </form>
           
    </div>
    </>
  )
}

export default Mensajes