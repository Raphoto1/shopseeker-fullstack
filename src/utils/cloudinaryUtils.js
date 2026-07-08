//imports de app
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageUploaderCloudinary = async (file, pCode, retries = 3) => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  // Validar archivo
  if (!file || file.size === 0) {
    throw new Error("empty or Invalid file");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Not a Valid Image");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Max file size allowed is (10 MB)");
  }

  // Convertir archivo a base64
  const fileBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(fileBuffer).toString("base64");
  const fileUri = `data:${file.type};base64,${base64String}`;

  // Retry logic con exponential backoff
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`Cloudinary upload attempt ${attempt + 1}/${retries}`);
      
      // Subir a Cloudinary con timeout
      const uploadResult = await Promise.race([
        cloudinary.uploader.upload(fileUri, {
          invalidate: true,
          timeout: 60000, // 60 segundos
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Upload timeout")), 90000) // 90 segundos fallback
        ),
      ]);
      
      return uploadResult.secure_url;
    } catch (error) {
      lastError = error;
      console.error(`Cloudinary upload error (attempt ${attempt + 1}):`, error.message);
      
      // Si es el último intento, lanzar error
      if (attempt === retries - 1) {
        console.error("Error en imageUploaderCloudinary:", error);
        throw new Error("Error uploading image to Cloudinary after multiple retries");
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const backoffMs = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${backoffMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  throw lastError || new Error("Error uploading image to Cloudinary");
};

export const imageDeleterCloudinary = async (photoUrl) => {
  const preFilter = photoUrl.lastIndexOf("/") + 1;
  const fileName = photoUrl.slice(preFilter);
  const fileNamefilter = fileName.lastIndexOf(".");
  const fileNameCLear = fileName.slice(0, fileNamefilter);
  const photoToDelete = await cloudinary.uploader.destroy(`${fileNameCLear}`, (result) => {
    console.log(result);
  });
  console.log(photoToDelete);
  return photoToDelete;
};

export const imageArrayPacker = async (imgs, pCode) => {
  // Procesar imágenes en paralelo con mejor manejo de errores
  try {
    const uploadedImages = await Promise.all(
      imgs.map(async (img, index) => {
        console.log(`Processing image ${index + 1}/${imgs.length}`);
        const urlSecondaryImg = await imageUploaderCloudinary(img, pCode);
        const objReady = await objectCreator(index, urlSecondaryImg);
        return objReady;
      })
    );
    return uploadedImages;
  } catch (error) {
    console.error("Error en imageArrayPacker:", error);
    throw error;
  }
};

const objectCreator = (index, string) => {
  let imageObj = {};
  imageObj["SIUrl"] = `${string}`;
  return imageObj;
};
