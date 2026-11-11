import React, { useState, useEffect } from 'react';
import { X, UploadCloud, CheckCircle2, Loader2, FileText, Database, AlertCircle, Trash2 } from 'lucide-react';
import { DocumentItem } from '../../types';
import { RAGService } from '../../services/ragService';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingDocs: DocumentItem[];
  onUploadSuccess: (newDocs: DocumentItem[]) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  existingDocs,
  onUploadSuccess,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<Array<{ file: File; name: string; type: DocumentItem['type']; simulateUnreadable?: boolean }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const steps = [
    { title: 'Uploading...', desc: 'Validating binary file header and structure' },
    { title: 'Extracting text...', desc: 'OCR & font table extraction across PDF pages' },
    { title: 'Cleaning text...', desc: 'Removing line breaks, hyphenations & ligature artifacts' },
    { title: 'Splitting into chunks...', desc: 'Hierarchical chunking (512 tokens, 10% sliding overlap)' },
    { title: 'Generating embeddings...', desc: 'Dense vector projection via text-embedding-004' },
    { title: 'Indexing document...', desc: 'HNSW graph vector indexing in ChromaDB' },
    { title: 'Document ready ✓', desc: 'Vector store synchronized with LangChain retriever' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
      setIsUploading(false);
      setCurrentStep(0);
      setUploadError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newEntries = Array.from(files).map((f) => {
      // Validate file format
      const isPdf = f.name.toLowerCase().endsWith('.pdf') || f.type.includes('pdf');
      if (!isPdf && !f.name.endsWith('.txt') && !f.name.endsWith('.docx')) {
        setUploadError(`Unsupported format for ${f.name}. Only PDF, DOCX, and TXT files are accepted.`);
      }

      // Check file size (50MB)
      if (f.size > 50 * 1024 * 1024) {
        setUploadError(`File ${f.name} exceeds the maximum 50MB academic upload limit.`);
      }

      // Duplicate check
      if (existingDocs.some((d) => d.name.toLowerCase() === f.name.toLowerCase())) {
        setUploadError(`Duplicate detected: "${f.name}" has already been indexed in ChromaDB.`);
      }

      return {
        file: f,
        name: f.name,
        type: 'Research Papers' as const
      };
    });

    setSelectedFiles((prev) => [...prev, ...newEntries]);
  };

  const handleAddDemoPaper = (name: string, simulateUnreadable: boolean = false) => {
    setUploadError(null);
    // Duplicate check
    if (existingDocs.some((d) => d.name.toLowerCase() === name.toLowerCase())) {
      setUploadError(`Duplicate detected: "${name}" has already been indexed in ChromaDB.`);
      return;
    }

    const mockFile = new File(['%PDF-1.4 mock content'], name, { type: 'application/pdf' });
    setSelectedFiles((prev) => [
      ...prev,
      { file: mockFile, name, type: 'Research Papers', simulateUnreadable }
    ]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadError(null);
  };

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0) return;

    // Check if any file is unreadable (scanned/image-only PDF)
    const unreadableFile = selectedFiles.find((f) => f.simulateUnreadable || f.name.toLowerCase().includes('scanned') || f.name.toLowerCase().includes('image_only'));
    if (unreadableFile) {
      setIsUploading(true);
      setCurrentStep(1); // Fails at text extraction
      setTimeout(() => {
        setIsUploading(false);
        setUploadError('Unable to extract readable text from this document. It may be scanned or image-based.');
      }, 1200);
      return;
    }

    setIsUploading(true);
    setCurrentStep(0);
    setUploadError(null);

    try {
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => (prev < steps.length - 2 ? prev + 1 : prev));
      }, 450);

      // Process real file uploads through RAGService
      const uploadedDocs: DocumentItem[] = [];
      for (const sf of selectedFiles) {
        const doc = await RAGService.uploadDocument(sf.file, sf.type);
        uploadedDocs.push(doc);
      }

      clearInterval(stepInterval);
      setCurrentStep(steps.length - 1); // Document ready ✓

      setTimeout(() => {
        setIsUploading(false);
        onUploadSuccess(uploadedDocs);
      }, 700);
    } catch (err: any) {
      setIsUploading(false);
      setUploadError(err.message || 'Unable to extract readable text from this document. It may be scanned or image-based.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-academic-950/70 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-academic-100 dark:border-academic-800 flex items-center justify-between bg-academic-50/50 dark:bg-academic-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-academic-900 dark:text-white">
                Upload & Ingest Research Documents
              </h3>
              <p className="text-xs text-academic-500 dark:text-academic-400">
                Multi-PDF Ingestion Pipeline into ChromaDB Vector Store
              </p>
            </div>
          </div>
          {!isUploading && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-academic-400 hover:text-academic-700 dark:hover:text-academic-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {uploadError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Ingestion Warning</p>
                <p>{uploadError}</p>
              </div>
            </div>
          )}

          {!isUploading ? (
            <>
              {/* Drag & Drop File Zone */}
              <label className="border-2 border-dashed border-academic-300 dark:border-academic-700 hover:border-primary-500 rounded-2xl p-6 text-center cursor-pointer bg-academic-50/50 dark:bg-academic-800/30 transition-all flex flex-col items-center justify-center group block">
                <UploadCloud className="h-10 w-10 text-academic-400 group-hover:text-primary-500 transition-colors" />
                <p className="text-xs font-semibold text-academic-800 dark:text-academic-200 mt-2">
                  Drag and drop research PDFs, or <span className="text-primary-600 dark:text-primary-400 underline">browse files</span>
                </p>
                <p className="text-[11px] text-academic-400 mt-1">
                  Supports multiple PDFs, DOCX, TXT (Maximum 50MB per file)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelection}
                  className="hidden"
                />
              </label>

              {/* Quick Sample File Selection for Testing */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-academic-400 block">
                  Quick Add Sample Research Papers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddDemoPaper('GraphRAG_Unifying_KGs.pdf')}
                    className="px-2.5 py-1 rounded-lg bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-700 dark:text-academic-300 transition-colors"
                  >
                    + GraphRAG_Unifying_KGs.pdf
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddDemoPaper('Self_Reflective_RAG_2024.pdf')}
                    className="px-2.5 py-1 rounded-lg bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-700 dark:text-academic-300 transition-colors"
                  >
                    + Self_Reflective_RAG_2024.pdf
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddDemoPaper('Scanned_Image_Only_Doc.pdf', true)}
                    className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 transition-colors"
                    title="Test realistic unreadable PDF error handling"
                  >
                    + Test Scanned/Image-Only PDF
                  </button>
                </div>
              </div>

              {/* Selected Files Queue */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-academic-700 dark:text-academic-300 block">
                    Files to Index ({selectedFiles.length}):
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                    {selectedFiles.map((sf, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-academic-50 dark:bg-academic-800/60 border border-academic-200 dark:border-academic-700 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-primary-600 shrink-0" />
                          <span className="font-medium text-academic-800 dark:text-academic-200 truncate">
                            {sf.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="p-1 text-academic-400 hover:text-red-600 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Upload & Real Processing Pipeline Tracker */
            <div className="py-2 space-y-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-academic-700 dark:text-academic-300 pb-2 border-b border-academic-100 dark:border-academic-800">
                <span className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                  <Database className="h-4 w-4" />
                  <span>Ingestion Pipeline Active</span>
                </span>
                <span className="font-mono text-primary-600 dark:text-primary-400">
                  Stage {currentStep + 1} of {steps.length}
                </span>
              </div>

              <div className="space-y-2">
                {steps.map((step, idx) => {
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={step.title}
                      className={`flex items-start gap-3 p-2 rounded-xl transition-all ${
                        isCurrent
                          ? 'bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800'
                          : isDone
                          ? 'bg-academic-50/50 dark:bg-academic-800/30'
                          : 'opacity-35'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : isCurrent ? (
                          <Loader2 className="h-4 w-4 text-primary-600 animate-spin" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-academic-300 dark:border-academic-600" />
                        )}
                      </div>
                      <div className="flex-1 text-xs">
                        <p
                          className={`font-semibold ${
                            isCurrent
                              ? 'text-primary-800 dark:text-primary-300'
                              : isDone
                              ? 'text-academic-800 dark:text-academic-200'
                              : 'text-academic-400'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-[11px] text-academic-500 dark:text-academic-400">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!isUploading && (
          <div className="p-4 bg-academic-50 dark:bg-academic-800/50 border-t border-academic-100 dark:border-academic-800 flex items-center justify-between">
            <span className="text-[11px] text-academic-400">
              {selectedFiles.length} file(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-academic-600 hover:text-academic-900 dark:text-academic-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartUpload}
                disabled={selectedFiles.length === 0}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Database className="h-3.5 w-3.5" />
                <span>Start Ingestion & Indexing</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
