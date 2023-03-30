import { useContext, useState } from 'react'
import  Header from '../../components/Header'
import Title from '../../components/Title'
 

import {FiSettings, FiUpload} from 'react-icons/fi'
import avatar from'../../assets/avatar.png'
import { AuthContext } from '../../contexts/auth'

import {db, storage} from '../../services/firebaseConnection'
import {doc, updateDoc} from 'firebase/firestore'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'

import {toast} from 'react-toastify'

import './profile.css';
import { async } from '@firebase/util'

export default function Perfil(){

    const { user,storageUser, setUser, logout } = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [imageAvatar, setimageAvatar] = useState(null);
    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setimageAvatar(image)
                setAvatarUrl(URL.createObjectURL(image)) //esta recebendo a image AVatar Pelo próprio URL
            }else{
                alert("Envie uma imagem do tipo PNG ou JPEG")
                setimageAvatar(null);
                return;
            }
        }
    }

    
    async function handleUpload(){
        const currentUid = user.uid;

        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)

        const uploadTaks = uploadBytes(uploadRef, imageAvatar)
        .then( (snapshot) =>{
            

            //Ve se a Pessoa tem Foto, se tiver busca do banco e apareco na avatarUrl
            getDownloadURL(snapshot.ref).then( async (downloadURL) => {
                let urlFoto = downloadURL;

                const docRef = doc(db, "users", user.uid)
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    nome: nome,
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlFoto,
                    }
        
                    setUser(data);
                    storageUser(data);  
                    toast.success("Atualizado com sucesso")
                })
            })
        })
    }
    
    
    async function handleSubmit(e){
        e.preventDefault();
        
        if(imageAvatar === null && nome !== ''){
            //Atualizar o nome do usuario(Apenas)
        const docRef = doc(db, "users", user.uid)
        await updateDoc(docRef, {
            nome: nome,
        })
        .then( () => {
            let data = {
                ...user,
                nome: nome,
            }

            setUser(data);
            storageUser(data);  
            toast.success("Atualizado com sucesso!")
        })

    }else if(nome !== '' && imageAvatar !== null){
        //atualizar tanto o nome quanto a foto
        handleUpload()
    }
}

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Minha conta">
                    <FiSettings size={25} /> 
                </Title>
            

            <div className="container">
            </div> 

                <form className="form-profile" onSubmit={handleSubmit}>   
                    <label className="label-avatar">
                        <span>
                            <FiUpload color="#FFF" size={25} />
                        </span>

                        <input type="file" accept="image/*" onChange={handleFile} /> <br/> 
                        {avatarUrl === null ?(
                            <img src={avatar} alt="Foto de Pefil" width={250} height={250}/>
                        ) : (
                            <img src={avatarUrl} alt="Foto de Pefil" width={250} height={250}/>
                        )}
                    </label>

                           <label>Nome</label> 
                           <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
                           <label>Email</label> 
                           <input type="text" value={email} disabled={true}/>

                           <button type='submit'>Salvar</button>

                </form>

            </div>
            
            <div className="content">
                <button className="logout-btn" onClick={ () => logout() }>Sair</button>
            </div>
            
        </div>
    )
}