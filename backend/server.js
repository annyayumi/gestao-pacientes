const express = require('express');
const cors = require('cors');
const pacienteRoutes = require('./routes/pacienteRoutes');
const exameRoutes = require('./routes/exameRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', pacienteRoutes);
app.use('/api', exameRoutes); 

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
