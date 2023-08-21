const controller = require("../controller/loginController");

// route.get('/lamps-testing/login-verification', controller.getUsers)

route.get('/api/sample_view_ejs', controller.sample_view_ejs);

route.post('/api/login-verification', controller.login);
// route.post('/otp-verification', controller.otpVerification);

module.exports = route;