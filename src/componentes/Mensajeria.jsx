import { useContext, useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { ContextoUsuario } from "../../context/AuthContext";

const Mensajeria = () => {
  const { usuario, autenticarUser } = useContext(ContextoUsuario);
  const [mensajes, guardarMensajes] = useState([]);
  const [load, isLoad] = useState(false);
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const [hayMasPaginas, setHayMasPaginas] = useState(false);

  useEffect(() => {
    if (!usuario) {
      autenticarUser();
    }

    const showEnviados = async () => {
      try {
        const res = await clienteAxios.get(
          `/mostrar-mensajes/${usuario.id}?pagina=${paginaActual}&elementosPorPagina=${elementosPorPagina}`,
          {
            withCredentials: true,
          }
        );
        guardarMensajes(res.data);
        isLoad(true);

        const resSiguiente = await clienteAxios.get(
          `/mostrar-mensajes/${usuario.id}?pagina=${
            paginaActual + 1
          }&elementosPorPagina=${elementosPorPagina}`,
          {
            withCredentials: true,
          }
        );
        setHayMasPaginas(resSiguiente.data.length > 0);
      } catch (e) {
        console.log(e);
        Swal.fire({
          title: "",
          text: e.response.data.msg,
          icon: "error",
        });
      }
    };
    showEnviados();
  }, [usuario, autenticarUser, paginaActual]);

  const mostrarChat = (userId) => navigate(`/inbox/${userId}`);

  const irAPagina = (pagina) => setPaginaActual(pagina);

  if (!load) return <Spinner />;

  return (
    <div className="contenedor_mensajes">
      {mensajes.length === 0 && (
        <p className="aviso_user">No hay mensajes para mostrar</p>
      )}
      {mensajes.map((msg) => (
        <li className="listado_mensajes" key={msg.mensaje_id}>
          <p>
            <span>
              <NavLink
                to={
                  msg.user_envia === usuario.id
                    ? `/usuario/${msg.recibido_por}`
                    : `/usuario/${msg.enviado_por}`
                }
                className="link"
              >
                <img
                  src={
                    msg.user_envia === usuario.id
                      ? msg.avatar_recibe
                      : msg.avatar_envia
                  }
                  alt="avatar"
                />
                {msg.user_envia === usuario.id
                  ? msg.recibido_por
                  : msg.enviado_por}
                :
              </NavLink>
            </span>
            {msg.contenido.slice(0, 10)}
          </p>

          <div className="buttons_mensajes">
            {msg.leido === 0 && usuario.id === msg.user_recibe && (
              <p className="nuevo_mensaje"> {msg.mensaje_nuevo} </p>
            )}
            <button
              onClick={() =>
                mostrarChat(
                  msg.user_envia === usuario.id
                    ? msg.user_recibe
                    : msg.user_envia
                )
              }
              className="go_chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#fff"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z" />
              </svg>
              Ver mensajes
            </button>
          </div>
        </li>
      ))}
      <div className="buttons_page">
        <button
          onClick={() => irAPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="button_page"
        >
          Anterior
        </button>
        <span className="page">Página {paginaActual}</span>
        <button
          onClick={() => irAPagina(paginaActual + 1)}
          className="button_page"
          disabled={!hayMasPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Mensajeria;
