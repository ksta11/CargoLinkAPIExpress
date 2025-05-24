import Report from '../models/Report.js';
import mongoose from 'mongoose';

// Obtener todos los reportes
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
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
        res.status(200).json({ reports: reports.map(report => ({ report })) });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los reportes', error });
    }
};

// Obtener reportes de un usuario (reportes creados por el usuario y reportes donde el usuario es reportado)
export const getUserReports = async (req, res) => {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        
        const { getUserReports } = await import('../services/reportService.js');
        const reports = await getUserReports(userId);
        
        res.status(200).json({ reports: reports.map(report => ({ report })) });
    } catch (error) {
        console.error('Error al obtener reportes del usuario:', error);
        res.status(500).json({ message: 'Error al obtener reportes del usuario', error: error.message });
    }
};

// Obtener un reporte por ID
export const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
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
        
        if (!report) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el reporte', error });
    }
};

// Crear un nuevo reporte
export const createReport = async (req, res) => {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        let reportData = {
            ...req.body,
            reportingUser: userId // Asignar el ID del usuario autenticado
        };

        // Si hay un envío reportado, obtenemos información adicional
        if (reportData.reportedShipment) {
            const Shipment = mongoose.model('Shipment');
            const shipment = await Shipment.findById(reportData.reportedShipment);
            
            if (!shipment) {
                return res.status(404).json({ message: 'Envío no encontrado' });
            }

            // Verificar diferentes escenarios según el tipo de usuario que reporta
            if (reportData.reportingUserType === 'User') {
                // Verificar que el usuario sea el cliente del envío
                if (shipment.client.toString() !== userId) {
                    return res.status(403).json({ 
                        message: 'No tienes permiso para reportar este envío como cliente'
                    });
                }
                
                // Si se está reportando a un transportador
                if (reportData.reportedUserType === 'Transporter') {
                    // Verificar que el envío tenga un transportador asignado
                    if (!shipment.transporter) {
                        return res.status(400).json({ 
                            message: 'Este envío no tiene un transportador asignado para reportar'
                        });
                    }
                    // Asignar el transportador del envío como usuario reportado
                    reportData.reportedUser = shipment.transporter;
                }
            } 
            else if (reportData.reportingUserType === 'Transporter') {
                // Verificar que el usuario sea el transportador del envío
                if (!shipment.transporter || shipment.transporter.toString() !== userId) {
                    return res.status(403).json({ 
                        message: 'No tienes permiso para reportar este envío como transportador'
                    });
                }
                
                // Si se está reportando a un cliente
                if (reportData.reportedUserType === 'User') {
                    // Asignar el cliente del envío como usuario reportado
                    reportData.reportedUser = shipment.client;
                }
            }
        }
        
        // Si no se proporciona reportedUserType y el tipo de usuario es cliente,
        // no incluir reportedUser (reporte sobre el envío sin transportador)
        if (!reportData.reportedUserType && reportData.reportingUserType === 'User') {
            delete reportData.reportedUser;
        }

        const report = new Report(reportData);
        const savedReport = await report.save();
        
        res.status(201).json({ 
            message: 'Reporte creado con éxito', 
            report: savedReport 
        });
    } catch (error) {
        console.error('Error al crear reporte:', error);
        res.status(400).json({ message: 'Error al crear el reporte', error: error.message });
    }
};

// Actualizar un reporte existente
export const updateReport = async (req, res) => {
    try {
        const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json(updatedReport);    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el reporte', error });
    }
};

// Eliminar un reporte
export const deleteReport = async (req, res) => {
    try {
        const deletedReport = await Report.findByIdAndDelete(req.params.id);
        if (!deletedReport) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json({ message: 'Reporte eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el reporte', error });
    }
};
