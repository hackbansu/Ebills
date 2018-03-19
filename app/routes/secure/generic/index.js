const Router = require("express").Router;
const route = Router();


// view a blog      query = {blogId}
route.post('/uploadXML', require("./functions/uploadXML"));
// like a blog      query = {blogId}
route.get('/toggleBlogLike', require("./functions/toggleBlogLike"));

module.exports = route;