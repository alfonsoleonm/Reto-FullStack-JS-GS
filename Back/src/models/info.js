// src/models/info.js  (ESM + mongoose CJS)
import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const InfoSchema = new Schema(
  {
    sensor: {
      type: String,
      required: true,
      enum: ['TEMP', 'HUM'],
      trim: true,
    },
    value: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,        // createdAt / updatedAt
    versionKey: false,       // oculta __v
  }
);

InfoSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export default models.Info || model('Info', InfoSchema);
