const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Proveri i napravi folder ako ne postoji
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir('uploads/questions');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/questions'); // Putanja: /form-builder-app/uploads/questions
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `question-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Samo slike su dozvoljene (jpg, png, gif, itd.)'));
    }
  }
});

module.exports = upload;