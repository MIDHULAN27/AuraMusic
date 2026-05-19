import CryptoJS from 'crypto-js';

/**
 * Decrypts JioSaavn encrypted media URLs
 * @param {string} encryptedUrl - The base64 encoded encrypted URL
 * @returns {string} - The decrypted media URL
 */
export const decryptUrl = (encryptedUrl) => {
  if (!encryptedUrl) return '';
  
  try {
    const key = '38346b36'; // Standard JioSaavn decryption key
    const bytes = CryptoJS.DES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(encryptedUrl) },
      CryptoJS.enc.Utf8.parse(key),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    
    let decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    // Safety check and common fixes
    if (!decrypted) return '';
    
    // Replace http with https and ensure .mp3 or similar
    decrypted = decrypted.replace('http:', 'https:');
    
    // Fix for some older formats that might include extra characters
    if (decrypted.includes('_96.mp4')) decrypted = decrypted.replace('_96.mp4', '_320.mp4');
    else if (decrypted.includes('_96.mp3')) decrypted = decrypted.replace('_96.mp3', '_320.mp3');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};
