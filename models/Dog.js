import mongoose from 'mongoose';

const dogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  adoptedMessage: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Dog', dogSchema);
