/**
 * File Upload Utilities
 * Multer configuration for file uploads
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define upload paths for different file types
const uploadPaths = {
  sourcecode: path.join(__dirname, '../../uploads/sourcecode'),
  reports: path.join(__dirname, '../../uploads/reports'),
  ppt: path.join(__dirname, '../../uploads/ppt'),
  viva: path.join(__dirname, '../../uploads/viva'),
  abstract: path.join(__dirname, '../../uploads/abstract'),
  images: path.join(__dirname, '../../uploads/images')
};

// Create upload directories if they don't exist
Object.values(uploadPaths).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for source code files
const sourceCodeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPaths.sourcecode);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for reports
const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPaths.reports);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for PPTs
const pptStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPaths.ppt);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for viva questions
const vivaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPaths.viva);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for abstracts
const abstractStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPaths.abstract);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPaths.images);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for source code (zip files)
const sourceCodeFilter = (req, file, cb) => {
  if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
    cb(null, true);
  } else {
    cb(new Error('Only ZIP files are allowed for source code'));
  }
};

// File filter for reports (PDF)
const reportFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for reports'));
  }
};

// File filter for PPTs
const pptFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(ppt|pptx)$/)) {
    cb(null, true);
  } else {
    cb(new Error('Only PPT/PPTX files are allowed'));
  }
};

// File filter for viva questions (PDF or DOCX)
const vivaFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed for viva questions'));
  }
};

// File filter for abstracts (PDF or DOCX)
const abstractFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed for abstracts'));
  }
};

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Create multer instances for different file types
export const uploadSourceCode = multer({
  storage: sourceCodeStorage,
  fileFilter: sourceCodeFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

export const uploadReport = multer({
  storage: reportStorage,
  fileFilter: reportFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

export const uploadPPT = multer({
  storage: pptStorage,
  fileFilter: pptFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

export const uploadViva = multer({
  storage: vivaStorage,
  fileFilter: vivaFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

export const uploadAbstract = multer({
  storage: abstractStorage,
  fileFilter: abstractFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export { uploadPaths };
