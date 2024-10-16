import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddArmaView = () => {
    const [codigo, setcodigo] = useState('');
    const [clase, setclase] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [armas, setArmas] = useState([]);
    const [showTable, setShowTable] = useState(false);

    const navigate = useNavigate();  // Hook para la navegación

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        const newUser = {
            codigo,
            clase,
            name
        };

        try {
            const response = await fetch('http://localhost:3001/addarma/arma/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            const result = await response.json();

            if (response.ok) {
                // Limpiar el formulario
                setcodigo('');
                setclase('');
                setName('');

                // Redirigir y forzar una recarga para asegurarse de que el formulario se vea limpio
                navigate('/admin/add-arma', { replace: true });
                window.location.reload(); // Recargar la página
            } else {
                setError(result.message || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while adding the user');
        }
    };
    const fetchArmas = async () => {
        try {
            const response = await fetch('http://localhost:3001/addarma/arma');
            const data = await response.json();

            if (response.ok) {
                setArmas(data);
            } else {
                setError('Falló en buscar armas');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Se produjo un error al buscar armas.');
        }
    };
    const handleShowArmas = () => {
        if (!showTable) {
            fetchArmas();
        }
        setShowTable(!showTable);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Agregación de Armas</h2>
            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label htmlFor="codigo" className="form-label">Codigo:</label>
                    <input
                        id="codigo"
                        className="form-control"
                        value={codigo}
                        onChange={(e) => setcodigo(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="clase" className="form-label">Clase:</label>
                    <select
                        id="clase"
                        className="form-control"
                        value={clase}
                        onChange={(e) => setclase(e.target.value)}
                    >
                        <option value="">Seleccione la clase del arma</option>
                        <option value="Arma Corta">Arma Corta</option>
                        <option value="Arma Larga">Arma Larga</option>
                        <option value="Arma No Letal">Arma No Letal</option>
                        <option value="Arma Especial">Arma Especial</option>
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
                <button type="submit" className="btn btn-primary">Agregar Arma</button>
            </form>
            <div className="d-flex justify-content-between mt-3">
                <button
                    onClick={handleShowArmas}
                    className="btn btn-primary mt-3"
                >
                     {showTable ? 'Ocultar Armas Registradas' : 'Ver Armas Registradas'}
                </button>

                <button
                    onClick={() => navigate('/admin')}
                    className="btn btn-secondary mt-3"
                >
                    Regresar
                </button>
            </div>
            {showTable && (
                <div className="mt-4">
                    <h3>Armas Registradas</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Clase</th>
                                <th>Nombre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {armas.map((arma, index) => (
                                <tr key={index}>
                                    <td>{arma.Codigo}</td>
                                    <td>{arma.Clase}</td>
                                    <td>{arma.Nombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AddArmaView;
