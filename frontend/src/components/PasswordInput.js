// src/components/PasswordInput.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importar íconos de FontAwesome

const PasswordInput = ({ value, onChange, required }) => {
    const [showPassword, setShowPassword] = useState(false); // Estado para visibilidad de la contraseña

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <input
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                required={required}
                style={{ paddingRight: '30px' ,  width: '100%'}} // Asegúrate de que haya espacio para el ícono
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: 0
                }}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
    );
};

export default PasswordInput;
