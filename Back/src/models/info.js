import { Schema, model } from "mongoose";

const datosSchema = Schema({
  sensor: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true

  }
});

export default model('info', datosSchema);