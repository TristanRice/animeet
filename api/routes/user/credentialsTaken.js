const express = require("express");
    , User    = require("../../models/user");
router = express.Router( );

/*
/api/user/{username}/exists
/api/user/{email}/exists
*/

router.get("/:credentialType/isTaken", function(req, res) {
  const type  = req.params.credentialType;
  const value = req.params.value;
  User.findOne({type: value}, function(err, user) {
    if (err)
      throw err;
    //search for a user with the parameter that is given. If the user does not
    //exist, then the 'user' variable will be undefined.
    return res.json({"isTaken": !!user});
  });
});

module.exports = router;
