const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

// 🔐 File Filter (Only Videos + Images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|mp4|mov|avi|mkv/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpg, jpeg, png) and videos (mp4, mov, avi, mkv) are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

module.exports = upload;
console.log("multer is working with image + video filter");

console.log("multer is working");