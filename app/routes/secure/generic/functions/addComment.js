const Op = require("sequelize").Op;
const models = require(process.env.APP_ROOT + "/app/db/models");
const Blogger = models["blogger"];
const User = models["user"];
const Blog = models["blog"];
const Blog_like = models["blog_like"];
const Comment = models["comment"];

module.exports = (req, res) => {
    let comment = req.body["comment"], blogId = parseInt(req.body["blogId"]);
    let parentId = req.body["parentId"] ? parseInt(req.body["parentId"]) : null;
    let whereObj = {
        comment: comment,
        blog_id: blogId,
        parentId: parentId
    };
    whereObj[req["user"]["isBlogger"] ? "blogger_id" : "user_id"] = req["user"]["id"];
    Comment
        .findOrCreate({
            where: whereObj,
            logging: false
        })
        .spread((obj, created) => {
            if (!created) {
                return res.status(400).json({status: true, msg: "comment already posted"});
            }
            return res.status(200).json({status: true, msg: "comment added"});
        })
        .catch((err) => {
            console.log(err);
            return res.status(503).json({status: false, msg: "error in database"});
        })
};