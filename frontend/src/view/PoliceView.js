import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import SearchDelincuentesView from './BusquedaView';
const PoliceView = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('home');

    const handleLogout = () => {
        // Elimina cualquier dato de sesión aquí (por ejemplo, token)
        localStorage.removeItem('authToken'); // Ejemplo: eliminar token del localStorage

        // Redirige al usuario a la página de login
        navigate('/');
    };
    const handleDelincuente = () => {
        setView('searchDelincuente'); 
    };

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">Panel de Policia</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link onClick={handleDelincuente}>Búsqueda de Delincuente</Nav.Link>
                        </Nav>
                        <Button variant="outline-light" onClick={handleLogout}>Cerrar Sesión</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div>
                {view === 'home' && <h1>Bienvenido Policía!</h1>}
                {view === 'searchDelincuente' && <SearchDelincuentesView/>}
            </div>
        </div>
    );
};

export default PoliceView;
