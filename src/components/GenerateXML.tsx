import React, { useState, useEffect } from 'react';
import { ClubInfo, Member } from '../types';
import { generateSepaXML } from '../utils/sepaXmlGenerator';

interface GenerateXMLProps {
  clubInfo: ClubInfo;
  members: Member[];
  onBack: () => void;
  onReset: () => void;
}

const GenerateXML: React.FC<GenerateXMLProps> = ({ clubInfo, members, onBack, onReset }) => {
  const [xmlContent, setXmlContent] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('sepa-lastschrift.xml');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      const xml = generateSepaXML(clubInfo, members);
      setXmlContent(xml);
      setError(null);
      
      // Create a download URL
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      // Generate a filename with date
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0];
      setFileName(`sepa-lastschrift-${dateStr}.xml`);
      
      // Clean up URL when component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      console.error('Error generating XML:', err);
      setError(err instanceof Error ? err.message : 'Fehler bei der XML-Generierung');
    }
  }, [clubInfo, members]);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(xmlContent)
      .then(() => {
        alert('XML in die Zwischenablage kopiert!');
      })
      .catch(err => {
        console.error('Fehler beim Kopieren:', err);
      });
  };
  
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Fehler bei der XML-Generierung</h2>
        
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">
            {error}
          </p>
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">SEPA-XML generiert</h2>
      
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
        <p className="text-green-700">
          Die SEPA-XML-Datei wurde erfolgreich generiert! Sie können die Datei jetzt herunterladen
          oder den Inhalt in die Zwischenablage kopieren.
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Zusammenfassung:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Verein: {clubInfo.name}</li>
          <li>Anzahl der Lastschriften: {members.length}</li>
          <li>
            Gesamtbetrag:{' '}
            {members.reduce((sum, member) => {
              const fee = member.fee !== undefined ? member.fee : clubInfo.membershipFee;
              return sum + (fee || 0);
            }, 0).toFixed(2)}{' '}
            €
          </li>
          <li>
            Ausführungsdatum:{' '}
            {new Date(Date.now() + clubInfo.executionDaysInFuture * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')}
          </li>
        </ul>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">XML-Inhalt:</h3>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-60">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap">{xmlContent}</pre>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <a
          href={downloadUrl}
          download={fileName}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          XML-Datei herunterladen
        </a>
        
        <button
          onClick={handleCopyToClipboard}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          In Zwischenablage kopieren
        </button>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Zurück
        </button>
        
        <button
          onClick={onReset}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Neue Lastschrift erstellen
        </button>
      </div>
    </div>
  );
};

export default GenerateXML;
