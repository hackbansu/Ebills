const models = require(process.env.APP_ROOT + "/app/db/models");
const User = models.user;


module.exports = (obj, cb) => {
    User.findById(obj.id)
        .then((user) => {
            if (!user) {
                return cb("error");
            }
            return cb(null, user);
        })
        .catch((err) => cb(err))
};