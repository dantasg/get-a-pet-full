import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import styles from './AddPet.module.css';

// API
import api from '../../../utils/api';

// Components
import PetForm from '../../form/PetForm';

// Hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

function AddPet() {
  const [token] = useState(localStorage.getItem('token'));
  const { setFlashMessage } = useFlashMessage();
  const history = useHistory();

  async function registerPet(pet) {
    let msgType = 'success';
    let msgText = '';

    const formData = new FormData();

    await Object.keys(pet).forEach((key) => {
      if (key === 'images') {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append('images', pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });

    const data = await api
      .post('pets/create', formData, {
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Content-Type': 'multipart/form-data',
      })
      .then((response) => {
        msgType = 'success';
        msgText = response.data.message;
        setFlashMessage(msgText, msgType);
        return response.data.message;
      })
      .catch((err) => {
        msgType = 'error';
        msgText = err.response.data.message;

        setFlashMessage(msgText, msgType);
        return err.response.data.message;
      });

    if (msgType !== 'error') {
      history.push('/pet/mypets');
    }
  }

  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele estará disponível para adoção</p>
      </div>
      <PetForm handleSubmit={registerPet} btnText="Cadastrar Pet" />
    </section>
  );
}

export default AddPet;
