import { createContext, useCallback, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

export const ContextoUsuario = createContext();

export const Usuarios = ({ children }) => {
  const [usuario, guardarUsuarios] = useState(null);
  const navigate = useNavigate();
  let refreshTokenTimer;

  const autenticarUser = useCallback(async () => {
    try {
      const res = await clienteAxios.get("/verify", {
        withCredentials: true,
      });
      guardarUsuarios(res.data);
      startTokenRefreshTimer();
      return true;
    } catch (e) {
      console.log(e);
      guardarUsuarios(null);
      return false;
    }
  }, []);

  let isRefreshing = false; // Bandera para evitar múltiples renovaciones

  const refreshAccessToken = async () => {
    if (isRefreshing) return;
    isRefreshing = true;
  
    try {
      const res = await clienteAxios.post("/refresh-token", {}, { withCredentials: true });
      startTokenRefreshTimer();
      return res.data;
    } catch (error) {
      console.error("Error al renovar token:", error);
      // Cierra sesión y redirige solo si el error es crítico
      if (error.response?.status === 403) {
        guardarUsuarios(null);
        window.location.href = "/";
      }
    } finally {
      isRefreshing = false;
    }
  };
  
  const startTokenRefreshTimer = () => {
    if (refreshTokenTimer) clearTimeout(refreshTokenTimer);
    refreshTokenTimer = setTimeout(refreshAccessToken, 14 * 60 * 1000); // 14 minutos
  };
  
  const logoutUser = async () => {
    try {
      const userId = usuario.id;
      const res = await clienteAxios.post(
        "/cerrar-sesion",
        { userId },
        { withCredentials: true }
      );
      guardarUsuarios(null);
      // Limpiar el temporizador cuando el usuario cierra sesión
      if (refreshTokenTimer) {
        clearTimeout(refreshTokenTimer);
      }
      navigate("/");

      if (res.status === 200) {
        Swal.fire("", res.data.msg, "success");
      }
    } catch (e) {
      Swal.fire({
        title: "",
        text: e.response.data.error,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if(usuario){
      autenticarUser();
    }
  }, [usuario,autenticarUser]);

  return (
    <ContextoUsuario.Provider
      value={{
        usuario,
        autenticarUser,
        guardarUsuarios,
        refreshAccessToken,
        startTokenRefreshTimer,
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
