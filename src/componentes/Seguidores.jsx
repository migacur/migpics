import { useContext, useEffect, useState } from "react";
import clienteAxios from "./../../config/axios";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { ContextoUsuario } from "../../context/AuthContext";

const Seguidores = ({ clase, idUsuario, username, cerrarVentana }) => {
  const { usuario, autenticarUser } = useContext(ContextoUsuario);
  const [data, guardarData] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 20;
  const [hayMasPaginas, setHayMasPaginas] = useState(false);

  useEffect(() => {
    const showFollowers = async () => {
      if (!usuario) {
        autenticarUser();
      }

      try {
        const res = await clienteAxios.get(
          `/mostrar-seguidores/${idUsuario}?pagina=${paginaActual}&elementosPorPagina=${elementosPorPagina}`,
          {
            withCredentials: true,
          }
        );
        guardarData(res.data);
      
        // Verificar si hay más datos
        const resSiguiente = await clienteAxios.get(
          `/mostrar-seguidores/${idUsuario}?pagina=${
            paginaActual + 1
          }&elementosPorPagina=${elementosPorPagina}`,
          {
            withCredentials: true,
          }
        );
        setHayMasPaginas(resSiguiente.data.length > 0);
      } catch (e) {
        console.log(e);
      }
    };
    showFollowers();
  }, [autenticarUser, idUsuario, paginaActual, usuario]);

  const irAPagina = (pagina) => setPaginaActual(pagina);

  return (
    <div className={clase ? "background_likes" : "ocultar_likes"}>
      <div className={clase ? "contenedor_likes" : "ocultar_likes"}>
        <div className="seguidos_title">
          <h1>Seguidores de {username} </h1>
          <button className="button_seguido" onClick={() => cerrarVentana()}>
            X
          </button>
        </div>
        {data.map((follower) => (
          <li key={follower.seguidor_id} className="seguidos">
            <div className="info_seguido">
              <img src={follower.avatar} alt="avatar usuario" />
              <NavLink to={`/usuario/${follower.username}`} className="enlace">
                {" "}
                {follower.username}{" "}
              </NavLink>
            </div>
            <NavLink
              to={
                usuario.id === follower.seguidor_id
                  ? "/mi-cuenta"
                  : `/usuario/${follower.username}`
              }
              className="link_user"
            >
              Ir al perfil
            </NavLink>
          </li>
        ))}
        {data.length > 0 && (
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

Seguidores.propTypes = {
  clase: PropTypes.bool,
  idUsuario: PropTypes.number,
  username: PropTypes.string,
  cerrarVentana: PropTypes.func,
};

export default Seguidores;
