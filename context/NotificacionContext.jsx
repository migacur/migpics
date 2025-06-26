import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const NotifyContext = createContext();

export const NotificacionContext = ({ children }) => {
  const [notificaciones, guardarNotificaciones] = useState(0);

  const resetear = () => guardarNotificaciones(0);

  return (
    <NotifyContext.Provider
      value={{
        notificaciones,
        guardarNotificaciones,
        resetear,
      }}
    >
      {children}
    </NotifyContext.Provider>
  );
};

NotificacionContext.propTypes = {
  children: PropTypes.object.isRequired,
};
