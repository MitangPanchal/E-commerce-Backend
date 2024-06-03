const nodeMailer=require('nodemailer')

const sendEmail=async (options)=>{

    const transporter=nodeMailer.createTransport({
        service:"gmail",
        auth:{
            user:"krishna.cars.27@gmail.com",
            pass:"ibtmrjzoorzqffka"
        }
    })

    const mailOptions={
        from:"krishna.cars.27@gmail.com",
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailOptions)
}
module.exports=sendEmail