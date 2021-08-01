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
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }, 1000);

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
      })
      .catch(err => {
        handleToastNotification(false);
        console.error(err.message);
      });
  }

  function handleFetchUsers() {
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
      <div className="div__form">
        <div className="form__header">
          <h2>Cadastre-se em nossa plataforma</h2>
        </div>
        <div className="form__body-separator">Insira seus dados</div>
        <form onSubmit={handleFormSubmit}>
          <div className="form__input-block input-name">
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
          <div className="form__input-block">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form__input-block">
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
          <div className="form__input-block">
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
          <div className="form__input-block">
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
          <div className="form__input-block input-address">
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
          <div className="form__input-block input-location">
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
          <div className="form__button-submit">
            <button type="submit">Cadastrar</button>
          </div>
        </form>
      </div>

      {hasUsers && (
        <div className="div__table">
          <table>
            <thead className="table__header">
              <tr className="table__header-row">
                <th>Ação</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>CPF/CNPJ</th>
                <th>CEP</th>
                <th>Logradouro</th>
                <th>Bairro</th>
                <th>Número</th>
                <th>Cidade</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody className="table__body">
              {users.map(user => {
                return (
                  <tr key={user.id} className="table__body-row">
                    <td>
                      <button onClick={() => handleUserDeletion(user)}>
                        Excluir
                      </button>
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.cpfOrCnpj}</td>
                    <td>{user.cep}</td>
                    <td>{user.address}</td>
                    <td>{user.addressDistrict}</td>
                    <td>{user.addressNumber}</td>
                    <td>{user.city}</td>
                    <td>{user.state}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );  
}
