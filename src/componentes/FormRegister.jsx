import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "./../../config/axios";
import Swal from "sweetalert2";
import { ContextoUsuario } from "../../context/AuthContext";
import ButtonClose from "./Icons/ButtonClose";
import { PropTypes } from 'prop-types';

const FormRegister = ({closeForm,showFormLogin}) => {
  const { usuario } = useContext(ContextoUsuario);
  const [user, setUser] = useState([]);
  const [comprobarPass, setComprobarPass] = useState(false);
  const [errors, setErrors] = useState([]);
    const [isLogin,setIsLogin]=useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario) return navigate("/mi-cuenta");
  }, [usuario, navigate]);

  const registerUser = async (e) => {
    e.preventDefault();
  setIsLogin(true)
    try {
      const res = await clienteAxios.post("/registrar-usuario", user);
      console.log(res.data);
      if (res.status === 200) {
        Swal.fire("", "Usuario registrado correctamente", "success");
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
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const comprobarPassword = () => {
    const { password, repeat } = user;
    if (password.trim().length > 0 || repeat.trim().length > 0) {
      if (user.password === user.repeat) {
        setComprobarPass(false);
        return;
      }
      setComprobarPass(true);
    }
  };

  return (
    <div className="div-form">
      <form
        method="POST"
        action="/registrar-usuario"
        className="formulario"
        onSubmit={registerUser}
      >
        <div className="div_header">
          <p></p>
        <p className="form-title">
          <strong>Registrar cuenta</strong>
        </p>
        <ButtonClose closeForm={closeForm}/>
        </div>
        <div className="input-div">
          <input
            type="text"
            placeholder="Ingresa tu usuario"
            className="input"
            autoComplete="username"
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
            type="email"
            placeholder="Ingresa un email válido"
            autoComplete="email"
            className="input"
            name="email"
            onChange={leerInput}
          ></input>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            fill="#0062DC"
            viewBox="0 0 24 24"
          >
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z" />
          </svg>
        </div>
        <div className="input-div">
          <input
            type="password"
            onKeyUp={comprobarPassword}
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
        <div className="input-div">
          <input
            type="password"
            onKeyUp={comprobarPassword}
            placeholder="Repite el password"
            className="input"
            autoComplete="repeat"
            name="repeat"
            onChange={leerInput}
          ></input>

          {comprobarPass ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#FF0083"
              viewBox="0 0 24 24"
            >
              <path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM12 20c-4.411 0-8-3.589-8-8s3.567-8 7.953-8C16.391 4 20 7.589 20 12s-3.589 8-8 8z" />
              <path d="M11 7h2v7h-2zm0 8h2v2h-2z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              fill="#0062DC"
              viewBox="0 0 24 24"
            >
              <path d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
            </svg>
          )}
        </div>
        {comprobarPass && (
          <p className="form_error">Las contraseñas no coinciden</p>
        )}
        {errors.map((error, index) => (
          <li key={index} className="form_error">
            {error.msg}
          </li>
        ))}
        {isLogin &&
          <div className="div_load_form">
          <p className="load_form">Registrando usuario...</p>
          </div>
      }
        <input type="submit" value="Registrarme" className="btn-send"></input>
      </form>
      <button className="btn-send back" onClick={showFormLogin}>
          ¿Ya tienes cuenta? Ingresa
        </button>
    </div>
  );
};

FormRegister.propTypes = {
  closeForm: PropTypes.func.isRequired,
  showFormLogin: PropTypes.func.isRequired
};

export default FormRegister;
