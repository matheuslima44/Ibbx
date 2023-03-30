import { async } from '@firebase/util';
import { useContext, useEffect,useState } from 'react'
import { AuthContext } from '../../contexts/auth'

import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2} from 'react-icons/fi'

import { Link } from 'react-router-dom'
import {collection, getDocs, orderBy, limit, startAfter, query} from 'firebase/firestore'
import { db } from  '../../services/firebaseConnection'

import { format } from 'date-fns'

import './dashboard.css'

const listRef = collection(db, "Equipamentos")

export default function Dashboard(){
    const { logout } = useContext(AuthContext);

    const [empresa, setEmpresa] = useState([])
    const [loading, setLoading]  = useState(true);

    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDocs, setLastDocs] = useState()
    const [loadingMore, setLoadingMore] =useState(false);

    
    useEffect( () => { //criar lista/Buscar
      async function loadEquipamento(){
        const q = query(listRef, orderBy('created', 'desc'), limit(5));                   //busca ordenada e com limite de 5 equipamentos

        const querySnapshot = await getDocs(q)
        setEmpresa([]);
        await updateState(querySnapshot)

        setLoading(false);
      } 
      
      loadEquipamento();

      return() => { }
      
    }, [])


    //recebe a lista para percorrer os equipamentos
    async function updateState(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];
            
            querySnapshot.forEach((doc) =>{
                lista.push({
                    id: doc.id,
                    empresa: doc.data().empresa,
                    equipamento: doc.data().equipamento,
                    cliete: doc.data().cliete,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    descricao: doc.data().descricao,
                })
            })

            const lastDocs = querySnapshot.docs[querySnapshot.docs.length -1] //Pegando o utlimo item Redenrizado
            
            
            setEmpresa(empresa => [...empresa, ...lista]) //Pegando as empresas salva na lista acima e passando a + na própria 
            setLastDocs(lastDocs)


        }else{
            setIsEmpty(true);
        }

        setLoadingMore(false);

    }

    async function handleMore(){
        setLoadingMore(true)
        const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5)); 
        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot)
    }

        if(loading){
            return(
                <div>
                    <Header/>

                    <div className='content'>
                    <Title name="Empresas">
                <FiMessageSquare size={25}/>
                    </Title>

                    <div className='container dashboard'>
                        <span>Buscando chamados...</span>
                    </div>

                    </div>

                </div>
            )
        }


    return(
        <div>
        <Header />
        
        <div className="content">
           <Title name="Empresas">
                <FiMessageSquare size={25}/>
           </Title>
        </div>
        
        <> 
            {empresa.length === 0 ? (
                <div className='container dashboard'>
                    <span>Nenhuma empresa registrada</span>
                <Link to="/new" className="new">
            <FiPlus color="#FFF" size={25}/>
             Nova Empresa
                </Link>
                </div>
            ): (
                <> 
                 <Link to="/new" className="new">
                    <FiPlus color="#FFF" size={25}/>
                    Nova Empresa
                </Link>

                <table>
                <thead>
                    <tr>
                        <th scope="col">Empresa</th>
                        <th scope="col">Equipamento</th>
                        <th scope="col">Status</th>
                        <th scope="col">Cadastrado em</th>
                        <th scope="col">#</th>
                    </tr>
                </thead>
                <tbody>
                    {empresa.map ((item, index) =>{
                        return(
                        <tr key={index}>
                            <td data-labe="Empresa">{item.empresa}</td>
                            <td data-labe="Equipamentos">{item.equipamento}</td>
                            <td data-labe="Status">
                                <span className="badge" style={{backgroundColor : item.status === 'Ativado' ? '#008000' : '#ff0000' }}>
                                    {item.status}
                                </span>
                            </td>
                            <td data-labe="Cadastrado">{item.createdFormat}</td>
                            <td data-labe="#">
                                <button className="action" style={ {backgroundColor: '#3583f6'} }>
                                    <FiSearch color='#FFF' size={17}/>
                                </button>
                                <Link to={`/new/${item.id}`} className="action" style={ {backgroundColor: '#f6a935'} }>
                                    <FiEdit2 color='#FFF' size={17}/>
                                </Link>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>                
            </table> 


                    {loadingMore && <h3>Bucando mais Cadastros...</h3>}
                    {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}

                </>
            )} 

        </>
    
    </div>
    )
}