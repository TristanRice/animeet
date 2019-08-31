const express  = require("express")
    , path     = require("path")
    , mongoose = require("mongoose")
    , routes   = require("./routes")
		, parser   = require("body-parser");

require("./passport");

const app  = express( );

app.use(express.static(path.resolve(__dirname, "static")));

app.use(parser.json());

app.use("/api", routes);

const port = process.env.port || 8000;

const prod = process.env.NODE_ENV === "production";

//connect to database
const mongo_uri = process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/animeet";

mongoose.connect(mongo_uri, {useNewUrlParser: true});

app.listen(port, function( ) {
	console.log(`[*] Listening on port ${port}`);
});
