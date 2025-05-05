import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import redis from '@repo/cache/cache'
import { EMAIL_QUEUE, SIGNUP } from '@repo/common/config';
import { IEmail, IMailOptions } from '@repo/common/types';
import jwt from 'jsonwebtoken'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  },
});

async function emailSender() {
  await nodemailer.createTestAccount();
  while (true) {
    try {
      const data = await redis.brpop(EMAIL_QUEUE, 0)
      const mailOptions: IMailOptions = {
        from: process.env.EMAIL_ADDRESS!,
      }
      if (data) {
        const { subject, token }: IEmail = JSON.parse(data[1]);
        const decoded: any = await jwt.verify(token, 'rahul')
        mailOptions.to = decoded.email;
        if (subject === SIGNUP) {
          const verificationUrl = `${process.env.CLIENT_URL}/verify/${token}`
          mailOptions.subject = `Welcome to Draw App`
          mailOptions.html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="UTF-8" />
                      <title>Welcome!</title>
                      <style>
                        body { font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
                        .button { display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
                        .footer { margin-top: 40px; font-size: 12px; color: #888888; text-align: center; }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h2>Welcome, ${decoded.name} 👋</h2>
                        <p>Thank you for signing up! We’re excited to have you on board.</p>
                        <p>To complete your registration, please verify your email address by clicking the button below:</p>
                        <a href="${verificationUrl}" class="button">Verify Email</a>
                        <p>If you didn’t sign up, you can safely ignore this email.</p>
                        <div class="footer">&copy; 2025 Your Draw App. All rights reserved.</div>
                      </div>
                    </body>
                    </html>
                  `;
        } else if (subject === 'FORGOTPASSWORD') {
          const verificationUrl = `${process.env.CLIENT_URL}/recover-account/${token}`
          mailOptions.subject = `Recover Draw App Account`
          mailOptions.html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="UTF-8" />
                      <title>Password Recovery!</title>
                      <style>
                        body { font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
                        .button { display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
                        .footer { margin-top: 40px; font-size: 12px; color: #888888; text-align: center; }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h2>Welcome, ${decoded.name} 👋</h2>
                        <p>We came to know that you forgot your draw app password</p>
                        <p>No Problem, To recover it click on the link below</p>
                        <a href="${verificationUrl}" class="button">Recover Account</a>
                        <p>If you didn’t requested this, you can safely ignore this email.</p>
                        <div class="footer">&copy; 2025 Your Draw App. All rights reserved.</div>
                      </div>
                    </body>
                    </html>
                  `;
        }
        await transporter.sendMail(mailOptions)
        console.log(`Email Send to token - ${token}`)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
emailSender();