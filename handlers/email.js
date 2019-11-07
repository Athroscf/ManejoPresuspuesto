const emailConfig = require("../config/email");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const util = require("util");

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

transport.use(
    "compile",
    hbs({
        viewEngine: {
            extName: ".handlebars",
            partialsDir: __dirname + "/../views/email",
            layoutsDir: __dirname + "/../views/email",
            defaultLayout: ""
        },
        viewPath: __dirname + "/../views/email",
        extName: ".handlebars"
    })
);

exports.enviar = async options => {
    const optionsEmail = {
        from: "Budget Manager <noreply@budgetmanager.com>",
        to: options.usuario.email,
        subject: options.subject,
        template: options.template,
        context: {
            resetUrl: options.resetUrl
        }
    };

    const sendMail = util.promisify(transport.sendMail, transport);
    
    return sendMail.call(transport, optionsEmail);
}
