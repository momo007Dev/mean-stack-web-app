const {roles} = require('./roles');

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);
            //console.log((req.user._id).toString());
            //console.log(action);
            //console.log(resource);
            //console.log( (req.params.userId).toString());
            //console.log(permission.attributes);

            if (!permission.granted) {
                return res.status(403).json({
                    message: "You don't have enough permission to perform this action"
                });
            }

            if ((action === 'readOwn' || action === 'updateOwn') &&
                (req.user._id).toString() !==
                (req.params.userId).toString() && req.user.role !== 'admin' &&
                req.user.role !== 'teacher') {
                return res.status(403).json({
                    message: "You don't have enough permission to perform this action !"
                });
            }

            next()
        } catch (error) {
            next(error)
        }
    }
};

module.exports = {
    grantAccess
};
