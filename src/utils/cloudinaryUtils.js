//imports de app
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageUploaderCloudinary = async (file, pCode) => {
  try {
    console.log("Iniciando subida a Cloudinary...");

    // Validar archivo
    if (!file || file.size === 0) {
      throw new Error("El archivo está vacío o no es válido");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("El archivo no es una imagen válida");
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("El archivo excede el tamaño máximo permitido (10 MB)");
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    console.log("bytes: ", bytes);

    const buffer = Buffer.from(bytes);
    console.log("buffer: ", buffer);

    console.log("Subiendo archivo a Cloudinary...");
    const cloudUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({}, (err, result) => {
        if (err) {
          console.error("Error en Cloudinary:", err);
          reject(err);
        } else {
          console.log("Subida exitosa:", result);
          resolve(result);
        }
      });
      uploadStream.end(buffer);
    });
    console.log("cloudUpload: ", cloudUpload);

    return cloudUpload.secure_url;
  } catch (error) {
    console.error("Error en imageUploaderCloudinary:", error);
    throw new Error("Error al subir la imagen a Cloudinary");
  }
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
  let secondaryPhotos = [];
  const packingPhotos = async (img, index) => {
    console.log(img);
    let urlSecondaryImg = await imageUploaderCloudinary(img, pCode);
    let objReady = await objectCreator(index, urlSecondaryImg);
    await secondaryPhotos.push(objReady);
  };
  //organizar la data del form, se crea promesa por delay de la db
  const test = await Promise.all(
    imgs.map(async (img, index) => {
      await packingPhotos(img, index);
    })
  );
  return secondaryPhotos;
};

const objectCreator = (index, string) => {
  let imageObj = {};
  imageObj["SIUrl"] = `${string}`;
  return imageObj;
};
