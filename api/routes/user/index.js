const express  = require("express")
    , register = require("./register")
    , login    = require("./login")
    , isTaken  = require("./credentialsTaken")
    , me       = require("./me")
    , router = express.Router( );

router.use("/", register);
router.use("/", login);
router.use("/", me);
router.use("/", isTaken)

module.exports = router;
