import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingAuth } from './LoadingAuth';
import {checkAuth} from './checkAuth';
import './auth.css'

export const RedirectByAuth = ()=>{
    const navigateTo = useNavigate();
    useEffect(()=>{
        checkAuth()
        .then(()=>navigateTo('/painel'))
        .catch(()=>navigateTo('/login'))
    },[])
    return (
        <LoadingAuth/>
    );
}