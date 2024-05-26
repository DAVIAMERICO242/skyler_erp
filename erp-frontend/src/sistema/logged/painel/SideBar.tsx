import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { FaRegChartBar } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { FaStoreAlt } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { useState, useRef,useEffect,useReducer } from "react";


export const SideBar = ()=>{

    const [toggle,setToggle] = useState<boolean>(true);
    const ref = useRef<HTMLDivElement>(null);
    const refToggle = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(ref.current && !toggle){
            const children = ref.current?.getElementsByClassName('item_name');
            const hello_user = ref.current?.getElementsByClassName('hello_text');
            // Set opacity of each child to 0
            for (let i = 0; i < children.length; i++) {
                (children[i] as HTMLElement).style.display = 'none';
            }
            hello_user[0].style.display = 'none';
            ref.current.style.width = "6%";

        }else{
            const children = ref.current?.getElementsByClassName('item_name');
            const hello_user = ref.current?.getElementsByClassName('hello_text');
            // Set opacity of each child to 0
            if(refToggle.current){
                refToggle.current.style.pointerEvents = 'none';
            }
            setTimeout(() => {
                for (let i = 0; i < children.length; i++) {
                    (children[i] as HTMLElement).style.display = '';
                }
                hello_user[0].style.display='';
                if(refToggle.current){
                    refToggle.current.style.pointerEvents = '';
                }
            }, 300);
            ref.current.style.width = "20%";
        }
    },[toggle]);

    // const item_focus_reducer = (state,action)=>{
    //     console.log(action.clicked_item)
    //     if (action.clicked_item.tagName.toLowerCase() === 'li') {
    //         action.clicked_item.style.opacity='0';
    //     }

    // }

    // const [clickedItem,dispatch] = useReducer(item_focus_reducer,{});



    return(
        <div ref={ref} className="side_bar" onClick={(e)=>dispatch({'clicked_item':e.target})}>
            <div ref={refToggle} className="toggle"
             onClick={()=>setToggle((prev)=>!prev)}>
                {toggle?<IoIosArrowBack/>:<LuPlus/>}
            </div>
            <div className="hello_user">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="hello_text">
                    {"Olá " + localStorage.getItem('username')}
                </div>
            </div>
            <div className="divider"></div>
            <div className="side_bar_items">
                <ul>
                    <li>
                        <div className="circle"><FaRegChartBar/></div>
                        <div className="item_name">
                            Resumo geral
                        </div>
                    </li>
                    <li>
                        <div className="circle"><GiNotebook/></div>
                        <div className="item_name">
                            Cadastro de terceiros
                        </div>
                    </li>
                    <li>
                        <div className="circle"><FaStoreAlt/></div>
                        <div className="item_name">
                            Análise por loja
                        </div>
                    </li>
                    <li>
                        <div className="circle"><IoPeopleSharp/></div>
                        <div className="item_name">
                            Análise por vendedor
                        </div>
                    </li>
                    <li>
                        <div className="circle"><FaMoneyBillTransfer/></div>
                        <div className="item_name">
                            Analisar DRE
                        </div>
                    </li>
                    <li>
                        <div className="circle"><BsBank2/></div>
                        <div className="item_name">
                            Integração
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}