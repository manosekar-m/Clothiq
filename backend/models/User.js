const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  mobile: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  address: { street: String, city: String, district: String, state: String, pincode: String },
  wishlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matchPassword = async function (p) {
  return await bcrypt.compare(p, this.password);
};
module.exports = mongoose.model('User', userSchema);
