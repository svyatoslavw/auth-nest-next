export function getEmailHtml(code: string): string {
  return `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; text-align: center;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; display: inline-block;">
                <h1 style="color: #333333;">Your Verification Code</h1>
                <p style="color: #666666; font-size: 12px;">Use the following code to login to your account:</p>
                <p style="color: #3366cc; font-size: 36px; font-weight: bold;">${code}</p>
                <p style="color: #666666; text-decoration: underline;">This code will expire in 5 minutes.</p>
            </div>
        </div>
    `
}
