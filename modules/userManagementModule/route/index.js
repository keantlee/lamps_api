const controller = require("../controller/userController");

route.get('/api/user-management/index', controller.index);

module.exports = route;
