const Joi = require('@hapi/joi');
const productsModel = require('../models/productsModel');

const productSchema = Joi.object({
  name: Joi.string().min(5).required().messages({
    'string.min': '"name" length must be at least 5 characters long',
  }),
  quantity: Joi.number().min(1).required(),
});
const nameSchema = Joi.string().min(5).required().messages({
  'string.min': '"name" length must be at least 5 characters long',
});
const quantitySchema = Joi.number().min(1).required().messages({
  'number.min': '"quantity" must be larger than or equal to 1',
  'number.base': '"quantity" must be a number',
});

const newError = (err) => (err);

const newProductValidate = async (product) => {
  const { error } = productSchema.validate(product);
  if (error) {
    throw newError({ status: 422, message: error.message });
  }
  if (await productsModel.findProductByName(product.name)) {
    throw newError({ status: 422, message: 'Product already exists' });
  }
  const createdProduct = await productsModel.insertProduct(product);
  return createdProduct;
};

const productList = async () => {
  const list = await productsModel.listProducts();
  return list;
};

const productShow = async (id) => {
  const listedProduct = await productsModel.findProductById(id);
  return listedProduct;
};

const updatedProductValidate = async (id, name, quantity) => {
  const nameValidate = nameSchema.validate(name);
  const quantityValidate = quantitySchema.validate(quantity);
  if (nameValidate.error) {
    throw newError({ status: 422, message: nameValidate.error.message });
  }
  if (quantityValidate.error) {
    throw newError({ status: 422, message: quantityValidate.error.message });
  }
  const updatedProduct = await productsModel
    .updateProduct(id, name, quantity);
  return updatedProduct;
};

const deletedProductValidate = async (id) => {
  const deletedProduct = await productsModel.deleteProduct(id);
  if (deletedProduct.err) {
    throw deletedProduct.err;
  }
  return deletedProduct;
};

module.exports = {
  newProductValidate,
  productList,
  productShow,
  updatedProductValidate,
  deletedProductValidate,
};
