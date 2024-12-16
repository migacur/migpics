import { useContext, useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { ContextoUsuario } from "../../context/AuthContext";

const ListadoLikes = ({ clase, postId, cerrarVentana }) => {
  const { usuario } = useContext(ContextoUsuario);
  const [listadoLikes, setListadoLikes] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 20;
  const [hayMasPaginas, setHayMasPaginas] = useState(false);

  useEffect(() => {
    if(!usuario) return;
    const mostrarLikes = async () => {
      const res = await clienteAxios.get(
        `/mostrar-likes/${postId}?pagina=${paginaActual}&elementosPorPagina=${elementosPorPagina}`,
        {
          withCredentials: true,
        }
      );
      setListadoLikes(res.data);

      const resSiguiente = await clienteAxios.get(
        `/mostrar-likes/${postId}?pagina=${
          paginaActual + 1
        }&elementosPorPagina=${elementosPorPagina}`,
        {
          withCredentials: true,
        }
      );
      setHayMasPaginas(resSiguiente.data.length > 0);
    };

    mostrarLikes();
  }, [paginaActual,postId,usuario]);

  const irAPagina = (pagina) => setPaginaActual(pagina);

  return (
    <div className={clase ? "background_likes" : "ocultar_likes"}>
      <div className={clase ? "contenedor_likes" : "ocultar_likes"}>
        <div className="likes_header">
          <p className="title">Me gusta</p>
          <button className="btn" onClick={() => cerrarVentana()}>
            X
          </button>
        </div>
        <div className="listado_likes">
          {listadoLikes.map((like) => (
            <li key={like.like_id} className="user_like">
              <NavLink to={usuario.username === like.username ? `/usuario/mi-cuenta` : `/usuario/${like.username}`} className="enlace">
                <img src={like.avatar} alt="avatar del usuario" />
                {like.username}
              </NavLink>
              <NavLink to={usuario.username === like.username ? `/usuario/mi-cuenta` : `/usuario/${like.username}`} className="perfil">
                Ir al perfil
              </NavLink>
            </li>
          ))}
          {listadoLikes.length === 0 && (
            <p className="nothing_likes">Esta publicación no tiene likes</p>
          )}
        </div>

        {listadoLikes.length > 0 && (
          <div className="button_follower">
            <button
              onClick={() => irAPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="m8.121 12 4.94-4.939-2.122-2.122L3.879 12l7.06 7.061 2.122-2.122z" />
                <path d="M17.939 4.939 10.879 12l7.06 7.061 2.122-2.122L15.121 12l4.94-4.939z" />
              </svg>
            </button>

            <button
              onClick={() => irAPagina(paginaActual + 1)}
              disabled={!hayMasPaginas}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="m13.061 4.939-2.122 2.122L15.879 12l-4.94 4.939 2.122 2.122L20.121 12z" />
                <path d="M6.061 19.061 13.121 12l-7.06-7.061-2.122 2.122L8.879 12l-4.94 4.939z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ListadoLikes.propTypes = {
  clase: PropTypes.bool,
  postId: PropTypes.number,
  cerrarVentana: PropTypes.func,
};

export default ListadoLikes;
