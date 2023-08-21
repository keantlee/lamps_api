const send_mail = async (email, msg_from, msg_subject, mail_path, mail_datas) => {
    try {
        const mail_template = await ejs.renderFile(path.join(__dirname, mail_path), mail_datas);

        const msg_attachment = [
            {
                filename: 'DA-LOGO-1024x1024.png',
                path: path.join(__dirname, '../../public/assets/images/DA-LOGO-1024x1024.png'),
                cid: 'da_logo_img' // Use a unique identifier here
            },
            {
                filename: 'user.png',
                path: path.join(__dirname, '../../public/assets/images/user.png'),
                cid: 'user_img' // Use a unique identifier here
            },
            {
                filename: 'user_access.png',
                path: path.join(__dirname, '../../public/assets/images/user_access.png'),
                cid: 'user_access_img' // Use a unique identifier here
            },
            {
                filename: 'calendar.png',
                path: path.join(__dirname, '../../public/assets/images/calendar.png'),
                cid: 'calendar_img' // Use a unique identifier here
            },
        ];

        const mailOptions = {
            from: msg_from,
            to: email.trim(),
            subject: msg_subject,
            html: mail_template,
            attachments: msg_attachment
        };
    
        // Send mail using NodeMailer
        return await transporter.sendMail(mailOptions); 
    } catch (err) {
        console.error('Error sending mail:', err);
        return err;
    }
}

module.exports = { send_mail };