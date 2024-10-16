import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginViewModel from '../viewmodel/LoginViewModel';
import PasswordInput from '../components/PasswordInput';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginView = () => {
    const [usuario, setUsuario] = React.useState('');
    const [contrasena, setContrasena] = React.useState('');
    const navigate = useNavigate();
    const viewModel = new LoginViewModel();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await viewModel.login(usuario, contrasena);
        if (data.message) {
            alert(data.message);
            if (data.role === 1) {
                navigate('/admin');
            } else if (data.role === 2) {
                navigate('/police');
            }
        } else {
            alert('Error de autenticación');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow">
                    <div className="card-body">
                        <h4 className="card-title text-center mb-4">Iniciar Sesión</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="usuario" className="form-label">Usuario:</label>
                                <input
                                    type="text"
                                    id="usuario"
                                    className="form-control"
                                    value={usuario}
                                    onChange={(e) => setUsuario(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="contrasena" className="form-label">Contraseña:</label>
                                <PasswordInput
                                    id="contrasena"
                                    className="form-control"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Acceso</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
