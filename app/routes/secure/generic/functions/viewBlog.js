const Op = require("sequelize").Op;
const models = require(process.env.APP_ROOT + "/app/db/models");
const Blog = models["blog"];
const View = models["view"];

module.exports = (req, res) => {
    let blogId = parseInt(req.query["blogId"]);
    Blog
        .findById(blogId)
        .then((blog) => {
            if (!blog) {
                return res.status(404).json({status: false, msg: "blog not found"});
            }
            blog
                .increment('views', {by: 1})
                .then(() => {
                    let whereObj = {
                        blog_id: blogId
                    };
                    whereObj[req["user"]["isBlogger"] ? "blogger_id" : "user_id"] = req["user"]["id"];
                    View
                        .findOrCreate({
                            where: whereObj,
                            logging: false
                        })
                        .spread((obj, created) => {
                            if (!created) {
                                return res.status(200).json({
                                    status: true,
                                    msg: "view added and points not incremented"
                                });
                            }
                            // increment points of the user
                            let pointIncCount = parseInt(process.env[(req["user"]["isBlogger"] ? "BLOGGER" : "USER") + "_BLOG_VIEW_POINTS"])
                            req["user"]
                                .increment('points', {
                                    by: pointIncCount
                                })
                                .then(() => {
                                    return res.status(200).json({
                                        status: true,
                                        msg: "view added and points incremented"
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return res.status(503).json({status: false, msg: "error in database"});
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(503).json({status: false, msg: "error in database"});
                        });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(503).json({status: false, msg: "error in database"});
                });
        })
        .catch((err) => {
            console.log(err);
            return res.status(503).json({status: false, msg: "error in database"});
        });
};