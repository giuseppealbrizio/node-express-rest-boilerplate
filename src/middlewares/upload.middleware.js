import multer from 'multer';
import slugify from 'slugify';
import MulterGoogleCloudStorage from 'multer-cloud-storage';

/**
 * This is the default middleware for uploading files.
 * This instance return buffer in req.file useful
 * if we need to stream something to GCS.
 * You can use this in conjunction with uploading buffer
 * @type {Multer}
 */

const memoryStorageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // no larger than 20mb
  },
});

// export const that handle the upload and include in the route as middleware
export const uploadSingleFileToMS = memoryStorageUpload.single('file');
export const uploadMultipleFilesToMS = memoryStorageUpload.array('files');

/**
 * This is the middleware for uploading files to Google Cloud Storage
 * It does not handle any file type or any custom destination
 * When you use it in a route it upload a file in the root folder and return
 * the file object with his own properties
 */

const gcsUploadStandard = multer({
  storage: new MulterGoogleCloudStorage({
    acl: 'publicRead',
    autoRetry: true,
    bucket: process.env.GOOGLE_STORAGE_BUCKET_NAME, // bucket name
    destination: 'the-name-of-service-folder/', // folder destination in gcs
    projectId: process.env.GOOGLE_PROJECT_ID, // gcp project id
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // path to JSON
    filename: (req, file, cb) => {
      cb(null, slugify(file.originalname));
    },
  }),
});

// export const that handle the upload and include in the route as middleware
export const uploadSingleFileToGCS = gcsUploadStandard.single('file');
export const uploadMultipleFilesToGCS = gcsUploadStandard.array('files');

/**
 * MORE OPTIONS TO UPLOAD TO GOOGLE CLOUD STORAGE
 * Define the GCS storage passing values where and
 * how to handle the file then passing a filter to
 * restrict file types to image and then define the
 * multer function to allow passing only a single file
 */

const gcsUploadImgToDirectory = multer({
  storage: new MulterGoogleCloudStorage({
    acl: 'publicRead',
    autoRetry: true,
    bucket: process.env.GOOGLE_STORAGE_BUCKET_NAME, // bucket name
    destination: (req, file, cb) => {
      const { id } = req.params; // whatever the id you need
      cb(null, `the-name-of-service-folder/subdirectory/${id}/subdirectory2`);
    }, // folder destination in gcs
    projectId: process.env.GOOGLE_PROJECT_ID, // gcp project id
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // path to JSON
    filename: (req, file, cb) => {
      cb(null, slugify(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb('Please upload only images.', false);
    }
  },
});

// export const that handle the upload and include in the route as middleware
export const uploadSingleImageToGCS = gcsUploadImgToDirectory.single('file');

/**
 * Some explanations
 *
 * If we use memoryStorage option in middleware 'req.file' will have properties:
 * {
 *   fieldname: 'file',
 *   originalname: 'Original File Name.jpg',
 *   encoding: '7bit',
 *   mimetype: 'image/jpeg',
 *   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 ... 98145 more bytes>,
 *   size: 98195
 * }
 * Later we have to convert this buffer to a stream then we can use
 *
 * If we use MulterGoogleCloudStorage 'req.file' will have properties:
 * {
 *   fieldname: 'file',
 *   originalname: 'Original Name.jp',
 *   encoding: '7bit',
 *   mimetype: 'image/jpeg',
 *   bucket: 'bucket-name',
 *   destination: 'folder/subdirectory/subdirectory2/subdirectory3/',
 *   filename: 'Name after.jpg',
 *   path: 'folder/subdirectory/subdirectory2/expenses/filename.jpg',
 *   contentType: 'image/jpeg',
 *   size: 98195,
 *   uri: 'gs://skeldon-dashboard-v3-cloud-storage-bucket/ems-service-folder/permits/61d37defd0466b0be6f375df/expenses/Giuseppe-Albrizio-Pic-2.jpg',
 *   linkUrl: 'url-link-to-use-after in passing to some other service'
 *   selfLink: 'https://www.googleapis.com/storage/v1/b/...'
 * }
 * Here we don't need to convert the buffer to a stream but the file is yet in
 * storage
 *
 * Multer to GCS middleware.
 * Follow the README.md instructions at .src/config/gcloud/README.md
 * and create a bucket in GCP and generate a JSON file
 * otherwise this middleware will not work
 */
