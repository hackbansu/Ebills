const Router = require("express").Router;
const route = Router();


// view a blog      query = {blogId}
route.post('/uploadXML', require("./functions/uploadXML"));

module.exports = route;