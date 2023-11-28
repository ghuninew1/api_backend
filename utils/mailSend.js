import nodemailer from "nodemailer";

export const mailSend = async (email, subject, text, html) => {
    try {
        if (email !== "" && email !== undefined) {
            const transporter = nodemailer.createTransport(
                {
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                    logger: true,
                    transactionLog: false, // include SMTP traffic in the logs
                    allowInternalNetworkInterfaces: true,
                },
                {
                    from: "GhuniNew ",
                }
            );

            const message = {
                from: '"GhuniNew" <ghuninew@localhost.local>',
                to: email ? email : "aakanun43@gmail.com",
                subject: subject ? subject : "mail test",
                text: text ? text : "test text",
                html: html ? html : "<b>test html</b>",
            };

            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log("Error occurred. " + err.message);
                    return process.exit(1);
                }
                return info;
            });
        } else {
            console.log({ message: "email is empty" });
        }
    } catch (err) {
        return err;
    }
};

export default mailSend;
