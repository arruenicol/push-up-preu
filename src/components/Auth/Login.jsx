import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData.email, formData.password);
      if (onLogin) {
        onLogin();
      }
      navigate('/notifications');
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-60">
      <div className="row">
        <div className="col-xl-9 col-lg-12">
          <div className="uc-card mb-160 p-32">
            <form className="row" onSubmit={handleSubmit}>
              <div className="col-md-12 mb-36">
                <h4>Iniciar sesión</h4>
                <div className="uc-text-divider divider-secondary mt-16 mb-0"></div>
              </div>
              
              {error && (
                <div className="col-md-12 mb-24">
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                </div>
              )}
              
              <div className="col-md-12 mb-24">
                <div className="uc-form-group mb-0">
                  <label htmlFor="email" className="mb-4">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="uc-input-style"
                    placeholder="Ej: correo@uc.cl"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-12">
                <div className="uc-form-group">
                  <label htmlFor="password" className="mb-4">Contraseña</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="uc-input-style"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-12">
                <div className="row justify-content-between mt-24">
                  <div className="col-md-4 col-lg-3 mb-0">
                    <button
                      type="submit"
                      className="uc-btn btn-cta"
                      style={{ width: '100%' }}
                      disabled={loading}
                    >
                      {loading ? 'Iniciando...' : 'Iniciar sesión'}
                    </button>
                  </div>
                  <div
                    className="col-md-6 d-flex justify-content-end align-items-center text-weight--medium my-8"
                  >
                    <Link className="mr-20" to="/recover-password">Recuperar contraseña</Link>
                    <Link to="/register">Registrarse</Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;