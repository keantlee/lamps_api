const controller = require("../controller/loginController");

route.get('/lamps-testing', controller.getUsers)

route.get('/api/sample_view_ejs', controller.sample_view_ejs);

route.post('/api/login-verification', controller.login);

route.post('/api/resend_otp', controller.resend_otp);

route.post('/api/send_reset_password_link', controller.send_reset_password_link);

// route.post('/otp-verification', controller.otpVerification);

module.exports = route;