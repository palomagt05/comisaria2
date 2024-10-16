import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPoliView = () => {
    const [rfc, setRfc] = useState('');
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();  // Hook para la navegación

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar mensajes de error

        const newUser = {
            rfc,
            role,
            name
        };

        try {
            const response = await fetch('http://localhost:3001/addpoli/poli/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            const result = await response.json();

            if (response.ok) {
                // Limpiar el formulario
                setRfc('');
                setRole('');
                setName('');

                // Redirigir y forzar una recarga para asegurarse de que el formulario se vea limpio
                navigate('/admin/add-poli', { replace: true });
                window.location.reload(); // Recargar la página
            } else {
                setError(result.message || 'Fallo al agregar usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Se produjo un error al agregar el usuario');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Agregación de Policías</h2>
            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label htmlFor="rfc" className="form-label">RFC:</label>
                    <input
                        id="rfc"
                        className="form-control"
                        value={rfc}
                        onChange={(e) => setRfc(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Categoria:</label>
                    <select
                        id="role"
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">Seleccione Categoria</option>
                        <option value="1">Policía Municipal</option>
                        <option value="2">Policía Estatal</option>
                        <option value="3">Policía Ministerial</option>
                        <option value="4">Policía Vial</option>
                        <option value="5">Policía Turistica</option>
                        <option value="6">Policía Auxiliar</option>
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
                <button type="submit" className="btn btn-primary">Agregar Policia</button>
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

export default AddPoliView;
