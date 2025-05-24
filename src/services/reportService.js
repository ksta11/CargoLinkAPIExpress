import Report from '../models/Report.js';

// Obtener un reporte por su ID
export const getReportById = async (id) => {
  return await Report.findById(id);
};

// Obtener reportes por usuario reportado
export const getReportsByReportedUser = async (userId) => {
  return await Report.find({ reportedUser: userId });
};

// Obtener reportes por usuario que reporta y por usuario reportado
export const getUserReports = async (userId) => {
  return await Report.find({
    $or: [
      { reportingUser: userId },
      { reportedUser: userId }
    ]
  })
  .populate({
    path: 'reportingUser',
    select: 'name lastname email phone role'
  })
  .populate({
    path: 'reportedUser',
    select: 'name lastname email phone role'
  })
  .populate({
    path: 'reportedShipment',
    select: 'title pickupAddress deliveryAddress status'
  });
};

// Obtener reportes por usuario que reporta
export const getReportsByReportingUser = async (userId) => {
  return await Report.find({ reportingUser: userId });
};

// Obtener reportes por envío
export const getReportsByShipment = async (shipmentId) => {
  return await Report.find({ reportedShipment: shipmentId });
};

// Obtener estadísticas de reportes
export const getReportStats = async () => {
  const totalReports = await Report.countDocuments();
  const pendingReports = await Report.countDocuments({ status: 'pending' });
  const resolvedReports = await Report.countDocuments({ status: 'resolved' });
  const closedReports = await Report.countDocuments({ status: 'closed' });
  
  return {
    total: totalReports,
    pending: pendingReports,
    resolved: resolvedReports,
    closed: closedReports
  };
};
