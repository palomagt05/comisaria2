import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/option.css';

const InsertarJefeView = () => {
    const [rfcJefeByCategory, setRfcJefeByCategory] = useState({});
    const [rfcSubordinadosByCategory, setRfcSubordinadosByCategory] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [policias, setPolicias] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async (category) => {
        const rfcJefe = rfcJefeByCategory[category] || '';
        const rfcSubordinados = rfcSubordinadosByCategory[category] || [];
    
        if (!rfcJefe || rfcSubordinados.length === 0) {
            setError('Debes seleccionar un jefe y al menos un subordinado para la categoría seleccionada');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:3001/insertarj/jefes', {
                rfcJefe,
                rfcSubordinados: rfcSubordinados.join(','),
                categoriaJefe: category
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 201) {
                setMessage(response.data.message);
                setRfcJefeByCategory(prev => ({ ...prev, [category]: '' }));
                setRfcSubordinadosByCategory(prev => ({ ...prev, [category]: [] }));
            
                navigate('/admin/insertar-jefe', { replace: true });
                window.location.reload(); // Recargar la página
            } else {
                setError('Error al insertar la relación de jefe y subordinados');
            }
        } catch (error) {
            console.error('Error al insertar la relación de jefe y subordinados:', error);
            setError('Error al insertar la relación de jefe y subordinados: ' + error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        const fetchPolicias = async () => {
            try {
                const response = await axios.get('http://localhost:3001/addpoli/policias');
                if (response.status === 200) {
                    setPolicias(response.data);
                } else {
                    setError('Falló en buscar los policías');
                }
            } catch (error) {
                console.error('Error al buscar policías:', error);
                setError('Se produjo un error al buscar policías');
            }
        };

        fetchPolicias();
    }, []);

    const getCategoria = (categoria) => {
        switch (categoria) {
            case 1: return 'Policía Municipal';
            case 2: return 'Policía Estatal';
            case 3: return 'Policía Ministerial';
            case 4: return 'Policía Vial';
            case 5: return 'Policía Turística';
            case 6: return 'Policía Auxiliar';
            case 7: return 'Administrador';
            default: return 'Desconocido';
        }
    };

    const categorizePolicias = () => {
        const categories = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
        };

        policias.forEach(poli => {
            if (categories[poli.Categoria]) {
                categories[poli.Categoria].push(poli);
            }
        });

        return categories;
    };

    const categorizedPolicias = categorizePolicias();

    const handleCheckboxChange = (e, type, category) => {
        const value = e.target.value;
        if (type === 'jefe') {
            setRfcJefeByCategory(prevState => ({
                ...prevState,
                [category]: value
            }));
        } else if (type === 'subordinado') {
            setRfcSubordinadosByCategory(prevState => ({
                ...prevState,
                [category]: e.target.checked
                    ? [...(prevState[category] || []), value]
                    : (prevState[category] || []).filter(rfc => rfc !== value)
            }));
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Listado de Policías por Categoría</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            {Object.keys(categorizedPolicias).map((cat) => (
                <div key={cat} className="mt-5">
                    <h3>{getCategoria(parseInt(cat))}</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>RFC</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Jefe</th>
                                <th>Subordinado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorizedPolicias[parseInt(cat)].map((poli) => (
                                <tr key={poli.RFC}>
                                    <td>{poli.RFC}</td>
                                    <td>{poli.Nombre}</td>
                                    <td>{getCategoria(poli.Categoria)}</td>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            name="jefe"
                                            className="custom-checkbox" 
                                            id={`rfcJefe-${poli.RFC}`}
                                            value={poli.RFC}
                                            checked={rfcJefeByCategory[cat] === poli.RFC}
                                            onChange={(e) => handleCheckboxChange(e, 'jefe', parseInt(cat))}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            name="subordinado"
                                            className="custom-checkbox" 
                                            id={`rfcSubordinado-${poli.RFC}`}
                                            value={poli.RFC}
                                            checked={(rfcSubordinadosByCategory[cat] || []).includes(poli.RFC)}
                                            onChange={(e) => handleCheckboxChange(e, 'subordinado', parseInt(cat))}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" className="btn btn-primary" onClick={() => handleSubmit(parseInt(cat))}>
                        Insertar Relación
                    </button>
                </div>
            ))}

            <button onClick={() => navigate('/admin')} className="btn btn-secondary mt-3">
                Regresar
            </button>
        </div>
    );
};

export default InsertarJefeView;
