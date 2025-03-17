import { ClubInfo, Member } from '../types';
import SEPA from 'sepa';

export const generateSepaXML = (clubInfo: ClubInfo, members: Member[]): string => {
  try {
    // Create a new SEPA document for direct debit
    const doc = new SEPA.Document('pain.008.001.02');
    
    // Set up the group header
    doc.grpHdr.id = `MSG-${Date.now()}`;
    doc.grpHdr.created = new Date();
    doc.grpHdr.initiatorName = clubInfo.name;
    
    // Create payment info
    const info = doc.createPaymentInfo();
    
    // Calculate execution date (current date + days in future)
    const executionDate = new Date();
    executionDate.setDate(executionDate.getDate() + clubInfo.executionDaysInFuture);
    
    info.collectionDate = executionDate;
    info.creditorIBAN = clubInfo.iban;
    info.creditorBIC = clubInfo.bic;
    info.creditorName = clubInfo.name;
    info.creditorId = clubInfo.creditorId;
    info.batchBooking = true;
    info.localInstrumentation = 'CORE'; // Standard SEPA direct debit
    info.sequenceType = 'RCUR'; // Recurring collection

    doc.addPaymentInfo(info);
    
    // Add transactions for each member
    members.forEach((member) => {
      const memberName = member.name || `${member.firstName} ${member.lastName}`;
      const fee = member.fee !== undefined ? member.fee : clubInfo.membershipFee;
      
      if (fee === undefined) {
        console.error(`No fee defined for member: ${memberName}`);
        return;
      }
      
      const tx = info.createTransaction();
      tx.debtorName = memberName;
      tx.debtorIBAN = member.iban;
			// BIC is optional
      tx.mandateId = member.mandateReference;
      
      // Parse mandate date
      let mandateDate;
      try {
        mandateDate = new Date(member.mandateDate);
        if (isNaN(mandateDate.getTime())) {
          // If parsing fails, try different format (DD.MM.YYYY)
          const parts = member.mandateDate.split('.');
          if (parts.length === 3) {
            mandateDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }
      } catch (e) {
        console.error(`Invalid mandate date format for member: ${memberName}`, e);
        // Use current date as fallback
        mandateDate = new Date();
      }
      
      tx.mandateSignatureDate = mandateDate;
      tx.amount = fee;
      tx.currency = 'EUR';
      tx.remittanceInfo = clubInfo.purpose;
      tx.end2endId = `${clubInfo.reference}-${member.mandateReference}`;
      
      info.addTransaction(tx);
    });
    
    // Generate the XML string
    return doc.toString();
  } catch (error) {
    console.error('Error generating SEPA XML:', error);
    throw new Error(`Failed to generate SEPA XML: ${error instanceof Error ? error.message : String(error)}`);
  }
};
