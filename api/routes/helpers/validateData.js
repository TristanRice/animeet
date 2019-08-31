const { validationResult } = require("express-validator/check");

module.exports = function(req, res, next) {
  const errors_ = validationResult(req).array( );

  console.log(delete body);


  if (errors_.length)
    return res.json({
      "success": false,
      "errType": "invalid_data",
      "errors_": errors_
    });	

	//console.log(body);
  next( );
}
