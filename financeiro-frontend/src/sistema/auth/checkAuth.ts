import BACKEND_URL from '../backend-urls';

export const checkAuth = ():Promise<null>=>{
    return new Promise((resolve,reject)=>{
        fetch(BACKEND_URL+'/auth_painel',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'token': localStorage.getItem('token') || ''
            }
        })
        .then((d)=>d.json())
        .then((d)=>{
            if (!d?.success){
                reject(null);
            }else{
                resolve(null)
            }
        })
        .catch(()=>reject(null))
    })
}