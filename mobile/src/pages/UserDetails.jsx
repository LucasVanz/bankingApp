import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { ErrorMessage } from './ErrorMessage';
import './css/UserDetails.css'

export function UserDetails() {

    // Para uso genérico 
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const location = useLocation();

    // Para controle de alteração dos dados
    const [isEditing, setIsEditing] = useState(false);

    // Pega os dados do dashboard
    const initialData = location.state || {};

    // Inicializa com os dados recebidos do dashboard
    const [userData, setUserData] = useState({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        photo: initialData.photo || null
    });


    const handleBackStatement = async () => {
        navigate('/dashboard');
    }

    const handleSave = async () => {
        try {
            const response = await api.post('/user/updateInfos', { name: userData.name, email: userData.email, phone: userData.phone, photo: userData.photo}); 
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            setErrorMsg(errorMessage);
        }
    }


   return (
    <div className="user-details-screen">
        <header className="user-details-header">
            <div>
                <button className="user-details-back-button" onClick={handleBackStatement}>
                    <span>Back to dashboard</span>
                </button>
            </div>
        </header>

        <div className="user-details-content">
            {/* Área da Foto */}
            <div className="user-details-photo-section">
                <div className="user-details-photo-wrapper">
                    <img 
                        className="user-details-avatar"
                        src={userData.photo || 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                    />
                    {isEditing && (
                        <label className="user-details-upload-badge">
                            <span>📷</span>
                            <input 
                                type="file" 
                                hidden 
                                onChange={(e) => console.log(e.target.files[0])} 
                            />
                        </label>
                    )}
                </div>
            </div>
            <div>
                <h2 className="user-details-title">My Profile</h2>
            </div>
            {/* Formulário */}
            <div className="user-details-form">
                <div className="user-details-input-group">
                    <label className="user-details-label">Full Name</label>
                    <input 
                        className="user-details-input"
                        type="text" 
                        value={userData.name} 
                        disabled={!isEditing} 
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                    />
                </div>

                <div className="user-details-input-group">
                    <label className="user-details-label">E-mail</label>
                    <input 
                        className="user-details-input"
                        type="email" 
                        value={userData.email} 
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                    />
                </div>

                <div className="user-details-input-group">
                    <label className="user-details-label">Phone</label>
                    <input 
                        className="user-details-input"
                        type="text" 
                        value={userData.phone} 
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    />
                </div>
            </div>

            <button 
                className={`user-details-btn ${isEditing ? 'user-details-btn-save' : 'user-details-btn-edit'}`}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
            >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
        </div>
    </div>
    );
}