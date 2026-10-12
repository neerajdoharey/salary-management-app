import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { employeesApi } from '../api/client';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Users,
  RefreshCw,
  FileText,
  ArrowRight,
  Info,
  Mail,
  ExternalLink,
} from 'lucide-react';

export default function ImportEmployeesPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  // Validate and stage the selected CSV file
  const handleValidateAndSetFile = (file) => {
    setErrorMessage(null);
    setImportResult(null);

    if (!file) return;

    // Validate file type
    const isCsvName = file.name.toLowerCase().endsWith('.csv');
    const isCsvType = file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';

    if (!isCsvName && !isCsvType) {
      setErrorMessage('Invalid file format. Please upload a standard comma-separated (.csv) file.');
      return;
    }

    // Validate file size (max 50MB)
    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage('File size exceeds the 50MB limit. Please upload a smaller CSV file.');
      return;
    }

    setSelectedFile(file);
  };

  // Drag & drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      setIsDragging(false);
      dragCounterRef.current = 0;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleValidateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleValidateAndSetFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImportResult(null);
    setErrorMessage(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload the selected CSV file to the API
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);
    setImportResult(null);
    setUploadProgress(10);

    try {
      const data = await employeesApi.import(selectedFile, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 90) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      setUploadProgress(100);
      setImportResult(data);
    } catch (err) {
      console.error('Import failed:', err);
      const apiError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to import employee CSV. Please check the file formatting.';
      setErrorMessage(apiError);
    } finally {
      setIsUploading(false);
    }
  };

  // Format file size utility
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Trigger download of sample CSV file
  const handleDownloadSample = () => {
    const csvContent = [
      'first_name,last_name,email,job_title,department,country,salary',
      'Alexander,Wright,alexander.wright.sample@acme.com,Senior Software Engineer,Engineering,United States,135000',
      'Sophia,Chen,sophia.chen.sample@acme.com,Product Manager,Product,Canada,118000',
      'Liam,Johnson,liam.johnson.sample@acme.com,Account Executive,Sales,United Kingdom,92000',
      'Emma,Davis,emma.davis.sample@acme.com,Marketing Lead,Marketing,Australia,88000',
      'Lucas,Mueller,lucas.mueller.sample@acme.com,Financial Analyst,Finance,Germany,95000',
      'Olivia,Martin,olivia.martin.sample@acme.com,HR Specialist,Human Resources,France,78000',
      'Hiroshi,Tanaka,hiroshi.tanaka.sample@acme.com,DevOps Engineer,Engineering,Japan,110000',
      'Aarav,Patel,aarav.patel.sample@acme.com,Full Stack Developer,Engineering,India,65000',
      'Isabella,Silva,isabella.silva.sample@acme.com,Operations Manager,Operations,Brazil,82000',
      'Wei,Zhang,wei.zhang.sample@acme.com,Compliance Specialist,Legal,Singapore,105000',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <UploadCloud className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span>Bulk CSV Employee Import</span>
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Import high-volume employee compensation records using standard CSV formatting.
          </p>
        </div>

        {/* Download Sample CSV Link */}
        <button
          onClick={handleDownloadSample}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-xs"
          title="Download sample CSV template"
        >
          <Download className="h-4 w-4" />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Import Result Feedback Card */}
      {importResult && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5 transition-colors">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700/60 pb-4">
            <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {importResult.message || 'Bulk Import Enqueued Successfully'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your dataset is being processed in the background by the Solid Queue engine.
              </p>
            </div>
          </div>

          {/* Background Job Information Callout */}
          <div className="p-4 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 text-sm font-semibold">
              <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Log File & Row Breakdown Delivered via Email</span>
            </div>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
              Each row is individually processed and validated in the background. Once the import completes, an <strong>import.log</strong> file detailing the success status or error message for each row will be automatically emailed to your account.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/admin/employees"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>View Employee Directory</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Import Another CSV File
            </button>
          </div>
        </div>
      )}

      {/* Main Upload Dropzone Card */}
      {!importResult && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 transition-colors">
          {/* Hidden HTML input */}
          <input
            ref={fileInputRef}
            type="file"
            id="csv-file-input"
            accept=".csv,text/csv,application/vnd.ms-excel"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Dropzone container */}
          {!selectedFile ? (
            <div
              id="csv-dropzone"
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 ${isDragging
                ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-400 scale-[1.01]'
                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-gray-50/50 dark:bg-gray-700/20'
                }`}
            >
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-indigo-50 dark:bg-indigo-950/70 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-transform hover:scale-105">
                <UploadCloud className="h-8 w-8" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Drag & Drop CSV File Here
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Drag and drop your employee CSV file here, or click to browse files from your computer.
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Browse Files</span>
              </button>

              <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                Supports .CSV files up to 50MB
              </div>
            </div>
          ) : (
            /* Selected File State */
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatFileSize(selectedFile.size)} • Last modified:{' '}
                      {new Date(selectedFile.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {!isUploading && (
                  <button
                    onClick={handleClearFile}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Remove file"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                      Streaming records to Rails API...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClearFile}
                  disabled={isUploading}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Choose Different File
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 shadow-xs transition-colors"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      <span>Start Bulk Import</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSV Format Guidelines & Requirements Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4 transition-colors">
        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold text-sm">
          <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>CSV Format Specifications & Column Requirements</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The first row of your CSV file must contain the exact column headers listed below. The order of columns is flexible as long as the header names match.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-semibold uppercase">
              <tr>
                <th className="py-2.5 px-3">Column Header</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Example</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-gray-700 dark:text-gray-300">
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                  first_name
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    Required
                  </span>
                </td>
                <td className="py-2.5 px-3">String</td>
                <td className="py-2.5 px-3">Alexander</td>
                <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">First legal name</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                  last_name
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    Required
                  </span>
                </td>
                <td className="py-2.5 px-3">String</td>
                <td className="py-2.5 px-3">Wright</td>
                <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">Family/last name</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                  email
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    Required
                  </span>
                </td>
                <td className="py-2.5 px-3">Email</td>
                <td className="py-2.5 px-3 font-mono">alex.wright@acme.com</td>
                <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">Unique work email</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                  job_title
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    Optional
                  </span>
                </td>
                <td className="py-2.5 px-3">String</td>
                <td className="py-2.5 px-3">Senior Software Engineer</td>
                <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">Defaults to "Employee"</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                  department
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    Optional
                  </span>
                </td>
                <td className="py-2.5 px-3">String</td>
                <td className="py-2.5 px-3">Engineering</td>
                <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">Defaults to "General"</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                  country
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    Optional
                  </span>
                </td>
                <td className="py-2.5 px-3">String</td>
                <td className="py-2.5 px-3">United States</td>
                <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">Defaults to "United States"</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                  salary
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    Required
                  </span>
                </td>
                <td className="py-2.5 px-3">Number</td>
                <td className="py-2.5 px-3">135000</td>
                <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">Annual base USD compensation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
