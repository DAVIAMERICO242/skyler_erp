import { useReducer, useState,useRef} from "react";
import { Input } from "@/components/ui/input";
import logo from '/skyler.png';
import login from '/login.jpg';
import BACKEND_URL from "../backend-urls";
import { useNavigate } from 'react-router-dom';
import './login.css';
import {LoadingButton} from '../../components/ui/LoadingButton';

export const Login = ()=>{
    const navigateTo = useNavigate();
    const [loading,setLoading] = useState<boolean>(false);

    interface loginCredentials{
        username?:string;
        password?:string;
    }

    interface loginAction{
        field: 'username' | 'password',
        value: string;
    }

    const login_reducer = (state:loginCredentials,action:loginAction):loginCredentials=>{
        return{
            ...state,
            [action.field]: action.value
        }
    }
    
    const [credentials,dispatch] = useReducer(login_reducer,{});
    const [loginError, setLoginError] = useState<boolean>(false);

    const Login_submit = async ()=>{
        setLoading(true);
        setLoginError(false);
        fetch(BACKEND_URL + '/login',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then((d)=>
            d.json()
        )
        .then((d)=>{
            if(!d?.success){
                setLoading(false);
                setLoginError(true);
            }else{
                localStorage.setItem('token',d.token);
                localStorage.setItem('username',d.username);
                navigateTo('/painel')
            }
        })
        .catch((error)=>{
            console.log(error);
            setLoading(false);
            setLoginError(true);
        })
    }

    const loginRef = useRef<HTMLButtonElement | null>(null);

    const handleSubmit= (event)=>{
        if (event.key === 'Enter') {
            console.log('oi')
            if(loginRef.current){
                console.log('aaa')
                loginRef.current.click();
            }
        }
    }

    return (
        <div className="login_page">
            <div className="marketing">
            </div>
            <div className="login_area">
                <div className="login_form"  onKeyDown={handleSubmit}>
                    <div className="skyler-logo">
                        <img src={logo} alt="" />
                    </div>
                    <div className="login_title">Insira sua senha</div>
                    <div className="login_field">
                        <Input onChange={(e)=>{
                            dispatch({field:'username',value:e.target.value})
                        }} className="login_input" placeholder="Usuário"/>
                    </div>
                    <div className="login_field">
                        <Input onChange={(e)=>{
                            dispatch({field:'password',value:e.target.value})
                        }} className="login_input" placeholder="Senha" type="password"/>
                    </div>
                    {!loginError || <div className="unauth_login">
                        Não autorizado
                    </div>}
                    <LoadingButton
                        ref={loginRef}
                        loading={loading}
                        onClick={Login_submit}
                        className={"login_button"}
                        type="skyler">
                        Entrar
                    </LoadingButton>
                </div>
            </div>
        </div>
    )

}