import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Spinner from "./Spinner";

const Recibidos = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [recibidos, guardarRecibidos] = useState([]);
  const [load, isLoad] = useState(false);

  const showRecibidos = async () => {
    try {
      const res = await clienteAxios.get(`/mostrar-recibidos/${user.id}`, {
        withCredentials: true,
      });
      guardarRecibidos(res.data);
      isLoad(true);
    } catch (e) {
      console.log(e);
      Swal.fire({
        title: "",
        text: e.res.data.msg,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    showRecibidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!load) return <Spinner />;

  return (
    <>
      {recibidos.length === 0 && (
        <p className="aviso_user">No hay mensajes para mostrar</p>
      )}
      {recibidos.map((msg) => (
        <li className="listado_mensajes" key={msg.mensaje_id}>
          <p>
            <span>
              Enviado a{" "}
              <NavLink to={`/usuario/${msg.recibido_por}`} className="link">
                {" "}
                {msg.recibido_por}{" "}
              </NavLink>
              :
            </span>{" "}
            {msg.contenido}
          </p>
          <small className="fecha_msg">
            {" "}
            {msg.fecha_enviado.split(".")[0].replace("T", " a las ")}{" "}
          </small>
        </li>
      ))}
    </>
  );
};

export default Recibidos;
