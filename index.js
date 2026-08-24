const express = require('express');
const sequelize = require('./config/database'); // Ajuste o caminho da sua conexão com o banco

// Importação das Rotas
const userRoute = require('./routes/userRoute');
const clienteRoute = require('./routes/clienteRoute');
const tecnicoRoute = require('./routes/tecnicoRoute');
const pecaRoute = require('./routes/pecaRoute');
const servicoRoute = require('./routes/servicoRoute');
const OSRoute = require('./routes/OSRoute');

const app = express();

// Middleware para interpretar requisições JSON
app.use(express.json());

// Registro das Rotas
app.use(userRoute);
app.use(clienteRoute);
app.use(tecnicoRoute);
app.use(pecaRoute);
app.use(servicoRoute);
app.use(OSRoute);

// Teste de conexão com o banco e inicialização do servidor
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados PostgreSQL realizada com sucesso!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Não foi possível conectar ao banco de dados:', error);
  });
