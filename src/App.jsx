import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './componentes/Header'
import Tendencias from './componentes/Tendencias'
import Recientes from './componentes/Recientes';
import Buscador from './componentes/Buscador'
import Post from './componentes/Post'
import { Usuarios } from './../context/AuthContext';
import Agregar from './componentes/Agregar'
import Footer from './componentes/Footer'
import { PostContext } from '../context/PostContext'
import UserPost from './componentes/Tops/UserPost'
import PerfilPublico from './componentes/PerfilPublico'
import UserLikes from './componentes/Tops/UserLikes'
import NotFound from './componentes/NotFound'
import PostLikes from './componentes/Tops/PostLikes'
import PostComments from './componentes/Tops/PostComments'
import Profile from './componentes/Profile'
import ListadoPost from './componentes/ListadoPost'
import Comentarios from './componentes/Comentarios'
import Unauthorized from './componentes/Unauthorized'
import EditarPost from './componentes/EditarPost'
import Favoritos from './componentes/Favoritos'
import PostSeguidos from './componentes/PostSeguidos'
import Mensajes from './componentes/Mensajes'
import Bandeja from './componentes/Bandeja'
import RecoverPass from './componentes/RecoverPass';
import EnviarCodigo from './componentes/EnviarCodigo'
import Inbox from './componentes/Inbox'


function App() {

  return (
    <Usuarios>
      <PostContext>
    <>
      <div className='principal'>
      <Header/>
      <main className='container'>
      <div className='div_container'>
        <Router>
      <Routes>
      <Route path="/" element={<Recientes/>} />
       <Route path="/tendencias" element={<Tendencias/>} />
       <Route path="/post-seguidos" element={<PostSeguidos/>} />
       <Route path="/buscar/:palabra" element={<Buscador/>} />
       <Route path="/agregar-post" element={<Agregar/>} />
       <Route path="/post/:postId" element={<Post/>} />
       <Route path='/editar-post/:postId' element={<EditarPost/>} />
       <Route path="/usuario-top-post" element={<UserPost/>} />
       <Route path="/usario-top-likes" element={<UserLikes/>} />
       <Route path="/top-post-likes" element={<PostLikes/>} />
       <Route path="/top-post-comentarios" element={<PostComments/>} />
       <Route path="/usuario/:username" element={<PerfilPublico/>} />
       <Route path="/usuario/:username/posts" element={<ListadoPost/>} />
       <Route path="/usuario/:username/comentarios" element={<Comentarios/>} />
       <Route path="/usuario/:username/favoritos" element={<Favoritos/>} />
       <Route path="/mi-cuenta" element={<Profile/>} />
       <Route path="/enviar-mensaje/:userId" element={<Mensajes/>} />
       <Route path="/mensajes" element={<Bandeja/>} />
       <Route path="/forgot-password" element={<RecoverPass/>} />
       <Route path="/enviar-codigo" element={<EnviarCodigo/>} />
       <Route path="/unauthorized" element={<Unauthorized/>} />
       <Route path="/inbox/:userId" element={<Inbox/>} />
       <Route path='*' element={<NotFound texto="Página no encontrada"/>} />
    </Routes>
      </Router>
      </div>
 
    </main>
    <Footer/> 
    </div>
    </>
      </PostContext>
    </Usuarios>
  )
}

export default App
