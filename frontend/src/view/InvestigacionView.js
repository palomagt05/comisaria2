import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InsertarInvestigacionView = () => {
    const [rfcPolicia, setRfcPolicia] = useState('');
    const [codigoCaso, setCodigoCaso] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showTable, setShowTable] = useState(false); 
    const [policias, setPolicias] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('http://localhost:3001/api/investigacion', { rfcPolicia, codigoCaso });
            if (response.status === 201) {
                setMessage(response.data.message);
                setRfcPolicia('');
                setCodigoCaso('');
                navigate('/admin/insertar-investigacion', { replace: true });
                window.location.reload(); // Recargar la página después del registro
            } else {
                setError('Error al insertar la investigación');
            }
        } catch (error) {
            setError('Error al insertar la investigación');
        }
    };
    const fetchPolicias = async () => {
        try {
            const response = await fetch('http://localhost:3001/addpoli/policias');
            const data = await response.json();
    
            if (response.ok) {
                // Filtrar los policías para que solo queden los de categoría Policía Ministerial
                const policiasMinisteriales = data.filter(poli => poli.Categoria === 3);
                setPolicias(policiasMinisteriales);
            } else {
                setError('Falló en buscar los policias');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Se produjo un error al buscar policias');
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
            case 3: return 'Policia Ministerial';
            default: return 'Desconocido';
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Insertar Investigación del Policía</h2>
            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <div className="mb-3">
                    <label htmlFor="rfcPolicia" className="form-label">RFC Policía:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="rfcPolicia"
                        value={rfcPolicia}
                        onChange={(e) => setRfcPolicia(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="codigoCaso" className="form-label">Caso:</label>
                    <select
                        id="Codigo_Caso"
                        className="form-control"
                        value={codigoCaso}
                        onChange={(e) => setCodigoCaso(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un Código</option>
                        <option value="CASE001">Robo con Violencia</option>
                        <option value="CASE002">Homicidio</option>
                        <option value="CASE003">Fraude</option>
                        <option value="CASE004">Tráfico de Drogas</option>
                        <option value="CASE005">Secuestro</option>
                        <option value="CASE006">Lavado de Dinero</option>
                        <option value="CASE007">Asalto a Mano Armada</option>
                        <option value="CASE008">Delitos Cibernéticos</option>
                        <option value="CASE009">Violencia Doméstica</option>
                        <option value="CASE010">Extorsión</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Insertar Investigación</button>
            </form>
            <div className="d-flex justify-content-between mt-3">
                 <button
                    onClick={handleShowPolicias}
                    className="btn btn-primary mt-3"
                 >
                    {showTable ? 'Ocultar Policías Registrados' : 'Ver Policías Registrados'}
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
            </div>
        </div>
    );
};

export default InsertarInvestigacionView;
