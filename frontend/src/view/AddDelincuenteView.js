import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddDelincuenteView = () => {
    const [curp, setCurp] = useState('');
    const [name, setName] = useState('');
    const [tel, setTel] = useState('');
    const [direccion, setDireccion] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar mensajes de error

        const newUser = {
            curp,
            name,
            tel,
            direccion
        };

        try {
            const response = await fetch('http://localhost:3001/adddelincuente/delincuente/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            const result = await response.json();

            if (response.ok) {
                // Limpiar el formulario
                setCurp('');
                setName('');
                setTel('');
                setDireccion('');

                // Redirigir y forzar una recarga para asegurarse de que el formulario se vea limpio
                navigate('/admin/add-delincuente', { replace: true });
                window.location.reload(); // Recargar la página
            } else {
                setError(result.message || 'Error al agregar delincuente');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while adding the user');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Agregación de Delincuentes</h2>
            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label htmlFor="curp" className="form-label">CURP:</label>
                    <input
                        id="curp"
                        className="form-control"
                        value={curp}
                        onChange={(e) => setCurp(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre:</label>
                    <input
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="tel" className="form-label">Teléfono:</label>
                    <input
                        id="tel"
                        type="text"
                        className="form-control"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección:</label>
                    <input
                        id="direccion"
                        type="text"
                        className="form-control"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Agregar Delincuente</button>
            </form>
            <button
                onClick={() => navigate('/admin')}
                className="btn btn-secondary mt-3"
            >
                Regresar
            </button>
        </div>
    );
};

export default AddDelincuenteView;
