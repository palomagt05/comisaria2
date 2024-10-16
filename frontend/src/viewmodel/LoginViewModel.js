import UserModel from '../models/UserModel';

class LoginViewModel {
    constructor() {
        this.user = null;
    }

    async login(usuario, contrasena) {
        this.user = new UserModel(usuario, contrasena);

        const response = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: this.user.usuario,
                contrasena: this.user.contrasena
            }),
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('authToken', data.token); // Guarda el token en el almacenamiento local
        }
        return data;
    }
}

export default LoginViewModel;
