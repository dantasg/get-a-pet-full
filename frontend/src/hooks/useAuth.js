// API
import api from '../utils/api';

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import useFlashMessage from './useFlashMessage';

export default function useAuth() {
  const { setFlashMessage } = useFlashMessage();
  const [authenticated, setAuthenticated] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
      console.log(authenticated);
    }
  }, [authenticated]);

  async function register(user) {
    let msgText = 'Cadastro Realizado com sucesso!';
    let msgType = 'success';

    try {
      const data = await api.post('/users/register', user).then((response) => {
        return response.data;
      });

      await authUser(data);
    } catch (err) {
      // Tratar o erro
      msgText = err.response.data.message;
      msgType = 'error';
    }

    setFlashMessage(msgText, msgType);
  }

  async function login(user) {
    let msgText = 'Login realizado com sucesso!';
    let msgType = 'success';

    try {
      const data = await api.post('/users/login', user).then((response) => {
        return response.data;
      });

      await authUser(data);
    } catch (err) {
      // Tratar o erro
      msgText = err.response.data.message;
      msgType = 'error';
    }

    setFlashMessage(msgText, msgType);
  }

  async function authUser(data) {
    setAuthenticated(true);

    localStorage.setItem('token', JSON.stringify(data.token));

    history.push('/');
  }

  function logout() {
    let msgText = 'logout realizado com sucesso!';
    let msgType = 'success';

    setAuthenticated(false);
    localStorage.removeItem('token');
    api.defaults.headers.Authorization = undefined;
    history.push('/');

    setFlashMessage(msgText, msgType);
  }

  return { authenticated, logout, register, login };
}
