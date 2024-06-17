import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import styled from "styled-components";

const ReceberHojeContainer = styled.div`
    color:white;
    height:300px;
    border-radius:5px;
    display:flex;
    align-items:center;
    flex-direction:column;
    justify-content:center;
    background-color:rgb(95, 239, 85);
    transition:all 0.2s ease;
    box-shadow: rgba(90, 241, 102, 0.25) 0px 50px 100px -20px, rgba(26, 211, 84, 0.3) 0px 30px 60px -30px;
    &:hover{
        cursor:pointer;
        transform: scale(1.2); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
    }
    >h1{
        font-size:40px;
    }
    >h2{
        font-size:20px;
    }
    >div{
        font-size:14px;
    }
`
export const ReceberHoje = ()=>{
    return(
        <Dialog>
            <DialogTrigger className="w-full">
                <ReceberHojeContainer>
                    <h2>A receber hoje</h2>
                    <h1>R$ 6559.6</h1>
                </ReceberHojeContainer>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>A receber hoje</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
