import { Schema, model, Document } from 'mongoose';

export interface Item extends Document {
  name: string;
}

const itemSchema = new Schema<Item>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<Item>('Item', itemSchema);
