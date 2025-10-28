import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
  name: string;
  sku: string;
  description?: string;
  minQuantity: number;
  currentQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    minQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    currentQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ sku: 1 });
productSchema.index({ currentQuantity: 1 });

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productSchema);
