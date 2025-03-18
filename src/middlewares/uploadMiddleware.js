// const multer = require('multer');
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Solo se permiten imágenes'), false);
//     }
//   },
// });

// export default upload;