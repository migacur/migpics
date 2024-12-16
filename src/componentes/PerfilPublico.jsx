import { useContext, useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import Swal from "sweetalert2";
import Seguidos from "./Seguidos";
import Seguidores from "./Seguidores";
import { ContextoUsuario } from "../../context/AuthContext";

const PerfilPublico = () => {
  const { autenticarUser, usuario } = useContext(ContextoUsuario);
  const navigate = useNavigate();
  const { username } = useParams();
  const [data, guardarData] = useState([]);
  const [error, mostrarError] = useState(false);
  const [profile, setProfile] = useState(false);
  const [verifyFollow, setVerifyFollow] = useState(false);
  const [mostrarSeguidos, setMostrarSeguidos] = useState(false);
  const [mostrarSeguidores, setMostrarSeguidores] = useState(false);

  useEffect(() => {
    if (!usuario) {
      autenticarUser();
    }
  }, [usuario, autenticarUser]);

  useEffect(() => {
    if (mostrarSeguidos) setMostrarSeguidos(false);
    if (mostrarSeguidores) setMostrarSeguidores(false);

    const datosUsuario = async () => {
      try {
        const res = await clienteAxios.get(`/usuario/${username}`, {
          withCredentials: true,
        });
        guardarData(res.data);
        setProfile(true);
        setVerifyFollow(res.data.lo_sigue);
      } catch (e) {
        mostrarError(true);
        console.log(e);
        Swal.fire({
          title: 'Ha ocurrido un error',
          text: e.response.data.msg,
          icon: 'error',
        })
        navigate("/");
      }
    };
    datosUsuario();
  }, [navigate, username]);

  const rolUsuario = (rol) => {
    let rango = "";
    if (rol === 1) rango = "Administrador";
    if (rol === 2) rango = "Moderador";
    if (rol === 3) rango = "User";
    return rango;
  };

  if (!profile && !error) return <Spinner />;

  const seguirUsuario = async (userId) => {
    try {
      const res = await clienteAxios.post(`/seguir-usuario/${userId}`, null, {
        withCredentials: true,
      });
      if (res.status === 200) {
        Swal.fire("", "Ahora sigues a este usuario", "success");

        if (res.data.isFollow) {
          setVerifyFollow(true);
        }
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        title: "Ha ocurrido un error",
        text: e.response.data.msg,
        icon: "error",
      });
    }
  };

  const deseguirUsuario = async (userId) => {
    try {
      const res = await clienteAxios.delete(`/deseguir-usuario/${userId}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        Swal.fire("", "Ya no sigues a este usuario", "success");

        if (!res.data.isFollow) {
          setVerifyFollow(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const showSeguidores = () => {
    if (data.cantidad_seguidores === 0) return;

    setMostrarSeguidos(false);
    setMostrarSeguidores(true);
  };

  const mostrarUserSeguidos = () => {
    if (data.cantidad_seguidos === 0) return;

    setMostrarSeguidores(false);
    setMostrarSeguidos(true);
  };

  const cerrarVentana = () => {
    if (data.cantidad_seguidores === 0) return;

    setMostrarSeguidos(false);
    setMostrarSeguidores(false);
  };

  return (
    <>
      <div className="header_profile">
        <div className="div_msg">
          <NavLink to={`/enviar-mensaje/${data.user_id}`} className="enviar_mp">
            Enviar MP
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="msg_icon"
              width="10px"
              height="10px"
              viewBox="0 0 24 24"
            >
              <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z" />
            </svg>
          </NavLink>
        </div>
        {mostrarSeguidos && (
          <Seguidos
            clase={mostrarSeguidos}
            idUsuario={data.user_id}
            username={data.username}
            cerrarVentana={cerrarVentana}
          />
        )}
        {mostrarSeguidores && (
          <Seguidores
            clase={mostrarSeguidores}
            idUsuario={data.user_id}
            username={data.username}
            cerrarVentana={cerrarVentana}
          />
        )}

        <div className="header_avatar">
          <img src={data.avatar} alt="avatar" />
        </div>

        <div className="header_info_public">
          <h1 className="username"> {data.username} </h1>
          <p className="range">{rolUsuario(data.idRol)} </p>
          <button
            className={verifyFollow ? "btn_follow followed" : "btn_follow"}
            onClick={
              verifyFollow
                ? () => deseguirUsuario(data.user_id)
                : () => seguirUsuario(data.user_id)
            }
          >
            {verifyFollow ? "Seguido" : "Seguir"}
            {verifyFollow ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path d="M8 12.052c1.995 0 3.5-1.505 3.5-3.5s-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5 1.505 3.5 3.5 3.5zM9 13H7c-2.757 0-5 2.243-5 5v1h12v-1c0-2.757-2.243-5-5-5zm11.294-4.708-4.3 4.292-1.292-1.292-1.414 1.414 2.706 2.704 5.712-5.702z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path d="M4.5 8.552c0 1.995 1.505 3.5 3.5 3.5s3.5-1.505 3.5-3.5-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5zM19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2z" />
              </svg>
            )}
          </button>

          <p className="bio">
            {" "}
            {data.bio ? data.bio : "Este usuario no tiene biografía"}{" "}
          </p>
        </div>
        <div className="header_info">
          <NavLink to={`/usuario/${data.username}/posts`} className="link">
            <div className="user_post">
              <div className="barra_info">
                <div className="info_svg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 22h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zm7-18 5 5h-5V4zm-4.5 7a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 8.5 11zm.5 5 1.597 1.363L13 13l4 6H7l2-3z" />
                  </svg>
                  <p>Publicaciones:</p>
                </div>
                <div className="info_user">{data.cantidad_publicaciones}</div>
              </div>
            </div>
          </NavLink>

          <div className="user_comments" onClick={() => showSeguidores()}>
            <div className="barra_info">
              <div className="info_svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 8a3.91 3.91 0 0 0 4 4 3.91 3.91 0 0 0 4-4 3.91 3.91 0 0 0-4-4 3.91 3.91 0 0 0-4 4zm6 0a1.91 1.91 0 0 1-2 2 1.91 1.91 0 0 1-2-2 1.91 1.91 0 0 1 2-2 1.91 1.91 0 0 1 2 2zM4 18a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1h2v-1a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v1h2z" />
                </svg>
                <p>Seguidores:</p>
              </div>
              <div className="info_user">{data.cantidad_seguidores}</div>
            </div>
          </div>

          <div className="user_comments" onClick={() => mostrarUserSeguidos()}>
            <div className="barra_info">
              <div className="info_svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.29 8.29 16 12.58l-1.3-1.29-1.41 1.42 2.7 2.7 5.72-5.7zM4 8a3.91 3.91 0 0 0 4 4 3.91 3.91 0 0 0 4-4 3.91 3.91 0 0 0-4-4 3.91 3.91 0 0 0-4 4zm6 0a1.91 1.91 0 0 1-2 2 1.91 1.91 0 0 1-2-2 1.91 1.91 0 0 1 2-2 1.91 1.91 0 0 1 2 2zM4 18a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1h2v-1a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v1h2z" />
                </svg>
                <p>Seguidos:</p>
              </div>
              <div className="info_user">{data.cantidad_seguidos}</div>
            </div>
          </div>

          <div className="user_comments">
            <div className="barra_info">
              <div className="info_svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z" />
                </svg>
                <p>Likes:</p>
              </div>
              <div className="info_user">{data.cantidad_likes}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfilPublico;
