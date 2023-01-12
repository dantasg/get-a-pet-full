import styles from './EditPet.module.css';

import api from '../../../utils/api';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import PetForm from '../../form/PetForm';

// Hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

function EditPet(params) {
  const [pet, setPet] = useState({});
  const [token] = useState(localStorage.getItem('token' || ''));
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get(`/pets/${id}`, {
        Authorization: `Bearer ${JSON.parse(token)}`,
      })
      .then((response) => {
        setPet(response.data.pet);
      });
  }, [token, id]);

  async function updatePet(pet) {
    let msgText = '';
    let msgType = '';

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

    await api
      .patch(`/pets/${pet._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
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
  }

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editando Pet: {pet.name}</h1>
        <p>Depois da edição, os dados serão atualizados no sistema</p>
      </div>
      {pet.name && (
        <PetForm handleSubmit={updatePet} btnText="Atualizar" petData={pet} />
      )}
    </section>
  );
}

export default EditPet;
