import Review from "../models/Review";

export const createReview =  async (req, res) => {
    try{
        const { type, rating, comment, user, transporter, shipment } = req.body;

        const newReview = new Review({ type, rating, comment, user, transporter, shipment });

        await newReview.save();

        // Respuesta exitosa
        res.status(201).json({ message: 'Reseña creada exitosamente', newReview });

    } catch (err) {
        console.error('Error al crear una reseña:', err);
        res.status(400).json({ message: err.message });
    }
};