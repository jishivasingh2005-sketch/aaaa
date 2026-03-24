const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  uid: { type: String, required: true, unique: true }, // Internal app ID mapped to mongo _id or generated
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String, default: '' },
  password: { type: String, default: '' } // Stores hashed password
}, { timestamps: true });

UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user._id;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', UserSchema);
