const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: String, required: true },
  authorPhoto: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  comments: { type: Number, default: 0 },
  commentsList: { type: Array, default: [] },
  tags: { type: [String], default: [] },
  image: { type: String, default: null }
}, { timestamps: true });

// Optional: format the returned object to pretend _id is id for React
IdeaSchema.methods.toJSON = function() {
  const idea = this.toObject();
  idea.id = idea._id;
  delete idea._id;
  delete idea.__v;
  return idea;
};

module.exports = mongoose.model('Idea', IdeaSchema);
