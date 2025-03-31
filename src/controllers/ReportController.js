const Report = require('../models/Report');

// Obtener todos los reportes
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('reportingUser reportedUser reportedShipment');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los reportes', error });
    }
};

// Obtener un reporte por ID
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).populate('reportingUser reportedUser reportedShipment');
        if (!report) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el reporte', error });
    }
};

// Crear un nuevo reporte
exports.createReport = async (req, res) => {
    try {
        const report = new Report(req.body);
        const savedReport = await report.save();
        res.status(201).json(savedReport);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el reporte', error });
    }
};

// Actualizar un reporte existente
exports.updateReport = async (req, res) => {
    try {
        const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el reporte', error });
    }
};

// Eliminar un reporte
exports.deleteReport = async (req, res) => {
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
