import { Request, Response, NextFunction } from "express";
import Order from "../models/orderModel";
import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripeKey = String(process.env.STRIPE_SECRET_TEST!);
const stripe = new Stripe(stripeKey, {
  apiVersion: "2020-08-27",
  typescript: true,
});

export const getAllOrders = (req: Request, res: Response) => {
  Order.find()
    .exec()
    .then((docs: any) => res.status(200).json(docs))
    .catch((err: any) => {
      res.status(500).json({ error: err });
    });
};

export const getUserOrders = (req: Request, res: Response) => {
  Order.find({ user: req.params.userId })
    .exec()
    .then((orders: any) => {
      if (orders.length === 0) {
        return res.status(200).json({
          message: "Orders not found",
        });
      }
      res.status(200).json(orders);
    })
    .catch((err: any) => {
      res.status(500).json({ error: err });
    });
};

export const postOrder = async (req: Request, res: Response) => {
  console.log(process.env.STRIPE_SECRET_TEST!);
  const amount: number = Number(req.body.amount);
  const paymentId: string = req.body.paymentId;

  try {
    const payment = await stripe.paymentIntents.create({
      currency: "USD",
      amount: amount * 100,
      payment_method: paymentId,
      confirm: true,
    });

    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      products: req.body.products,
      address: req.body.address,
      user: req.body.user,
    });

    order
      .save()
      .then((result) => {
        res.status(200).json({
          message: "Thank you for your order!",
          order,
        });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  } catch (err: any) {
    res.status(400).json({ error: err });
  }
};

export const deleteOrder = (req: Request, res: Response) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((order: any) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: process.env.URL,
          body: { productId: "ID", quantity: "Number" },
        },
      });
    })
    .catch((err: any) => {
      res.status(500).json({ error: err });
    });
};
