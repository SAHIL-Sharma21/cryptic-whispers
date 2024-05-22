//writing logic for sending verification email

import {resend} from '@/lib/resend'

import VerificationEmailTemplate from '../../emails/VerificationEmailTemplate'

import {ApiResponse} from '@/types/ApiResponse'

//now email method: emails are always async

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        //sending email logic read from documentation.
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "Cryptic whispers | Verification Code",
            react: VerificationEmailTemplate({username, otp: verifyCode}),
        });

        return {
            success: true,
            message: "Verification email send successfully!"
        }
    } catch (emailError) {
        console.error("Error sending verification email.", emailError);
        //returing so that ts did not give warning
        return {
            success: false,
            message: "Failed to send verification email."
        }
    }
}