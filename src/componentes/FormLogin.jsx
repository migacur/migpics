import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { ContextoUsuario } from "../../context/AuthContext";
import ButtonClose from "./Icons/ButtonClose";
import PropTypes from 'prop-types';

const FormLogin = ({closeForm,showFormRegister}) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { usuario, autenticarUser } = useContext(ContextoUsuario);
  const [isLogin,setIsLogin]=useState(false)
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (usuario) return navigate("/mi-cuenta");
  }, [usuario, navigate]);

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLogin(true)
    try {
      const res = await clienteAxios.post("/ingresar-usuario", data, {
        withCredentials: true,
      });

      if (res.status === 200) {
        Swal.fire(
          `Hola ${res.data.user.username}`,
          "Sesión iniciada exitosamente",
          "success"
        );
        autenticarUser();
        closeForm()
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      if (e.response && e.response.data && e.response.data.errors) {
        setErrors(e.response.data.errors);
      } else {
        Swal.fire({
          title: "",
          text: e.response.data.msg,
          icon: "error",
        });
      }
    }finally{
      setIsLogin(false)
    }
  };

  const leerInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <>
    <div className="div-form">
      <form
        method="POST"
        action="/ingresar-usuario"
        className="formulario"
        onSubmit={loginUser}
      >
        <div className="div_header">
          <p></p>
        <p className="form-title">
          <strong>Ingresa a tu cuenta</strong>
        </p>
        <ButtonClose closeForm={closeForm}/>
        </div>
        <div className="input-div">
          <input
            type="text"
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            className="input"
            name="username"
            onChange={leerInput}
          ></input>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            fill="#0062DC"
            viewBox="0 0 24 24"
          >
            <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z" />
          </svg>
        </div>
        <div className="input-div">
          <input
            type="password"
            placeholder="Ingresa el password"
            className="input"
            autoComplete="password"
            name="password"
            onChange={leerInput}
          ></input>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            fill="#0062DC"
            viewBox="0 0 24 24"
          >
            <path d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
          </svg>
        </div>
        {errors.length > 0 && (
          <ul>
            {" "}
            {errors.map((error, index) => (
              <li key={index} className="form_error">
                {error.msg}
              </li>
            ))}{" "}
          </ul>
        )}
          {isLogin &&
          <div className="div_load_form">
          <p className="load_form">Ingresando...</p>
          </div>
      }
        <input type="submit" value="Ingresar" className="btn-send"></input>

        <Link to="/forgot-password" className="btn-send back" onClick={closeForm}>
          Olvidé mi password
        </Link>
       
      </form>
    
      <button className="btn-send back" onClick={showFormRegister}>
          ¿No tienes cuenta? Regístrate
        </button>
    </div>
    </>
  );
};


FormLogin.propTypes = {
  closeForm: PropTypes.func.isRequired,
  showFormRegister: PropTypes.func.isRequired
};

export default FormLogin;
