import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter (configure based on your email provider)
const createTransporter = () => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.warn('⚠️ Email not configured - notifications will be logged only');
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const transporter = createTransporter();

/**
 * Send email notification for new lead
 * @param {object} lead - Lead record from database
 * @param {object} formData - Original form data
 */
export const sendLeadNotification = async (lead, formData) => {
    const { name, email, message, company } = formData;

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 20px; border-radius: 8px 8px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #1e293b; padding: 24px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 16px; }
        .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .value { color: #f1f5f9; font-size: 16px; margin-top: 4px; }
        .message { background: #0f172a; padding: 16px; border-radius: 8px; border-left: 4px solid #0ea5e9; }
        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
        .badge { display: inline-block; background: #10b981; color: #000; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 New Lead Received</h1>
        </div>
        <div class="content">
            <p><span class="badge">NEW INQUIRY</span></p>
            
            <div class="field">
                <div class="label">Name</div>
                <div class="value">${name}</div>
            </div>
            
            <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}" style="color: #0ea5e9;">${email}</a></div>
            </div>
            
            ${company ? `
            <div class="field">
                <div class="label">Company</div>
                <div class="value">${company}</div>
            </div>
            ` : ''}
            
            <div class="field">
                <div class="label">Message</div>
                <div class="message">${message}</div>
            </div>
            
            <div class="field">
                <div class="label">Submitted At</div>
                <div class="value">${new Date(lead.submitted_at).toLocaleString()}</div>
            </div>
        </div>
        <div class="footer">
            SecurePent Lead Management System
        </div>
    </div>
</body>
</html>
    `;

    if (!transporter) {
        console.log('📧 [EMAIL SIMULATION] New lead notification:');
        console.log(`   From: ${name} <${email}>`);
        console.log(`   Company: ${company || 'N/A'}`);
        console.log(`   Message: ${message.substring(0, 100)}...`);
        return;
    }

    try {
        await transporter.sendMail({
            from: `"SecurePent Leads" <${process.env.SMTP_USER}>`,
            to: process.env.NOTIFICATION_EMAIL || 'team@securepent.com',
            subject: `🎯 New Lead: ${name} - ${company || 'Individual'}`,
            html: emailContent,
            text: `New Lead from ${name} (${email}):\n\n${message}`,
        });

        console.log('📧 Lead notification sent successfully');
    } catch (error) {
        console.error('📧 Email send failed:', error.message);
        throw error;
    }
};

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (user) => {
    if (!transporter) {
        console.log(`📧 [EMAIL SIMULATION] Welcome email to: ${user.email}`);
        return;
    }

    try {
        await transporter.sendMail({
            from: `"SecurePent" <${process.env.SMTP_USER}>`,
            to: user.email,
            subject: 'Welcome to SecurePent Client Portal',
            html: `
                <h1>Welcome to SecurePent!</h1>
                <p>Hi ${user.name},</p>
                <p>Your account has been created successfully.</p>
                <p>You can now access the client portal to view your security assessments.</p>
            `,
        });
    } catch (error) {
        console.error('Welcome email failed:', error.message);
    }
};
