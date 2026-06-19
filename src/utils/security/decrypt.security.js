import crypto from "node:crypto";

// Ensure this is exactly 32 characters
const ENCRYPTION_KEY = Buffer.from("12345678901234567890123456789012", "utf8");

export function decrypt(text) {
    // 1. Split the IV from the Ciphertext
    const [ivHex, encryptedText] = text.split(':');

    // 2. Convert IV back to binary
    const iv = Buffer.from(ivHex, 'hex');

    // 3. Create the Decipher engine
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

    // 4. Update: convert from Hex back to UTF-8
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');

    // 5. Final: Output the last chunk as UTF-8 (This was the error!)
    decrypted += decipher.final('utf8'); 

    return decrypted;
}