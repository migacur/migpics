import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const PostContexto = createContext()

export const PostContext = ({ children }) => {

    const [realizarBusqueda, mostrarBusqueda] = useState('')

    return (

        <PostContexto.Provider value={ { realizarBusqueda, mostrarBusqueda } }>
            {children}
        </PostContexto.Provider>
    )
}

PostContext.propTypes = {
    children: PropTypes.object.isRequired
  }