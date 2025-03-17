import Papa from 'papaparse';
import readXlsxFile from 'read-excel-file';
import i18n from './i18n';

export const parseFile = async (file: File): Promise<string[][]> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExtension === 'csv') {
    return parseCSV(file);
  } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    return parseExcel(file);
  } else {
    throw new Error(i18n.t('fileUpload.errors.invalidFormat'));
  }
};

const parseCSV = (file: File): Promise<string[][]> => {
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

const parseExcel = async (file: File): Promise<string[][]> => {
  try {
    const rows = await readXlsxFile(file);
    
    // Convert all cell values to strings to maintain consistency with CSV parsing
    return rows.map(row => 
      row.map(cell => 
        cell === null ? '' : String(cell)
      )
    );
  } catch (error) {
    console.error('Error parsing Excel file', error);
    throw new Error(i18n.t('fileUpload.errors.invalidFormat'));
  }
};

export const mapFileToMembers = (
  data: string[][],
  columnMapping: import('../types').ColumnMapping,
  hasHeader: boolean
): import('../types').Member[] => {
  const startIndex = hasHeader ? 1 : 0;
  const members: import('../types').Member[] = [];

  for (let i = startIndex; i < data.length; i++) {
    const row = data[i];
    if (row.length === 0 || row.every(cell => cell === '')) continue;

    const member: Partial<import('../types').Member> = {};

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

    members.push(member as import('../types').Member);
  }

  return members;
};
