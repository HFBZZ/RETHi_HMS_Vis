
export default function EmailNotification(subject, body) {
    var templateParams = {
        to_email: 'ctolbert555@gmail.com',
        from_name: 'RETHi Habitat',
        subject: subject,
        body: body,
    };

    emailjs.init("9sz-lY4SWMsyCE2je");
    
    emailjs.send("service_gmail", "flexible_template", templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
            console.log('FAILED...', error);
        });
}