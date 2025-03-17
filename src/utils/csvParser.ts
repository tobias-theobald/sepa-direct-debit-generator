import Papa from 'papaparse';
import { Member, ColumnMapping } from '../types';

export const parseCSV = (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        resolve(results.data as string[][]);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const mapCSVToMembers = (
  data: string[][],
  columnMapping: ColumnMapping,
  hasHeader: boolean
): Member[] => {
  const startIndex = hasHeader ? 1 : 0;
  const members: Member[] = [];

  for (let i = startIndex; i < data.length; i++) {
    const row = data[i];
    if (row.length === 0 || row.every(cell => cell === '')) continue;

    const member: Partial<Member> = {};

    // Name field
    if (columnMapping.name !== undefined && columnMapping.name >= 0 && columnMapping.name < row.length) {
      member.name = row[columnMapping.name].trim();
    }

    // First name field
    if (columnMapping.firstName !== undefined && columnMapping.firstName >= 0 && columnMapping.firstName < row.length) {
      member.firstName = row[columnMapping.firstName].trim();
    }

    // Last name field
    if (columnMapping.lastName !== undefined && columnMapping.lastName >= 0 && columnMapping.lastName < row.length) {
      member.lastName = row[columnMapping.lastName].trim();
    }

    // IBAN field (required)
    if (columnMapping.iban >= 0 && columnMapping.iban < row.length) {
      member.iban = row[columnMapping.iban].trim();
    }

    // Mandate date field (required)
    if (columnMapping.mandateDate >= 0 && columnMapping.mandateDate < row.length) {
      member.mandateDate = row[columnMapping.mandateDate].trim();
    }

    // Mandate reference field (required)
    if (columnMapping.mandateReference >= 0 && columnMapping.mandateReference < row.length) {
      member.mandateReference = row[columnMapping.mandateReference].trim();
    }

    // Fee field (optional)
    if (columnMapping.fee !== undefined && columnMapping.fee >= 0 && columnMapping.fee < row.length) {
      const feeStr = row[columnMapping.fee].trim().replace(',', '.');
      const fee = parseFloat(feeStr);
      if (!isNaN(fee)) {
        member.fee = fee;
      }
    }

    members.push(member as Member);
  }

  return members;
};
