import { useState } from 'react';

import './styles.scss';
import { formatCpfCnpj } from '../../utils/FormatCpfCnpj';

function Main() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [socialNumber, setSocialNumber] = useState('');

  return (
    <main>
      <aside />
      <div className="main-div">
        <div className="main-div__header">
          <h4>Bem-vindo a</h4>
          <h2>Ceres Investimentos</h2>
        </div>
        <div className="separator">Insira seus dados</div>
        <form>
          <div className="input-block">
            <div className="input-block__input-name">
              <input
                type="text" 
                name="first-name"
                placeholder="Nome"
                value={name}
                onChange={event => setName(event.target.value)}
                required
              />
              <input
                type="text" 
                name="last-name"
                placeholder="Sobrenome"
                value={lastName}
                onChange={event => setLastName(event.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-block">
            <input
              type="email" 
              name="email"
              placeholder="E-mail"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="input-block">
            <input
              type="text" 
              name="social-number"
              placeholder="CPF ou CNPJ"
              maxLength={18}
              value={socialNumber}
              onChange={event => setSocialNumber(formatCpfCnpj(event.target.value))}
              required
            />
          </div>
          <button 
            type="submit" 
            className="button-submit"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </main>
  );  
}

export default Main;
