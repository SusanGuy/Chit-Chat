const express = require("express");
const path = require("path");
const app = express();
const static = path.join(__dirname, "../public");

const port = process.env.PORT || 5000;
app.use(express.static(static));

app.listen(port, () => {
    console.log("Express server started on Port " + port);
});