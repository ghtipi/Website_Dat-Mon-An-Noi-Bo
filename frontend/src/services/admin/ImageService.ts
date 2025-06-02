import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = 'dew0duolg';
const CLOUDINARY_UPLOAD_PRESET = 'upload-m4nooq3a';

interface UploadImageResponse {
  secure_url: string;
  public_id: string;
}

/**
 * Upload image directly to Cloudinary
 * @param file - File object from input[type="file"]
 * @returns { secure_url, public_id }
 */
export const uploadImage = async (
  file: File
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return {
      secure_url: response.data.secure_url,
      public_id: response.data.public_id
    };
  } catch (error: any) {
    console.error('Error uploading image:', error.response ?? error.message ?? error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Delete image by public_id via your Laravel API
 * @param publicId - The public_id returned by Cloudinary when uploading
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await axios.delete('http://localhost:8000/api/images', {
      data: { public_id: publicId }
    });
  } catch (error: any) {
    console.error('Error deleting image:', error.response ?? error.message ?? error);
    throw new Error('Failed to delete image');
  }
};
