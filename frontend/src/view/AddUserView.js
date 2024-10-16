import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';

const AddUserView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [showTable, setShowTable] = useState(false); 
    const [policias, setPolicias] = useState([]);
    const [users, setusers] = useState([]);
    const [showTable2, setShowTable2] = useState(false); 

    const navigate = useNavigate();  // Hook para la navegación

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar mensajes de error

        const newUser = {
            username,
            password,
            role,
            name
        };

        try {
            const response = await fetch('http://localhost:3001/add/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            const result = await response.json();

            if (response.ok) {
                // Limpiar el formulario
                setUsername('');
                setPassword('');
                setRole('');
                setName('');

                // Redirigir y forzar una recarga para asegurarse de que el formulario se vea limpio
                navigate('/admin/add-user', { replace: true });
                window.location.reload(); // Recargar la página
            } else {
                setError(result.message || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while adding the user');
        }
    };
    
    const fetchPolicias = async () => {
        try {
            const response = await fetch('http://localhost:3001/addpoli/policias');
            const data = await response.json();

            if (response.ok) {
                setPolicias(data);
            } else {
                setError('Falló en buscar los policias');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('se produjo un error al buscar policias');
        }
    };

    const handleShowPolicias = () => {
        if (!showTable) {
            fetchPolicias();
        }
        setShowTable(!showTable);
    };
    const getCategoria = (categoria) => {
        switch (categoria) {
            case 1: return 'Policia Municipal';
            case 2: return 'Policia Estatal';
            case 3: return 'Policia Ministerial';
            case 4: return 'Policia Vial';
            case 5: return 'Policia Turistica';
            case 6: return 'Policia Auxiliar';
            case 7: return 'Administrador';
            default: return 'Desconocido';
        }
    };
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/add/users');
            const data = await response.json();

            if (response.ok) {
                setusers(data);
            } else {
                setError('Falló en buscar usuarios');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Se produjo un error al buscar usuarios.');
        }
    };
    const handleShowUsers = () => {
        if (!showTable2) {
            fetchUsers();
        }
        setShowTable2(!showTable2);
    };
    const getcargo = (categoria) => {
        switch (categoria) {
            case 1: return 'Administrador';
            case 2: return 'Policia';
        }
    };
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Agregación de Usuarios</h2>
            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Usuario:</label>
                    <input
                        id="username"
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña:</label>
                    <PasswordInput
                        id="password"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Rol:</label>
                    <select
                        id="role"
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">Select Role</option>
                        <option value="1">Administrator</option>
                        <option value="2">Policia</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre:</label>
                    <input
                        id="name"
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Agregar Usuario</button>
            </form>
            <div className="d-flex justify-content-between mt-3">
                <button
                    onClick={handleShowPolicias}
                    className="btn btn-primary mt-3"
                >
                    {showTable ? 'Ocultar Policías Registrados' : 'Ver Policías Registrados'}
                </button>
                <button
                        onClick={handleShowUsers}
                        className="btn btn-primary mt-3"
                    >
                        {showTable2 ? 'Ocultar Usuarios Registradas' : 'Ver Usuarios Registradas'}
                </button>
                
                <button
                    onClick={() => navigate('/admin')}
                    className="btn btn-secondary mt-3"
                >
                    Regresar
                </button>
            </div>
            <div className="row">
                {showTable && (
                    <div className="col-md-6 mt-4">
                        <h3>Policías Registrados</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>RFC</th>
                                    <th>Nombre</th>
                                    <th>Categoria</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policias.map((poli, index) => (
                                    <tr key={index}>
                                        <td>{poli.RFC}</td>
                                        <td>{poli.Nombre}</td>
                                        <td>{getCategoria(poli.Categoria)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {showTable2 && (
                    <div className="col-md-6 mt-4">
                        <h3>Usuarios Registrados</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Cargo</th>
                                    <th>Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.usuario}</td>
                                        <td>{getcargo(user.id_cargo)}</td>
                                        <td>{user.nombre}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddUserView;
