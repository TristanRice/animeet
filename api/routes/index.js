const express = require("express")
    , user    = require("./user");

router = express.Router( );

router.use(function(req, res, next) {
  //log each request
  console.log(`${req.method} ${req.url}`);
  next( );
});


/*
/api/
*/
router.get("/", function(req, res) {
  return res.json({
    "message": "API is working"
  });
});

/*
/api/user/
*/
router.use("/user", user);

module.exports = router;
