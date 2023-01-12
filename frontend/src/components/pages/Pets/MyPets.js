import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import RoundedImage from '../../layout/RoundedImage';

// Hooks
import useFlashMessage from '../../../hooks/useFlashMessage';
import api from '../../../utils/api';

import styles from './Dashboard.module.css';

function MyPets() {
  const [pets, setPets] = useState([]);
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get('/pets/mypets', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setPets(response.data.pets);
      });
  }, [token]);

  async function removePet(id) {
    let msgType = '';
    let msgText = '';

    await api
      .delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        msgType = 'success';
        msgText = response.data.message;

        setFlashMessage(msgText, msgType);

        const updatedPet = pets.filter((pet) => pet._id !== id);
        setPets(updatedPet);
        return response.data;
      })
      .catch((err) => {
        msgType = 'error';
        msgText = err.response.data.message;

        setFlashMessage(msgText, msgType);

        return err.message;
      });
  }

  async function concludeAdoptions(id) {
    let msgType = '';
    let msgText = '';

    await api
      .patch(`/pets/conclude/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        msgType = 'success';
        msgText = response.data.message;

        setFlashMessage(msgText, msgType);
        window.location.reload(false);
        return response.data;
      })
      .catch((err) => {
        msgType = 'error';
        msgText = err.response.data.message;

        setFlashMessage(msgText, msgType);
        return err.message;
      });
  }

  return (
    <section>
      <div className={styles.petlist_header}>
        <h1>MyPets</h1>
        <Link to="/pet/add">Cadastrar Pets</Link>
      </div>
      <div className={styles.petlist_container}>
        {pets.length > 0 &&
          pets.map((pet) => (
            <div className={styles.petlist_row} key={pet._id}>
              <RoundedImage
                src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`}
                alt={pet.name}
                width="px75"
              />
              <span className="bold">{pet.name}</span>
              <div className={styles.actions}>
                {pet.available ? (
                  <>
                    {pet.adopter && (
                      <button
                        className={styles.conclude_btn}
                        onClick={() => {
                          concludeAdoptions(pet._id);
                        }}
                      >
                        Concluir adoção!
                      </button>
                    )}{' '}
                    <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                    <button
                      onClick={() => {
                        removePet(pet._id);
                      }}
                    >
                      Excluir
                    </button>
                  </>
                ) : (
                  <p>Pet já adotado!</p>
                )}
              </div>
            </div>
          ))}
        {pets.length === 0 && <p>Não temos pets cadastrados</p>}
      </div>
    </section>
  );
}

export default MyPets;
