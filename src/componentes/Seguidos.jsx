import { useContext, useEffect, useState } from "react"
import clienteAxios from "../../config/axios"
import { NavLink } from "react-router-dom"
import PropTypes from 'prop-types';
import { ContextoUsuario } from "../../context/AuthContext";

const Seguidos = ({clase,idUsuario,username,cerrarVentana}) => {

  const { autenticarUser,usuario } = useContext(ContextoUsuario)
    const [seguidos,guardarSeguidos]=useState([])
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 20;
    const [hayMasPaginas, setHayMasPaginas] = useState(false);

  
    useEffect(() => {

      if(!usuario){
        autenticarUser()
      }

      const showSeguidos = async() => {
        try {
            const res = await clienteAxios.get(`/mostrar-seguidos/${idUsuario}?pagina=${paginaActual}&elementosPorPagina=${elementosPorPagina}`,{
              withCredentials:true
              } )
            guardarSeguidos(res.data)
           
          // Verificar si hay más datos
          const resSiguiente = await clienteAxios.get(`/mostrar-seguidos/${idUsuario}?pagina=${paginaActual + 1}&elementosPorPagina=${elementosPorPagina}`,
          {
            withCredentials:true
          });
          setHayMasPaginas(resSiguiente.data.length > 0);
  
        } catch (e) {
            console.log(e)
        }
    }
      showSeguidos()
    },[paginaActual,idUsuario,usuario,autenticarUser])
    

    
    const irAPagina = (pagina) => {
      setPaginaActual(pagina);
    };
   
  return (
    <div className={clase ? "background_likes" : "ocultar_likes"}>
    <div className={clase ? "contenedor_likes" : "ocultar_likes"}>
        <div className="seguidos_title">
          <h1>Usuarios que sigue {username} </h1>
          <button className="button_seguido" onClick={()=> cerrarVentana()}>X</button>
        </div>
        { seguidos.map(seguido => (
          <li key={seguido.followed_id} className="seguidos"> 
          <div className="info_seguido">
          <img src={seguido.avatar} alt="avatar usuario"/>
          <NavLink to={`/usuario/${seguido.username}`} className="enlace"> {seguido.username} </NavLink>
          </div>
          <NavLink to={usuario.id === seguido.followed_id ? '/mi-cuenta' : `/usuario/${seguido.username}`} className="link_user">
                    Ir al perfil
          </NavLink>
          </li>
        ))

        }
      
        { seguidos.length > 0 &&
  <div className="button_follower">
  <button onClick={() => irAPagina(paginaActual - 1)} 
disabled={paginaActual === 1}>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m8.121 12 4.94-4.939-2.122-2.122L3.879 12l7.06 7.061 2.122-2.122z"/><path d="M17.939 4.939 10.879 12l7.06 7.061 2.122-2.122L15.121 12l4.94-4.939z"/></svg>
</button>

<button onClick={() => irAPagina(paginaActual + 1)}
disabled={!hayMasPaginas}>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
viewBox="0 0 24 24"><path d="m13.061 4.939-2.122 2.122L15.879 12l-4.94 4.939 2.122 2.122L20.121 12z"/><path d="M6.061 19.061 13.121 12l-7.06-7.061-2.122 2.122L8.879 12l-4.94 4.939z"/></svg>
</button>
</div>
}

    </div>
    </div>
  )
}

Seguidos.propTypes = {
  clase: PropTypes.bool,
  idUsuario: PropTypes.number,
  username: PropTypes.string,
  cerrarVentana: PropTypes.func
};

export default Seguidos