
var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
db = mongoose.connect('mongodb://localhost:27017/todo_data');
mongoose.set('useCreateIndex', true);

var UserSchema = new Schema({
    userName: {type:String, unique: true},
    userPassword: {type:String, required: true}
  });

UserSchema
.virtual('url')
.get(function () {
  return '/default/user/' + this._id;
});

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.userPassword, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.userPassword = hash;
    next();
  })
});

//authenticate input against database
UserSchema.statics.authenticate = function (userName, userPassword, callback) {
  User.findOne({ userName: userName })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(userPassword, user.userPassword, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

UserSchema.plugin(uniqueValidator);
User = mongoose.model('UserModel', UserSchema);
module.exports = User;

