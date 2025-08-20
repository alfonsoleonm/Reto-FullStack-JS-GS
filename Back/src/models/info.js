// Back/src/models/info.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const infoSchema = new Schema(
  {
    sensor: { type: String, enum: ['TEMP', 'HUM'], required: true },
    value: { type: Number, required: true },
    date:  { type: Date, default: Date.now, required: true }
  },
  { versionKey: false }
);

infoSchema.index({ date: 1 });
infoSchema.index({ sensor: 1, date: 1 });

export default model('info', infoSchema);
