const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/pinterest");
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String},
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String},
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref:'Post'}],
  savedpost: [{ type: mongoose.Schema.Types.ObjectId, ref:'Post'}],
  profilepic: { type: String, default: '/images/profilepic/profiledefault.jpg'},
});
userSchema.plugin(plm);
module.exports = mongoose.model('Users', userSchema);


