'use client';
import { useState } from 'react';
import { FaCheckCircle, FaUpload, FaSpinner } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const QualityChecksPage = () => {
  const { width, height } = useWindowSize();
  const [files, setFiles] = useState([
    { id: 1, name: 'Hygiene Certificate', uploaded: false, verified: false },
    { id: 2, name: 'Business License', uploaded: false, verified: false },
    { id: 3, name: 'Stall Photos', uploaded: false, verified: false },
  ]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const handleFileChange = (fileId, e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentFile(fileId);
      setShowVerificationModal(true);
    }
  };

  const verifyDocument = () => {
    setIsVerifying(true);
    setShowVerificationModal(false);
    
    // Simulate admin verification process
    setTimeout(() => {
      setFiles(files.map(f => 
        f.id === currentFile ? { ...f, uploaded: true, verified: true } : f
      ));
      setIsVerifying(false);
      setShowConfetti(true);
      
      setTimeout(() => setShowConfetti(false), 5000);
    }, 2000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Quality Checks</h1>
      <p className="mb-8 text-gray-600">
        Upload required documents to become a verified seller. Our team will review your submissions.
      </p>

      <div className="space-y-6">
        {files.map((file) => (
          <div key={file.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center text-black">
            <div className="flex items-center">
              {file.verified ? (
                <FaCheckCircle className="text-green-500 text-2xl mr-4" />
              ) : (
                <div className="w-8 h-8 mr-4"></div>
              )}
              <span className="font-medium">{file.name}</span>
            </div>
            
            {!file.uploaded ? (
              <label className="cursor-pointer bg-[#0AD1C8] hover:bg-[#086477] text-white px-4 py-2 rounded-lg flex items-center transition">
                <FaUpload className="mr-2" />
                Upload
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileChange(file.id, e)}
                  accept="image/*,.pdf"
                />
              </label>
            ) : (
              <span className="text-green-500 font-medium">
                {file.verified ? 'Verified' : 'Pending Verification'}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Submit for Verification</h2>
            <p className="mb-6 text-black">
              Your document will be sent to our admin team for verification. This usually takes 1-2 business days.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowVerificationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={verifyDocument}
                className="px-4 py-2 bg-[#0AD1C8] text-white rounded-lg hover:bg-[#086477] transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isVerifying && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-[#0AD1C8] mb-4" />
            <p className="text-lg">Verifying your document...</p>
          </div>
        </div>
      )}

      {/* Confetti Celebration */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Trusted Member Badge */}
      {files.every(f => f.verified) && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-black">
          <FaCheckCircle className="text-green-500 text-3xl mr-4" />
          <div>
            <h3 className="font-bold text-green-800">Verified Trusted Member</h3>
            <p className="text-green-600">
              Congratulations! All your documents have been verified. You're now a trusted seller.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityChecksPage;