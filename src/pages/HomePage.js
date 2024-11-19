import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/homepage.css';
import { verifyAccount, registerAccount, getLoggedInUser } from '../data/accountsData'; // Importa o "banco de dados"

function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Verificar se há um usuário logado ao carregar a página
  useEffect(() => {
    const user = getLoggedInUser();
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (isLogin) {
      // Verifica login
      const user = verifyAccount(formData.email, formData.password);
      if (user) {
        setLoggedInUser(user); // Define o usuário logado
        alert(`Bem-vindo de volta, ${user.name}!`);
        navigate('/main');
      } else {
        alert('Credenciais inválidas. Tente novamente.');
      }
    } else {
      // Registra nova conta
      if (formData.password !== formData.confirmPassword) {
        alert('As senhas não correspondem.');
        return;
      }

      const result = registerAccount(formData.name, formData.email, formData.password);
      if (result.success) {
        alert(result.message);
        setIsLogin(true); // Muda para tela de login
      } else {
        alert(result.message);
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleForm = () => setIsLogin(!isLogin);

  const handleAboutRedirect = () => {
    window.location.href = 'https://exploramanaus.github.io/view/';
  };

  return (
    <div className="login-page">
      <div className="img-container"></div>
      <div className="login-container">
        <h1>Explora Manaus</h1>
        {loggedInUser ? (
          <h2>Bem-vindo, {loggedInUser.name}!</h2>
        ) : (
          <h2>{isLogin ? 'Fazer Login' : 'Criar Conta'}</h2>
        )}
        {!loggedInUser && (
          <form onSubmit={handleFormSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name"></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nome"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email"></label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password"></label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword"></label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirmar senha"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            <button type="submit" className="btn-submit">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
            {isLogin && (
              <button type="button" onClick={() => navigate('/main')} className="btn-secondary">
                Entrar sem conta
              </button>
            )}
            <button type="button" onClick={toggleForm} className="btn-link">
              {isLogin ? 'Criar Conta' : 'Já tenho conta'}
            </button>
          </form>
        )}
        {loggedInUser && (
          <button onClick={() => navigate('/main')} className="btn-about">
            Ir para a página principal
          </button>
        )}
        {/* Botão para a página "Sobre o Projeto" */}
        <button type="button" onClick={handleAboutRedirect} className="btn-about">
          Sobre o Projeto
        </button>
      </div>
    </div>
  );
}

export default LoginPage;