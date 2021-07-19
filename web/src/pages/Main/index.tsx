import { useState, FormEvent } from 'react';

import './styles.scss';
import bgImg from '../../assets/bg.jpg';
import { ToasterNotification, handleToastNotification } from '../../components/ToasterNotification';
import { database } from '../../services/Firebase';
import { capitalizeStr, formatPhone, formatCpfCnpj, formatCep } from '../../utils/FormatValues';
import { states } from '../../data/BrazilStates';
import { IUser } from '../../types';

export default function Main() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpfOrCnpj, setCpfOrCnpj] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [addressDistrict, setAddressDistrict] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [hasUsers, setHasUsers] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    const user = {
      username: `${name} ${lastName}`,
      email: email,
      phone: phone,
      cpfOrCnpj: cpfOrCnpj,
      cep: cep,
      address: address,
      addressDistrict: addressDistrict,
      addressNumber: addressNumber,
      city: city,
      state: state
    }

    await database
      .ref('users')
      .push(user)
      .then(() => {
        setHasUsers(true);
        handleToastNotification(true, 'Cadastro efetuado');
        handleFetchUsers();
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });

        /*
        setName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setCpfOrCnpj('');
        setCep('');
        setAddress('');
        setAddressDistrict('');
        setAddressNumber('');
        setCity('');
        setState('');
        */
      })
      .catch(err => {
        handleToastNotification(false);
        console.error(err.message);
      });
  }

  async function handleFetchUsers() {
    database
      .ref('users')
      .on('value', user => {
        if (user.val() !== null) {
          const getUsers: IUser[] = Object.entries(user.val()).map(([key, value]: any) => {
            return {
              id: key,
              username: value.username,
              email: value.email,
              phone: value.phone,
              cpfOrCnpj: value.cpfOrCnpj,
              cep: value.cep,
              address: value.address,
              addressDistrict: value.addressDistrict,
              addressNumber: value.addressNumber,
              city: value.city,
              state: value.state
            }
          });
          setUsers([...getUsers]);
        } else {
          setHasUsers(false);
        }
      });
  }

  async function handleUserDeletion(user: IUser) {
    await database
      .ref(`users/${user.id}`)
      .remove()
      .then(() => {
        handleToastNotification(true, 'Usuário excluído');
      })
      .catch(err => {
        handleToastNotification(false);
        console.error(err.message);
      });
  }

  return (
    <main>
      <ToasterNotification />
      <aside>
        <h3>Bem-vindo a:</h3>
        <h1>Ceres <br /> Investimentos</h1>
        <img src={bgImg} alt="Agriculture" />
      </aside>
      <div className="div-form">
        <div className="div-form__header">
          <h2>Cadastre-se em nossa plataforma</h2>
        </div>
        <div className="div-form__body-separator">Insira seus dados</div>
        <form onSubmit={handleFormSubmit}>
          <div className="div-form__input-block input-name">
            <input
              type="text"
              name="first-name"
              placeholder="Nome"
              value={name}
              onChange={event => setName(capitalizeStr(event.target.value))}
              required
            />
            <input
              type="text"
              name="last-name"
              placeholder="Sobrenome"
              value={lastName}
              onChange={event => setLastName(capitalizeStr(event.target.value))}
              required
            />
          </div>
          <div className="div-form__input-block">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="div-form__input-block">
            <input
              type="text"
              name="phone"
              placeholder="Telefone"
              minLength={15}
              maxLength={15}
              value={phone}
              onChange={event => setPhone(formatPhone(event.target.value))}
              required
            />
          </div>
          <div className="div-form__input-block">
            <input
              type="text"
              pattern="([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})"
              name="social-number"
              placeholder="CPF ou CNPJ"
              maxLength={18}
              value={cpfOrCnpj}
              onChange={event => setCpfOrCnpj(formatCpfCnpj(event.target.value))}
              required
            />
          </div>
          <div className="div-form__input-block">
            <input
              type="text"
              name="cep"
              placeholder="CEP"
              minLength={9}
              maxLength={9}
              value={cep}
              onChange={event => setCep(formatCep(event.target.value))}
              required
            />
          </div>
          <div className="div-form__input-block input-address">
            <input
              type="text"
              name="address"
              placeholder="Logradouro"
              value={address}
              onChange={event => setAddress(capitalizeStr(event.target.value))}
              required
            />
            <input
              type="text"
              name="address-district"
              placeholder="Bairro"
              value={addressDistrict}
              onChange={event => setAddressDistrict(capitalizeStr(event.target.value))}
              required
            />
            <input
              type="number"
              pattern="[0-9]"
              name="address-number"
              placeholder="Número"
              min={1}
              value={addressNumber}
              onChange={event => setAddressNumber(event.target.value)}
              required
            />
          </div>
          <div className="div-form__input-block input-location">
            <input
              type="text"
              pattern="^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$"
              name="city"
              placeholder="Cidade"
              value={city}
              onChange={event => setCity(capitalizeStr(event.target.value))}
              required
            />
            <datalist id="states">
              {states.map((state, index) => {
                return (
                  <option
                    key={index}
                    value={state.value}
                  >
                    {state.label}
                  </option>
                );
              })}
            </datalist>
            <input
              type="text"
              name="state"
              list="states"
              placeholder="Estado"
              value={state}
              onChange={event => setState(event.target.value)}
              required
            />
          </div>
          <div className="button-submit">
            <button type="submit">Cadastrar</button>
          </div>
        </form>
      </div>

      {hasUsers && (
        <div>
          <ul className="div-table">
            <li className="div-table__header">
              <div className="div-table__col col-action">Ação</div>
              <div className="div-table__col col-name">Nome</div>
              <div className="div-table__col col-email">E-mail</div>
              <div className="div-table__col col-phone">Telefone</div>
              <div className="div-table__col col-social-number">CPF/CNPJ</div>
              <div className="div-table__col col-cep">CEP</div>
              <div className="div-table__col col-address">Logradouro</div>
              <div className="div-table__col col-address-district">Bairro</div>
              <div className="div-table__col col-address-number">Número</div>
              <div className="div-table__col col-city">Cidade</div>
              <div className="div-table__col col-state">Estado</div>
            </li>
            {users.map(user => {
              return (
                <li key={user.id} className="div-table__body">
                  <button
                    className="col-action col-button"
                    onClick={() => handleUserDeletion(user)}
                  >
                    Excluir
                  </button>
                  <div className="div-table__col col-name">{user.username}</div>
                  <div className="div-table__col col-email">{user.email}</div>
                  <div className="div-table__col col-phone">{user.phone}</div>
                  <div className="div-table__col col-social-number">{user.cpfOrCnpj}</div>
                  <div className="div-table__col col-cep">{user.cep}</div>
                  <div className="div-table__col col-address">{user.address}</div>
                  <div className="div-table__col col-address-district">{user.addressDistrict}</div>
                  <div className="div-table__col col-address-number">{user.addressNumber}</div>
                  <div className="div-table__col col-city">{user.city}</div>
                  <div className="div-table__col col-state">{user.state}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </main>
  );  
}
