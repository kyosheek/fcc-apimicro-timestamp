const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

app.use(
  bodyParser.urlencoded({ extended: false }),
  (req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
  }
);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.route('/api/timestamp/:date_string?')
.get((req, res) => {
  let { date_string } = req.params;
  let unix = 0, utc = "", error = "";
  // handle date_string
  if (date_string) {
    date_string = (Number(date_string) == date_string) ? Number(date_string) : date_string;
    if (!isNaN(new Date(date_string))) {
      const date = new Date(date_string);
      unix = date.getTime();
      utc = date.toUTCString();
    } else {
      error = "Invalid Date";
    }
  } else {
    const date = new Date();
    unix = date.getTime();
    utc = date.toUTCString();
  }
  // send result
  if (error.length > 0) {
    res.send({ error });
  } else {
    res.send({ unix, utc });
  }
});

console.log("Server is running!");

app.listen(process.env.PORT || 1337);
