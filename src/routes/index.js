import {Routes, Route} from 'react-router-dom'

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard'
import Perfil from '../pages/Profile';
import Customers from '../pages/Customers'
import New from '../pages/New';

import Private from './Private'


function RoutesApp(){
    return(
        <Routes> 
            <Route path="/" element={ <SignIn/> } /> 
            <Route path="/register" element={ <SignUp/>} />

            <Route path="dashboard" element={ <Private> <Dashboard/> </Private> } />
            <Route path="/Perfil" element={ <Private> <Perfil/> </Private>}/>
            <Route path="/Clientes" element={ <Private> <Customers/> </Private>} />
            <Route path="/new" element={<Private> <New/> </Private>} />
            <Route path="/new/:id" element={<Private> <New/> </Private>} />
        </Routes>   
    )
}

export default RoutesApp;