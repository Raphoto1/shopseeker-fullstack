//imports de app
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { diff, applyDiff } from "deep-diff";
import _ from "lodash";
//imports propios
import {
  mongoDbgetDesignsById,
  mongoDbCreateNewDesign,
  mongoDbGetAllDesigns,
  mongoDbUpdateDesign,
  mongoDbDeleteDesign,
  mongoDbUpdateDesignMultiple,
} from "@/dao/design.dao";
import { categories, shops } from "@/enums/SuperVariables";
//**codigo**
//cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllDesigns = async (limit, page, sortField, sortQ, queryKey, queryParam, filterCat, filterShop) => {
  //logica y organizacion de data
  //filtros y busqueda
  let limitIn = limit ? limit : 50;
  let pageIn = page ? page : 1;
  let sortFieldIn = sortField ? sortField : "title";
  let sortIn = sortQ ? { [sortFieldIn]: sortQ } : false;
  let queryKeyIn = queryKey;
  let queryIn = queryParam;
  let filterCategory = filterCat ? filterCat : false;
  let filterShops = filterShop ? filterShop : false;

  if (queryKeyIn) {
    queryKeyIn;
  } else {
    queryKeyIn = "title";
  }
  //empaqueto options
  let options = { limit: limitIn, page: pageIn, sort: sortIn };
  //se ajusta el termino a query a exp regular porque el mongo no acepta string directo
  //sin ^ para que tome tooodo el string

  let querySearch;
  if (queryKeyIn && queryIn) {
    const textToFind = queryIn.toLowerCase();
    const textToFindConverted = RegExp(textToFind, "i");
    querySearch = { [queryKeyIn]: textToFindConverted };
    options.limit = 5;
  } else {
    {
    }
  }
  //filtros de paquete
  let filterPack = {};

  //crear la busqueda de filtro
  //filtro por categoria
  if (filterCategory) {
    filterPack.category = filterCategory;
  } else {
    filterPack;
  }

  //filtro por tienda
  if (filterShops) {
    let filterShopToLow = filterShop.toLowerCase();
    let regularFilter = RegExp(filterShopToLow);
    filterPack["shops.shopUrl"] = regularFilter;
  } else {
    filterPack;
  }
  if (Object.entries(filterPack).length >= 1 && queryIn == null) {
    const designs = await mongoDbGetAllDesigns(filterPack, options);
    return designs;
  } else if (Object.entries(filterPack).length >= 1 && queryIn != null) {
    let complexQuery = { ...filterPack, ...querySearch };
    const designs = await mongoDbGetAllDesigns(complexQuery, options);
    return designs;
  } else {
    const designs = await mongoDbGetAllDesigns(querySearch, options);
    return designs;
  }
};

export const getDesignById = async (id) => {
  const design = await mongoDbgetDesignsById(id);
  if (design === null) {
    throw new Error("Design not Found");
  }
  return design;
};

export const createDesign = async (data) => {
  //manipular imagen para guardar en fs y crear el path
  const photo = data.get("photo");
  const secondary = data.getAll("secondaryImages");
  const testPhoto = data.get('photoTest');
  console.log('esto es testPhoto ',testPhoto);
  const dataToPush = Object.fromEntries(data);
  const pCode = dataToPush["pCode"];
  //manipular links de tiendas para empaquetar
  let shopspack = [];
  shops.map((shop) => {
    let shopToPush = shopFilter(dataToPush, shop, `url${shop}`);
    shopspack.push(shopToPush);
  });
  dataToPush["shops"] = shopspack;
  //organizar la data del form, se elimina la data de photo y se agrega el path
  console.log(secondary);
  let photosToPush = [];
  if (secondary[0].size === 0) {
    photosToPush = [];
  } else {
    photosToPush = await imageArrayPacker(secondary, pCode);
  }
  // console.log(photosToPush);
  dataToPush["secondaryImages"] = photosToPush;
  console.log('esto es photo',photo);
  const photoPath = await imageUploaderCloudinary(photo, pCode);
  // const photoPath = "url muy larga de cloud";
  dataToPush["photo"] = photoPath;
  //   se envia a DB
  const result = await mongoDbCreateNewDesign(dataToPush);
  // const result = dataToPush;
  return result;
};

export const updateDesign = async (data) => {
  const dataToUpdate = await Object.fromEntries(data);
  const id = dataToUpdate.id;
  const chkDesign = await mongoDbgetDesignsById(id);
  const photo = data.get("photo");
  const secondary = data.getAll("secondaryImages");
  let secondaryUpdate = dataToUpdate.secondaryUpdate;
  let updatePack = [];
  let shopsExist = false;
  let deletedSimgs = false;
  let secondaryImagesOld = [...chkDesign.secondaryImages];
  let secondaryImages = [];
  let newSimgs = [];
  let newSimgsExist = false;
  const shops = [...chkDesign.shops];
  const packingCycle = async (data) => {
    for (let item in data) {
      let field = item;
      if (data[item] === "") {
        continue;
      } else if (field === "photo") {
        if (photo.size === 0) {
          continue;
        }
        console.log(photo);
        const oldPhoto = chkDesign.photo;
        await imageDeleterCloudinary(oldPhoto);
        const newPhotoUrl = await imageUploaderCloudinary(photo);
        updatePack.push({ photo: newPhotoUrl });
      } else if (field === "secondaryUpdate") {
        deletedSimgs = true;
        //eliminar del cloud las imagenes eliminadas
        const updateTransformed = JSON.parse(secondaryUpdate);
        const deleteSimgs = (secondaryImagesOld, updateTransformed) => {
          const result = _.differenceWith(secondaryImagesOld, updateTransformed, _.isEqual);
          result.forEach((e) => {
            imageDeleterCloudinary(e.SIUrl);
          });
        };
        deleteSimgs(secondaryImagesOld, updateTransformed);
        secondaryImagesOld = JSON.parse(secondaryUpdate);
      } else if (field === "secondaryImages") {
        if (secondary[0].size === 0) {
          continue;
        }
        //se deja en test mientras se ajusta, desapues se pasa a real
        newSimgsExist = true;
        const imgsUrl = await imageArrayPacker(secondary);
        newSimgs = imgsUrl;
      } else if (item.startsWith("url")) {
        shopsExist = true;
        const shopName = field.replace("url", "");
        const shopToUpdateIndex = shops.findIndex((e) => e.shopName === `${shopName}`);
        shops[shopToUpdateIndex].shopUrl = data[item];
      } else if (field === "id") {
        continue;
      } else {
        updatePack.push({ [item]: data[item] });
      }
    }
    //revisar como cargarlo solo si llega info
    // updatePack.push(shops);
  };
  const secondaryImagesOrganizer = (delImgs, newImgs) => {
    let repackSimgs = [];
    if (deletedSimgs) {
      for (let item of delImgs) {
        repackSimgs.push(item);
      }
    } else {
      repackSimgs = secondaryImagesOld;
    }
    for (let item of newImgs) {
      repackSimgs.push(item);
    }
    updatePack.push({ secondaryImages: repackSimgs });
  };

  const pack = await packingCycle(dataToUpdate);
  shopsExist && updatePack.push({ shops: shops });
  if (deletedSimgs || newSimgsExist) {
    await secondaryImagesOrganizer(secondaryImagesOld, newSimgs);
  }
  const objUpdate = Object.fromEntries(updatePack.map((item) => Object.entries(item)[0]));
  const designToUpdate = await mongoDbUpdateDesignMultiple(id, objUpdate);
  // const designToUpdate = objUpdate;
  return designToUpdate;
};

export const deleteDesign = async (id) => {
  const designToDelete = await mongoDbgetDesignsById(id);
  if (designToDelete) {
    const designDeleted = await mongoDbDeleteDesign(id);
    return designDeleted;
  } else {
    throw new Error("design Not found");
  }
};

export const likeDesign = async (id, value) => {
  const chkDesign = await mongoDbgetDesignsById(id);
  const likeUpdate = value;
  if (chkDesign) {
    let likeToUpdate = chkDesign.likes;
    if (Math.sign(likeUpdate) === 1) {
      const likeToPush = likeToUpdate + 1;
      const designToUpdate = await mongoDbUpdateDesign(id, "likes", likeToPush);
      return designToUpdate;
    } else {
      if (likeToUpdate === 0) {
        return "no permited";
      } else {
        const likeToPush = likeToUpdate - 1;
        const designToUpdate = await mongoDbUpdateDesign(id, "likes", likeToPush);
        return designToUpdate;
      }
    }
  } else {
    throw new Error("Design Not Found");
  }
};

const imageFileUploaderDesign = async (file, pCode) => {
  if (file.size === 0) {
    throw new Error("please add a photo");
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${pCode}-design-${file.name}`;
  if (fs.existsSync(`public/img/designs/${fileName}`)) {
    console.log("el archivo ya existe");
    throw new Error("filename already on database, please change the file name or pCode and try again");
  } else {
    const filePath = path.join(process.cwd(), "public/img/designs", fileName);
    await fs.writeFileSync(filePath, buffer, (error) => {
      return error;
    });
    return fileName;
  }
};

const imageUploaderCloudinary = async (file, pCode) => {
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

const imageDeleterCloudinary = async (photoUrl) => {
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

const objectCreator = (index, string) => {
  let imageObj = {};
  imageObj["SIUrl"] = `${string}`;
  return imageObj;
};

const imageArrayPackerTest = async (imgs) => {
  console.log("entro a pack test");
  let secondaryPhotos = [];
  const packingPhotos = async (img, index) => {
    const objectReady = await objectCreator(index, img.name);
    secondaryPhotos.push(objectReady);
  };
  const test = await Promise.all(
    imgs.map(async (img, index) => {
      await packingPhotos(img, index);
    })
  );
  return secondaryPhotos;
};

const imageArrayPacker = async (imgs, pCode) => {
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

const shopFilter = (arr, shopName, shopUrl) => {
  let shop = {};
  if (arr[`${shopUrl}`]) {
    shop["shopName"] = `${shopName}`;
    shop["shopUrl"] = `${arr[shopUrl]}`;
    return shop;
  } else {
    shop["shopName"] = `${shopName}`;
    shop["shopUrl"] = `null`;
    return shop;
  }
};
