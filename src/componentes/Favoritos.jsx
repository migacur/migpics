import { useContext, useEffect, useState } from "react";
import clienteAxios from "./../../config/axios";
import Spinner from "./Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { ContextoUsuario } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Favoritos = () => {
  const { autenticarUser, usuario } = useContext(ContextoUsuario);
  const navigate = useNavigate();
  const [data, guardarData] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const [hayMasPaginas, setHayMasPaginas] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const { username } = useParams();

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
    const showFavorites = async () => {
      setIsLoad(true);
      try {
        const res = await clienteAxios.get(
          `/mis-favoritos/${username}?pagina=${paginaActual}&elementosPorPagina=${elementosPorPagina}`,
          {
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          guardarData(res.data);
          // Verificar si hay más datos
          const resSiguiente = await clienteAxios.get(
            `/mis-favoritos/${username}?pagina=${
              paginaActual + 1
            }&elementosPorPagina=${elementosPorPagina}`,
            {
              withCredentials: true,
            }
          );
          setHayMasPaginas(resSiguiente.data.length > 0);
        }
      } catch (e) {
        console.log(e);
        Swal.fire({
          title: "",
          text: e.response.data.msg,
          icon: "error",
        });
        return navigate("/unauthorized")
      }
      setIsLoad(false);
    };
    showFavorites();
  }, [paginaActual, username, navigate]);

  const capturarImg = (postId) => navigate(`/post/${postId}`);

  const irAPagina = (pagina) => setPaginaActual(pagina);

  return (
    <div className="div-images">
      <h1>Tus publicaciones favoritas</h1>

      <div className="show_post">
        {!data.length && (
          <p className="p_seguidos">
            No hay publicaciones agregadas a favoritos
          </p>
        )}
        {isLoad && <Spinner />}
        {data.map((img) => (
          <div
            className="card_image"
            key={img.publicacion_id}
            onClick={() => capturarImg(img.publicacion_id)}
          >
            <img src={img.imagen} alt={img.titulo} />
            <div className="post_info">
              <div className="info_hover">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z" />
                  </svg>
                </div>
                <span>{img.likes_totales}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default Favoritos;
