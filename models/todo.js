var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const connString = 'mongodb+srv://bluereptile:PxBAKe6ZMYKKJQI0@clusterapi-ppfxo.mongodb.net/test?retryWrites=true&w=majority';
db = mongoose.connect(connString,{dbName:'test',useNewUrlParser: true});



var TodoSchema = new Schema({
    _userId: {type: Schema.Types.ObjectId, ref: 'UserModel'},
    todoName: String,
    todoDesc: String,
    todoItens: [{itemTodo:{type: String, lowercase: true, trim: true}},{isDone:{type: Boolean, default: false}}],
    updated: { type: Date, default: Date.now() }
  });


  
TodoSchema
.virtual('url')
.get(function () {
  return '/todoInfo/' + this._id;
});
//Export model
TodoSchema.plugin(uniqueValidator);
Todo = mongoose.model('TodoModel', TodoSchema);
module.exports = Todo;