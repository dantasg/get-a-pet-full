import styles from './PetDetails.module.css';

import { useState, useEffect } from 'react';

import { useParams, Link } from 'react-router-dom';

import api from '../../../utils/api';

// Hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

function PetDetails() {
  const [pet, setPet] = useState({});
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();
  const [token] = useState(localStorage.getItem('token' || ''));

  useEffect(() => {
    api.get(`/pets/${id}`).then((response) => {
      setPet(response.data.pet);
    });
  }, [id]);

  async function schedule() {
    let msgType = '';
    let msgText = '';

    await api
      .patch(`pets/schedule/${pet._id}`, {
        Authorization: `Bearer ${JSON.parse(token)}`,
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
    <>
      {pet.name && (
        <section className={styles.pet_details_container}>
          <div className={styles.pet_details_header}>
            <h1>Conhecendo o pet {pet.name}</h1>
            <p>Se tiver interesse, marque uma visita para conhecê-lo</p>
          </div>
          <div className={styles.pet_images}>
            {pet.images.map((image, index) => (
              <img
                src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                alt={pet.name}
                key={index}
              />
            ))}
          </div>
          <p>
            <span className="bold">Peso: </span>
            {pet.weight}kg
          </p>{' '}
          <p>
            <span className="bold">Idade: </span>
            {pet.age > 1 ? <p>{pet.age} anos</p> : <p>{pet.age} ano</p>}
          </p>
          {token ? (
            <button onClick={schedule}>Solicitar uma visita</button>
          ) : (
            <p>
              Você precisa <Link to="/register">criar uma conta</Link> para
              solicitar adoção
            </p>
          )}
        </section>
      )}
    </>
  );
}

export default PetDetails;
