const optGenerator = require('otp-generator');
const now = new Date();

const method = {};

let salt = bcrypt.genSalt(10);
// let hash = bcrypt.hash(password, salt);

method.getUsers = async (req, res) => {
    // .find() to get all data on query;
    var user = await lampsDev41Connection.getRepository("Users").find();
    console.log(user);
    res.status(200).json({ user });
}

method.login = async (req, res)=>{
    try {
        var email    = req.body.email;
        var password = req.body.password;

        // get user
        var user = await lampsDev41Connection.getRepository("Users").findOne({
            select: {
                user_id: true,
                email: true,
                password: true,
                first_name: true,
                middle_name: true,
                last_name: true,
                ext_name: true,
            }, 
            where: {
                email: email,
                user_access: {
                    status: '1'
                }
            }
        });

        if(user != null){
            // check email if exists
            if(user.email){
                if(bcrypt.compare(password, user.password)){
                    // const generate_token = jwt.sign({ email: user.email }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1m'})
                    // const saved_webtoken = await saved_webtoken(user.user_id, generate_token);
                    const saved_otp      = await otp(user);
                    
                    if(saved_otp.status === false){
                        return res.send({ status:false, icon:"error", message: saved_otp.message });
                    }else{
                        const encrypted_uuid  = Buffer.from(user.user_id).toString('base64'); //Base64 encode
                        return res.status(200).send({ status:true, icon:"success", message: saved_otp.message, email: user.email, uuid: encrypted_uuid });
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
        console.log(error);
        return res.send(error);
    }
}

var otp = async (user) => {
    var response = {
        status: "",
        message: ""
    };

    // check active user otp
    const check_otp = await lampsDev41Connection.getRepository("UsersOtp").findOne({
        where: { 
            user_id: user.user_id, 
            status:'1', 
        }
    });

    if(check_otp){
        // Start a transaction
        await lampsDev41Connection.query('BEGIN');
        
        try {
            const updateResult = await lampsDev41Connection.getRepository('UsersOtp').update({user_id: user.user_id}, {status: '0'});
  
            if(updateResult.affected >= 1){
                const generate_otp = optGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
                const otp = {
                    'user_id': user.user_id,
                    'otp': generate_otp
                }

                const save_new_otp = await lampsDev41Connection.getRepository("UsersOtp").save(otp);
                
                if(save_new_otp){
                    // commit transaction:
                    await lampsDev41Connection.query('COMMIT');

                    var fullname = `${user.first_name}  ${user.middle_name} ${user.last_name} ${user.ext_name}`

                    // send email to user
                    // send_otp_mail(user.user_id, user.otp, user.email, user.role, fullname);
                    
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
        // Else: user not found on UsersOtp
        response.status  = false;
        response.message = 'User not found on the system!';
        return response;
    }
};

const send_otp_mail = (user_id, otp, email, role, fullname) => {
    // read otp mail view

}

method.otpVerification = (req, res) => {code 

}

method.sample_view_ejs = (req, res) => {
    var otp      = 123456;
    var email    = "kentleyong@gmail.com";
    var role     = "Super Admin";
    var fullname = "Kentley Ong";
    var date_created = date_and_time.format(now, 'YYYY-MM-DD HH:mm:ss');
    
    res.render('mail/otpMail', { otp, email, role, fullname, date_created });
};

module.exports = method;