import React from 'react'
import { useState, createContext } from 'react';

import { useNavigate } from'react-router-dom';

import { toast } from 'react-toastify';

const PlayerContext = createContext();







const PlayerContextProvider = (props)=>{
    
    
    const value = {
    
    };
    
    
    return (
        <PlayerContext.Provider value={value}>
            {props.children}
        </PlayerContext.Provider>
    )
    
    
    
}


export { PlayerContext };

export default PlayerContextProvider