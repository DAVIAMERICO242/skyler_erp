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
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { useState, useRef,useEffect} from "react";
import { useNavigate} from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import './css/side_bar.css';
import logo from '../../../../public/skyler.png';
import favicon from '../../../../public/skyler-favicon.png';
import { CircleSideBar } from "@/components/ui/circleSideBar";
import { Link } from "react-router-dom";

export const SideBar = ({features,featuresToPARAM,focusedFeature,setFocusedFeature, setFatherToggle}: 
    {features: string[],
    featuresToPARAM:{[key:string]:string},
    focusedFeature:string,
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

    const handle_click = (e):void=>{
        
        const target = e.currentTarget

        if(target.getElementsByTagName('p')[0]){
            setFocusedFeature(target.getElementsByTagName('p')[0].innerText);
        }
        else if(target.getElementsByClassName('item_name')[0]){
            setFocusedFeature(target.getElementsByClassName('item_name')[0].innerText);
        }

    }


    return(
        <div ref={ref} className="side_bar">
            <div className="skyler-logo-side-bar">
                <img src={toggle?logo:favicon} alt="" />
            </div>
            <div className="hello_user">
                <Avatar>
                    <AvatarImage src="" alt="@shadcn" />
                    <AvatarFallback>
                        {localStorage.getItem('username')?.toLocaleUpperCase().slice(0,2)}
                    </AvatarFallback>
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
                    <li onClick={handle_click}>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleSideBar focused={focusedFeature===features[0]}>
                                        <FaRegChartBar/>
                                    </CircleSideBar>
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
                    <li onClick={handle_click}>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleSideBar focused={focusedFeature===features[1]}>
                                        <GiNotebook/>
                                    </CircleSideBar>
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
                    <li onClick={handle_click}>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleSideBar focused={focusedFeature===features[2]}>
                                        <FaStoreAlt/>
                                    </CircleSideBar>
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
                    <li onClick={handle_click}>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleSideBar focused={focusedFeature===features[3]}>
                                        <BsBank2/>
                                    </CircleSideBar>
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
                    <li onClick={handle_click}>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleSideBar focused={focusedFeature===features[4]}>
                                        <FaMoneyBillTransfer/>
                                    </CircleSideBar>
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
                </ul>
            </div>
        </div>
    )
}