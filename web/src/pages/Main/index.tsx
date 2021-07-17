import { useState, FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import './styles.scss';
import bgImg from '../../assets/bg.jpg';
import { database } from '../../services/Firebase';
import { formatPhone, formatCpfCnpj, formatCep } from '../../utils/FormatValues';
import { states } from '../../data/BrazilStates';

function Main() {
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

  function handleToastNotification(hasSucceeded: boolean, msg: string) {
    if (hasSucceeded) {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await database
      .ref('users')
      .push({
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
    })
      .then(() => {
        handleToastNotification(true, 'Cadastro efetuado');
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
        handleToastNotification(false, 'Alguma coisa deu errado');
        console.error(err.message);
      });
  }

  return (
    <main>
      <Toaster />
      <aside>
        <img src={bgImg} alt="Agriculture" />
      </aside>
      <div className="main-div">
        <div className="main-div__header">
          <h4>Bem-vindo a</h4>
          <h2>Ceres Investimentos</h2>
        </div>
        <div className="separator">Insira seus dados</div>
        <form onSubmit={handleSubmit}>
          <div className="input-block name-input">
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
          <div className="input-block">
            <input
              type="email"
              autoComplete="on"
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
              name="phone"
              placeholder="Telefone"
              minLength={15}
              maxLength={15}
              value={phone}
              onChange={event => setPhone(formatPhone(event.target.value))}
              required
            />
          </div>
          <div className="input-block">
            <input
              type="text"
              name="social-number"
              placeholder="CPF ou CNPJ"
              minLength={14}
              maxLength={18}
              value={cpfOrCnpj}
              onChange={event => setCpfOrCnpj(formatCpfCnpj(event.target.value))}
              required
            />
          </div>
          <div className="input-block">
            <input
              type="text"
              name="cep"
              placeholder="CEP"
              maxLength={9}
              value={cep}
              onChange={event => setCep(formatCep(event.target.value))}
              required
            />
          </div>
          <div className="input-block address-input">
            <input
              type="text"
              name="address"
              placeholder="Logradouro"
              value={address}
              onChange={event => setAddress(event.target.value)}
              required
            />
            <input
              type="text"
              name="address-district"
              placeholder="Bairro"
              value={addressDistrict}
              onChange={event => setAddressDistrict(event.target.value)}
              required
            />
            <input
              type="number"
              pattern="[0-9]"
              name="address-number"
              placeholder="Número"
              value={addressNumber}
              onChange={event => setAddressNumber(event.target.value)}
              required
            />
          </div>
          <div className="input-block location-input">
            <input
              type="text"
              name="city"
              placeholder="Cidade"
              value={city}
              onChange={event => setCity(event.target.value)}
              required
            />
            <input
              type="text"
              name="state"
              list="states"
              placeholder="Estado"
              onChange={event => setState(event.target.value)}
              required
            />
              <datalist id="states">
                {states.map(state => {
                  return (
                    <option value={state.value}>{state.label}</option>
                  )
                })}
              </datalist>
          </div>
          <div className="button-submit">
            <button type="submit">Cadastrar</button>
          </div>
        </form>
      </div>
    </main>
  );  
}

export default Main;
