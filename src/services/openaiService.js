import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Configuración de la clave de API
});

export const generateRecommendations = async (data) => {
  const messages = [
    {
      role: 'system',
      content: `Actúa como un experto en logística con 15 años de experiencia en empaque y envíos. Analiza los siguientes datos para generar recomendaciones:
      
**Instrucciones específicas:**
1. Evalúa primero la calidad de la información:
   - Si el título/descripción es vago (menos de 20 palabras o términos genéricos como "objeto", "producto"), genera recomendaciones basadas únicamente en dimensiones y peso, indicando claramente esta limitación.
   - Si la descripción es detallada, ofrece sugerencias personalizadas.

2. Estructura la respuesta en 4 partes:
   [Evaluación de Información]
   - Explícitamente indica si la información es suficiente o no
   - Menciona qué factores no pudieron considerarse por falta de datos (si aplica)

   [Recomendaciones Básicas] (siempre aplicables)
   - Tipo de caja/embalaje sugerido según dimensiones
   - Material de relleno necesario basado en peso
   - Técnica de empaque genérica

   [Recomendaciones Específicas] (solo si hay datos suficientes)
   - Protecciones especiales
   - Consideraciones de fragilidad
   - Posicionamiento ideal

   [Consejos Adicionales]
   - Cómo mejorar la descripción para futuros envíos
   - Señales de advertencia que debería agregar al paquete

3. Usa un tono profesional pero directo. Si la información es limitada:
   - Destaca claramente: "RECOMENDACIÓN GENERAL (por información limitada):"
   - Explica cómo una mejor descripción permitiría sugerencias más precisas
   - Sugiere preguntas clave que el usuario debería responderse para mejorar el empaque`,
    },
    {
      role: 'user',
      content: `
**Datos del envío:**
- Título: ${data.titulo}
- Descripción: ${data.descripcion}
- Dimensiones: ${data.alto}cm (alto) × ${data.ancho}cm (ancho) × ${data.largo}cm (largo)
- Peso: ${data.peso} kg`,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error al generar recomendaciones:', error);
    throw new Error('No se pudo generar la recomendación.');
  }
};