import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistroCasoView = () => {
    const [Codigo_Caso, setCodigo_Caso] = useState('');
    const [CURP_Delincuente, setCURP_Delincuente] = useState('');
    const [Juzgado, setJuzgado] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showTable, setShowTable] = useState(false); 
    const [delincuente, setdelincuente] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('http://localhost:3001/delincuente-caso/register', { Codigo_Caso, CURP_Delincuente, Juzgado });
            if (response.status === 201) {
                setMessage(response.data.message);
                setCodigo_Caso('');
                setCURP_Delincuente('');
                setJuzgado('');
                navigate('/admin/register-case', { replace: true });
                window.location.reload(); // Recargar la página después del registro
            } else {
                setError('Error al registrar el caso');
            }
        } catch (error) {
            setError('Error al registrar el caso');
        }
    };
    const fetchdelincuente = async () => {
        try {
            const response = await fetch('http://localhost:3001/adddelincuente/delincuente');
            const data = await response.json();

            if (response.ok) {
                setdelincuente(data);
            } else {
                setError('Falló en buscar los delincuente');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('se produjo un error al buscar delincuente');
        }
    };

    const handleShowdelincuente = () => {
        if (!showTable) {
            fetchdelincuente();
        }
        setShowTable(!showTable);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Registrar Caso</h2>
            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}
                
                <div className="mb-3">
                    <label htmlFor="Codigo_Caso" className="form-label">Caso:</label>
                    <select
                        id="Codigo_Caso"
                        className="form-control"
                        value={Codigo_Caso}
                        onChange={(e) => setCodigo_Caso(e.target.value)}
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

                <div className="mb-3">
                    <label htmlFor="CURP_Delincuente" className="form-label">CURP Delincuente:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="CURP_Delincuente"
                        value={CURP_Delincuente}
                        onChange={(e) => setCURP_Delincuente(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Juzgado" className="form-label">Juzgado:</label>
                    <select
                        id="Juzgado"
                        className="form-control"
                        value={Juzgado}
                        onChange={(e) => setJuzgado(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un Juzgado</option>
                        <option value="JP1">Juzgado Penal 1</option>
                        <option value="JP2">Juzgado Penal 2</option>
                        <option value="JP3">Juzgado Penal 3</option>
                        <option value="JP4">Juzgado Penal 4</option>
                        <option value="JP5">Juzgado Penal 5</option>
                        <option value="JP6">Juzgado Penal 6</option>
                        <option value="JP7">Juzgado Penal 7</option>
                        <option value="JP8">Juzgado Penal 8</option>
                        <option value="JP9">Juzgado Penal 9</option>
                        <option value="JP10">Juzgado Penal 10</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Registrar Caso</button>
            </form>
            <div className="d-flex justify-content-between mt-3">
                 <button
                    onClick={handleShowdelincuente}
                    className="btn btn-primary mt-3"
                 >
                    {showTable ? 'Ocultar Delincuentes Registrados' : 'Ver Delincuentes Registrados'}
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
                        <h3>Delincuentes Registrados</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>CURP</th>
                                    <th>Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {delincuente.map((delincuente, index) => (
                                    <tr key={index}>
                                        <td>{delincuente.CURP}</td>
                                        <td>{delincuente.Nombre}</td>
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

export default RegistroCasoView;
