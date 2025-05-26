import User from '../models/User.js';
import Shipment from '../models/Shipment.js';

export const getUserWithVehicles = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('vehicles');
    res.status(200).json({ user: { ...user.toObject(), vehicles: user.vehicles.map(vehicle => ({ vehicle })) } });
  } catch (err) {
    console.error('Error al obtener usuario con vehículos:', err);
    res.status(500).json({ message: 'Error al obtener usuario con vehículos', error: err.message });
  }
};

export const getTransporterStatistics = async (req, res) => {
  try {
    const transporterId = req.user.id;

    // Obtener totales
    const disponibles = await Shipment.countDocuments({ 
      status: 'activated' // Envíos disponibles para ser tomados
    });
    
    const activos = await Shipment.countDocuments({ 
      transporter: transporterId, 
      status: { $in: ['accepted', 'in_transit'] } // Envíos activos del transportador
    });

    // Calcular los últimos 5 meses
    const currentDate = new Date();
    const monthsData = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      
      const nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);
      
      monthsData.push({
        date,
        nextMonth
      });
    }

    // Obtener estadísticas históricas de envíos disponibles
    const disponiblesStats = await Promise.all(
      monthsData.map(async (month) => {
        return await Shipment.countDocuments({
          status: 'activated',
          createdAt: {
            $gte: month.date,
            $lt: month.nextMonth
          }
        });
      })
    );

    // Obtener estadísticas históricas de envíos activos del transportador
    const activosStats = await Promise.all(
      monthsData.map(async (month) => {
        return await Shipment.countDocuments({
          transporter: transporterId,
          status: { $in: ['accepted', 'in_transit'] },
          updatedAt: { // Usar updatedAt porque es cuando se asigna el transportador
            $gte: month.date,
            $lt: month.nextMonth
          }
        });
      })
    );

    res.status(200).json({
      disponibles,
      activos,
      disponiblesStats,
      activosStats
    });
  } catch (err) {
    console.error('Error al obtener estadísticas del transportador:', err);
    res.status(500).json({ 
      message: 'Error al obtener estadísticas del transportador', 
      error: err.message 
    });
  }
};