import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { ErrorMessage } from './ErrorMessage';
import { formatPhoneNumber } from '../utils/formatters';
import './css/UserDetails.css'

export function UserDetails() {

    // Para uso genérico 
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);
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
        photoBase64: initialData.photo || null
    });


    const handleBackStatement = async () => {
        navigate('/dashboard');
    }

    const handleSave = async () => {
        try {
            const response = await api.put('users/me/update', { name: userData.name, email: userData.email, phone: userData.phone.replace(/\D/g, ''), photoBase64: userData.photoBase64}); 
            setUserData(response.data)
            setIsEditing(false); 
            // Ativa a animação de sucesso
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000); 
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.[0]?.defaultMessage || // Erro do @NotEmpty
                                 error.response?.data?.message || "An unexpected error occurred";
            setErrorMsg(errorMessage);
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            setUserData({ ...userData, photoBase64: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };
    useEffect(() => {
        if (errorMsg) {
            const timer = setTimeout(() => {
                setErrorMsg("");
            }, 5000); 
        return () => clearTimeout(timer);
        }
    }, [errorMsg]);

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
                        src={userData.photoBase64 || 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                    />
                    {isEditing && (
                        <label className="user-details-upload-badge">
                            <span>📷</span>
                            <input 
                                type="file" 
                                hidden 
                                accept="image/*" 
                                onChange={handleFileChange}
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
                <ErrorMessage message={errorMsg} />
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
                        value={formatPhoneNumber(userData.phone)} 
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, phone: formatPhoneNumber(e.target.value)})}
                    />
                </div>
            </div>

            <button 
                className={`user-details-btn ${isEditing ? 'user-details-btn-save' : 'user-details-btn-edit'} ${saveSuccess ? 'btn-success-anim' : ''}`}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={saveSuccess}
            >
                {saveSuccess ? '✓ Updated!' : (isEditing ? 'Save Changes' : 'Edit Profile')}
            </button>
        </div>
    </div>
    );
}