import axios from 'axios'

const apiUploadCV = async (cvFile) => {
    try {
        const formData = new FormData();
        formData.append("file", cvFile);
        formData.append("upload_preset", process.env.REACT_APP_UPDATE_ACCESS_NAME);

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/raw/upload`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return {
            success: true,
            url: response.data.secure_url,
            publicId: response.data.public_id
        };
    } catch (error) {
        console.error('Error uploading CV to Cloudinary:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export default apiUploadCV;