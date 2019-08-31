const express        = require("express")
    , validateSchema = require("./validators/register")
    , validator      = require("../helpers/validateData")
    , user           = require("../../models/user")
    , verifyCaptcha  = require("../helpers/verifyCaptcha");

const router = express.Router( );

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
      "password": req.body.password
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
