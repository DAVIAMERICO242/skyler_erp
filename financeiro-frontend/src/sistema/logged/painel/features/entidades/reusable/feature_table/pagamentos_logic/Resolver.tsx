/* eslint-disable no-var */
import { LoadingButton } from "@/components/ui/LoadingButton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

import { PagamentoForm } from "./PagamentoForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Resolver = ({
    row,
    resolverOpen,
    setResolverOpen}:

    {row:any,
    resolverOpen:any,
    setResolverOpen:any})=>
{

    return(
        <Dialog open={resolverOpen} onOpenChange={setResolverOpen}>

            {!row['situacao'] &&                         
                <DialogTrigger asChild>
                    <LoadingButton loading={false} type="destructive">
                        {`Não resolvido`}
                    </LoadingButton>
                </DialogTrigger>
            }

            {row['situacao']==="parcial" &&             
                <DialogTrigger asChild>
                    <LoadingButton loading={false} type="warning">
                        {`Parcial`}
                    </LoadingButton>
                </DialogTrigger>
            }

            {row['situacao']==="resolvido" &&             
                <DialogTrigger asChild>
                    <LoadingButton loading={false} type="success">
                        {`Resolvido`}
                    </LoadingButton>
                </DialogTrigger>
            }

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Resolver conta</DialogTitle>
                  <DialogDescription>
                  </DialogDescription>
                </DialogHeader>
                <PagamentoForm row={row} setResolverOpen={setResolverOpen}/>
            </DialogContent>
        </Dialog>
    )
}