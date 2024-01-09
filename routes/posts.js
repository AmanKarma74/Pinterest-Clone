const mongoose = require('mongoose');
const { array } = require('./multer');
mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  createdAt: {type: Date, default: Date.now},
  likedby: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
}); 

module.exports = mongoose.model('Post', postSchema);


