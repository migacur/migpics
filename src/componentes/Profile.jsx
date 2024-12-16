import { useContext, useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import { NavLink, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import FormAvatar from "./FormAvatar";
import Swal from "sweetalert2";
import Seguidos from "./Seguidos";
import Seguidores from "./Seguidores";
import { ContextoUsuario } from "../../context/AuthContext";

const Profile = () => {
  const { autenticarUser, usuario } = useContext(ContextoUsuario);
  const [user, mostrarUsuario] = useState([]);
  const [data, cargarData] = useState(false);
  const [form, showForm] = useState(false);
  const [message, setMessage] = useState(false);
  const [leerCampo, guardarLeerCampo] = useState("");
  const [mostrarSeguidos, setMostrarSeguidos] = useState(false);
  const [mostrarSeguidores, setMostrarSeguidores] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    if(!usuario){
      const verificarUsuario = async() => {
        const autenticado = await autenticarUser();
        return autenticado ? autenticarUser() : navigate("/unauthorized")
       }
       verificarUsuario()
    }
    const mostrarPerfil = async () => {
      try {
        const res = await clienteAxios.get(`/mi-perfil/${usuario.id}`, {
          withCredentials: true,
        });
        if(res.status === 200){
          mostrarUsuario(res.data);
          cargarData(true);
        }
      } catch (e) {
        console.log(e.response.data.msg)
        Swal.fire({
          title: 'Ha ocurrido un error',
          text: e.response.data.msg,
          icon: 'error',
        })
        return navigate("/unauthorized")
      }
    };
    mostrarPerfil();
  }, [usuario, autenticarUser,navigate]);


  const guardarTextoBio = (e) => guardarLeerCampo(e.target.value);

  const addBio = async (userId) => {
    if (leerCampo.length > 150){
      Swal.fire({
        title: "",
        text: "No puedes agregar una biografía mayor a 150 caracteres",
        icon: "error",
      });
      return;
    }

    try {
      const res = await clienteAxios.put(
        `/modify-bio/${userId}`,
        { data: leerCampo },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        Swal.fire("", res.data.msg, "success");
        setMessage(false);
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

  const showSeguidores = () => {
    if (user.cantidad_seguidores === 0) return;
    setMostrarSeguidos(false);
    setMostrarSeguidores(true);
  };

  const mostrarUserSeguidos = () => {
    if (user.cantidad_seguidos === 0) return;
    setMostrarSeguidos(true);
    setMostrarSeguidores(false);
  };

  const cerrarVentana = () => {
    setMostrarSeguidos(false);
    setMostrarSeguidores(false);
  };

  if (!data) return <Spinner />;

  return (
    <div className="header_profile">
      {mostrarSeguidos && (
        <Seguidos
          clase={mostrarSeguidos}
          idUsuario={usuario.id}
          username={usuario.username}
          cerrarVentana={cerrarVentana}
        />
      )}

      {mostrarSeguidores && (
        <Seguidores
          clase={mostrarSeguidores}
          idUsuario={usuario.id}
          username={usuario.username}
          cerrarVentana={cerrarVentana}
        />
      )}
  
      <div className="header_button"></div>
      <div className="header_avatar">
        {form && <FormAvatar showForm={showForm} />}
        <img src={user.avatar} alt={user.username} />
        <button
          type="button"
          className="change_avatar"
          onClick={() => showForm(!form)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
          >
            <path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z" />
            <path d="m8 11-3 4h11l-4-6-3 4z" />
            <path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z" />
          </svg>
        </button>
      </div>
      <h1 className="profile_username"> {user.username} </h1>
      <div className="mi_bio">
        <p> {user.bio ? user.bio : "No has agregado tu biografía"} </p>
        {message ? (
          <>
            <textarea
              name="descripcion"
              className="input-msg input-bio"
              minLength="0"
              maxLength="150"
              placeholder={user.bio ? "Edita tu bío" : "Agrega tu bío"}
              onChange={guardarTextoBio}
            ></textarea>
            <button className="btn_bio" onClick={() => addBio(user.user_id)}>
              Agregar
            </button>
            <button onClick={() => setMessage(false)} className="btn_cancel">
              Cancelar
            </button>
          </>
        ) : (
          <button className="btn_bio" onClick={() => setMessage(true)}>
            {" "}
            {user.bio ? "Editar biografía" : "Agregar biografía"}
          </button>
        )}
      </div>

      <div className="header_info">
        <NavLink to={`/usuario/${user.username}/posts`} className="link">
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
              <div className="info_user">{user.publicaciones_total}</div>
            </div>
          </div>
        </NavLink>

        <div className="user_favs">
          <div className="barra_info">
            <div className="info_svg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z" />
              </svg>
              <p>Likes:</p>
            </div>
            <div className="info_user">{user.num_likes}</div>
          </div>
        </div>

        <NavLink to={`/usuario/${user.username}/comentarios`} className="link">
          <div className="user_comments">
            <div className="barra_info">
              <div className="info_svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h3v3.766L13.277 18H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14h-7.277L9 18.234V16H4V4h16v12z" />
                  <circle cx="15" cy="10" r="2" />
                  <circle cx="9" cy="10" r="2" />
                </svg>
                <p>Comentarios:</p>
              </div>
              <div className="info_user">
                {user.comentarios_total + user.num_respuestas}
              </div>
            </div>
          </div>
        </NavLink>

        <NavLink to={`/usuario/${user.username}/favoritos`} className="link">
          <div className="user_favs">
            <div className="barra_info">
              <div className="info_svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="m6.516 14.323-1.49 6.452a.998.998 0 0 0 1.529 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082a1 1 0 0 0-.59-1.74l-5.701-.454-2.467-5.461a.998.998 0 0 0-1.822 0L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.214 4.107zm2.853-4.326a.998.998 0 0 0 .832-.586L12 5.43l1.799 3.981a.998.998 0 0 0 .832.586l3.972.315-3.271 2.944c-.284.256-.397.65-.293 1.018l1.253 4.385-3.736-2.491a.995.995 0 0 0-1.109 0l-3.904 2.603 1.05-4.546a1 1 0 0 0-.276-.94l-3.038-2.962 4.09-.326z" />
                </svg>
                <p>Favoritos:</p>
              </div>
              <div className="info_user">{user.total_favoritos}</div>
            </div>
          </div>
        </NavLink>

        <div className="user_favs" onClick={() => showSeguidores()}>
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
            <div className="info_user">{user.cantidad_seguidores}</div>
          </div>
        </div>

        <div className="user_favs" onClick={() => mostrarUserSeguidos()}>
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
              <p>Siguiendo:</p>
            </div>
            <div className="info_user">{user.cantidad_seguidos}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
