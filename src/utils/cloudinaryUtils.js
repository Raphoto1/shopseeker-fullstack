//imports de app
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
  
export const imageUploaderCloudinary = async (file, pCode) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cloudUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        })
        .end(buffer);
    });
    return cloudUpload.secure_url;
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