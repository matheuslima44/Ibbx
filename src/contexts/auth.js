import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection'; //autentificação e banco de dados
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'//logar o usuario 
import { doc, getDoc, setDoc } from 'firebase/firestore'//pegar documento e criar documento
import { async } from '@firebase/util';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
 
export const AuthContext = createContext({}); 

function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();


    //mantem o usuario logado, mesmo após dar F5
    useEffect( () => {
        async function LoadUser(){
            const storageUser = localStorage.getItem('@ticketsPRO')

            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false);
            }

            setLoading(false);


        }

        LoadUser();
    }, [])

    async function signIn(email, password){
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef) //Vai no banco de dados Realizar a busca do id User
       
            let data = {
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success("Bem-vindo(a) de volta! ")
            navigate("/dashboard")

        })

        .catch( (error) => {
            console.log(error);
            setLoadingAuth(false);
            toast.error("Ops algo deu errado...")
        })

    }

    //cadastrar novo usuario

   async function signUp(email, password, name){
        setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, password)
    .then( async (value) => {
        let uid =value.user.uid

        await setDoc(doc(db, "users", uid), {
            nome: name,
            avatarUrl: null
        })
        .then( () => {

            let data ={
                uid: uid,
                nome: name,
                email: value.user.email, //email que foi cadastrado
                avatarUrl: null
            };
            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success("Seja Bem-vindo ao sistema !")
            navigate("/dashboard")

        })


    })
    .catch( (error) => {
        console.log(error);
        setLoadingAuth(false);
    })

    }
        

    function storageUser(data){
        localStorage.setItem('@ticketsPRO', JSON.stringify(data))
    }

    //deslogar o usuário do firebase
    async function logout(){
        await signOut(auth);
        localStorage.removeItem('@ticketsPRO');
        setUser(null); //informações do usuario vai ser limpa

    }

//area p/ Salvar variaveis exportadas
    return(
    <AuthContext.Provider 
    value={{
        signed: !!user, // !!converte a variavel user para booleano -> null = falso
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        loading,
        storageUser,
        setUser
        
    }}
    >
            {children}
    </AuthContext.Provider>
    )
}

export default AuthProvider;