const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');
const User = require('../models/user');
const axios = require('axios');


const router = express.Router();

// Função auxiliar para validar os dados de entrada
const validateUserData = (email, password, name = null) => {
  if (!email || !email.includes('@')) {
    throw new Error('Email inválido.');
  }
  if (!password || password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }
  if (name && name.length < 3) {
    throw new Error('O nome deve ter pelo menos 3 caracteres.');
  }
};


router.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    const { email, password, name } = req.body;

    // Validação de dados de entrada
    validateUserData(email, password, name);

    const hashedPassword = await bcrypt.hash(password, 12);

    // Inserir usuário no banco de dados
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *', 
      [email, hashedPassword, name]
    );
    const user = result.rows[0];

    // Fazer a requisição para a API externa
    const pandaResponse = await axios.post('https://api-v2.pandavideo.com.br/folders', {
      parent_folder_id: "5280efe8-09af-445e-8e94-08f46f1a6ef9",
      name: email
    }, {
      headers: {
        'Authorization': 'panda-f3c410ff76dad651c9834316eaa3cf45725ae97abc2162ad9abbe01b170c44e5',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Verificar se a requisição foi bem-sucedida
    if (pandaResponse.data && pandaResponse.data.id) {
      const folderId = pandaResponse.data.id;

      // Atualizar o usuário no banco de dados com o library_id
      await pool.query(
        'UPDATE users SET library_id = $1 WHERE id = $2',
        [folderId, user.id]
      );

      res.status(201).json({ message: 'Usuário criado!', userId: user.id, libraryId: folderId });
    } else {
      throw new Error('Não foi possível obter o ID do folder da API externa');
    }
  } catch (error) {
    console.error(error); // Logando o erro no console do servidor
    res.status(500).json({ message: error.message || 'Algo deu errado!' });
  }
});


// Rota de Login

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação de dados de entrada
    validateUserData(email, password);

    // Verificar se o usuário existe
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado!' });
    }

    // Comparar senhas
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(401).json({ message: 'Senha incorreta!' });
    }

    // Gerar token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', { expiresIn: '1h' });

    // Enviar resposta de sucesso
    res.status(200).json({ 
      message: 'Login bem-sucedido!', // Mensagem de sucesso
      token: token, 
      userId: user.id 
    });
  } catch (error) {
    console.error(error); // Logando o erro no console do servidor
    res.status(500).json({ message: error.message || 'Algo deu errado!' });
  }
});

// Rota para obter dados do usuário
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Verificar se o usuário existe
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Enviar resposta de sucesso
    res.status(200).json({ user: user });
  } catch (error) {
    console.error(error); // Logando o erro no console do servidor
    res.status(500).json({ message: error.message || 'Algo deu errado!' });
  }
});



module.exports = router;
