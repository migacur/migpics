import Mensajeria from "./Mensajeria"

const Bandeja = () => {

 
  return (
    <>
     <h1 className="bandeja_title">Bandeja de mensajes</h1>
    
    <div className="bandeja_mensajes">
        <div className="seccion_msg">
          <Mensajeria/> 
        </div>
   
    </div>
    </>
  )
}

export default Bandeja