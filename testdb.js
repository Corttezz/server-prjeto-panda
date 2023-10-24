const pool = require('./models/db'); 

pool.query('SELECT NOW()', (error, response) => {
    if (error) {
        console.error('Erro ao conectar-se ao banco de dados:', error);
        process.exit(-1); 
    } else {
        console.log('Conexão bem-sucedida ao banco de dados:', response.rows[0]);
        pool.end(); // fecha a conexão
    }
});
