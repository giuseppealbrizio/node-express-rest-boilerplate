import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import validator from 'validator';
import { ApplicationError } from '../errors';
import { roles } from '../config/roles.config';

dotenv.config();

// const jwtPrivateSecret = process.env.JWT_PRIVATE_SECRET.replace(/\\n/g, '\n');

if (!process.env.JWT_KEY) {
  throw new ApplicationError(
    404,
    'Please provide a JWT_KEY as global environment variable',
  );
}
const jwtKey = process.env.JWT_KEY;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email can't be blank"],
      unique: true,
      lowercase: true,
      index: true,
      validate: [validator.isEmail, 'Please provide an email address'],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    google: {
      id: String,
      sync: { type: Boolean }, // authorisation to sync with google
      tokens: {
        accessToken: String,
        refreshToken: String,
      },
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    pictureUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (value) =>
          validator.isURL(value, {
            protocols: ['http', 'https', 'ftp'],
            require_tld: true,
            require_protocol: true,
          }),
        message: 'Must be a Valid URL',
      },
    },
    pictureBlob: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    toObject: {
      virtuals: true,
      getters: true,
    },
    timestamps: true,
  },
);

UserSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true });

UserSchema.index({ username: 1, email: 1, googleId: 1 });

UserSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next;

  this.password = await bcrypt.hash(
    this.password,
    parseInt(process.env.HASH, 10),
  );
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this;

  const userObj = user.toObject();
  userObj.id = userObj._id; // remap _id to id

  delete userObj._id;
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateVerificationToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      active: this.active,
      role: this.role,
      deleted: this.deleted,
    },
    jwtKey,
    {
      expiresIn: '1d',
      // algorithm: 'RS256',
    },
  );
};

UserSchema.methods.generatePasswordResetToken = async function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

UserSchema.statics.checkExistingField = async function (field, value) {
  const user = this;

  return user.findOne({ [`${field}`]: value });
};

export default mongoose.model('User', UserSchema, 'users');
