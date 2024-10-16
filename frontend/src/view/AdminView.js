import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import AddUserView from './AddUserView'; // Importa los componentes
import AddPoliView from './AddPoliView';
import AddArmaView from './AddArmaView';
import AddDelincuenteView from './AddDelincuenteView';
import AssignDelincuenteView from './AssignDelincuenteView';
import RegistroCasoView from './RegistroCasoView';
import InsertarHabilidadView from './HabilidadView';
import InsertarInvestigacionView from './InvestigacionView';
import InsertarJefeView from './InsertarJefeView';

const AdminView = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('home'); // Estado para controlar la vista actual

    const handleLogout = () => {
        // Elimina cualquier dato de sesión aquí (por ejemplo, token)
        localStorage.removeItem('authToken'); // Ejemplo: eliminar token del localStorage

        // Redirige al usuario a la página de login
        navigate('/');
    };

    const handleAddUser = () => {
        setView('addUser'); 
    };

    const handleAddPoli = () => {
        setView('addPoli'); 
    };

    const handleAddArma = () => {
        setView('addArma'); 
    };

    const handleAddDelincuente = () => {
        setView('addDelincuente'); 
    };
    const handleAssingDelincuente = () => {
        setView('assingDelincuente'); 
    };
    const handleCasoDelincuente = () => {
        setView('casoDelincuente'); 
    };
    const handleHabilidad = () => {
        setView('habilidad'); 
    };
    const handleinvestigacion = () => {
        setView('investigacion'); 
    };
    const handlejefe = () => {
        setView('jefe'); 
    };
    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">Panel de Administración</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link onClick={handleAddPoli}>Agregar Policías</Nav.Link>
                            <Nav.Link onClick={handlejefe}>Asignación de Jefe</Nav.Link>
                            <Nav.Link onClick={handleAddUser}>Agregar Usuarios</Nav.Link>
                            <Nav.Link onClick={handleAddArma}>Agregar Armas</Nav.Link> 
                            <Nav.Link onClick={handleHabilidad}>Habilidad Con Armas</Nav.Link>
                            <Nav.Link onClick={handleAddDelincuente}>Agregar Delincuentes</Nav.Link>
                            <Nav.Link onClick={handleAssingDelincuente}>Asignación de Calabozo</Nav.Link>
                            <Nav.Link onClick={handleCasoDelincuente}>Asignación de Juzgado</Nav.Link>
                            <Nav.Link onClick={handleinvestigacion}>Investigación</Nav.Link>


                        </Nav>
                        <Button variant="outline-light" onClick={handleLogout}>Cerrar Sesión</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div>
                {view === 'home' && <h1>Bienvenido Administrador!</h1>}
                {view === 'addUser' && <AddUserView />}
                {view === 'addPoli' && <AddPoliView />}
                {view === 'addArma' && <AddArmaView />}
                {view === 'addDelincuente' && <AddDelincuenteView />}
                {view === 'assingDelincuente' && <AssignDelincuenteView/>}
                {view === 'casoDelincuente' && <RegistroCasoView/>}
                {view === 'habilidad' && <InsertarHabilidadView/>}
                {view === 'investigacion' && <InsertarInvestigacionView/>}
                {view === 'jefe' && <InsertarJefeView/>}
            </div>
        </div>
    );
};

export default AdminView;
