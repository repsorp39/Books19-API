const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    pseudo: { type: String, required: true },
    password: { type: String },
    provider: { type: String },
    role: { type: Number, default: 2000 },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, data) => {
        delete data.password;
        delete data.__v;
        data.id = data._id;
        delete data._id;
      },
    },
  }
);

//print a friendly message when unique constraint rule is overpassed instead of default code E001 by mongodb
UserSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', UserSchema);
