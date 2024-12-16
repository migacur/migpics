import { NavLink, useNavigate } from "react-router-dom"
import InputSearch from "./InputSearch"
import Swal from "sweetalert2"
import { useContext, useRef, useState } from "react"
import { PostContexto } from "../../context/PostContext"

const Footer = () => {

  const navigate = useNavigate()
  const { mostrarBusqueda } = useContext(PostContexto)
  const [busqueda,guardarBusqueda]=useState('')
  const input = useRef()

  const leerBusqueda = e => guardarBusqueda(e.target.value)

const enviarBusqueda = e => {
  e.preventDefault()
  let palabra = busqueda.trim();
  if(!palabra.length || palabra.length < 3){
    Swal.fire({
      title: 'Error en la búsqueda',
      text: 'Debes ingresar al menos 3 caracteres',
      icon: 'error',
  })
  input.current.value = ''
  return;  
} 
  guardarBusqueda('')
  input.current.value = ''
  mostrarBusqueda(palabra)
  navigate(`/buscar/${palabra}`)

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

  return (
    <footer className="footer">
       <InputSearch
      enviarBusqueda={enviarBusqueda}
      input={input}
      leerBusqueda={leerBusqueda}
      claseOpcional="footer_search"
      />
      <div className="footer_div">
        <div className="footer_info">
          <div className="footer_info_users">
          <h3 className="footer_title">Top Usuarios</h3>
          <NavLink to="/usuario-top-post" className="footer_link">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#FF0083" viewBox="0 0 24 24"><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"/></svg>
            Usuarios con más publicaciones</NavLink>
          <NavLink to="/usario-top-likes" className="footer_link">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#FF0083" viewBox="0 0 24 24"><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"/></svg>
            Usuarios con más likes</NavLink>
          </div>
         
          <div className="footer_info_post">
            <h3 className="footer_title">Top Post</h3>
            <NavLink to="/top-post-likes" className="footer_link">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#FF0083" viewBox="0 0 24 24"><path d="M19.999 4h-16c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm-13.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5.5 10h-7l4-5 1.5 2 3-4 5.5 7h-7z"/></svg>
            Publicaciones con más likes
              </NavLink>
            <NavLink to="/top-post-comentarios" className="footer_link">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#FF0083" viewBox="0 0 24 24"><path d="M19.999 4h-16c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm-13.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5.5 10h-7l4-5 1.5 2 3-4 5.5 7h-7z"/></svg>
              Publicaciones con más comentarios</NavLink>
          </div>
        </div>
        
        </div>
        <div className="footer_copyright">
        <span>Página web realizada por Miguel Acurero &copy; 2023</span>
        </div>
    </footer>
  )
}

export default Footer