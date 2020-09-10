import * as mongoose from 'mongoose';
import { IBaseDocument } from "../../core/repositories/IBaseDocument";

export const ProductModelName = 'Products';

export interface IProductDocument extends IBaseDocument {
    name: string,
    price: number,
    color: string,
    brand: string,
    category: string,
}

const ProductSchema: mongoose.Schema = new mongoose.Schema(
    {
      name: {
        required: true,
        type: String,
      },
      price: {
        required: true,
        type: Number,
      },
      color: {
        type: String
      },
      brand: {
        required: true,
        type: String
      },
      category: {
        required: true,
        type: String
      },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.__v;
            }
        }
    }
  );
  
  export const ProductModel: mongoose.Model<IProductDocument> = mongoose.model(
    ProductModelName,
    ProductSchema
  );