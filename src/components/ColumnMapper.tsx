import React, { useEffect, useState } from 'react';
import { ColumnMapping } from '../types';

interface ColumnMapperProps {
  csvData: string[][];
  hasHeader: boolean;
  columnMapping: ColumnMapping;
  onColumnMappingChange: (mapping: ColumnMapping) => void;
  onNext: () => void;
  onBack: () => void;
}

const ColumnMapper: React.FC<ColumnMapperProps> = ({
  csvData,
  hasHeader,
  columnMapping,
  onColumnMappingChange,
  onNext,
  onBack
}) => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(true);

  // Get column headers or indices
  const getColumnHeaders = () => {
    if (csvData.length === 0) return [];
    
    if (hasHeader) {
      return csvData[0];
    } else {
      return csvData[0].map((_, index) => `Spalte ${index + 1}`);
    }
  };

  // Get preview data (first few rows)
  const getPreviewData = () => {
    if (csvData.length <= 1) return [];
    
    const startIndex = hasHeader ? 1 : 0;
    return csvData.slice(startIndex, startIndex + 3);
  };

  // Validate mapping whenever it changes
  useEffect(() => {
    const requiredFields = ['iban', 'mandateDate', 'mandateReference'];
    const isValid = requiredFields.every(field => 
      columnMapping[field as keyof ColumnMapping] !== undefined && 
      columnMapping[field as keyof ColumnMapping] !== -1
    );
    
    setIsValid(isValid);
  }, [columnMapping]);

  const handleColumnSelect = (field: keyof ColumnMapping, columnIndex: number) => {
    // If this column is already selected for another field, unselect it there
    const updatedMapping = { ...columnMapping };
    
    // Check if this column is already mapped to another field
    Object.keys(updatedMapping).forEach(key => {
      if (updatedMapping[key as keyof ColumnMapping] === columnIndex && key !== field) {
        updatedMapping[key as keyof ColumnMapping] = -1;
      }
    });
    
    // Update the mapping for the current field
    updatedMapping[field] = columnIndex;
    
    onColumnMappingChange(updatedMapping);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    }
  };

  const columnHeaders = getColumnHeaders();
  const previewData = getPreviewData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Spalten zuordnen</h2>
      
      <p className="mb-4 text-gray-600">
        Bitte ordnen Sie die Spalten aus Ihrer Datei den entsprechenden Feldern zu.
        <strong className="text-gray-800"> Felder mit * sind Pflichtfelder.</strong>
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <select
              value={columnMapping.name !== undefined ? columnMapping.name : -1}
              onChange={(e) => handleColumnSelect('name', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={-1}>-- Nicht zugeordnet --</option>
              {columnHeaders.map((header, index) => (
                <option key={index} value={index}>{header}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Vollständiger Name des Mitglieds
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vorname
            </label>
            <select
              value={columnMapping.firstName !== undefined ? columnMapping.firstName : -1}
              onChange={(e) => handleColumnSelect('firstName', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={-1}>-- Nicht zugeordnet --</option>
              {columnHeaders.map((header, index) => (
                <option key={index} value={index}>{header}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Alternative zu "Name": Vorname des Mitglieds
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nachname
            </label>
            <select
              value={columnMapping.lastName !== undefined ? columnMapping.lastName : -1}
              onChange={(e) => handleColumnSelect('lastName', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={-1}>-- Nicht zugeordnet --</option>
              {columnHeaders.map((header, index) => (
                <option key={index} value={index}>{header}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Alternative zu "Name": Nachname des Mitglieds
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IBAN *
            </label>
            <select
              value={columnMapping.iban}
              onChange={(e) => handleColumnSelect('iban', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border ${
                columnMapping.iban === -1 ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value={-1}>-- Bitte auswählen --</option>
              {columnHeaders.map((header, index) => (
                <option key={index} value={index}>{header}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              IBAN des Mitglieds für den Lastschrifteinzug
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Datum des Lastschriftmandats *
            </label>
            <select
              value={columnMapping.mandateDate}
              onChange={(e) => handleColumnSelect('mandateDate', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border ${
                columnMapping.mandateDate === -1 ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value={-1}>-- Bitte auswählen --</option>
              {columnHeaders.map((header, index) => (
                <option key={index} value={index}>{header}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Datum, an dem das Lastschriftmandat erteilt wurde (oft das Eintrittsdatum des Mitglieds)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mandatsreferenz-Suffix *
            </label>
            <select
              value={columnMapping.mandateReference}
              onChange={(e) => handleColumnSelect('mandateReference', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border ${
                columnMapping.mandateReference === -1 ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value={-1}>-- Bitte auswählen --</option>
              {columnHeaders.map((header, index) => (
                <option key={index} value={index}>{header}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Eindeutige Referenz des Lastschriftmandats (z.B. Mitgliedsnummer). 
              Diese wird mit dem Präfix aus den Vereinsinformationen kombiniert.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Individueller Beitrag
            </label>
            <select
              value={columnMapping.fee !== undefined ? columnMapping.fee : -1}
              onChange={(e) => handleColumnSelect('fee', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={-1}>-- Nicht zugeordnet --</option>
              {columnHeaders.map((header, index) => (
                <option key={index} value={index}>{header}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Individueller Beitrag des Mitglieds (falls abweichend vom Standard-Mitgliedsbeitrag)
            </p>
          </div>
        </div>
        
        {/* Data Preview */}
        {showPreview && csvData.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-800">Datenvorschau</h3>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Ausblenden
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columnHeaders.map((header, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {!showPreview && (
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="mb-6 text-sm text-blue-600 hover:text-blue-800"
          >
            Datenvorschau anzeigen
          </button>
        )}
        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Zurück
          </button>
          
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              !isValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={!isValid}
          >
            Weiter
          </button>
        </div>
      </form>
    </div>
  );
};

export default ColumnMapper;
