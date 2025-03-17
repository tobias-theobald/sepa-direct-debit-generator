import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { parseFile } from '../utils/fileParser';

interface FileUploaderProps {
  onDataLoaded: (data: string[][], hasHeader: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded, onNext, onBack }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [hasHeader, setHasHeader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      return;
    }
    
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'csv' && fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      setError(t('fileUpload.errors.invalidFormat'));
      return;
    }
    
    setFile(selectedFile);
    setIsLoading(true);
    
    try {
      const data = await parseFile(selectedFile);
      setPreview(data.slice(0, 5)); // Show first 5 rows as preview
      onDataLoaded(data, hasHeader);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('fileUpload.errors.invalidFormat'));
      setIsLoading(false);
    }
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasHeader(e.target.checked);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      const fileExtension = droppedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'csv' && fileExtension !== 'xlsx' && fileExtension !== 'xls') {
        setError(t('fileUpload.errors.invalidFormat'));
        return;
      }
      
      if (fileInputRef.current) {
        // Create a DataTransfer object to set the files property of the input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        fileInputRef.current.files = dataTransfer.files;
        
        // Trigger the change event manually
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="hidden sm:block text-2xl font-bold mb-6 text-gray-800">{t('steps.fileUpload')}</h2>
      
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls"
          className="hidden"
        />
        
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        <p className="mt-2 text-sm text-gray-600">
          {file ? `${t('fileUpload.fileSelected')} ${file.name}` : `${t('fileUpload.dragDrop')} ${t('fileUpload.orClick')}`}
        </p>
        <p className="mt-1 text-xs text-gray-500">{t('fileUpload.acceptedFormats')}</p>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="hasHeader"
          checked={hasHeader}
          onChange={handleHeaderChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="hasHeader" className="ml-2 block text-sm text-gray-700">
          {t('fileUpload.hasHeaderRow')}
        </label>
      </div>
      
      {preview.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">{t('fileUpload.preview')}:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-3 py-2 text-sm ${
                          rowIndex === 0 && hasHeader
                            ? 'font-medium bg-gray-100'
                            : 'text-gray-500'
                        }`}
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
      
      <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row sm:justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-2 sm:order-1"
        >
          {t('common.back')}
        </button>
        
        <button
          type="button"
          onClick={onNext}
          disabled={!file || isLoading}
          className={`w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-1 sm:order-2 ${
            !file || isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700'
          }`}
        >
          {isLoading ? t('common.loading') : t('common.next')}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
