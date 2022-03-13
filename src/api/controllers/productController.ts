import { Request, Response, NextFunction } from "express";
import Product from "../models/productModel";
import mongoose from "mongoose";
import { ProductInterface } from "../models/productModel";

export const getProducts = (req: Request, res: Response) => {
  Product.find()
    .exec()
    .then((products: any) => {
      if (products.length > 0) {
        res.status(200).json(products);
      } else {
        res.status(200).json({ message: "No entries found" });
      }
    })
    .catch((err: any) => {
      res.status(500);
      throw new Error(err);
    });
};

export const searchProducts = (req: Request, res: Response) => {
  Product.find()
    .exec()
    .then((products: any) => {
      const search = products.filter((item: ProductInterface) => {
        const name: string =
          req.params.text.charAt(0).toUpperCase() +
          req.params.text.slice(1).toLowerCase();
        return item.name.includes(name);
      });
      if (search.length > 0) {
        res.status(200).json(search);
      } else {
        res.status(404).json({ message: "No entries found" });
      }
    })
    .catch((err: any) => {
      res.status(500).json({ error: err });
    });
};
export const postProduct = (req: Request, res: Response) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: Number(req.body.price),
    description: req.body.description,
    productImage: req.body.productImage,
  });
  product
    .save()
    .then((result: any) => {
      console.log(result);
      res.status(201).json({
        message: "Product made successfully",
        createdProduct: {
          name: product.name,
          description: product.description,
          price: product.price,
          _id: product._id,
          productImage: product.productImage,
          request: {
            type: "GET",
            url: process.env.URL + "/products/" + product._id,
          },
        },
      });
    })
    .catch((err: any) => {
      res.status(500).json({ error: err });
    });
};
export const getProduct = (req: Request, res: Response) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc: any) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "Get all products",
            url: process.env.URL + "/products" + doc._id,
          },
        });
      } else {
        res.status(200).json({ message: "Valid entry not found for that ID" });
      }
    })
    .catch((err: any) => {
      res.status(500).json({ error: err });
    });
};

export const patchProduct = (req: Request, res: Response) => {
  const id = req.params.productId;
  const updatedProduct: any = {};
  for (const entry of Object.entries(req.body)) {
    updatedProduct[entry[0]] = entry[1];
  }
  Product.updateOne({ _id: id }, { $set: updatedProduct })
    .exec()
    .then((result: any) => {
      res.status(200).json({
        message: "product updated",
        product: updatedProduct,
        request: {
          type: "GET",
          url: process.env.URL + "/products" + id,
        },
      });
    })
    .catch((err: any) => {
      res.status(500).json({ error: err });
    });
};

export const deleteProduct = (req: Request, res: Response) => {
  const id = req.params.productId;
  const response = {
    message: `Object ${id} deleted`,
    request: {
      type: "GET",
      url: process.env.URL + "/products",
    },
  };
  Product.remove({ _id: id })
    .exec()
    .then((result: any) => res.status(200).json(response))
    .catch((err: any) => {
      res.status(500).json({ error: err });
    });
};
