//imports de app
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
//imports propios
import { mongoDbgetDesignsById, mongoDbCreateNewDesign, mongoDbGetAllDesigns, mongoDbUpdateDesign, mongoDbDeleteDesign } from "@/dao/design.dao";
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
    const textToFindConverted = RegExp(textToFind,'i');
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
  const photoPath = await imageUploaderCloudinary(photo, pCode);
  dataToPush["photo"] = photoPath;
  //   se envia a DB
  const result = await mongoDbCreateNewDesign(dataToPush);
  // const result = dataToPush
  return result;
};

export const updateDesign = async (data) => {
  const dataToUpdate = Object.fromEntries(data);
  const id = dataToUpdate.id;
  const field = dataToUpdate.field;
  const photo = data.get("photo");
  const dataToPush = dataToUpdate.data;
  const url = dataToUpdate.url;
  const idCaptured = dataToUpdate.idCaptured;
  const chkDesign = await mongoDbgetDesignsById(dataToUpdate.id);
  if (!chkDesign) {
    throw new Error("design does not exist");
  }
  if (field === "photo") {
    //organizo data para db y fs
    let pCode = chkDesign.pCode;
    const photoPush = await imageUploaderCloudinary(photo, pCode);
    const designToUpdate = await mongoDbUpdateDesign(id, field, photoPush);
    return designToUpdate;
  } else if (field === "shops") {
    const shops = [...chkDesign.shops];
    const shopToUpdateIndex = shops.findIndex((e) => e.shopName === `${dataToPush}`);
    shops[shopToUpdateIndex].shopUrl = url;
    const designToUpdate = await mongoDbUpdateDesign(id, field, shops);
    return designToUpdate;
  } else {
    const designToUpdate = await mongoDbUpdateDesign(id, field, dataToPush);
    return designToUpdate;
  }
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
    cloudinary.uploader.upload_stream({}, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
    .end(buffer)
  })
  return cloudUpload.secure_url
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
