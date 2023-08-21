const method = {};

method.usersTableQuery = async() => {
    var query = await lampsDev41Connection.getRepository("Users").findOne({
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
        },
    });
};

method.get_userByEmailQuery = async (email) => {
    var query = await lampsDev41Connection.getRepository("Users").findOne({
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
        },
        relations: [
            'user_access',           // Include user_access relation
            'user_access.role_type',  // Include role_type relation within user_access
        ]
    });

    return query;
};

method.get_userByUserID_query = async (user_id) => {
    var query = await lampsDev41Connection.getRepository("Users").findOne({
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
            user_id: user_id,
            user_access: {
                status: '1'
            }
        },
        relations: [
            'user_access',           // Include user_access relation
            'user_access.role_type',  // Include role_type relation within user_access
        ]
    });

    return query;
};

method.get_userRolesAndUserAccessQuery = async (user_id) => {
    var query = await lampsDev41Connection.getRepository("Users").findOne({
        select: {
            user_id: true,
            email: true,
            password: true,
            first_name: true,
            middle_name: true,
            last_name: true,
            ext_name: true,
            contact_no: true, 
            reg: true,
            prov: true,
            mun: true,
            bgy: true,
        }, 
        where: {
            user_id: user_id,
            user_access: {
                status: '1'
            }
        },
        relations: [
            'user_access',           // Include user_access relation
            'user_access.role_type',  // Include role_type relation within user_access
        ]
    });

    return query;
};

method.get_allUsersQuery = async() => {
    var query = await lampsDev41Connection.getRepository("Users").find({
        select: {
            user_id: true,
            email: true,
            password: true,
            first_name: true,
            middle_name: true,
            last_name: true,
            ext_name: true,
            contact_no: true, 
            reg: true,
            prov: true,
            mun: true,
            bgy: true
        }, 
        where: {
            user_access: {
                status: '1'
            }
        },
        relations: [
            'user_access',           // Include user_access relation
            'user_access.role_type',  // Include role_type relation within user_access
        ]
    });

    return query;
};

method.get_active_OTP_query = async(user_id) => {
    var query = await lampsDev41Connection.getRepository("UsersOtp").findOne({
        where: { 
            user_id: user_id, 
            status:'1', 
        }
    });
    
    return query;
};

method.updateOTP_query = async(user_id) => {
    var query = await lampsDev41Connection.getRepository('UsersOtp').update({user_id: user_id}, {status: '0'});

    return query;
};

method.save_otp_query = async(otp) => {
    var query = await lampsDev41Connection.getRepository("UsersOtp").save(otp);

    return query;
};

method.update_password_reset_status_query = async(user_id, expiration_date) => {
    var query = await lampsDev41Connection.getRepository("Users").update({user_id: user_id}, {password_reset_status: 1, password_expired_status: expiration_date})

    return query;
};

module.exports = method;