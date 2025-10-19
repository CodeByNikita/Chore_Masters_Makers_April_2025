import mongoose, { Document } from "mongoose";

interface Prize extends Document {
  name: string;
  value: number;
  imageURL: string;
}

const PrizeSchema = new mongoose.Schema<Prize>({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  imageURL: { type: String, required: true },
});

const PrizeModel = mongoose.model<Prize>("Prize", PrizeSchema);

export { PrizeModel, Prize };
