import mongoose from "mongoose";

export interface IMovement extends mongoose.Document {
  product: mongoose.Types.ObjectId;
  type: "entrada" | "saida";
  quantity: number;
  operator: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
}

const movementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: ["entrada", "saida"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

movementSchema.index({ product: 1, createdAt: -1 });
movementSchema.index({ createdAt: -1 });

export default mongoose.models.Movement ||
  mongoose.model<IMovement>("Movement", movementSchema);
