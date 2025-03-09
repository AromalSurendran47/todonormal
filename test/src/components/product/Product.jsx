import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Product.css';

const Product = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        des: '',
        model_no: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ text: '', isError: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevState => ({
                ...prevState,
                image: file
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('des', formData.des);
            formDataToSend.append('model_no', formData.model_no);
            formDataToSend.append('image', formData.image);

            const response = await axios.post('http://localhost:3001/product', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message) {
                setStatusMessage({ text: 'Product uploaded successfully!', isError: false });
                // Clear form after successful upload
                setFormData({
                    name: '',
                    price: '',
                    des: '',
                    model_no: '',
                    image: null
                });
                setPreviewImage(null);
                
                // Navigate to product details after successful upload
                setTimeout(() => {
                    navigate('/productdetail');
                }, 1500);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setStatusMessage({ text: 'Product upload failed. Please try again.', isError: true });
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleViewProducts = () => {
        navigate('/productdetail');
    };

    return (
        <div className="product-form-container">
            <h2>Add New Product</h2>
            
            {/* Status Message */}
            {statusMessage.text && (
                <div className={`status-message ${statusMessage.isError ? 'error' : 'success'}`}>
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="des"
                        value={formData.des}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Model Number:</label>
                    <input
                        type="text"
                        name="model_no"
                        value={formData.model_no}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Product Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    {previewImage && (
                        <div className="image-preview">
                            <img src={previewImage} alt="Preview" />
                        </div>
                    )}
                </div>

                <div className="button-group">
                    <button type="submit" className="submit-btn">Add Product</button>
                    <button type="button" onClick={handleViewProducts} className="view-btn">
                        View Products
                    </button>
                    <button type="button" onClick={handleBackToHome} className="back-btn">
                        Back to Home
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Product;
