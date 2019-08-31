const request = require("request");

function verifyRecaptcha(req, res, next) {
  //this is just used to be able to test the API easily. 
  console.log(req.query);
  console.log(!req.query.useRecaptcha);
  if (!req.query.useRecaptcha) {
    return next( ); //remove this in production
  }
  console.log("hereaaaa");
  const response = req.body["g-recaptcha-response"];
  if (!response)
    return res.json({
      "success": false,
      "msg": "Captcha verification failed"
    });

  console.log("here");

  const recaptchaSecretKey = "6LeYjqkUAAAAAIqH4B_wMAkhWGSOmCt9WY2Uqb2k";

  const verificationUrl ="https://www.google.com/recaptcha/api/siteverify?secret="+
      recaptchaSecretKey + "&response=" + response + "&remoteip=" + req.connection.remoteAddress;

  request(verificationUrl, function(err, response, body) {
    const json_body = JSON.parse(body);
    if (!json_body.success){
          return res.json({
            "success": false,
            "msg": "Captcha verification failed"
          });
    }
    else { 
      next( );
    }
  });
}

module.exports = verifyRecaptcha;
