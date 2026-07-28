const {Pool} = require('pg');

const pool = new Pool({
    user  : 'postgres',
    host : 'localhost',
    database : 'web',
    password : 'zz1973',
    port : 5432,
});

module.exports = pool;

const express = require('express')
const app = express()
const port = 3000

const pool = require('./db');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World, sla!!')
})

app.get('/contato', (req, res) => {
  res.send('Entre em contato ou nao!')
})

app.get('/usuario/:nome', (req, res) =>{
    res.send('Oi usuario ' + req.params.nome)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/pessoas',async(req,res) => {
  try{
    const result = await pool.query('SELECT * FROM cliente');
    res.json(result.rows);
  }
  catch(err) {
    console.error('Erro na consulta', err.message);
    res.status(500).send('Erro no servidor');
  }
});
