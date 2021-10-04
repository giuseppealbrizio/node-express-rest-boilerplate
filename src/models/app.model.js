import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from 'validator';
import crypto from 'crypto';
import { ApplicationError } from '../helpers/errors.helper';

dotenv.config();

// const jwtPrivateSecret = process.env.JWT_PRIVATE_SECRET.replace(/\\n/g, '\n');

if (!process.env.JWT_KEY) {
  throw new ApplicationError(
    404,
    'Please provide a JWT_KEY as global environment variable',
  );
}
const jwtKey = process.env.JWT_KEY;

const AppSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email can't be blank"],
      unique: true,
      lowercase: true,
      index: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Must be a Valid email',
      },
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
    roleAccess: {
      admin: { type: Boolean, default: false },
      employee: { type: Boolean, default: false },
      client: { type: Boolean, default: false },
      vendor: { type: Boolean, default: false },
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
  },
  {
    // _id: false,
    // id: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

AppSchema.index({ username: 1, email: 1, googleId: 1 });

AppSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next;

  this.password = await bcrypt.hash(
    this.password,
    parseInt(process.env.HASH, 10),
  );
  next();
});

AppSchema.methods.toJSON = function () {
  const user = this;

  const userObj = user.toObject();
  userObj.id = userObj._id; // remap _id to id

  delete userObj._id;
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

AppSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

AppSchema.methods.generateVerificationToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      // role: this.role,
      active: this.active,
      roleAccess: this.roleAccess,
    },
    jwtKey,
    {
      expiresIn: '10d',
      // algorithm: 'RS256',
    },
  );
};

AppSchema.methods.generatePasswordResetToken = async function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

AppSchema.statics.checkExistingField = async function (field, value) {
  const user = this;

  return user.findOne({ [`${field}`]: value });
};

AppSchema.virtual('fullApp').get(function () {
  const appProfile = this;
  return `${appProfile.username} - ${appProfile.email}`;
});

export default mongoose.model('App', AppSchema, 'apps');
