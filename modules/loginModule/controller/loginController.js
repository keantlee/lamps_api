const optGenerator = require('otp-generator');
const now          = new Date();
require("../../../models/usersEntity"); // Import related entity
const loginModel   = require("../model/loginModel");
const mail         = require("../../../global/mail/send_mail");
const method       = {};


method.login = async (req, res)=>{
    try {
        var email     = req.body.email;
        var password  = req.body.password;
        
        // get user by emai repository
        var user = await loginModel.get_userByEmailQuery(email);

        if(user != null){
            // check email if exists
            if(user.email){
                const passwordVersion = user.password.indexOf("$2y$");
                const hashedPassword  = (passwordVersion == 0) ? user.password.replace("$2y$", "$2a$") :  user.password;
    
                const compare = await bcrypt.compare(password, hashedPassword);

                if(compare === true){
                    // const generate_token = jwt.sign({ email: user.email }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1m'})
                    // const saved_webtoken = await saved_webtoken(user.user_id, generate_token);
                    const saved_otp   = await otp(user);
                    
                    if(saved_otp.status === false){
                        return res.send({ status:false, icon:"error", message: saved_otp.message });
                    }else{
                        const encrypted_uuid  = Buffer.from(user.user_id).toString('base64'); //Base64 encode
                        return res.send({ status:true, icon:"success", message: saved_otp.message, email: user.email, uuid: encrypted_uuid });
                    }
                }else{
                    return res.send({ status:false, icon:"error", message: "Incorrect email or password!" });
                }
            }else{
                return res.send({ status:false, icon:"error", message: "Email does not exists!" });
            }
        }else{
            return res.send({ status:false, icon:"error", message: "User does not exists on the system!" });
        }
    } catch (error) {
        // var break_tag = "<br/>";
        console.log(error);
        res.send(error);
        // return res.send({ status:false, icon:"error", message:`Failed to login. ${break_tag} ${break_tag} Error: ${error}`});
    }
};

method.verifyOTP = async(req, res) => {
    var input_otp = req.body.otp;
    var user_id   = req.body.user_id;

    var check_otp = await loginModel.get_active_OTP_query(user_id);

    if(check_otp.otp == input_otp){
        // Get user user_access and roles
        var user  = await loginModel.get_userRolesAndUserAccessQuery(user_id);

        // stored in session
        
        // Go to home page
    }else{
        return res.send({ status:false, icon:'error', message:'Invalid OTP' });
    }
};

method.resend_otp = async(req, res) => {
    try {
        var user_id = req.body.user_uuid;

        // get user by email repository
        var user = await loginModel.get_userByUserID_query(user_id);
   
        const saved_otp = await otp(user);

        if(saved_otp.status === false){
            return res.send({ status:false, icon:"error", message: saved_otp.message });
        }else{
            return res.send({ status:true, icon:"success", message: saved_otp.message});
        }
    } catch (error) {
        var break_tag = "<br/>";
        console.log(error);
        return res.send({ status:false, icon:"error", message:`Failed to resend OTP. ${break_tag} ${break_tag} Error: ${error}`});
    }
};

method.send_reset_password_link = async(req, res) => {
    try {
        var email = req.body.email;

        var user = await loginModel.get_userByEmailQuery(email);
    
        if(user){
            if(user.email == email){
                var user_id        = Buffer.from(user.user_id).toString('base64'); //Base64 encode
                var middle_name    = user.middle_name == null ? '' : user.middle_name;
                var last_name      = user.ext_name == null ? '' : user.ext_name;
                var fullname       = `${user.first_name}  ${middle_name} ${user.last_name} ${last_name}`;
                var role           = user.user_access[0].role_type.role;
                
                var msg_from       = `lamps_mail_testing@gmail.com`;
                var msg_subject    = `Reset Password`;
                var date_created   = date_and_time.format(now, 'YYYY-MM-DD HH:mm:ss');
                var mail_path      = '../../modules/loginModule/views/mail/sendResetLinkMail.ejs';
                var base_url        = "http://localhost/lamps" // req.protocol + '://' + req.get('host')
                var mail_datas     = { base_url, email, user_id, role, fullname, date_created };
    
                // console.log(mail_datas);
                
                // Update password_reset_status to "1"
                await loginModel.update_password_reset_status_query(user.user_id, date_created);
    
                // send email to user
                mail.send_mail(user.email, msg_from, msg_subject, mail_path, mail_datas);
    
                return res.send({status: true, icon: "success", message: "Reset password link is has been sent to your email."});
            }else{
                return res.send({status: false, icon: "error", message: "Incorrect email!"});
            }
        }else{
            return res.send({status: false, icon: "error", message: "Email does not exists!"});
        }
    } catch (error) {
        var break_tag = "<br/>";
        console.log(error);
        return res.send({ status:false, icon:"error", message:`Failed to send reset link. ${break_tag} ${break_tag} Error: ${error}`});
    }
};


const otp = async (user) => {
    var response = {
        status: "",
        message: ""
    };

    // check active user otp
    var check_otp = await loginModel.get_active_OTP_query(user.user_id);

    if(check_otp){
        // Start a transaction
        await lampsDev41Connection.query('BEGIN');
        
        try {
            const updateResult = await loginModel.updateOTP_query(user.user_id);
  
            if(updateResult.affected >= 1){
                const generate_otp = optGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
                const otp = {
                    'user_id': user.user_id,
                    'otp': generate_otp
                }

                const save_new_otp = await loginModel.save_otp_query(otp);
                
                if(save_new_otp){
                    // commit transaction:
                    await lampsDev41Connection.query('COMMIT');
   
                    var middle_name    = user.middle_name == null ? '' : user.middle_name;
                    var last_name      = user.ext_name == null ? '' : user.ext_name;
                    var fullname       = `${user.first_name}  ${middle_name} ${user.last_name} ${last_name}`;
                    var role           = user.user_access[0].role_type.role;

                    var msg_from       = `lamps_mail_testing@gmail.com`;
                    var msg_subject    = `OTP`;
                    var date_created   = date_and_time.format(now, 'YYYY-MM-DD HH:mm:ss');
                    var mail_path      = '../../modules/loginModule/views/mail/otpMail.ejs';
                    var mail_datas     = { otp:generate_otp, email: user.email, role, fullname, date_created };
                  
                    // send email to user
                    mail.send_mail(user.email, msg_from, msg_subject, mail_path, mail_datas);
                    
                    response.status  = true;
                    response.message = "OTP has been sent to your email!";
                    return response;
                }else{
                    // rollback transaction:
                    await lampsDev41Connection.query('ROLLBACK');
                    response.status  = false;
                    response.message = "Creating new OTP failed!";
                    return response;
                }
            }else{
                // rollback transaction:
                await lampsDev41Connection.query('ROLLBACK');
                response.status  = false;
                response.message = "Updating OTP status failed!";
                return response;
            }
        } catch (err) {
            // rollback transaction:
            await lampsDev41Connection.query('ROLLBACK');
            response.status  = false;
            response.message = err;
            return response;
        } finally {
            await lampsDev41Connection.close();
        }
    }else{
        // Else: user not found on UsersOtp or status is not '1'
        response.status  = false;
        response.message = 'Error, on generating OTP';
        return response;
    }
};

//===============================================  TEST DATAS ==================================================================
method.sample_view_ejs = (req, res) => {
    var otp      = 123456;
    var email    = "kentleyong@gmail.com";
    var role     = "Super Admin";
    var fullname = "Kentley Ong";
    var date_created = date_and_time.format(now, 'YYYY-MM-DD HH:mm:ss');
    const da_logo_img = fs.readFileSync(
        path.join(__dirname, '../../../public/assets/images/DA-LOGO-1024x1024.png'),
        'base64'
    );      
    res.render('mail/otpMail', { otp, email, role, fullname, date_created, da_logo_img});
};

method.getUsers = async (req, res) => {
    var users = await loginModel.get_allUsersQuery();
    console.log(users);
    return res.send(users);

    // .find() to get all data on query;
    // var email = 'kentleyong@gmail.com';

    // var user = await lampsDev41Connection.getRepository("Users").findOne({
    //     select: {
    //         user_id: true,
    //         email: true,
    //         password: true,
    //         first_name: true,
    //         middle_name: true,
    //         last_name: true,
    //         ext_name: true,
    //     }, 
    //     where: {
    //         email: email,
    //         user_access: {
    //             status: '1'
    //         }
    //     },
    //     relations: [
    //         'user_access',                  // Include user_access relation
    //         'user_access.role_type',        // Include role_type relation within user_access
    //         // 'user_access.role_type.users', // Include users relation within role_type
    //     ]
    // });

    // var get_role = user.user_access[0].role_type.role;
    // return res.json({ user });
}
//===============================================  TEST DATAS ==================================================================

module.exports = method;