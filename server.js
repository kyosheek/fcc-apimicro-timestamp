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
  const { date_string } = req.params;
  if (date_string) {
    let timestamp = Date.parse(date_string);
    if (!isNaN(timestamp)) {
      const date = new Date(date_string);
      res.send({
        "unix": date.getTime(),
        "utc": date.toUTCString()
      });
    } else {
      res.send({
        "error": "Invalid date"
      });
    }
  } else {
    const date = new Date();
    res.send({
      "unix": date.getTime(),
      "utc": date.toUTCString()
    });
  }
});

console.log("Server is running!");

app.listen(process.env.PORT || 1337);
