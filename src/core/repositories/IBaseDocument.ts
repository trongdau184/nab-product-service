import * as Mongoose from "mongoose";

export interface IBaseDocument extends Mongoose.Document {
    id: string;
}