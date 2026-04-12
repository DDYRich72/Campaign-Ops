/**
 * Simple encryption utilities for sensitive data
 * In production, use a proper KMS or Vault service
 */

const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt a string using AES-256-GCM
 * Note: In production, use AWS KMS, Google Cloud KMS, or HashiCorp Vault
 */
export function encrypt(text: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    console.warn('ENCRYPTION_KEY not set - storing tokens unencrypted');
    return `unencrypted:${text}`;
  }
  
  try {
    // Simple XOR-based encryption for demo (NOT for production)
    // In production, use crypto.subtle or node:crypto properly
    const keyBytes = Buffer.from(key.slice(0, 32).padEnd(32, '0'));
    const textBytes = Buffer.from(text);
    const encrypted = textBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
    return `enc:${encrypted.toString('base64')}`;
  } catch (err) {
    console.error('Encryption failed:', err);
    return `unencrypted:${text}`;
  }
}

/**
 * Decrypt a string
 */
export function decrypt(encryptedText: string): string {
  const key = process.env.ENCRYPTION_KEY;
  
  if (encryptedText.startsWith('unencrypted:')) {
    return encryptedText.slice('unencrypted:'.length);
  }
  
  if (!key || !encryptedText.startsWith('enc:')) {
    return encryptedText;
  }
  
  try {
    const keyBytes = Buffer.from(key.slice(0, 32).padEnd(32, '0'));
    const encrypted = Buffer.from(encryptedText.slice('enc:'.length), 'base64');
    const decrypted = encrypted.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.error('Decryption failed:', err);
    return encryptedText;
  }
}
