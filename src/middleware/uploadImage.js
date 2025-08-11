import multer from 'multer';
import path from 'path';

// const storage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null,"src/uploads/")
//     },

//     filename: (req,file,cb)=>{
//         const currDate = Date.now();
//         const uniqueSuffix = currDate + "-" + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
//         cb(null,file.fieldname + "-" + uniqueSuffix + ext);
//     }
// })

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({
    storage:storage,
    fileFilter:fileFilter
});

export default upload;