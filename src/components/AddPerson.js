import React, { useState } from 'react';

function AddPerson({ onAddPerson }) {
  const [formData, setFormData] = useState({
    name: '',
    linkedinUrl: '',
    wikipediaUrl: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'cursorUploads');
    formData.append('cloud_name', 'dlox0soom');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dlox0soom/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && !isSubmitting) {
      try {
        setIsSubmitting(true);
        let imageUrl = '';
        
        if (selectedFile) {
          console.log('Uploading image to Cloudinary...');
          imageUrl = await uploadToCloudinary(selectedFile);
          console.log('Image uploaded:', imageUrl);
        }

        const personData = {
          name: formData.name,
          linkedinUrl: formData.linkedinUrl,
          wikipediaUrl: formData.wikipediaUrl,
          imageUrl,
          createdAt: new Date().toISOString()
        };

        console.log('Submitting person data:', personData);
        await onAddPerson(personData);
        
        // Reset form
        setFormData({ name: '', linkedinUrl: '', wikipediaUrl: '', imageUrl: '' });
        setSelectedFile(null);
        setPreviewUrl(null);
        
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        alert(`Error: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const value = e.target.name === 'age' ? e.target.value.replace(/\D/g, '') : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <div className="add-person">
      <div className="add-person-header">
        <button onClick={() => window.history.back()} className="back-button">← Back</button>
        <h2>Add New Person</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="linkedinUrl">LinkedIn URL:</label>
          <input
            type="url"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="wikipediaUrl">Wikipedia URL:</label>
          <input
            type="url"
            id="wikipediaUrl"
            name="wikipediaUrl"
            value={formData.wikipediaUrl}
            onChange={handleChange}
            placeholder="https://wikipedia.org/wiki/..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Profile Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
        </div>
        {previewUrl && (
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        <button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Person'}
        </button>
      </form>
    </div>
  );
}

export default AddPerson; 