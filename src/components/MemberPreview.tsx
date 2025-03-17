import React, { useState, useEffect } from 'react';
import { Member, ClubInfo } from '../types';
import { validateIBAN, formatIBAN } from '../utils/validation';

interface MemberPreviewProps {
  members: Member[];
  clubInfo?: ClubInfo;
  defaultFee?: number;
  onNext: () => void;
  onBack: () => void;
}

const MemberPreview: React.FC<MemberPreviewProps> = ({ members, clubInfo, defaultFee, onNext, onBack }) => {
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});
  const [validatedMembers, setValidatedMembers] = useState<Member[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  
  // Use defaultFee if provided, otherwise use clubInfo.membershipFee if available
  const membershipFee = defaultFee !== undefined ? defaultFee : (clubInfo?.membershipFee || 0);
  
  useEffect(() => {
    // Validate all members' IBANs
    const errors: Record<number, string[]> = {};
    const validated = members.map((member, index) => {
      const memberErrors: string[] = [];
      
      // Validate IBAN
      if (member.iban) {
        const ibanResult = validateIBAN(member.iban);
        if (!ibanResult.isValid) {
          memberErrors.push(`IBAN ungültig: ${ibanResult.message}`);
        }
      } else {
        memberErrors.push('IBAN fehlt');
      }
      
      // Validate mandate reference
      if (!member.mandateReference) {
        memberErrors.push('Mandatsreferenz fehlt');
      }
      
      // Validate mandate date
      if (!member.mandateDate) {
        memberErrors.push('Datum des Lastschriftmandats fehlt');
      }
      
      // Store errors if any
      if (memberErrors.length > 0) {
        errors[index] = memberErrors;
      }
      
      return member;
    });
    
    setValidationErrors(errors);
    setValidatedMembers(validated);
    setIsFormValid(Object.keys(errors).length === 0 && members.length > 0);
  }, [members]);
  
  if (!members || members.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Mitgliedervorschau</h2>
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md mb-6">
          Keine Mitglieder gefunden. Bitte überprüfen Sie Ihre CSV-Datei und die Spaltenzuordnung.
        </div>
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Zurück
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mitgliedervorschau</h2>
      
      {!isFormValid && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Hinweise</h3>
          <p className="text-yellow-700 mb-2">
            Es wurden Probleme bei einigen Mitgliedsdaten gefunden. Bitte überprüfen Sie die markierten Einträge.
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Anzahl der Mitglieder:</span> {members.length}
        </p>
        
        <p className="text-gray-600">
          <span className="font-medium">Standard-Mitgliedsbeitrag pro Person:</span> {membershipFee.toFixed(2)} €
        </p>
        
        <p className="text-gray-600">
          <span className="font-medium">Gesamtbetrag:</span>{' '}
          {validatedMembers.reduce((sum, member) => {
            const fee = member.fee !== undefined ? member.fee : membershipFee;
            return sum + (fee || 0);
          }, 0).toFixed(2)}{' '}
          €
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IBAN
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mandatsreferenz (Kombiniert)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum Lastschriftmandat
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Beitrag (€)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {validatedMembers.map((member, index) => {
              const memberName = member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim();
              const fee = member.fee !== undefined ? member.fee : membershipFee;
              const hasError = validationErrors[index] !== undefined;
              
              return (
                <tr key={index} className={hasError ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {memberName || 'Unbekannt'}
                    {hasError && (
                      <div className="mt-1">
                        {validationErrors[index].map((error, errIndex) => (
                          <p key={errIndex} className="text-xs text-red-600">{error}</p>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatIBAN(member.iban)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {clubInfo?.reference ? `${clubInfo.reference}${member.mandateReference || ''}` : member.mandateReference || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.mandateDate || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fee !== undefined ? fee.toFixed(2) : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Zurück
        </button>
        
        <button
          onClick={onNext}
          className={`px-6 py-2 bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          disabled={!isFormValid}
        >
          SEPA-XML generieren
        </button>
      </div>
      
      {!isFormValid && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            Bitte korrigieren Sie die markierten Fehler, bevor Sie fortfahren.
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberPreview;
