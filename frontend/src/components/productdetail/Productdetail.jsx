import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Productdetail.css';

const Productdetail = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();
    const baseURL = "http://localhost:3001";

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ message: '', type: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/getproducts');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleBackToAdd = () => {
        navigate('/product');
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleEdit = (productId) => {
        navigate(`/editproduct/${productId}`);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${baseURL}/delete/${productId}`);
                setNotification({ message: 'Product was successfully deleted!', type: 'success' });
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                setNotification({ message: 'Failed to delete product', type: 'error' });
            }
        }
    };

    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
    };

    const getImageUrl = (imageName) => {
        if (!imageName) return 'https://via.placeholder.com/150?text=No+Image';
        return `${baseURL}/uploads/${imageName}`;
    };

    return (
        <div className="product-detail-container">
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <h2>Product List</h2>
            
            <div className="button-container">
                <button onClick={handleBackToAdd} className="add-new-btn">
                    Add New Product
                </button>

                <button onClick={handleBackToHome} className="add-new-btn">
                    Back to Home
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="no-products">No products found</div>
            ) : (
                <div className="table-responsive">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Model No</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.pid}>
                                    <td className="image-cell">
                                        <div className="image-container">
                                            <img 
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                onError={handleImageError}
                                                className="product-thumbnail"
                                            />
                                        </div>
                                    </td>
                                    <td>{product.name}</td>
                                    <td>₹{product.price}</td>
                                    <td>{product.des}</td>
                                    <td>{product.model_no}</td>
                                    <td className="action-buttons">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEdit(product.pid)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(product.pid)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Productdetail;
