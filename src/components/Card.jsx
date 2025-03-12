import React from 'react';
import '../styles/Card.css'

function Card({ id, name, description, price }) {
  return (
    <li key={id} className="subscription-item">
      <h3>{name}</h3>
      {description && <p>{description}</p>}
      {price && <p className="price">Cena: {price} €</p>}
      <button className="choose-button">Izveleties</button>
    </li>
  );
}

export default Card;