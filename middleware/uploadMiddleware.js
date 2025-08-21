import multer from "multer";
import path from 'path'

//storing file in memory to later stream it to cloudinary
const storage = multer.memoryStorage();

// Allowed File Types
const allowedFileTypes = /jpeg|jpg|png|gif/;

// File filter function
function checkFileType(file, cb) {
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
  }
}

//Multer upload config

const upload = multer({
  storage: storage,
//   limits: {
//     //fileSize: 1 * 1024 * 1024, // 1MB max size (we can chnage acc to our preference)
//     //files: 1, // we can limit the number of files per request
//     // fieldNameSize: 100,     // can uncomment to limit field name length
//     // fields: 10,             // can uncomment to limit number of non-file fields
//   },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("file");

export default upload;
