import SEPA from 'sepa';
import i18n from './i18n';

/**
 * Validates an IBAN using the SEPA library
 * @param iban The IBAN to validate
 * @returns An object with validation result and message if applicable
 */
export const validateIBAN = (iban: string): { isValid: boolean; message?: string } => {
  try {
    // Check if IBAN is undefined or empty
    if (!iban) {
      return {
        isValid: false,
        message: i18n.t('validation.required')
      };
    }
    
    // Remove spaces for validation
    const cleanIban = iban.replace(/\s+/g, '');
    
    // Check if IBAN is valid
    const isValid = SEPA.validateIBAN(cleanIban);
    
    if (isValid) {
      return { isValid: true };
    }
    
    return {
      isValid: false,
      message: i18n.t('validation.invalidIban')
    };
  } catch (error) {
    console.error('Error validating IBAN:', error);
    return {
      isValid: false,
      message: i18n.t('validation.invalidIban')
    };
  }
};

/**
 * Validates a BIC code
 * @param bic The BIC to validate
 * @returns An object with validation result and message if applicable
 */
export const validateBIC = (bic: string): { isValid: boolean; message?: string } => {
  try {
    // Check if BIC is undefined or empty
    if (!bic) {
      return {
        isValid: false,
        message: i18n.t('validation.required')
      };
    }
    
    // Remove spaces for validation
    const cleanBic = bic.replace(/\s+/g, '');
    
    // Basic BIC validation (8 or 11 characters, alphanumeric)
    const bicRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    
    if (bicRegex.test(cleanBic)) {
      return { isValid: true };
    }
    
    return {
      isValid: false,
      message: i18n.t('validation.invalidBic')
    };
  } catch (error) {
    console.error('Error validating BIC:', error);
    return {
      isValid: false,
      message: i18n.t('validation.invalidBic')
    };
  }
};

/**
 * Validates a Creditor ID using the SEPA library
 * @param creditorId The Creditor ID to validate
 * @returns An object with validation result and message if applicable
 */
export const validateCreditorID = (creditorId: string): { isValid: boolean; message?: string } => {
  try {
    // Check if Creditor ID is undefined or empty
    if (!creditorId) {
      return {
        isValid: false,
        message: i18n.t('validation.required')
      };
    }
    
    // Remove spaces for validation
    const cleanCreditorId = creditorId.replace(/\s+/g, '');
    
    // Check if Creditor ID is valid
    const isValid = SEPA.validateCreditorID(cleanCreditorId);
    
    if (isValid) {
      return { isValid: true };
    }
    
    return {
      isValid: false,
      message: i18n.t('validation.required')
    };
  } catch (error) {
    console.error('Error validating Creditor ID:', error);
    return {
      isValid: false,
      message: i18n.t('validation.required')
    };
  }
};

/**
 * Formats an IBAN with spaces for better readability
 * @param iban The IBAN to format
 * @returns The formatted IBAN
 */
export const formatIBAN = (iban: string | undefined): string => {
  // Return empty string if IBAN is undefined or empty
  if (!iban) {
    return '';
  }
  
  const cleanIban = iban.replace(/\s+/g, '');
  return cleanIban.replace(/(.{4})/g, '$1 ').trim();
};
