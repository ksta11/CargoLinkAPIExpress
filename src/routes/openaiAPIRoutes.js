import { Router } from 'express';
import { generateRecommendations } from '../services/openaiService.js'; // Importar la función

const router = Router();

router.post('/recommendations', async (req, res) => {
    const { titulo, descripcion, alto, ancho, largo, peso } = req.body;
  
    try {
      const recommendations = await generateRecommendations({ titulo, descripcion, alto, ancho, largo, peso });
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ message: 'Error al generar recomendaciones', error: error.message });
    }
  });
  
export default router;