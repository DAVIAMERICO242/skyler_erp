import { useReducer, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from '../../../public/skyler.png';
import { Loader2 } from "lucide-react"
import BACKEND_URL from "../backend-urls";
import { useNavigate } from 'react-router-dom';


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

    return (
        <div className="login_page">
            <div className="marketing">
            </div>
            <div className="login_area">
                <div className="login_form">
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
                    <Button onClick={Login_submit}
                    className={"login_button " + (!loading || "disabled")}>
                        {!loading || <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Entrar
                    </Button>
                </div>
            </div>
        </div>
    )

}