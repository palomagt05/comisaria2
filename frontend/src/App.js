import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginView from './view/LoginView';
import AdminView from './view/AdminView';
import PoliceView from './view/PoliceView';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddUserView from './view/AddUserView';
import AddPoliView from './view/AddPoliView';
import AddArmaView from './view/AddArmaView';
import AddDelincuenteView from './view/AddDelincuenteView';
import AssignDelincuenteView from './view/AssignDelincuenteView';
import RegistroCasoView from './view/RegistroCasoView';
import InsertarHabilidadView from './view/HabilidadView';
import InsertarInvestigacionView from './view/InvestigacionView';
import InsertarJefeView from './view/InsertarJefeView';
import SearchDelincuentesView from './view/BusquedaView';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginView />} />
                <Route path="/admin" element={<ProtectedRoute element={<AdminView />} />} />
                <Route path="/police" element={<ProtectedRoute element={<PoliceView />} />} />
                <Route path="/admin/add-user" element={<ProtectedRoute element={<AddUserView />} />} />
                <Route path="/admin/add-poli" element={<ProtectedRoute element={<AddPoliView />} />} />
                <Route path="/admin/add-arma" element={<ProtectedRoute element={<AddArmaView />} />} />
                <Route path="/admin/add-delincuente" element={<ProtectedRoute element={<AddDelincuenteView />} />} />
                <Route path="/admin/assign-delincuente" element={<ProtectedRoute element={<AssignDelincuenteView />} />} />
                <Route path="/admin/register-case" element={<ProtectedRoute element={<RegistroCasoView />} />} />
                <Route path="/admin/insertar-habilidad" element={<ProtectedRoute element={<InsertarHabilidadView />} />} />
                <Route path="/admin/insertar-investigacion" element={<ProtectedRoute element={<InsertarInvestigacionView/>} />} />
                <Route path="/admin/insertar-jefe" element={<ProtectedRoute element={<InsertarJefeView/>} />} />
                <Route path="/policia/search-delincuente" element={<ProtectedRoute element={<SearchDelincuentesView/>}/>}/>
            </Routes>
        </Router>
    );
};

export default App;
