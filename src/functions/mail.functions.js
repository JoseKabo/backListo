function createMailOptions(to, subject, contentHTML) {
    return {
        from: "cdental.support@tecdevsmx.com",
        to: to,
        subject: subject,
        html: contentHTML
    };
}

module.exports = createMailOptions;