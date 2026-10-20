const express = require('express');
const sequelize = require('./config/database');


const userRoute = require('./routes/userRoute');
const clienteRoute = require('./routes/clienteRoute');
const tecnicoRoute = require('./routes/tecnicoRoute');
const pecaRoute = require('./routes/pecaRoute');
const servicoRoute = require('./routes/servicoRoute');
const OSRoute = require('./routes/OSRoute');

const app = express();

app.use(express.json());
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./swagger');

app.use(userRoute);
app.use(clienteRoute);
app.use(tecnicoRoute);
app.use(pecaRoute);
app.use(servicoRoute);
app.use(OSRoute);

const PORT = process.env.PORT || 3000;

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

sequelize.authenticate()
  .then(() => {
    console.log('Conexao com o banco de dados PostgreSQL realizada com sucesso!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Nao foi possivel conectar ao banco de dados:', error);
  });
