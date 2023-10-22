

const express = require('express');
const Library = require('../models/library');
const pool = require('../models/db'); 

const router = express.Router();
const libraryModel = new Library(pool);

router.post('/', async (req, res) => {
  try {
    const { userId, videoId, videoExternalId, status, title, libraryId } = req.body;

  

    const libraryEntry = await libraryModel.createLibraryEntry({
      userId,
      videoId,
      videoExternalId,
      status,
      title,
      libraryId,
    });

    res.status(201).json({ message: 'Entrada da biblioteca criada com sucesso!', libraryEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Algo deu errado!' });
  }
});

router.put('/:videoId', async (req, res) => {
  console.log('PUT request received for videoId:', req.params.videoId); // Log do ID do vídeo recebido
  console.log('Request body:', req.body); // Log do corpo da requisição

  try {
    const { videoExternalId, status } = req.body;
    const { videoId } = req.params;

    // Não passe userId, title, ou libraryId, já que eles não são usados na query atualizada
    const updatedLibraryEntry = await libraryModel.updateLibraryEntry({
      videoId,
      videoExternalId,
      status,
    });

    if (!updatedLibraryEntry) {
      console.log('No matching video entry found for:', videoId); // Log se a entrada não for encontrada
      return res.status(404).json({ message: 'Entrada da biblioteca não encontrada!' });
    }

    console.log('Video entry updated successfully:', updatedLibraryEntry); // Log de sucesso
    res.status(200).json({ message: 'Entrada da biblioteca atualizada com sucesso!', updatedLibraryEntry });
  } catch (error) {
    console.error('Error updating video entry:', error); // Log de erro
    res.status(500).json({ message: error.message || 'Algo deu errado!' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const videos = await libraryModel.getVideosByUser(userId);

    if (videos.length === 0) {
      return res.status(404).json({ message: 'Nenhum vídeo encontrado para este usuário!' });
    }

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: error.message || 'Algo deu errado!' });
  }
});

router.get('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await libraryModel.getVideoById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Vídeo não encontrado!' });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: error.message || 'Algo deu errado!' });
  }
});


module.exports = router;
