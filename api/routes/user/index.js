const express  = require("express")
    , register = require("./register")
    , login    = require("./login")
    , me       = require("./me");
router = express.Router( );

router.use("/", register);
router.use("/", login);
router.use("/", me);

module.exports = router;
