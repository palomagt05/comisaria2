import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InsertarHabilidadView = () => {
    const [rfcPolicia, setRfcPolicia] = useState('');
    const [codigoArma, setCodigoArma] = useState('');
    const [habilidad, setHabilidad] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [armas, setArmas] = useState([]);
    const [showTable, setShowTable] = useState(false); 
    const [policias, setPolicias] = useState([]);
    const [showTable2, setShowTable2] = useState(false); 


    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('http://localhost:3001/habilidades-poli/habilidad', { rfcPolicia, codigoArma, habilidad });
            if (response.status === 201) {
                setMessage(response.data.message);
                setRfcPolicia('');
                setCodigoArma('');
                setHabilidad('');
                navigate('/admin/insertar-habilidad', { replace: true });
            } else {
                setError('Error al insertar la habilidad');
            }
        } catch (error) {
            setError('Error al insertar la habilidad');
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
        if (!showTable2) {
            fetchArmas();
        }
        setShowTable2(!showTable2);
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

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Insertar Habilidad del Policía</h2>
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
                    <label htmlFor="codigoArma" className="form-label">Código Arma:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="codigoArma"
                        value={codigoArma}
                        onChange={(e) => setCodigoArma(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="habilidad" className="form-label">Habilidad:</label>
                    <select
                        id="habilidad"
                        className="form-control"
                        value={habilidad}
                        onChange={(e) => setHabilidad(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un Nivel</option>
                        <option value="1"> Nivel 1</option>
                        <option value="2"> Nivel 2</option>
                        <option value="3"> Nivel 3</option>
                        <option value="4"> Nivel 4</option>
                        <option value="5"> Nivel 5</option>
                        <option value="6"> Nivel 6</option>
                        <option value="7"> Nivel 7</option>
                        <option value="8"> Nivel 8</option>
                        <option value="9"> Nivel 9</option>
                        <option value="10"> Nivel 10</option>                    
                    </select>

                </div>

                <button type="submit" className="btn btn-primary">Insertar Habilidad</button>
            </form>
            <div className="d-flex justify-content-between mt-3">
                <button
                    onClick={handleShowPolicias}
                    className="btn btn-primary mt-3"
                >
                    {showTable ? 'Ocultar Policías Registrados' : 'Ver Policías Registrados'}
                </button>
                <button
                        onClick={handleShowArmas}
                        className="btn btn-primary mt-3"
                    >
                        {showTable2 ? 'Ocultar Armas Registradas' : 'Ver Armas Registradas'}
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
                        <h3>Armas Registradas</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Clase</th>
                                </tr>
                            </thead>
                            <tbody>
                                {armas.map((arma, index) => (
                                    <tr key={index}>
                                        <td>{arma.Codigo}</td>
                                        <td>{arma.Clase}</td>
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

export default InsertarHabilidadView;
