const pool = require('./models/db'); // atualize com o caminho para o seu arquivo de configuração do banco de dados

pool.query('SELECT NOW()', (error, response) => {
    if (error) {
        console.error('Erro ao conectar-se ao banco de dados:', error);
        process.exit(-1); // Encerra o processo com um código de "erro"
    } else {
        console.log('Conexão bem-sucedida ao banco de dados:', response.rows[0]);
        pool.end(); // fecha a conexão do cliente
    }
});
