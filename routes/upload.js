var multer = require('multer');
var path = require('path');


var storage = multer.diskStorage({
  destination:'./public/uploads',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-'+ Date.now()+
    path.extname(file.originalname));
  }
});

var upload=multer({
  storage:storage,
  limits:{fileSize:2000000},
  fileFilter:function(req, file, cb){
    validatefile(file, cb);
  }

}).single("image");


var validatefile = function(file, cb ){
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType  = allowedFileTypes.test(file.mimetype);
  if(extension && mimeType){
    return cb(null, true);
  }else{
    cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
  }
}




module.exports = upload;

