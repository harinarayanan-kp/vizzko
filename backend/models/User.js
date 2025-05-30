const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
//   username: { type: String, required: true, unique: true },
//   profilePicture: { type: String }, // Store the image path or URL
//   bio: { type: String },
//   dob: { type: Date },
  createdAt: { type: Date, default: Date.now },
//   posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
//   followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
