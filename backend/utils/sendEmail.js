import nodemailer from "nodemailer";

export const sendOTPEmail = async (
  email = "gmyidea675@gmail.com",
  otp = 552314,
) => {
  console.log("EMAIL_USER:", envars.email_user);
  console.log("EMAIL_PASS exists:", !!envars.email_pass);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `EasyBuy <${envars.email_user}>`,
    to: email,
    subject: "Your Verification Code",
    html: `
      <div style="margin:0;padding:0;background:#f4f6f8;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f8;padding:20px 10px;">
          <tr>
            <td align="center">

              <!-- Main Container -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="background:#2563eb;padding:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center">

                          <!-- Logo + Name -->
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="vertical-align:middle;">
                                <img src="https://i.ibb.co/NdK5GhSr/elogo.png" alt="EasyBuy Logo" width="40" style="display:block;border:0;border-radius:100%;" />
                              </td>
                              <td width="10"></td>
                              <td style="vertical-align:middle;">
                                <span style="color:#ffffff;font-size:28px;font-weight:bold;font-family:Arial,sans-serif;">
                                  EasyBuy
                                </span>
                              </td>
                            </tr>
                          </table>

                          <!-- Subtitle -->
                          <p style="margin:8px 0 0;color:#dbeafe;font-size:13px;font-family:Arial,sans-serif;">
                            Password Reset Request
                          </p>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px 20px;text-align:center;font-family:Arial,sans-serif;">

                    <h2 style="margin:0 0 10px;color:#111827;font-size:20px;">
                      Verify Your Identity
                    </h2>

                    <p style="color:#6b7280;font-size:14px;line-height:1.5;margin-bottom:20px;">
                      Use the OTP below to reset your password. This code will expire in <strong>5 minutes</strong>.
                    </p>

                    <!-- OTP Box -->
                    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:20px auto;">
                      <tr>
                        <td style="
                          padding:14px 24px;
                          font-size:26px;
                          font-weight:bold;
                          letter-spacing:6px;
                          color:#111827;
                          background:#f3f4f6;
                          border:2px dashed #d1d5db;
                          border-radius:8px;
                          font-family:Arial,sans-serif;
                        ">
                          ${otp}
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
                      <tr>
                        <td style="height:1px;background:#e5e7eb;"></td>
                      </tr>
                    </table>

                    <!-- Info -->
                    <p style="color:#6b7280;font-size:13px;line-height:1.5;">
                      If you didn’t request this, you can safely ignore this email.
                    </p>

                    <p style="color:#9ca3af;font-size:12px;margin-top:10px;">
                      Never share this code with anyone.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f9fafb;padding:15px;text-align:center;font-family:Arial,sans-serif;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;">
                      © ${new Date().getFullYear()} EasyBuy. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </div>
      `,
  });
};
