export const emailTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your OTP Code</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#4F46E5; padding:24px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:22px;">Saraha App</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px; text-align:center;">
              <h2 style="margin:0 0 16px; color:#333333; font-size:20px;">Verification Code</h2>
              <p style="margin:0 0 24px; color:#666666; font-size:15px; line-height:1.5;">
                Use the code below to complete your verification. This code is valid for <strong>10 minutes</strong>.
              </p>
              <div style="display:inline-block; background-color:#f0f0f5; border-radius:6px; padding:16px 32px; margin-bottom:24px;">
                <span style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#4F46E5;">${otp}</span>
              </div>
              <p style="margin:0; color:#999999; font-size:13px; line-height:1.5;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f4f4f7; padding:20px; text-align:center;">
              <p style="margin:0; color:#aaaaaa; font-size:12px;">
                &copy; 2026 Saraha App. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;