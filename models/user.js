var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    userName: {type:String, unique: true},
    userPassword: {type:String, required: true}
  });

UserSchema
.virtual('url')
.get(function () {
  return '/default/user/' + this._id;
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserModel', UserSchema);