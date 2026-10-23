require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const sequelize = require('./config/database');
const swaggerSpec = require('./swagger');

const userRoute = require('./routes/userRoute');
const clienteRoute = require('./routes/clienteRoute');
const tecnicoRoute = require('./routes/tecnicoRoute');
const pecaRoute = require('./routes/pecaRoute');
const servicoRoute = require('./routes/servicoRoute');
const osRoutes = require('./routes/osRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const horarioDisponivelRoutes = require('./routes/horarioDisponivelRoutes');
const orcamentoRoutes = require('./routes/orcamentoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas que já definem o caminho completo dentro do arquivo
app.use(userRoute);
app.use(clienteRoute);
app.use(tecnicoRoute);
app.use(pecaRoute);
app.use(servicoRoute);

// Rotas que usam '/' e dependem do prefixo montado aqui
app.use('/os', osRoutes);
app.use('/agendamentos', agendamentoRoutes);
app.use('/horarios', horarioDisponivelRoutes);
app.use('/orcamentos', orcamentoRoutes);

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Conexao com o banco de dados PostgreSQL realizada com sucesso!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Nao foi possivel conectar ao banco de dados:', error.message);
    process.exit(1);
  });