import crypto from "node:crypto";

// Use 32 bytes (256 bits) for AES-256
const ENCRYPTION_KEY = "12345678901234567890123456789012"; // You should store this securely
const IV_LENGTH = 16; // For AES, the IV is always 16 bytes

export function encrypt(text) {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create the cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

    // Encrypt the text: input is utf8, output is hex
    let encrypted = cipher.update(text, 'utf8', 'hex');

    // Finalize the encryption (handles padding)
    encrypted += cipher.final('hex');

    // Return the IV and the encrypted data joined by a colon
    return iv.toString('hex') + ':' + encrypted;
}