import PropTypes from 'prop-types';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { useContext, useEffect, useState } from 'react';
import Spinner from './Spinner';
import { ContextoUsuario } from '../../context/AuthContext';

const FormAvatar = ({showForm}) => {

  const { autenticarUser,usuario } = useContext(ContextoUsuario)
  const [load,isLoad]=useState(false)
  const [avatar, guardarAvatar]=useState('')

  useEffect(() => {
      if(!usuario){
        autenticarUser()
      }
  },[usuario,autenticarUser])


  const leerArchivo = e => guardarAvatar( e.target.files[0] )

    const cambiarAvatar = async e => {
      e.preventDefault()
      isLoad(true)
     if(!avatar) return;

      const formData = new FormData();
      formData.append('file', avatar);

      try {
        const res = await clienteAxios.put(`/change-avatar/${usuario.id}`,formData,{
          withCredentials:true
        })

        if(res.status === 200) {
          Swal.fire(
            '',
            res.data.msg,
            'success'
          )
          isLoad(false)
          showForm(false)
      }
      } catch (e) {
        console.log(e);
        Swal.fire({
          title: '',
          text: e.response.data.error,
          icon: 'error',
        })
        isLoad(false)
      }

    }

  return (
    <div className="div-form-add form_avatar">
         <form 
    method="PUT" 
    action="/change-avatar" 
    encType="multipart/form-data"
    className="form-add"
    onSubmit={cambiarAvatar}>
   
    <p className='form-title'>
    <svg xmlns="http://www.w3.org/2000/svg" 
    onClick={()=> showForm(false)}
    width="25" height="25" viewBox="0 0 24 24"><path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"/><path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"/></svg>
    </p>
    
    <div className="div-input">
      <label htmlFor="avatar" className="button-image">
        {avatar ? "Avatar Cargado" : "Cambiar Avatar"}</label>
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#4d4d4d" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 8zM4 19h16v2H4z"/></svg>
    <input type="file" className="input-file" id="avatar" name="avatar"  onChange={leerArchivo}/>
    <small>Sólo es válido el formato jpg/png</small>
    </div>
    {load && <Spinner/>}
    <input 
    type="submit" 
    value="Cambiar Avatar" 
    className="btn-add"/>

  </form>
  </div>
  )
}

FormAvatar.propTypes = {
  showForm: PropTypes.func
};

export default FormAvatar