import React from 'react'
import { useState, createContext } from 'react';

import { useNavigate } from'react-router-dom';

import { toast } from 'react-toastify';

const AdminContext = createContext();







const AdminContextProvider = (props)=>{
    
    
    const value = {
    
    };
    
    
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
    
    
    
}


export { AdminContext };

export default AdminContextProvider