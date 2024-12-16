import { useNavigate, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import { ContextoUsuario } from "../../context/AuthContext";

const EditarPost = () => {
  const { usuario } = useContext(ContextoUsuario)
    const { postId } = useParams();
    const navigate = useNavigate()

 
    const [data,cargarData]=useState([])

    const obtenerDatos = async() => {

        try {
          const res = await clienteAxios.get(`/post/${postId}`, {
            withCredentials:true
          } );
          const { data } = res;
          cargarData(data);
          if(data.idUsuario !== usuario.id){
            cargarData(null)
            navigate("/unauthorized")
          }
            } catch (e) {
          console.log(e);
          Swal.fire({
            title: 'Ha ocurrido un error',
            text: e.response.data.msg,
            icon: 'error',
          })
          }  
        
      }
        useEffect(() => {

       
          if(!usuario) return navigate("/")
        
          obtenerDatos()
      
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[])
    
  const leerCampo = e => {
    cargarData({
      ...data,
      [e.target.name] : e.target.value
    })
  }

  const editarPublicacion = async e => {
    e.preventDefault()

   
    const { titulo,descripcion } = data;

    if(titulo.length === 0 || titulo.length > 30 || descripcion.length > 150) return;

    try {
        const res = await clienteAxios.put(`/editar-post/${postId}`, {
          data,
          usuarioId: data.idUsuario
        }, {
          withCredentials:true
          })
    
    if(res.status === 200){
        Swal.fire(
            '',
            res.data.msg,
            'success'
          )

          setTimeout(() => {
            navigate(-1)
          },2000)
    }
          
    } catch (e) {
        console.log(e)
        Swal.fire({
            title: '',
            text: e.response.data.msg,
            icon: 'error',
          })
    }

  

  }

  return (
    <div className="post_edit">

        <h1>Edita tu publicación</h1>
        <div className="container_edit">
          <div className="image_container">
        <img src={data.imagen} alt={data.titulo} className="image_edit"/>
        <small>La imagen NO puede ser editada</small>
        </div>
        <form  method='PUT'
         action="/add-libro" 
         onSubmit={editarPublicacion}
        className="formulario_edit">
            <div className="input_group">
            <label htmlFor="titulo">Título:</label>
            <input type="text" id="titulo"
            maxLength="30"
            onChange={leerCampo} 
            name="titulo" defaultValue={data?.titulo} />
            </div>
            <div className="input_group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea name="descripcion" className="descripcion_edit" 
            minLength="0" maxLength="150"
            placeholder="Editar Comentario..." 
            onChange={leerCampo}
            defaultValue={data?.descripcion}></textarea>
            </div>
            <input type="submit" value="Editar Publicación" className="btn_edit"/>
        </form>
        </div>
    </div>
  )
}

export default EditarPost