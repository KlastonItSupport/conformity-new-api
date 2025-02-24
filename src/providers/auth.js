import { createContext, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al enviar email');
      }
      
      return true;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Error de conexión. Intente nuevamente.'
      );
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await api.post('/reset-password', {
        token,
        newPassword
      });
      
      return response.data.success;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Error al actualizar contraseña. Token inválido o expirado.'
      );
    }
  };

  const authService = {
    passwordRecovery: async (data) => {
      try {
        const response = await api.post('/auth/password-recovery', data);
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || 
          'Error en el proceso de recuperación'
        );
      }
    }
  };

  return (
    <AuthContext.Provider value={{ forgotPassword, resetPassword, authService }}>
      {children}
    </AuthContext.Provider>
  );
}; 