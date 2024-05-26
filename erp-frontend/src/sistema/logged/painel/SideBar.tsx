import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaRegChartBar } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { FaStoreAlt } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { useState, useRef,useEffect,useReducer } from "react";
import { useNavigate} from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import './css/side_bar.css';
import logo from '../../../../public/skyler.png';
import favicon from '../../../../public/skyler-favicon.png';

export const SideBar = ({features,setFocusedFeature, setFatherToggle}: 
    {features: string[],
    setFocusedFeature: (feature: string) => void,
    setFatherToggle:(feature: boolean) => void}
    )=>{

    //Abaixo é a  logica do toggle
    const navigateTo = useNavigate();

    const [toggle,setToggle] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    const refToggle = useRef<HTMLDivElement>(null);
    const logoutRef = useRef(null);

    useEffect(()=>{
        setFatherToggle(toggle);
        if(ref.current && !toggle){
            const children = ref.current?.getElementsByClassName('item_name');
            const hello_user = ref.current?.getElementsByClassName('hello_text');
            // Set opacity of each child to 0
            for (let i = 0; i < children.length; i++) {
                (children[i] as HTMLElement).style.display = 'none';
            }
            (hello_user[0] as HTMLElement).style.display = 'none';
            logoutRef.current.style.display = 'none';
            ref.current.style.width = "var(--untoggled-side-bar-width)";

        }else{
            const children = ref.current?.getElementsByClassName('item_name');
            const hello_user = ref.current?.getElementsByClassName('hello_text');
            // Set opacity of each child to 0
            if(refToggle.current){
                refToggle.current.style.pointerEvents = 'none';
            }
            if(children && ref.current && hello_user && logoutRef.current){
                setTimeout(() => {
                    for (let i = 0; i < children.length; i++) {
                        (children[i] as HTMLElement).style.display = '';
                    }
                    (hello_user[0] as HTMLElement).style.display='';
                    if(refToggle.current){
                        refToggle.current.style.pointerEvents = '';
                    }
                    logoutRef.current.style.display = '';
                }, 300);
                ref.current.style.width = "var(--toggled-sibe-bar-width)";
            }
        }
    },[toggle]);

    //Abaixo é a logica de focar o elemento

    interface ActionToFocus{
        clicked_item:HTMLElement;
    }

    interface FocusedElement{
        previous_focused?:HTMLElement;
        focused?:HTMLElement;
        previous_focused_feature?:string;
        focused_feature?:string;
    }

    const item_focus_reducer = (state:FocusedElement,action:ActionToFocus):FocusedElement=>{
        if(action.clicked_item.getElementsByTagName('p')[0]){
            setFocusedFeature(action.clicked_item.getElementsByTagName('p')[0].innerText);
        }
        else if(action.clicked_item.getElementsByClassName('item_name')[0]){
            setFocusedFeature(action.clicked_item.getElementsByClassName('item_name')[0].innerText);
        }
        return{
            previous_focused:state.focused,
            focused:action.clicked_item,
            focused_feature: action.clicked_item.innerText,
            previous_focused_feature: state.focused_feature
        }

    }

    const [clickedItem,dispatch] = useReducer(item_focus_reducer,{});

    const firstFeatureRef = useRef(null);

    useEffect(()=>{
        console.log(clickedItem);
        if(firstFeatureRef.current){
            const children = firstFeatureRef.current.getElementsByClassName('circle');
            (children[0] as HTMLElement).style.backgroundColor = 'var(--skyler-blue)';
            (children[0] as HTMLElement).style.color= 'white';
            dispatch({'clicked_item':firstFeatureRef.current})
            firstFeatureRef.current=null;
        }

        if(clickedItem.focused){
            console.log(clickedItem.focused)
            const children = clickedItem.focused.getElementsByClassName('circle');
            (children[0] as HTMLElement).style.backgroundColor = 'var(--skyler-blue)';
            (children[0] as HTMLElement).style.color= 'white';
        }
        if(clickedItem.previous_focused && clickedItem.previous_focused!==clickedItem.focused){
            const children = clickedItem.previous_focused.getElementsByClassName('circle');
            (children[0] as HTMLElement).style.backgroundColor = 'var(--deep-white)';
            (children[0] as HTMLElement).style.color= 'var(--skyler-blue)';
        }
    },[clickedItem]);

    return(
        <div ref={ref} className="side_bar">
            <div className="skyler-logo-side-bar">
                <img src={toggle?logo:favicon} alt="" />
            </div>
            <div className="hello_user">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="hello_text">
                    {"Olá " + localStorage.getItem('username')}
                </div>
                <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                <div ref={logoutRef} className="circle logout" onClick={()=>{navigateTo('/logout')}}>
                                    <CiLogout />
                                </div>                        
                                </TooltipTrigger>
                                <TooltipContent className="tooltip">
                                <p>Sair</p>
                                </TooltipContent>
                            </Tooltip>
                </TooltipProvider>
            </div>
            <div className="divider"></div>
            <div className="side_bar_items">
                <div ref={refToggle} className="toggle"
                onClick={()=>setToggle((prev)=>!prev)}>
                    {toggle?<IoIosArrowBack/>:<LuPlus/>}
                </div>
                <ul className={(toggle?"toggled":"")}>
                    <li ref={firstFeatureRef} onClick={(e)=>dispatch({'clicked_item':e.currentTarget})}>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="circle"><FaRegChartBar/></div>
                                </TooltipTrigger>
                                <TooltipContent className="tooltip">
                                <p>{features[0]}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <div className="item_name">
                            {features[0]}
                        </div>
                    </li>
                    <li onClick={(e)=>dispatch({'clicked_item':e.currentTarget})}>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="circle"><GiNotebook/></div>
                                </TooltipTrigger>
                                <TooltipContent className="tooltip">
                                <p>{features[1]}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="item_name">
                            {features[1]}
                        </div>
                    </li>
                    <li onClick={(e)=>dispatch({'clicked_item':e.currentTarget})}>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="circle"><FaStoreAlt/></div>
                                </TooltipTrigger>
                                <TooltipContent className="tooltip">
                                <p>{features[2]}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="item_name">
                            {features[2]}
                        </div>
                    </li>
                    <li onClick={(e)=>dispatch({'clicked_item':e.currentTarget})}>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="circle"><IoPeopleSharp/></div>
                                </TooltipTrigger>
                                <TooltipContent className="tooltip">
                                <p>{features[3]}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="item_name">
                            {features[3]}
                        </div>
                    </li>
                    <li onClick={(e)=>dispatch({'clicked_item':e.currentTarget})}>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="circle"><FaMoneyBillTransfer/></div>
                                </TooltipTrigger>
                                <TooltipContent className="tooltip">
                                <p>{features[4]}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="item_name">
                           {features[4]}
                        </div>
                    </li>
                    <li onClick={(e)=>dispatch({'clicked_item':e.currentTarget})}>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="circle"><BsBank2/></div>
                                </TooltipTrigger>
                                <TooltipContent className="tooltip">
                                <p>{features[5]}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="item_name">
                          {features[5]}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}