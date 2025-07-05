import React from 'react'

import './App.css';

import {Routes,Route} from 'react-router-dom';

import Home from './Pages/Home';
import Navigation from './Components/Navigation';
import SignUpOptions from './Components/SignUpOptions';




import OrganizerHome from './Pages/Organizer/OrganizerHome';
import OrganizerTournament from './Pages/Organizer/OrganizerTournament';
import CreateTournament from './Pages/Organizer/CreateTournament';
import Tournament from './Pages/Organizer/Tournament';
import Events from './Pages/Organizer/Events';

  import { ToastContainer, Bounce } from 'react-toastify';




import PlayerLogin from './Components/Auth/Player/PlayerLogin';
import PlayerSignUp from './Components/Auth/Player/PlayerSignUp';
import OrganizerLogin from './Components/Auth/Organizer/OrganizerLogin';
import OrganizerSignUp from './Components/Auth/Organizer/OrganizerSignUp';
import AdminLogin from './Components/Auth/Admin/AdminLogin';
import Layout from './Components/Admin/components/layout/Layout';
import DashboardPage from './Components/Admin/pages/dashboard/index';




const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/roleSelection' element={<SignUpOptions/>}/>


        {/* Organizer Routes */}

        <Route path='/organizer/home' element={<OrganizerHome/>}/>
        <Route path='/organizer/tournaments' element={<OrganizerTournament/>}/>
        <Route path='/organizer/createTournament' element={<CreateTournament/>}/>
        <Route path='/organizer/tournament/id' element={<Tournament/>}/>


        {/* Auth Routes */}

        {/* Player Routes */}
        <Route path='/login/player' element={<PlayerLogin/>}/>
        <Route path='/signup/player' element={<PlayerSignUp/>}/>

        {/* Organizer Routes */}
        <Route path='/login/organizer' element={<OrganizerLogin/>}/>
        <Route path='/signup/organizer' element={<OrganizerSignUp/>}/>

        {/* Admin Routes */}
        <Route path='/login/admin' element={<AdminLogin/>}/>
          <Route path="admin/dashboard" element={<DashboardPage />} />

      </Routes>

      <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
      
    </div>
  )
}

export default App