import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const user: string = process.env.DB_USER!;
const pass: string = process.env.DB_PASS!;

const mdb = `mongodb+srv://${user}:${pass}@cluster0.9f1gi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

export const connectDb = (): void => {
  mongoose.connect(mdb);
  mongoose.connection.on("error", (err: any) => {
    console.error(err);
  });
  mongoose.connection.on("connected", (err: any, res: any) => {
    console.log("Mongoose is connected to Atlas DB");
  });

  mongoose.Promise = global.Promise;
};
