// const axios = require('axios');
// const FormData = require('form-data');
// require('dotenv').config();
import axios from 'axios'

// const uploadImage = async (fileBuffer) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', fileBuffer, { filename: 'uploaded-image' });
//     formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);

//     const response = await axios.post(
//       `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_300`,
//       formData,
//       {
//         headers: {
//           ...formData.getHeaders(),
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Cloudinary Error:', error.response?.data || error.message);
//     throw new Error('Error al subir la imagen');
//   }
// };

// export default { uploadImage };