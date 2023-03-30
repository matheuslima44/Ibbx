
import { useState, useEffect, useContext } from 'react'
import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiPlusCircle } from 'react-icons/fi'

import {AuthContext} from '../../contexts/auth'
import {db} from '../../services/firebaseConnection'
import {collection, getDocs, getDoc, doc, addDoc} from 'firebase/firestore'

import {useParams} from 'react-router-dom'

import { toast } from 'react-toastify'

import './new.css';
import { async } from '@firebase/util'

const listRef = collection(db, "customers")

export default function New(){
    const {user} = useContext(AuthContext)
    const { id } = useParams();

    const [customers, setCustomers] = useState ([])
    const [loadCustomer, setLoadCustomer] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0)

    const [descricao ,setDescricao] = useState('')
    const [equipamento ,setEquipamento] = useState('Ibbx')
    const [status ,setStatus] = useState('Ativado')

useEffect(() => {
    async function loadCustomer(){
        const querySnapshot = await getDocs(listRef)
        .then( (snapshot) => {
            let lista = [];
            
            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nomeEmpresa: doc.data().nomeEmpresa
                })
            })

            if(snapshot.docs.size === 0){
                console.log("Nenhuma empresa encontrada")
                setCustomers([ {id: '1', nomeEmpresa: 'Freela'} ])
                setLoadCustomer(false);
                return;
            }

            setCustomers(lista)
            setLoadCustomer(false);

            if(id){
                loadId(lista);
            }

        })
        .catch((error) => {
            console.log("Erro ao buscar os clientes", error)
            setLoadCustomer(false);
            setCustomers([ {id: '1', nomeEmpresa: 'Freela'} ])
        })
    }

    loadCustomer();
}, [id])

async function loadId(lista){
    const docRef = doc(db, "Empresa", id);
    await getDoc(docRef)
    .then( (snapshot) => {
        setEquipamento(snapshot.data().equipamento)
        setStatus(snapshot.data().status)
        setDescricao(snapshot.data().descricao);


        let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
        setCustomerSelected(index);

    })
    .catch((error) =>{
        console.log(error);
    })
}


function handleOptionChange(e){
    setStatus(e.target.value);
}

function handleChangeSelect(e){
    setEquipamento(e.target.value)
}

function handleChangeCustomer(e){
    setCustomerSelected(e.target.value)
    console.log(customers[e.target.value].nomeEmpresa);
}

async function handleRegister(e){
    e.preventDefault();

    //registrar um chamado
    await addDoc(collection (db, "Equipamentos"), {
        created: new Date(),
        cliente: customers[customerSelected].nomeEmpresa,
        clienteId: customers[customerSelected].id,
        equipamento: equipamento, 
        descricao: descricao,
        status: status,
        userId: user.uid,
    })
    .then(() => {
        toast.success("Equipamento Registrada!")
        setDescricao('')
        setCustomerSelected(0)
    })
    .catch((error) =>{
        toast.error("Ops erro ao registrar, Tente novamente!")
        console.log(error);
    })
}

    return(
        <div>
            <Header />

            <div className="content">
                <Title name="Novo chamado">
                    <FiPlusCircle size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                       
                       
                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type="text" disabled={true} value="Carregando..." />
                            ) :( 
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {customers.map((item, index) => {
                                        return(
                                            <option key={index} value={index}>
                                                {item.nomeEmpresa}
                                            </option>
                                        )
                                    })}
                                </select>
                            )
                        }

                        
                        
                        <label>Equipamentos</label>
                        <select value={equipamento} onChange={handleChangeSelect}>
                            <option value="Ibbx box">Ibbx box</option>
                            <option value="Motor de frequencia">Motor de frequencia</option>
                            <option value="Roteador">Roteador</option>
                        </select>

                    
                        <label>Status</label>
                        <div className="status">
                            
                            <input type="radio" name="radio" value="Ativado" onChange={handleOptionChange} checked={ status === 'Ativado'}/>
                        <span>Ativado</span>
                            <input type="radio" name="radio" value="Desativado" onChange={handleOptionChange} checked={ status === 'Desativado'}/>
                        <span>Desativado</span>
                            <input type="radio" name="radio" value="Em manutencao" onChange={handleOptionChange} checked={ status === 'Em manutencao'}/>
                        <span>Em manutenção</span>                       
                        </div>

                        <label>Descrição</label>
                            <textarea type="text" placeholder="Descreva o destino de determinado equipamento para a empresa" value={descricao} onChange={ (e) => setDescricao(e.target.value)} />

                        <button type="submit">Registrar</button>

                    </form>

                </div>

            </div>
        </div>
    )
}