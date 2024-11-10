import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'
import Login from './pages/Login'
import Usuarios from './pages/Usuarios'
import GerenciarUsuarios from './pages/Usuarios/Gerenciar'
import Galeria from './pages/Galeria'
import Voluntarios from './pages/Voluntarios'
import Memorial from './pages/Memorial'
import GerenciarVoluntarios from './pages/Voluntarios/Gerenciar'
import GerenciarGaleria from './pages/Galeria/Gerenciar'
import GerenciarMemorial from './pages/Memorial/Gerenciar'

export const Rotas = () => {
    
    return(
        <BrowserRouter>
            <Routes>

                <Route 
                    path='/'
                    element={<Login />}
                />

                <Route 
                    path='/usuarios'
                    element={<Usuarios />}
                />
                <Route 
                    path='/usuarios/:id'
                    element={<GerenciarUsuarios />}
                />

                <Route 
                    path='/voluntarios'
                    element={<Voluntarios />}
                /> 

                <Route 
                    path='/voluntarios/:id'
                    element={<GerenciarVoluntarios />}
                /> 

                <Route 
                    path='/galeria'
                    element={<Galeria />}
                />   

                <Route 
                    path='/galeria/:id'
                    element={<GerenciarGaleria />}
                /> 

                <Route 
                    path='/memorial'
                    element={<Memorial />}
                />  

                <Route 
                    path='/memorial/:id'
                    element={<GerenciarMemorial />}
                />        

            </Routes>
        </BrowserRouter>
    )
}