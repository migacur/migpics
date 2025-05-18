import { createContext, useCallback, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

export const ContextoUsuario = createContext();

export const Usuarios = ({ children }) => {
  const [usuario, guardarUsuarios] = useState(null);
  const navigate = useNavigate();
  //let refreshTokenTimer;

  const autenticarUser = useCallback(async () => {
    try {
      const res = await clienteAxios.get("/verify", {
        withCredentials: true,
      });
      // Evita actualizar el estado si los datos son iguales
      if (JSON.stringify(res.data) !== JSON.stringify(usuario)) {
        guardarUsuarios(res.data);
      }
    //  startTokenRefreshTimer();
      return true;
    } catch (e) {
      console.log("Prueba autenticarUser()")
      console.log(e)
      guardarUsuarios(null);
      return false;
    }
  }, [usuario]);
/*
  const refreshAccessToken = async () => {
    try {
      await clienteAxios.post("/refresh-token", {}, { withCredentials: true });
      startTokenRefreshTimer();
    } catch (error) {
      guardarUsuarios(null);
      navigate("/");
    }
  };

  const startTokenRefreshTimer = () => {
    clearTimeout(refreshTokenTimer);
    refreshTokenTimer = setTimeout(refreshAccessToken, 14 * 60 * 1000);
  };
*/
  const logoutUser = async () => {
    try {
      await clienteAxios.post(
        "/cerrar-sesion",
        { userId: usuario?.id },
        { withCredentials: true }
      );
      guardarUsuarios(null);
  //    clearTimeout(refreshTokenTimer);
      navigate("/");
      Swal.fire("", "Has cerrado la sesión", "success");
    } catch (e) {
      Swal.fire("Error", e.response?.data?.error || "Error al cerrar sesión", "error");
    }
  };

  useEffect(() => {
    // Verificar autenticación solo al montar el componente
    autenticarUser();
  }, []); // Eliminar todas las dependencias

  return (
    <ContextoUsuario.Provider
      value={{
        usuario,
        autenticarUser,
        guardarUsuarios,
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