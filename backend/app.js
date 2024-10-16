const express = require('express');
const bodyParser = require('body-parser'); // Opcional si usas express.json()
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const addRoutes = require('./routes/addRoutes'); 
const addpoliRoutes = require('./routes/poliRoutes');
const addarmaRoutes = require('./routes/armaRoutes');
const adddeliRoutes = require('./routes/delicuenteRoutes')
const delincuenteCalabozoRoutes = require('./routes/delincuenteCalabozoRoutes');
const casoRoutes = require('./routes/casoRoutes');
const habilidadRoutes = require('./routes/habilidadesRoutes');
const investigacionRoutes = require('./routes/investigacionRoutes');
const jefesRoutes = require('./routes/jefesRoutes');
const busqueda = require('./routes/busquedaRoutes')

const app = express();

app.use(cors());
app.use(express.json()); // Asegúrate de que esta línea esté presente para parsear JSON
app.use('/auth', authRoutes);
app.use('/add', addRoutes);
app.use('/addpoli', addpoliRoutes);
app.use('/addarma', addarmaRoutes);
app.use('/adddelincuente',adddeliRoutes);
app.use('/delincuente-calabozo', delincuenteCalabozoRoutes);
app.use('/delincuente-caso',casoRoutes);
app.use('/habilidades-poli',habilidadRoutes);
app.use('/api', investigacionRoutes);
app.use('/insertarj', jefesRoutes);
app.use('/delincuentes', busqueda)

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal en el servidor.');
});
