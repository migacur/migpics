import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { ContextoUsuario } from "../../context/AuthContext";

const Agregar = () => {
  const { autenticarUser, usuario } = useContext(ContextoUsuario);
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if(!usuario){
      verificarUsuario() 
    }
  }, [usuario,autenticarUser]);

  const verificarUsuario = async() => {
    const autenticado = await autenticarUser();
    return autenticado ? autenticarUser() : navigate("/")
   }
  

  const [post, guardarPost] = useState({
    titulo: "",
    descripcion: "",
  });
  // archivo = state, guardarArchivo = setState
  const [imagen, guardarImagen] = useState("");

  const leerCampo = (e) => {
    guardarPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const subirImagen = (e) => guardarImagen(e.target.files[0]);

  const agregarPost = async (e) => {
    e.preventDefault();
    setLoad(true);
    if (!post.titulo || !imagen) {
      Swal.fire({
        title: "",
        text: "El título y la imagen son obligatorias",
        icon: "error",
      });
      setLoad(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", imagen);
    formData.append("titulo", post.titulo);
    formData.append("descripcion", post.descripcion);

    // almacenarlo en la BD
    try {
      const res = await clienteAxios.post(
        `/agregar-post/${usuario.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data" // 👈 ¡Esto es crucial!
          }
        }
      );

      if (res.status === 201) {
        Swal.fire("", res.data.msg, "success");

        setLoad(false);
      }
      navigate(`/post/${res.data.idPost}`);
    } catch (e) {
      console.log(e);
      Swal.fire({
        title: "",
        text: e.response.data.error,
        icon: "error",
      });
      setLoad(false);
    }
  };

  return (
    <div className="div-form-add">
      <form
        method="POST"
        action="/agregar-post"
        encType="multipart/form-data"
        className="form-add"
        onSubmit={agregarPost}
      >
        <p className="form-title">
          <strong>Agregar Publicación</strong>
        </p>
        <input
          type="text"
          className="input-search"
          name="titulo"
          placeholder="Título de la imagen"
          onChange={leerCampo}
        />
        <div className="div-input">
          <label htmlFor="imagen" className="button-image">
            {imagen ? "Imagen Cargada" : "Subir Imagen"}
          </label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            fill="#4d4d4d"
            viewBox="0 0 24 24"
          >
            <path d="M19 9h-4V3H9v6H5l7 8zM4 19h16v2H4z" />
          </svg>
          <input
            type="file"
            className="input-file"
            id="imagen"
            name="imagen"
            onChange={subirImagen}
          />
          <small>Sólo es válido el formato jpg/png</small>
        </div>
        <textarea
          name="descripcion"
          className="input-msg"
          minLength="0"
          maxLength="150"
          placeholder="Añade una descripción (Opcional)"
          onChange={leerCampo}
        ></textarea>
        <small className="aviso_derechos">
          <span>IMPORTANTE:</span>Recuerda subir imágenes de tu autoría o en
          caso contrario, que no cuenten con derechos de autor(copyright), así
          evitas que tu publicación sea eliminada.
        </small>
        {load && <Spinner />}
        <input type="submit" value="Agregar Post" className="btn-add"></input>
      </form>
    </div>
  );
};

export default Agregar;
