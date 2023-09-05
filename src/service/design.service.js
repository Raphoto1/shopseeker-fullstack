//imports de app
import path from "path";
import fs from "fs";
//imports propios
import { mongoDbgetDesignsById, mongoDbCreateNewDesign, mongoDbGetAllDesigns, mongoDbUpdateDesign, mongoDbDeleteDesign } from "@/dao/design.dao";
//**codigo**
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
  const textToFind = `/${queryIn}/`;
  const textToFindConverted = new RegExp(textToFind.slice(1, -1));
  let querySearch;
  if (queryKeyIn && queryIn) {
    querySearch = { [queryKeyIn]: textToFindConverted };
    options.limit = 5;
  } else {
    {
    }
  }
  //filtros
  let filterPack = {};
  //crear la busqueda de filtro
  //filtro por categoria
  switch (filterCategory) {
    case "Digital":
      filterPack.category = "Digital";
      break;
    case "Photography":
      filterPack.category = "Photography";
      break;
    case "Traditional":
      filterPack.category = "Traditional";
      break;
    case "MixedMedia":
      filterPack.category = "MixedMedia";
      break;
    default:
      filterPack;
      break;
  }
  //filtro por tienda
  switch (filterShops) {
    case "RedBubble":
      filterPack["shops.shopUrl"] = /redbubble/;
      break;
    case "Society6":
      filterPack["shops.shopUrl"] = /society6/;
      break;
    case "Displate":
      filterPack["shops.shopUrl"] = /displate/;
      break;
    case "TeePublic":
      filterPack["shops.shopUrl"] = /teepublic/;
      break;
    case "Spreadshirt":
      filterPack["shops.shopUrl"] = /spreadshirt/;
      break;
    default:
      filterPack;
      break;
  }

  querySearch = filterPack;

  const designs = await mongoDbGetAllDesigns(querySearch, options);
  // const designs = await mongoDbGetAllDesigns({'category':'photo'}, options);
  if (designs === []) {
    return [];
  } else if (!designs) {
    return error;
  } else {
    return designs;
  }
};

export const getDesignById = async (id) => {
  const design = await mongoDbgetDesignsById(id);
  if (design===null) {
    throw new Error('Design not Found')
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
  let pushRed = shopFilter(dataToPush, "RedBubble", "urlRed");
  let pushSoc = shopFilter(dataToPush, "Society6", "urlSoc");
  let pushDisp = shopFilter(dataToPush, "Displate", "urlDisp");
  let pushTee = shopFilter(dataToPush, "TeePublic", "urlTee");
  let pushSpre = shopFilter(dataToPush, "Spreadshirt", "urlSpre");
  shopspack.push(pushRed);
  shopspack.push(pushSoc);
  shopspack.push(pushDisp);
  shopspack.push(pushTee);
  shopspack.push(pushSpre);
  dataToPush["shops"] = shopspack;
  //organizar la data del form, se elimina la data de photo y se agrega el path
  const photoPath = await imageFileUploaderDesign(photo, pCode);
  dataToPush["photo"] = photoPath;
  //   se envia a DB
  const result = await mongoDbCreateNewDesign(dataToPush);
  // const result = dataToPush
  return result;
};

export const updateDesign = async (data) => {
  const dataToUpdate = Object.fromEntries(data);
  console.log(dataToUpdate);
  const id = dataToUpdate.id;
  const field = dataToUpdate.field;
  const photo = data.get("photo");
  const dataToPush = dataToUpdate.data;
  const url = dataToUpdate.url;
  const idCaptured = dataToUpdate.idCaptured;
  console.log(idCaptured);
  const chkDesign = await mongoDbgetDesignsById(dataToUpdate.id);
  if (!chkDesign) {
    throw new Error("design does not exist");
  }
  if (field === "photo") {
    //organizo data para db y fs
    let pCode = chkDesign.pCode;
    const photoPush = await imageFileUploaderDesign(photo, pCode);
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
    if (Math.sign(likeUpdate)===1) {
      const likeToPush = likeToUpdate + 1;
      const designToUpdate = await mongoDbUpdateDesign(id, 'likes', likeToPush);
      return designToUpdate;
    } else {
      if (likeToUpdate===0) {
        return 'no permited';
      } else {
        const likeToPush = likeToUpdate - 1;
        const designToUpdate = await mongoDbUpdateDesign(id, 'likes', likeToPush);
        return designToUpdate;  
      };
    };
  } else {
   throw new Error('Design Not Found') 
  }
}

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
