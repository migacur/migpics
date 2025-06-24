import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ContextoUsuario } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { PostContexto } from "../../context/PostContext";
import InputSearch from "./InputSearch";
import FormLogin from "./FormLogin";
import FormRegister from "./FormRegister";
import { io } from "socket.io-client";
import clienteAxios from "../../config/axios";

const Header = () => {
  const { mostrarBusqueda } = useContext(PostContexto);
  const [busqueda, guardarBusqueda] = useState("");
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const navigate = useNavigate();
  let menuAnimated = useRef();
  let menuRef = useRef();
  const input = useRef();
  const [countNotifications, setCountNotifications] = useState(0);
  const { usuario, logoutUser } = useContext(ContextoUsuario);


useEffect(() => {
  if (!usuario?.id) return;

  // 1. Crear la conexión socket con parámetros de conexión mejorados
  const socket = io('https://migpics-backend.onrender.com', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    withCredentials: true,
    extraHeaders: {
      "Access-Control-Allow-Origin": "https://migpics.onrender.com" // Tu frontend
    }
  });

  // 2. Eventos de depuración (IMPORTANTES)
  socket.on('connect', () => {
    console.log('🟢 CONECTADO a Socket.io');
    socket.emit('join_user_room', usuario.id, (ack) => {
      console.log(`🛜 Unido a sala user_${usuario.id}`, ack);
    });
  });

  socket.on('disconnect', () => {
    console.log('🔴 DESCONECTADO de Socket.io');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });

  // 3. Cargar contador inicial
  const cargarContador = async () => {
    try {
      const res = await clienteAxios.get(`/cargar-notificaciones/${usuario.id}`);
      setCountNotifications(res.data.unread_count);
      console.log('📊 Contador inicial:', res.data.unread_count);
    } catch (error) {
      console.error("Error cargando contador:", error);
    }
  };
  
  // 4. Escuchar actualizaciones del contador
  const handleContador = (data) => {
    console.log('🔔 actualizar_contador recibido!', data);
    setCountNotifications(data.unread_count);
  };
  
  socket.on('actualizar_contador', handleContador);

  // 5. Solicitar el contador inicial después de conectar
  socket.on('connect', cargarContador);

  // 6. Limpieza PROFESIONAL
  return () => {
    console.log('🧹 Limpiando socket...');
    socket.off('actualizar_contador', handleContador);
    socket.off('connect', cargarContador);
    socket.disconnect();
  };
}, [usuario]);
console.log(countNotifications)
  const leerBusqueda = (e) => guardarBusqueda(e.target.value);

  const enviarBusqueda = (e) => {
    e.preventDefault();
    let palabra = busqueda.trim();
    if (!palabra.length || palabra.length < 3) {
      Swal.fire({
        title: "Error en la búsqueda",
        text: "Debes ingresar al menos 3 caracteres",
        icon: "error",
      });
      input.current.value = "";
      return;
    }
    guardarBusqueda("");
    input.current.value = "";
    mostrarBusqueda(palabra);
    navigate(`/buscar/${palabra}`);
  };

  const changeMenu = () => {
    if (menuRef.current.classList.contains("menu-inactive")) {
      menuRef.current.classList.add("menu-active");
      menuRef.current.classList.remove("menu-inactive");
      menuAnimated.current.classList.add("active-anim");
    } else {
      menuRef.current.classList.remove("menu-active");
      menuRef.current.classList.add("menu-inactive");
      menuAnimated.current.classList.remove("active-anim");
    }
  };

  const closeMenu = () => {
    menuRef.current.classList.add("menu-inactive");
    menuAnimated.current.classList.remove("active-anim");
  };

  const showFormLogin = () => {
    if (mostrarRegistro) setMostrarRegistro(false);
    setMostrarLogin(!mostrarLogin);
  };

  const showFormRegister = () => {
    if (mostrarLogin) setMostrarLogin(false);
    setMostrarRegistro(!mostrarRegistro);
  };

  const closeForm = () => {
    if (mostrarLogin) setMostrarLogin(false);
    if (mostrarRegistro) setMostrarRegistro(false);
  };

  return (
    <header className="header">
      <nav className="header_nav">
        <div className="header_logo">
          <h1>MigPics!</h1>
          <div className="nav-buttons">
            <NavLink to="/" className="enlace_menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="25"
                fill="#fff"
                viewBox="0 0 24 24"
              >
                <path d="m21.743 12.331-9-10c-.379-.422-1.107-.422-1.486 0l-9 10a.998.998 0 0 0-.17 1.076c.16.361.518.593.913.593h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a.998.998 0 0 0 .743-1.669z" />
              </svg>
            </NavLink>
            <NavLink to="/tendencias" className="enlace_menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="26"
                fill="#fff"
                viewBox="0 0 24 24"
              >
                <path d="M16.5 8c0 1.5-.5 3.5-2.9 4.3.7-1.7.8-3.4.3-5-.7-2.1-3-3.7-4.6-4.6-.4-.3-1.1.1-1 .7 0 1.1-.3 2.7-2 4.4C4.1 10 3 12.3 3 14.5 3 17.4 5 21 9 21c-4-4-1-7.5-1-7.5.8 5.9 5 7.5 7 7.5 1.7 0 5-1.2 5-6.4 0-3.1-1.3-5.5-2.4-6.9-.3-.5-1-.2-1.1.3" />
              </svg>
            </NavLink>
            {usuario && (
              <NavLink to="/post-seguidos" className="enlace_seguidos">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="33"
                  fill="#fff"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 12.052c1.995 0 3.5-1.505 3.5-3.5s-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5 1.505 3.5 3.5 3.5zM9 13H7c-2.757 0-5 2.243-5 5v1h12v-1c0-2.757-2.243-5-5-5zm11.294-4.708-4.3 4.292-1.292-1.292-1.414 1.414 2.706 2.704 5.712-5.702z" />
                </svg>
              </NavLink>
            )}
          </div>
          <InputSearch
            enviarBusqueda={enviarBusqueda}
            input={input}
            leerBusqueda={leerBusqueda}
            claseOpcional={null}
          />
        </div>

        <div className="barra">
          <div className="barra-content">
            <button
              onClick={changeMenu}
              ref={menuAnimated}
              type="button"
              className="hamburger"
            >
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </button>
          </div>
        </div>
        <div className="menu_normal">
          {usuario ? (
            <>
              <NavLink to="/agregar-post" className="link_menu">
                + Subir
              </NavLink>
              <NavLink to="/mi-cuenta" className="link_menu">
                Mi Perfil
              </NavLink>
              <NavLink to="/mensajes" className="link_menu link_msg">
               { countNotifications > 0 && 
                <div className="notificacion">
                    <p>{ countNotifications }</p>
                </div>
                }
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  className="message_icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z" />
                </svg>
              </NavLink>
              <NavLink to="/" className="link_menu" onClick={logoutUser}>
                Salir
              </NavLink>
            </>
          ) : (
            <>
              <button className="link_menu" onClick={showFormLogin}>
                Ingresar
              </button>
              <button className="link_menu" onClick={showFormRegister}>
                Registrarme
              </button>
              {mostrarLogin && (
                <FormLogin
                  closeForm={closeForm}
                  showFormRegister={showFormRegister}
                />
              )}
              {mostrarRegistro && (
                <FormRegister
                  closeForm={closeForm}
                  showFormLogin={showFormLogin}
                />
              )}
            </>
          )}
        </div>
        <div
          className="barra_menu menu-inactive"
          ref={menuRef}
          onClick={closeMenu}
        >
          {usuario ? (
            <>
              <NavLink to="/mi-cuenta" className="button_user" name="busqueda">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z" />
                </svg>
                Mi perfil
              </NavLink>
              <NavLink to="/agregar-post" className="button_user">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 22h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zm7-18 5 5h-5V4zM8 14h3v-3h2v3h3v2h-3v3h-2v-3H8v-2z" />
                </svg>
                Publicar
              </NavLink>
              <NavLink to="/mensajes" className="button_user">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z" />
                </svg>
                Mensajes
              </NavLink>
              <NavLink to="/" className="button_user" onClick={logoutUser}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 12.052c1.995 0 3.5-1.505 3.5-3.5s-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5 1.505 3.5 3.5 3.5zM9 13H7c-2.757 0-5 2.243-5 5v1h12v-1c0-2.757-2.243-5-5-5zm11.293-4.707L18 10.586l-2.293-2.293-1.414 1.414 2.292 2.292-2.293 2.293 1.414 1.414 2.293-2.293 2.294 2.294 1.414-1.414L19.414 12l2.293-2.293z" />
                </svg>
                Salir
              </NavLink>
            </>
          ) : (
            <>
              <button className="button_user" onClick={showFormLogin}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z" />
                </svg>
                Ingresar
              </button>
              <button className="button_user" onClick={showFormRegister}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.5 8.552c0 1.995 1.505 3.5 3.5 3.5s3.5-1.505 3.5-3.5-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5zM19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2z" />
                </svg>
                Registrarme
              </button>
            </>
          )}
        </div>
        {mostrarLogin && (
          <FormLogin
            closeForm={closeForm}
            showFormRegister={showFormRegister}
          />
        )}
        {mostrarRegistro && (
          <FormRegister closeForm={closeForm} showFormLogin={showFormLogin} />
        )}
      </nav>
    </header>
  );
};

export default Header;
