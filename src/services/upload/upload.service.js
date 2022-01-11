import fs from 'fs';
import { format } from 'util';
import slugify from 'slugify';
import stream from 'stream';
import { Storage } from '@google-cloud/storage';
import crypto from 'crypto';

const storage = new Storage();
const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME);

/**
 * This function upload a file to the local file system
 * 0. Always pass a buffer like argument otherwise will fail
 * 1. Takes a buffer argument
 * @param data
 * @return {Promise<void>}
 */
export const streamBufferToLFS = async (data) => {
  // Creation of document on local file system
  const fileName = `./test.xml`;
  fs.writeFile(fileName, data, function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
  });
};

/**
 * This function upload a file directly to gcs without passing buffer.
 * 0. To make this work use multer memory storage middleware
 * 1. Only instance of a file with buffer will succeed
 * 2. Return a public url
 * @param file
 * @return {Promise<void>}
 */
export const uploadFileToGCS = async (file) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = bucket.file(originalname.replace(/ /g, '_'));

    const blobStream = blob.createWriteStream({
      resumable: false,
      public: true,
    });

    blobStream
      .on('finish', () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        );
        resolve(publicUrl);
      })
      .on('error', (error) => {
        reject(error || 'unable to upload file');
      })
      .end(buffer);
  });

/**
 * This function take a pure buffer and convert to stream
 * 0. Always pass a buffer like argument otherwise will fail
 * 1. Takes a buffer argument
 * 2. Create a stream to store in memory
 * 3. Pipe the stream to Google Cloud Storage
 * 4. As soon as the file is recreated returns a public url
 * @return {Promise<void>}
 * @param buffer
 */
export const streamBufferToGCS = async (buffer) => {
  const dataStream = new stream.PassThrough();

  dataStream.push(buffer);
  dataStream.push(null);

  return new Promise((resolve, reject) => {
    const blob = bucket.file(
      'the-name-of-service-folder/subdirectory/filename.xml',
    );

    const blobStream = dataStream.pipe(
      blob.createWriteStream({
        resumable: false,
        public: true,
      }),
    );

    blobStream
      .on('finish', () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        );
        resolve(publicUrl);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

/**
 * This function take an object that also contain a buffer
 * 0. Always pass an object that contains buffer otherwise will fail
 * 1. Takes also a directory like argument
 * 2. Create a stream to store in memory
 * 3. Pipe the stream to Google Cloud Storage
 * 4. As soon as the file is recreated returns a public url
 * @return {Promise<void>}
 * @param file
 * @param {string} directory
 */
export const streamFileToGCS = async (file, directory) => {
  // destructuring data file object
  const { originalname } = file;

  // generate a  random uuid to avoid duplicate file name
  const uuid = crypto.randomBytes(4).toString('hex');

  // generate a file name
  const fileName = `${uuid} - ${originalname.replace(/ /g, '_')}`;

  // Instantiate a stream to read the file buffer
  const dataStream = new stream.PassThrough();

  dataStream.push(file.buffer);
  dataStream.push(null);

  return new Promise((resolve, reject) => {
    const blob = bucket.file(
      `the-name-of-service-folder/${directory}/${slugify(fileName || uuid)}`,
    );

    const blobStream = dataStream.pipe(
      blob.createWriteStream({
        resumable: false,
        public: true,
      }),
    );

    blobStream
      .on('finish', () => {
        const blobName = blob.name;
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        );
        resolve({ publicUrl, blobName });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

/**
 * Here we should pass the blobName of the file stored in GCS
 * @returns {Promise<[Response<any>]>}
 * @param blobName
 */
export const deleteFileFromGcs = async (blobName) => {
  try {
    // const name = filename.replace(/ /g, '_');
    return await bucket.file(blobName).delete();
  } catch (e) {
    console.log(e.toString());
  }
};
