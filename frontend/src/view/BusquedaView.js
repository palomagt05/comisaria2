import React, { useState } from 'react';
import axios from 'axios';

const SearchDelincuentesView = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [delincuentes, setDelincuentes] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:3001/delincuentes/search', {
                params: { searchQuery }
            });

            const { delincuentes: delincuentesData, casosDelincuentes, delincuentesCalabozo, investigaciones } = response.data;

            // Combinar datos
            const delincuentesCompletos = delincuentesData.map((delincuente) => {
                const caso = casosDelincuentes.find((c) => c.CURP_Delincuente === delincuente.CURP);
                const calabozo = caso ? delincuentesCalabozo.find((c) => c.CURP_Delincuente === caso.CURP_Delincuente) : null;
                const investigacion = caso ? investigaciones.find((i) => i.Codigo_Caso === caso.Codigo_Caso) : null;

                return {
                    CURP: delincuente.CURP,
                    Nombre: delincuente.Nombre || 'Nombre no disponible',
                    Telefono: delincuente.Telefono || 'Teléfono no disponible',
                    Direccion: delincuente.Direccion || 'Dirección no disponible',
                    Codigo_Caso: caso ? caso.Codigo_Caso : 'Desconocido',
                    Codigo_Calabozo: calabozo ? calabozo.Codigo_Calabozo : 'Desconocido',
                    RFC_Policia: investigacion ? investigacion.RFC_Policia : 'Desconocido'
                };
            });

            setDelincuentes(delincuentesCompletos);
            setError('');
        } catch (error) {
            console.error('Error al buscar delincuentes:', error);
            setError('Error al buscar delincuentes');
            setDelincuentes([]);
        }
    };

    const getUbicacion = (codigoCalabozo) => {
        switch (codigoCalabozo) {
            case 'CAL001': return 'Bloque A, Nivel 1';
            case 'CAL002': return 'Bloque A, Nivel 2';
            case 'CAL003': return 'Bloque B, Nivel 1';
            case 'CAL004': return 'Bloque B, Nivel 2';
            case 'CAL005': return 'Bloque C, Nivel 1';
            case 'CAL006': return 'Bloque C, Nivel 2';
            case 'CAL007': return 'Bloque D, Nivel 1';
            case 'CAL008': return 'Bloque D, Nivel 2';
            case 'CAL009': return 'Bloque E, Nivel 1';
            case 'CAL010': return 'Bloque E, Nivel 2';
            default: return 'Desconocido';
        }
    };

    const getCaso = (codigoCaso) => {
        switch (codigoCaso) {
            case 'CASE001': return 'Robo con Violencia';
            case 'CASE002': return 'Homicidio';
            case 'CASE003': return 'Fraude';
            case 'CASE004': return 'Tráfico de Drogas';
            case 'CASE005': return 'Secuestro';
            case 'CASE006': return 'Lavado de Dinero';
            case 'CASE007': return 'Asalto a Mano Armada';
            case 'CASE008': return 'Delitos Cibernéticos';
            case 'CASE009': return 'Violencia Doméstica';
            case 'CASE010': return 'Extorsión';
            default: return 'Desconocido';
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Buscar Delincuentes</h2>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por CURP o Nombre"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch} className="btn btn-primary mt-2">Buscar</button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {delincuentes.length > 0 && (
                <table className="table table-striped mt-4">
                    <thead>
                        <tr>
                            <th>CURP</th>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Calabozo Asignado</th>
                            <th>Caso Relacionado</th>
                            <th>Policía Asignado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {delincuentes.map((delincuente, index) => (
                            <tr key={index}>
                                <td>{delincuente.CURP}</td>
                                <td>{delincuente.Nombre}</td>
                                <td>{delincuente.Telefono}</td>
                                <td>{delincuente.Direccion}</td>
                                <td>{getUbicacion(delincuente.Codigo_Calabozo)}</td>
                                <td>{getCaso(delincuente.Codigo_Caso)}</td>
                                <td>{delincuente.RFC_Policia}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SearchDelincuentesView;
