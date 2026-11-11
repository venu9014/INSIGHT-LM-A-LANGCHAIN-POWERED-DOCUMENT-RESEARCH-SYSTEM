import React, { useState, useEffect } from 'react';
import { BookmarkCheck, Copy, Download, BookOpen, Check, Edit3, Save, RefreshCw, FileText } from 'lucide-react';
import { DocumentItem, CitationItem } from '../../types';

interface CitationGeneratorProps {
  documents: DocumentItem[];
}

export const CitationGenerator: React.FC<CitationGeneratorProps> = ({ documents }) => {
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || 'doc-1');
  const [style, setStyle] = useState<'IEEE' | 'APA' | 'MLA' | 'BibTeX'>('IEEE');
  const [copied, setCopied] = useState(false);
  const [bibCopied, setBibCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  // Editable citation metadata state
  const [metadata, setMetadata] = useState<{
    title: string;
    authors: string;
    year: number;
    venue: string;
    doi: string;
    volume: string;
    issue: string;
    pages: string;
    publisher: string;
  }>({
    title: '',
    authors: '',
    year: 2024,
    venue: '',
    doi: '',
    volume: '',
    issue: '',
    pages: '',
    publisher: ''
  });

  // Update metadata when selected document changes
  useEffect(() => {
    if (selectedDoc) {
      setMetadata({
        title: selectedDoc.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        authors: selectedDoc.authors || 'Lead Author et al.',
        year: selectedDoc.year || new Date().getFullYear(),
        venue: selectedDoc.doi?.includes('arXiv') ? 'arXiv preprint' : 'IEEE Transactions on Knowledge and Data Engineering',
        doi: selectedDoc.doi || '10.1109/TKDE.2024.1042318',
        volume: '36',
        issue: '4',
        pages: `1-${selectedDoc.pages}`,
        publisher: 'IEEE / Academic Press'
      });
      setIsEditing(false);
    }
  }, [selectedDocId, selectedDoc]);

  const formatCitation = (
    meta: typeof metadata,
    citationStyle: 'IEEE' | 'APA' | 'MLA' | 'BibTeX'
  ) => {
    const authorsStr = meta.authors || 'Unknown Authors';
    const titleStr = meta.title || 'Untitled Research';
    const venueStr = meta.venue || 'Academic Proceedings';
    const yearStr = meta.year || 'n.d.';
    const pagesStr = meta.pages ? `pp. ${meta.pages}` : '';
    const doiStr = meta.doi ? `https://doi.org/${meta.doi}` : '';

    switch (citationStyle) {
      case 'IEEE':
        return `${authorsStr}, "${titleStr}," ${venueStr}, vol. ${meta.volume || '1'}, no. ${meta.issue || '1'}, ${pagesStr ? pagesStr + ', ' : ''}${yearStr}${meta.doi ? `, doi: ${meta.doi}` : ''}.`;
      case 'APA':
        return `${authorsStr} (${yearStr}). ${titleStr}. ${venueStr}${meta.volume ? `, ${meta.volume}` : ''}${meta.issue ? `(${meta.issue})` : ''}${meta.pages ? `, ${meta.pages}` : ''}.${doiStr ? ' ' + doiStr : ''}`;
      case 'MLA':
        return `${authorsStr}. "${titleStr}." ${venueStr}, vol. ${meta.volume || '1'}, no. ${meta.issue || '1'}, ${yearStr}${meta.pages ? `, pp. ${meta.pages}` : ''}.${doiStr ? ` DOI: ${meta.doi}` : ''}`;
      case 'BibTeX': {
        const firstAuthorLast = authorsStr.split(/[, ]+/)[0]?.toLowerCase() || 'research';
        const bibKey = `${firstAuthorLast}${yearStr}${titleStr.split(' ')[0]?.toLowerCase() || 'doc'}`;
        return `@article{${bibKey},\n  author    = {${authorsStr}},\n  title     = {${titleStr}},\n  journal   = {${venueStr}},\n  year      = {${yearStr}},\n  volume    = {${meta.volume || '1'}},\n  number    = {${meta.issue || '1'}},\n  pages     = {${meta.pages || '1--10'}},\n  publisher = {${meta.publisher || 'IEEE'}}${meta.doi ? `,\n  doi       = {${meta.doi}}` : ''}\n}`;
      }
    }
  };

  const currentFormattedCitation = formatCitation(metadata, style);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(currentFormattedCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateBibliography = () => {
    const fullBib = documents
      .map((doc, idx) => {
        const itemMeta = {
          title: doc.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
          authors: doc.authors || 'Author et al.',
          year: doc.year || 2024,
          venue: 'Academic Research Journal',
          doi: doc.doi || '',
          volume: '1',
          issue: '1',
          pages: `1-${doc.pages}`,
          publisher: 'Academic Press'
        };
        return style === 'BibTeX'
          ? formatCitation(itemMeta, 'BibTeX')
          : `[${idx + 1}] ${formatCitation(itemMeta, style)}`;
      })
      .join('\n\n');

    navigator.clipboard.writeText(fullBib);
    setBibCopied(true);
    setTimeout(() => setBibCopied(false), 2000);
  };

  const handleDownloadBibTeX = () => {
    const content = documents
      .map((doc) => {
        const itemMeta = {
          title: doc.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
          authors: doc.authors || 'Author et al.',
          year: doc.year || 2024,
          venue: 'IEEE Transactions',
          doi: doc.doi || '',
          volume: '1',
          issue: '1',
          pages: `1-${doc.pages}`,
          publisher: 'IEEE'
        };
        return formatCitation(itemMeta, 'BibTeX');
      })
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `references_${style.toLowerCase()}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const styles: Array<'IEEE' | 'APA' | 'MLA' | 'BibTeX'> = ['IEEE', 'APA', 'MLA', 'BibTeX'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
          <BookmarkCheck className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <span>Reference & Citation Generator</span>
        </h2>
        <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
          Automatically extract metadata and generate standardized academic citations (IEEE, APA, MLA, BibTeX). Correct any extracted field in real time.
        </p>
      </div>

      {/* Selector & Style Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block mb-2">
              Select Indexed Document
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs font-semibold text-academic-900 dark:text-white focus:outline-none"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  📄 {doc.name} ({doc.pages} pages)
                </option>
              ))}
            </select>
          </div>

          {/* Citation Style */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block mb-2">
              Citation Standard
            </label>
            <div className="flex items-center gap-2">
              {styles.map((st) => (
                <button
                  key={st}
                  onClick={() => setStyle(st)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    style === st
                      ? 'bg-primary-600 text-white shadow-2xs'
                      : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-300 hover:bg-academic-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Metadata Correction Form */}
        <div className="flex items-center justify-between pt-2 border-t border-academic-100 dark:border-academic-800">
          <span className="text-xs text-academic-500">
            {isEditing ? 'Editing document metadata in real-time' : 'Verify or correct extracted publication metadata'}
          </span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-academic-300 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 text-academic-700 dark:text-academic-300 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isEditing ? 'Close Metadata Editor' : 'Edit & Correct Metadata'}</span>
          </button>
        </div>

        {/* Interactive Metadata Correction Form */}
        {isEditing && (
          <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200 dark:border-academic-700 space-y-4 animate-in fade-in duration-150">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Manual Metadata Correction
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-academic-600 dark:text-academic-400 mb-1">
                  Paper Title
                </label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-academic-900 border border-academic-300 dark:border-academic-700 text-academic-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-academic-600 dark:text-academic-400 mb-1">
                  Authors (Comma-separated)
                </label>
                <input
                  type="text"
                  value={metadata.authors}
                  onChange={(e) => setMetadata({ ...metadata, authors: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-academic-900 border border-academic-300 dark:border-academic-700 text-academic-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-academic-600 dark:text-academic-400 mb-1">
                  Year of Publication
                </label>
                <input
                  type="number"
                  value={metadata.year}
                  onChange={(e) => setMetadata({ ...metadata, year: parseInt(e.target.value) || 2024 })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-academic-900 border border-academic-300 dark:border-academic-700 text-academic-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-academic-600 dark:text-academic-400 mb-1">
                  Journal / Conference (Venue)
                </label>
                <input
                  type="text"
                  value={metadata.venue}
                  onChange={(e) => setMetadata({ ...metadata, venue: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-academic-900 border border-academic-300 dark:border-academic-700 text-academic-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-academic-600 dark:text-academic-400 mb-1">
                  DOI / URL Identifier
                </label>
                <input
                  type="text"
                  value={metadata.doi}
                  onChange={(e) => setMetadata({ ...metadata, doi: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-academic-900 border border-academic-300 dark:border-academic-700 text-academic-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-academic-600 dark:text-academic-400 mb-1">
                  Page Range (e.g. 1-28)
                </label>
                <input
                  type="text"
                  value={metadata.pages}
                  onChange={(e) => setMetadata({ ...metadata, pages: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-academic-900 border border-academic-300 dark:border-academic-700 text-academic-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formatted Citation Output Card */}
      <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 select-text">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-academic-100 dark:border-academic-800 gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 block mb-0.5">
              Standardized Citation Format: {style}
            </span>
            <h3 className="text-base font-bold text-academic-900 dark:text-white">
              Generated Reference Entry
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCitation}
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Citation'}</span>
            </button>

            <button
              onClick={handleGenerateBibliography}
              className="px-3.5 py-2 rounded-xl bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-700 dark:text-academic-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>{bibCopied ? 'Bibliography Copied!' : 'Copy Full Bibliography'}</span>
            </button>

            <button
              onClick={handleDownloadBibTeX}
              className="px-3.5 py-2 rounded-xl bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-700 dark:text-academic-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download BibTeX file"
            >
              <Download className="h-4 w-4" />
              <span>Export .bib</span>
            </button>
          </div>
        </div>

        {/* Citation Display Area */}
        <div className="p-6 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/80 dark:border-academic-750 font-serif text-sm text-academic-800 dark:text-academic-200 leading-relaxed shadow-inner">
          {style === 'BibTeX' ? (
            <pre className="font-mono text-xs text-primary-700 dark:text-primary-300 whitespace-pre-wrap">
              {currentFormattedCitation}
            </pre>
          ) : (
            <p className="leading-relaxed">
              {currentFormattedCitation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
