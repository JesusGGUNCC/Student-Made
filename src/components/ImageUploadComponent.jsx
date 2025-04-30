// src/components/ImageUploadComponent.jsx - Updated with "No Image" placeholder
import React, { useState } from 'react';
import axios from 'axios';
import { API_URLS } from '../common/urls';

function ImageUploadComponent({ onImageUploaded, currentImage }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [useUrlInput, setUseUrlInput] = useState(!currentImage);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset errors
    setUploadError('');
    
    // Basic validation
    if (!file.type.match('image.*')) {
      setUploadError('Please select an image file');
      return;
    }
    
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size exceeds 2MB. Please choose a smaller image.');
      return;
    }
    
    // Set selected file and create preview
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUseUrlInput(false);
  };

  // Handle image URL input
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setPreviewUrl(e.target.value);
  };

  // Handle upload
  const handleUpload = async () => {
    if (useUrlInput) {
      // If using URL input, just pass the URL back
      onImageUploaded(imageUrl);
      return;
    }
    
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setUploadError('');
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      // Send the file to the backend
      const response = await axios.post(API_URLS.uploadImage, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Check if upload was successful
      if (response.data && response.data.success) {
        // Create full URL using base URL
        const fullImageUrl = `${window.location.origin.replace(':5173', ':5000')}${response.data.image_url}`;
        
        // Call callback with the image URL
        onImageUploaded(fullImageUrl);
        setImageUrl(fullImageUrl);
      } else {
        throw new Error(response.data?.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle between file upload and URL input
  const toggleInputMethod = () => {
    setUseUrlInput(!useUrlInput);
    if (useUrlInput) {
      setImageUrl('');
    } else {
      setSelectedFile(null);
      setPreviewUrl(currentImage || '');
    }
  };

  // Render a "No Image" placeholder when no image is available
  const renderNoImagePlaceholder = () => {
    return (
      <div className="flex items-center justify-center h-full w-full bg-white border rounded-md">
        <span className="text-gray-500 text-lg font-medium">No Image</span>
      </div>
    );
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Product Image
        </label>
        <button
          type="button"
          onClick={toggleInputMethod}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {useUrlInput ? 'Upload from computer instead' : 'Enter image URL instead'}
        </button>
      </div>
      
      {/* Preview area */}
      <div className="mb-3 h-48 w-full">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="h-full w-full object-contain border rounded-md"
            onError={() => {
              if (useUrlInput) {
                setUploadError('Unable to load image from URL. Please check the URL or try a different one.');
              }
              setPreviewUrl('');
            }} 
          />
        ) : (
          renderNoImagePlaceholder()
        )}
      </div>
      
      {useUrlInput ? (
        // URL input field
        <div>
          <input
            type="text"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="Enter image URL (https://...)"
            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>
      ) : (
        // File input and upload button
        <div>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-1 text-sm text-gray-500 text-center">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`mt-3 px-4 py-2 text-sm font-medium rounded-md ${
              !selectedFile || isUploading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}
      
      {uploadError && (
        <p className="mt-2 text-sm text-red-600">{uploadError}</p>
      )}
    </div>
  );
}

export default ImageUploadComponent;