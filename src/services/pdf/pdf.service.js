import { Storage } from '@google-cloud/storage';
import axios from 'axios';
import crypto from 'crypto';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import slugify from 'slugify';
import stream from 'stream';
import { format } from 'util';

const storage = new Storage();
const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME);

/**
 * This function create a pdf and store in GCS storage
 * 0. Receive an object that can be used to edit the pdf
 * 1. Receive also a directory where the pdf will be stored
 * 2. pdf-lib return an array buffer
 * 3. We convert the array buffer to stream
 * 4. If we use pdf-kit instead of pdf-lib, we can use the stream directly
 * @param object
 * @param directory
 * @returns {Promise<unknown>}
 */
export const generatePdfFromBuffer = async (object, directory) => {
  // destructuring file object

  const COMPANY_LOGO = 'https://storage.url/logo-default-site.png';

  const COMPANY_NAME = 'Company Name';

  const SERVICE_FOLDER = 'service-folder-name';

  // retrieve logo image from storage
  const getLogoImage = await axios
    .get(COMPANY_LOGO, { responseType: 'arraybuffer' })
    .then((res) => res.data);

  // instantiate pdf-lib
  const pdfDoc = await PDFDocument.create();

  // Embed different fonts
  const pdfFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Add a page to the document
  const page = pdfDoc.addPage([570, 750]);

  // Get the width and height of the first page
  const { width, height } = page.getSize();

  // set a general font size
  const fontSize = 12;

  // embed the logo image into pdf created
  const embedLogoImage = await pdfDoc.embedPng(getLogoImage);
  const logoDims = embedLogoImage.scale(0.1);

  page.drawImage(embedLogoImage, {
    x: 10, // page.getWidth() / 2 - logoDims.width / 2
    y: height / 2 - logoDims.height / 2 + 350,
    width: logoDims.width,
    height: logoDims.height,
  });

  page.drawText('Some Text', {
    x: width / 2 - 50,
    y: height / 2 + 300,
    size: fontSize - 8,
    font: pdfFont,
    lineHeight: 12,
    maxWidth: width - 20,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: 10, y: height / 2 + 290 },
    end: { x: width - 10, y: height / 2 + 290 },
    color: rgb(0, 0, 0),
  });

  // Set Metadata properties
  pdfDoc.setTitle('PDF - Title');
  pdfDoc.setAuthor('Author Name');
  pdfDoc.setCreationDate(new Date());

  // PDF-LIB create a buffer that can be used to create a stream
  const pdfBuffer = await pdfDoc.save();

  // INSTANTIATE A NEW STREAM
  const dataStream = new stream.PassThrough();

  dataStream.push(pdfBuffer);
  dataStream.push(null);

  // create today date
  const today = new Intl.DateTimeFormat('it-IT').format(new Date());

  // generate a  random uuid to avoid duplicate file name
  const uuid = crypto.randomBytes(4).toString('hex');

  // generate a filename
  const fileName = `Filename_${uuid}_${COMPANY_NAME.replace(
    / /g,
    '_',
  )}_${today}.pdf`;

  // FINALLY, RETURN THE PROMISE PASSING THE STREAM AND THE FILENAME
  return new Promise((resolve, reject) => {
    const blob = bucket.file(
      `${SERVICE_FOLDER}/${directory}/${slugify(fileName)}`,
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
