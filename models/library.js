

class Library {
    constructor(db) {
      this.db = db;
    }
  
    async createLibraryEntry(data) {
      const { userId, videoId, videoExternalId, status, title, libraryId } = data;
      const result = await this.db.query(
        'INSERT INTO library (user_id, video_id, video_external_id, status, title, library_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, videoId, videoExternalId, status, title, libraryId]
      );
      return result.rows[0];
    }

    async updateLibraryEntry(data) {
      console.log('Updating library entry with data:', data); // Log dos dados recebidos para atualização
    
      const { videoId, videoExternalId, status } = data;
      try {
        const result = await this.db.query(
          'UPDATE library SET video_external_id = $1, status = $2 WHERE video_id = $3 RETURNING *',
          [videoExternalId, status, videoId]
        );
    
        if (result.rows.length === 0) {
          console.log('No rows updated for videoId:', videoId); // Log se nenhuma linha foi atualizada
          return null;
        }
    
        console.log('Library entry updated:', result.rows[0]); // Log da entrada atualizada
        return result.rows[0];
      } catch (error) {
        console.error('Error executing update query:', error); // Log se houver um erro na query
        throw error;
      }
    }
    

    async getVideosByUser(userId) {
      try {
        const result = await this.db.query(
          'SELECT * FROM library WHERE user_id = $1',
          [userId]
        );
        return result.rows;
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      }
    }

    async getVideoById(videoId) {
      try {
        const result = await this.db.query(
          'SELECT * FROM library WHERE video_id = $1',
          [videoId]
        );
    
        if (result.rows.length === 0) {
          return null;
        }
    
        return result.rows[0];
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      }
    }

    async deleteVideoById(videoId) {
      try {
        const result = await this.db.query(
          'DELETE FROM library WHERE video_id = $1 RETURNING *',
          [videoId]
        );
    
        if (result.rows.length === 0) {
          return null;
        }
    
        return result.rows[0];
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      }
    }
    
    
  }
  module.exports = Library;
  