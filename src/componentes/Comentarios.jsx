import { useContext, useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "./Spinner";
import { ContextoUsuario } from "../../context/AuthContext";

const Comentarios = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { autenticarUser, usuario } = useContext(ContextoUsuario);
  const [comentarios, guardarComentarios] = useState([]);
  const [respuestas, guardarRespuestas] = useState([]);
  const [data, cargarComentarios] = useState(false);
  const [showComments, setshowComments] = useState(false);
  const [paginaActualCom, setPaginaActualCom] = useState(1);
  const [paginaActualRes, setPaginaActualRes] = useState(1);
  const elementosPorPagina = 10;
  const [hayMasPaginasCom, hayMasPaginasComentarios] = useState(false);
  const [hayMasPaginasRes, hayMasPaginasRespuestas] = useState(false);
  const [cargar, setCargar] = useState(false);

  useEffect(() => {
    if (!usuario) {
      const verificarUsuario = async () => {
        const autenticado = await autenticarUser();
        return autenticado ? autenticarUser() : navigate("/unauthorized");
      };
      verificarUsuario();
    }
  }, [usuario, autenticarUser, navigate]);

  useEffect(() => {
    mostrarComentarios();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaActualCom, paginaActualRes, cargar]);

  const mostrarComentarios = async () => {
    if (setshowComments) {
      try {
        const res = await clienteAxios.get(
          `/comentarios/${username}?pagina=${paginaActualRes}&elementosPorPagina=${elementosPorPagina}`,
          {
            withCredentials: true,
          }
        );
        guardarRespuestas(res.data.respuestas);
        cargarComentarios(true);

        // Verificar si hay más datos
        const moraPagesRes = await clienteAxios.get(
          `/comentarios/${username}?pagina=${
            paginaActualRes + 1
          }&elementosPorPagina=${elementosPorPagina}`,
          {
            withCredentials: true,
          }
        );
        hayMasPaginasRespuestas(moraPagesRes.data.respuestas.length > 0);
      } catch (e) {
        console.log(e);
        Swal.fire({
          title: "",
          text: e.response.data.msg,
          icon: "error",
        });
        return navigate("/unauthorized")
      }
    }

    // Mostrar Comentarios
    try {
      const res = await clienteAxios.get(
        `/comentarios/${username}?pagina=${paginaActualCom}&elementosPorPagina=${elementosPorPagina}`,
        {
          withCredentials: true,
        }
      );
      guardarComentarios(res.data.comentarios);
      //  guardarRespuestas(res.data.respuestas)
      cargarComentarios(true);

      // Verificar si hay más datos
      const morePagesCom = await clienteAxios.get(
        `/comentarios/${username}?pagina=${
          paginaActualCom + 1
        }&elementosPorPagina=${elementosPorPagina}`,
        {
          withCredentials: true,
        }
      );
      hayMasPaginasComentarios(morePagesCom.data.comentarios.length > 0);
    } catch (error) {
      console.log(error);
    }
  };

  const cambiarComentarios = () => setshowComments(false);

  const cambiarRespuestas = () => setshowComments(true);

  const borrarComentario = async (id) => {
    try {
      const res = await clienteAxios.delete(`/borrar-comentario/${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        Swal.fire("", res.data.msg, "success");
      }
      setCargar(!cargar);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "",
        text: error.response.data.msg,
        icon: "error",
      });
    }
  };

  const borrarRespuesta = async (id) => {
    try {
      const res = await clienteAxios.delete(`/borrar-respuesta/${id}`);

      if (res.status === 200)
        Swal.fire(
          "Comentario Eliminado",
          "Se ha eliminado el comentario exitosamente",
          "success"
        );

      setCargar(!cargar);
    } catch (e) {
      console.log(e);
      Swal.fire({
        title: "",
        text: e.response.data.msg,
        icon: "error",
      });
    }
  };

  if (!data) return <Spinner />;

  const cambiarPaginaComentarios = (pagina) => setPaginaActualCom(pagina);
  const cambiarPaginaRespuestas = (pagina) => setPaginaActualRes(pagina);

  return (
    <div className="listado_comentarios">
      <div className="show-comentarios">
        <h1>Tus Comentarios</h1>
        <button
          onClick={() => cambiarComentarios()}
          className={showComments ? "btn_list" : "btn_list active_btn"}
        >
          Comentarios
        </button>
        <button
          onClick={() => cambiarRespuestas()}
          className={showComments ? "btn_list active_btn" : "btn_list"}
        >
          Has respondido
        </button>
      </div>

      <ul className="lista">
        {!showComments &&
          comentarios.map((comentario) => (
            <li key={comentario.comentario_id} className="post_comentados">
              <div>
                <p>
                  <span>
                    <NavLink
                      to={`/post/${comentario.publicacion_id}`}
                      className="link"
                    >
                      {comentario.titulo}:
                    </NavLink>
                  </span>
                  {comentario.texto}{" "}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => borrarComentario(comentario.comentario_id)}
                width="22"
                height="22"
                fill="#FF0083"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z" />
              </svg>
            </li>
          ))}

        {showComments &&
          respuestas.map((res) => (
            <li key={res.respuesta_id} className="post_respuestas">
              <div className="res_bar">
                <span>
                  {" "}
                  <NavLink
                    to={`/post/${res.publicacion_id}`}
                    className="link_res"
                  >
                    {res.titulo}:
                  </NavLink>
                </span>
                {res.username_respuesta === res.comentario_de ? (
                  <span className="link_res user">Te respondiste a ti:</span>
                ) : (
                  <NavLink
                    to={`/usuario/${res.comentario_de}`}
                    className="link_res user"
                  >
                    @{res.comentario_de}:
                  </NavLink>
                )}
                <p className="contenido"> {res.contenido} </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="btn_user"
                onClick={() => borrarRespuesta(res.respuesta_id)}
                width="22"
                height="22"
                fill="#FF0083"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z" />
              </svg>
            </li>
          ))}
        {!showComments && comentarios.length === 0 && (
          <p className="aviso_user">No hay comentarios para mostrar</p>
        )}
        {showComments && respuestas.length === 0 && (
          <p className="aviso_user">No hay respuestas para mostrar</p>
        )}
      </ul>

      {!showComments ? (
        <div className="buttons_page">
          <button
            onClick={() => cambiarPaginaComentarios(paginaActualCom - 1)}
            disabled={paginaActualCom === 1}
            className="button_page"
          >
            Anterior
          </button>
          <span className="page">Página {paginaActualCom}</span>
          <button
            onClick={() => cambiarPaginaComentarios(paginaActualCom + 1)}
            className="button_page"
            disabled={!hayMasPaginasCom}
          >
            Siguiente
          </button>
        </div>
      ) : (
        <div className="buttons_page">
          <button
            onClick={() => cambiarPaginaRespuestas(paginaActualRes - 1)}
            disabled={paginaActualRes === 1}
            className="button_page"
          >
            Anterior
          </button>
          <span className="page">Página {paginaActualRes}</span>
          <button
            onClick={() => cambiarPaginaRespuestas(paginaActualRes + 1)}
            className="button_page"
            disabled={!hayMasPaginasRes}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Comentarios;
