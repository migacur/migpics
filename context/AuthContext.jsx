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
      // 1. Intenta verificar el access token actual
      const res = await clienteAxios.get("/verify", { withCredentials: true });
      
      // Actualiza el estado solo si los datos son diferentes
      if (JSON.stringify(res.data) !== JSON.stringify(usuario)) {
        guardarUsuarios(res.data);
      }
      
      startTokenRefreshTimer(); // Programa la próxima renovación
      return true;
  
    } catch (error) {
      // 2. Si el access token falla (ej: expiró), usa el refresh token
      if (error.response?.status === 401) { // Error de autenticación
        try {
          // Intenta renovar el access token usando el refresh token
          const refreshRes = await clienteAxios.post(
            "/refresh-token", 
            {}, // Body vacío
            { withCredentials: true } // Envía las cookies (refresh token)
          );
  
          // Actualiza el estado del usuario con los nuevos datos
          guardarUsuarios(refreshRes.data.user);
          startTokenRefreshTimer(); // Reinicia el temporizador
          return true;
  
        } catch (refreshError) {
          // 3. Si el refresh token también falla, desloguea
          guardarUsuarios(null);
          return false;
        }
      } else {
        // Otros errores (ej: red, servidor caído)
        guardarUsuarios(null);
        return false;
      }
    }
  }, [usuario]); // Asegúrate de que las dependencias sean correctas

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

  const logoutUser = async () => {
    try {
      await clienteAxios.post(
        "/cerrar-sesion",
        { userId: usuario?.id },
        { withCredentials: true }
      );
      guardarUsuarios(null);
      clearTimeout(refreshTokenTimer);
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