var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TodoSchema = new Schema({
    _userId: {type: Schema.Types.ObjectId, ref: 'UserModel'},
    todoName: String,
    todoDesc: String,
    todoItens: [{itemTodo:{type: String, lowercase: true, trim: true}},{isDone:{type: Boolean, default: false}}],
    updated: { type: Date, default: Date.now() }
  });


//Export model
module.exports = mongoose.model('TodoModel', TodoSchema);