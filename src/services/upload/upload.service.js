import fs from 'fs';
import { format } from 'util';
import stream from 'stream';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME);

/**
 * This function upload a file to the local file system
 * @param data
 * @return {Promise<void>}
 */
export const uploadStreamToLocalFilesystem = async (data) => {
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
 * This function upload a file to gcs. It receives a formatted file yet
 * @param file
 * @return {Promise<unknown>}
 */
export const uploadFileToGcs = async (file) =>
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
 * This function store a stream in memory and produce a file to upload in gcs
 * @param data
 * @return {Promise<void>}
 */
export const uploadStreamToGcs = async (data) => {
  const dataStream = new stream.PassThrough();

  dataStream.push(data);
  dataStream.push(null);

  await new Promise((resolve, reject) => {
    // whatever data passed to this func rename file according to
    const blob = bucket.file('destination_folder/test.xml');

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
