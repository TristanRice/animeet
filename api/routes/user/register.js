const express        = require("express")
    , validateSchema = require("./validators/register")
    , validator      = require("../helpers/validateData")
    , user           = require("../../models/user")
    , multer         = require("multer")
    , verifyCaptcha  = require("../helpers/verifyCaptcha");

const router = express.Router( );

const storage = multer.diskStorage({
  destination: (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
});

const upload = multer({storage: storage}).single("file");

function handleFileUpload(req, res) {
  upload(req, res, function(err) {
    if (err)
      throw err;
  })
}

/*
/api/user/register

required args:
email
username
password
*/
router.post("/register",
  validateSchema,
  validator,
  verifyCaptcha,
  function(req, res) {
    const User = new user({
      "username": req.body.username,
      "email": req.body.email,
      "password": req.body.password,
      "biography": req.body.description,
      "gender": req.body.gender,
      "date_of_birth": req.body.dateOfBirth,
      "sexual_preferences": {
        "men": req.body.men,
        "women": req.body.women,
        "non_binary": req.body.nonbinary
      }
    });
    User.hash_password( );

    User.save(function(err) {
      if (err && err.name==="ValidationError")
        return res.json({
          "success": false,
          "errType": "not_unique",
          "errors": [err.errors]
        });
      else if (err) {
        throw err;
      }

      return res.json({
        "success": true,
        "msg": "User created successfully"
      });
    });
  }
);

module.exports = router;
