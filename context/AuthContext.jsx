import { createContext, useCallback, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

export const ContextoUsuario = createContext();

export const Usuarios = ({ children }) => {
  const [usuario, guardarUsuarios] = useState(null);
  const [isLoad, setIsLoad] = useState(true);
  const navigate = useNavigate();
  //let refreshTokenTimer;

  const autenticarUser = useCallback(async () => {
    setIsLoad(true)
    try {
      const res = await clienteAxios.get("/verify", {
        withCredentials: true,
      });
      if (JSON.stringify(res.data) !== JSON.stringify(usuario)) {
        guardarUsuarios(res.data);
      }
      return true;
    } catch (e) {
      console.log(e)
      guardarUsuarios(null);
       document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
       document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      return false;
    }finally{
      setIsLoad(false)
    }
  }, [usuario]);

  const logoutUser = async () => {
    try {
      await clienteAxios.post(
        "/cerrar-sesion",
        { userId: usuario?.id },
        { withCredentials: true }
      );
      guardarUsuarios(null);
      setIsLoad(false)
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
       document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      navigate("/");
      Swal.fire("", "Has cerrado la sesión", "success");
    } catch (e) {
      console.log(e)
      Swal.fire("Error", e.response?.data?.error || "Error al cerrar sesión", "error");
    }
  };

  useEffect(() => {
    autenticarUser();
  }, []);

  return (
    <ContextoUsuario.Provider
      value={{
        usuario,
        autenticarUser,
        guardarUsuarios,
        isLoad,
        logoutUser,
      }}
    >
      {children}
    </ContextoUsuario.Provider>
  );
};

Usuarios.propTypes = {
  children: PropTypes.object.isRequired,
};