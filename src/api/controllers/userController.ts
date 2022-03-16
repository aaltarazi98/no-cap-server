import { Response, Request } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const getUsers = (req: Request, res: Response) => {
  User.find()
    .select("email")
    .exec()
    .then((result: any) => {
      res.status(200).json(result);
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

export const signUp = (req: Request, res: Response) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user: any) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email already in use",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (error: any, hash: any) => {
          if (error) {
            return res.status(500).json({
              error,
            });
          } else {
            const newUser = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            const token = jwt.sign(
              {
                email: newUser.email,
                userId: newUser._id,
              },
              process.env.JWT_SECRET!,
              {
                expiresIn: "7d",
              }
            );
            newUser
              .save()
              .then((result: any) => {
                res.status(201).json({
                  _id: result.id,
                  email: result.email,
                  token,
                });
              })
              .catch((err: any) => {
                console.log(err);
                res.status(500).json({ error: err });
              });
          }
        });
      }
    })
    .catch((err: any) => {
      res.status(500).json({ error: err });
    });
};

export const logIn = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user: any) => {
      console.log(user);
      if (user === null) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      bcrypt.compare(
        req.body.password,
        user.password,
        (err: any, pass: any) => {
          if (err) {
            return res.status(401).json({ message: "Authentication failed" });
          }
          if (pass) {
            const token = jwt.sign(
              {
                email: user.email,
                userId: user._id,
              },
              process.env.JWT_SECRET!,
              {
                expiresIn: "7d",
              }
            );
            res.status(200).json({
              _id: user._id,
              email: user.email,
              token,
            });
          } else {
            return res.status(401).json({ message: "Authentication failed" });
          }
        }
      );
    });
};

export const deleteUser = (req: Request, res: Response) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result: any) => {
      res.status(200).json({ message: "user deleted" });
    })
    .catch((err: any) => {
      res.status(500).json({ error: err });
    });
};
