import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';

const EditProduct = () => {
    const { pid } = useParams();
    const navigate = useNavigate();
    const baseURL = "http://localhost:3001";
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: '', isError: false });
    const [product, setProduct] = useState({
        name: '',
        price: '',
        des: '',
        model_no: '',
        image: ''
    });
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${baseURL}/product/${pid}`);
            setProduct(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setLoading(false);
            setStatusMessage({ text: 'Error fetching product details', isError: true });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setStatusMessage({ 
                    text: 'Image size should be less than 5MB', 
                    isError: true 
                });
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setStatusMessage({ 
                    text: 'Please select a valid image file', 
                    isError: true 
                });
                return;
            }

            setNewImage(file);
            setImagePreview(URL.createObjectURL(file));
            setStatusMessage({ text: '', isError: false });
        }
    };

    const removeImage = () => {
        setNewImage(null);
        setImagePreview(null);
        // Reset the file input
        const fileInput = document.getElementById('image-input');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const formData = new FormData();
            
            // Append text data
            formData.append('name', product.name);
            formData.append('price', product.price);
            formData.append('des', product.des);
            formData.append('model_no', product.model_no);
            
            // Append image only if a new one is selected
            if (newImage) {
                formData.append('image', newImage);
            }

            const response = await axios.put(`${baseURL}/updateproduct/${pid}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                setStatusMessage({ text: 'Product updated successfully!', isError: false });
                setTimeout(() => {
                    navigate('/productdetail');
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            const errorMessage = error.response?.data?.error || 'Failed to update product. Please try again.';
            setStatusMessage({ text: errorMessage, isError: true });
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        navigate('/productdetail');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="edit-product-container">
            <h2>Edit Product</h2>
            
            {statusMessage.text && (
                <div className={`status-message ${statusMessage.isError ? 'error' : 'success'}`}>
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="edit-product-form">
                <div className="form-group">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="des"
                        value={product.des}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Model Number:</label>
                    <input
                        type="text"
                        name="model_no"
                        value={product.model_no}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Product Image:</label>
                    <div className="current-image">
                        <img
                            src={imagePreview || `${baseURL}/uploads/${product.image}`}
                            alt={product.name}
                            onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Image'}
                        />
                    </div>
                    <div className="image-upload">
                        <label htmlFor="image-input" className="image-upload-label">
                            {newImage ? 'Change Image' : 'Choose New Image'}
                        </label>
                        <input
                            id="image-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="image-input"
                        />
                        {newImage && (
                            <div className="image-actions">
                                <div className="selected-file">
                                    Selected: {newImage.name}
                                </div>
                                <button 
                                    type="button" 
                                    onClick={removeImage}
                                    className="remove-image-btn"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="button-group">
                    <button 
                        type="submit" 
                        className="save-btn"
                        disabled={uploading}
                    >
                        {uploading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                        type="button" 
                        className="cancel-btn" 
                        onClick={handleCancel}
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct; 