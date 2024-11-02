import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import GerenciarUsuarios from './pages/Usuarios/Gerenciar'
import Galeria from './pages/Galeria'
import Voluntarios from './pages/Voluntarios'
import Memorial from './pages/Memorial'
import GerenciarVoluntarios from './pages/Voluntarios/Gerenciar'

export const Rotas = () => {
    
    return(
        <BrowserRouter>
            <Routes>

                <Route 
                    path='/'
                    element={<Login />}
                />
                <Route 
                    path='/dashboard'
                    element={<Dashboard />}
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
                    path='/memorial'
                    element={<Memorial />}
                />          

            </Routes>
        </BrowserRouter>
    )
}