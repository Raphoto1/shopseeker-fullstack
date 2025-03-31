//imports de app
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
  
export const imageUploaderCloudinary = async (file, pCode) => {
  try {
    const stream = file.stream(); // Obtén el stream del archivo
    const cloudUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "designs", public_id: `${pCode}-${Date.now()}` },
        (err, result) => {
          if (err) {
            console.error("Error uploading to Cloudinary:", err);
            reject(err);
          }
          resolve(result);
        }
      );
      stream.pipe(uploadStream); // Envía el stream al uploader de Cloudinary
    });
    return cloudUpload.secure_url;
  } catch (error) {
    console.error("Error in imageUploaderCloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
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