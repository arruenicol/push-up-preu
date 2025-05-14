import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
    acceptPolicy: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirm_password) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (!formData.acceptPolicy) {
      setError('Debes aceptar la política de privacidad');
      return;
    }
    
    setLoading(true);

    try {
      // Remove confirm_password and acceptPolicy from the data sent to API
      const { confirm_password, acceptPolicy, ...apiData } = formData;
      
      await authService.register(apiData);
      // Iniciar sesión automáticamente después del registro
      await authService.login(formData.email, formData.password);
      navigate('/dashboard'); // Redirigir al dashboard o donde corresponda
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Error al registrarse. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container mt-60">
        <div className="row">
          <div className="col-xl-9 col-lg-12">
            <div className="uc-card mb-160 p-32">
              <form className="row" onSubmit={handleSubmit}>
                <div className="col-md-12">
                  <h4>Regístrate</h4>
                  <div className="uc-text-divider divider-secondary mt-16 mb-4"></div>
                  <p className="p-size--sm p-text--condensed p-color--gray mb-0 mt-32">
                    (*) Campos obligatorios para poder procesar tu registro en la plataforma
                  </p>
                </div>
                
                <hr className="uc-hr mx-16 mb-24" />
                
                {error && (
                  <div className="col-md-12 mb-24">
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  </div>
                )}
                
                <div className="col-md-6 mb-24">
                  <div className="uc-form-group mb-0">
                    <label htmlFor="first_name" className="mb-4">Nombre *</label>
                    <input 
                      id="first_name" 
                      name="first_name"
                      type="text" 
                      className="uc-input-style" 
                      placeholder="Nombre" 
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="col-md-6 mb-24">
                  <div className="uc-form-group mb-0">
                    <label htmlFor="last_name" className="mb-4">Apellido *</label>
                    <input 
                      id="last_name" 
                      name="last_name"
                      type="text" 
                      className="uc-input-style" 
                      placeholder="Apellido" 
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="col-md-12 mb-24">
                  <div className="uc-form-group mb-0">
                    <label htmlFor="email" className="mb-4">Email *</label>
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
                
                <div className="col-md-6 mb-24">
                  <div className="uc-form-group mb-0">
                    <label htmlFor="password" className="mb-4">Contraseña *</label>
                    <input 
                      id="password" 
                      name="password"
                      type="password" 
                      className="uc-input-style" 
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="col-md-6 mb-24">
                  <div className="uc-form-group mb-0">
                    <label htmlFor="confirm_password" className="mb-4">Repetir contraseña *</label>
                    <input 
                      id="confirm_password" 
                      name="confirm_password"
                      type="password" 
                      className="uc-input-style"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <hr className="uc-hr mx-16 my-36" />
                
                <div className="col-md-12">
                  <div className="p-24" style={{border: '1px solid #eaeaea', borderRadius: '4px'}}>
                    <p className="p-color--gray">
                      Autorizo expresamente a la UC para tratar los datos personales necesarios para el registro a la
                      plataforma, los que serán informados a la unidad de la UC que la
                      administra. Los datos personales serán usados para esta finalidad y se <strong>mantendrán mientras sean
                      requeridos por Ley.</strong>
                    </p>
                    <div className="uc-form-check">
                      <input 
                        id="acceptPolicy" 
                        name="acceptPolicy"
                        type="checkbox" 
                        checked={formData.acceptPolicy}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="acceptPolicy">
                        Acepto que la UC trate mis datos personales para el acceso a la plataforma, y he leído y acepto la <a href="https://protecciondedatos.uc.cl/politicas" target="_blank" rel="noopener noreferrer">Política de Privacidad UC</a>.
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex flex-column flex-md-row col-md-12 justify-content-between align-items-center">
                  <div className="mt-36">
                    {/* reCAPTCHA image from original form */}
                    <svg className="" width="307px" height="80px" viewBox="0 0 307 80" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                      {/* SVG content preserved from original form */}
                      <title>default</title>
                      <defs>
                        <rect id="path-1" x="0" y="0" width="303" height="76" rx="3"></rect>
                        <filter x="-1.2%" y="-3.3%" width="102.3%" height="109.2%" filterUnits="objectBoundingBox"
                          id="filter-2">
                          <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                          <feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                          <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1">
                          </feComposite>
                          <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.101137908 0" type="matrix"
                            in="shadowBlurOuter1"></feColorMatrix>
                        </filter>
                        <path
                          d="M16.3738145,0 C23.6125691,-3.36492738e-15 27.4243267,4.92597133 27.8070597,5.44671687 L30.5732748,2.6120061 L30.7281895,14.7091284 L18.8619963,14.6108153 L22.6918801,10.6873875 C22.3499681,10.1880157 20.4374015,7.65525566 16.5838145,7.27437191 C15.2406088,7.14161112 14.0331106,7.43595979 13.0084957,7.90232958 L8.73729489,2.04184726 C10.6352988,0.942263883 13.1904622,7.39888982e-16 16.3738145,0 Z"
                          id="path-3"></path>
                        <filter x="-6.8%" y="-10.2%" width="113.6%" height="120.4%" filterUnits="objectBoundingBox"
                          id="filter-4">
                          <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                          <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1">
                          </feGaussianBlur>
                          <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix"
                            in="shadowBlurOuter1"></feColorMatrix>
                        </filter>
                        <path
                          d="M15.65001,0.0407786058 L15.5516969,11.9069718 L11.6736637,8.12000585 C11.2354354,8.41496305 8.62477342,10.3265314 8.23760351,14.2437184 C8.13618887,15.2697799 8.28400453,16.2166522 8.56734457,17.0633067 L1.22011545,17.2790992 C1.05708443,16.4004826 0.963231598,15.4583854 0.963231598,14.4537184 C0.963231598,7.09486389 6.05401496,3.27766598 6.43218744,3.00425493 L3.55288771,0.195693379 L15.65001,0.0407786058 Z"
                          id="path-5"></path>
                        <filter x="-10.2%" y="-8.7%" width="120.4%" height="117.4%" filterUnits="objectBoundingBox"
                          id="filter-6">
                          <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                          <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1">
                          </feGaussianBlur>
                          <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix"
                            in="shadowBlurOuter1"></feColorMatrix>
                        </filter>
                        <path
                          d="M1,15.1726619 L12.8661932,15.270975 L9.03630947,19.1944028 C9.37822139,19.6937746 11.2907881,22.2265346 15.144375,22.6074184 C19.4229261,23.0303051 22.3245455,19.1196043 22.3245455,19.1196043 L22.3245455,19.1196043 L27.0189205,24.4505396 C27.0189205,24.4505396 22.9971023,29.8817903 15.354375,29.8817903 C8.11562045,29.8817903 4.30386286,24.9558189 3.92112982,24.4350734 L1.15491477,27.2697842 L1,15.1726619 Z"
                          id="path-7"></path>
                        <filter x="-5.8%" y="-10.2%" width="111.5%" height="120.4%" filterUnits="objectBoundingBox"
                          id="filter-8">
                          <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                          <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1">
                          </feGaussianBlur>
                          <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.382529438 0" type="matrix"
                            in="shadowBlurOuter1"></feColorMatrix>
                        </filter>
                      </defs>
                      <g id="Main-UI" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="Sticker-Sheet" transform="translate(-62.000000, -63.000000)">
                          <g id="default" transform="translate(64.000000, 64.000000)">
                            <g id="bg-box">
                              <use fill="black" fillOpacity="1" filter="url(#filter-2)" xlinkHref="#path-1"></use>
                              <rect stroke="#D6D6D6" strokeWidth="1" strokeLinejoin="square" fill="#FAFAFA"
                                fillRule="evenodd" x="0.5" y="0.5" width="302" height="75" rx="3"></rect>
                            </g>
                            <g id="reCAPTCHA" transform="translate(235.000000, 11.000000)">
                              <text fontFamily="ArialMT, Arial" fontSize="9.57090909" fontWeight="normal" fill="#A5A5A5">
                                <tspan x="0" y="43.4460432">reCAPTCHA</tspan>
                              </text>
                              <text id="Privacy---Terms" fontFamily="ArialMT, Arial" fontSize="8.14545455"
                                fontWeight="normal" fill="#A5A5A5">
                                <tspan x="0" y="54.9784173">Privacy - Terms</tspan>
                              </text>
                              <g transform="translate(11.421818, 0.000000)" id="Combined-Shape">
                                <g>
                                  <use fill="black" fillOpacity="1" filter="url(#filter-4)" xlinkHref="#path-3"></use>
                                  <use fill="#2B4CB9" fillRule="evenodd" xlinkHref="#path-3"></use>
                                </g>
                                <g>
                                  <use fill="black" fillOpacity="1" filter="url(#filter-6)" xlinkHref="#path-5"></use>
                                  <use fill="#5A96F6" fillRule="evenodd" xlinkHref="#path-5"></use>
                                </g>
                                <g>
                                  <use fill="black" fillOpacity="1" filter="url(#filter-8)" xlinkHref="#path-7"></use>
                                  <use fill="#BEBEBE" fillRule="evenodd" xlinkHref="#path-7"></use>
                                </g>
                              </g>
                            </g>
                            <text id="I'm-not-a-robot" fontFamily="Helvetica" fontSize="14" fontWeight="normal"
                              fill="#000000">
                              <tspan x="52" y="42">No soy un robot</tspan>
                            </text>
                            <rect id="checkbox" stroke="#C1C1C1" strokeWidth="2" fill="#FFFFFF" x="13" y="25" width="26"
                              height="26" rx="2"></rect>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="col-6 col-md-4 mt-36">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="uc-btn btn-cta w-full"
                    >
                      {loading ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </div>
                
                <div className="col-md-12 mt-4 text-center">
                  <p>
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;