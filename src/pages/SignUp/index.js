import { useState, useContext} from 'react'
import logo from '../../assets/ibbx.png';
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'

export default function SignUp(){
    const [name, setName] = useState ('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signUp, loadingAuth } = useContext(AuthContext);

   async function handleSubmit(e){
        e.preventDefault();

        if(name !== '' && email !== '' &&password !== ''){
        await signUp(email, password, name)
        }
    }
    return(
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt="Logo do sistema de chamados" />
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Nova conta</h1>
                    <input type="text" 
                    placeholder="Seu nome"
                    value={name}
                    onChange={ (e) => setName(e.target.value) }
                    />
                    <input type="text" 
                    placeholder="email@gmail.com"
                    value={email}
                    onChange={ (e) => setEmail(e.target.value) }
                    />
                    <br/>
                    <input type="password" 
                    placeholder="*********"
                    value={password}
                    onChange={ (e) => setPassword(e.target.value) }
                    />

                    <button type="submit">
                        {loadingAuth ? 'Carregando...' : 'Cadastrar'} 
                    </button> 
                </form> 

                    <Link to="/">Ja possui uma conta? faça login</Link>


            </div>
        </div>
    )
}