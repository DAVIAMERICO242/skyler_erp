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
import {
Form,
FormControl,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Resolver = ({
    row,
    resolverOpen,
    setResolverOpen}:

    {row:any,
    resolverOpen:any,
    setResolverOpen:any})=>
{
    const inputSchema = z.object({
        valor: z.coerce.number().max(row['valor'],
            {message:"O valor de resolução ultrapassa o valor exigido"}
        ),
        });
    var form = useForm<z.infer<typeof inputSchema>>({
        resolver: zodResolver(inputSchema),
        });
    
    function onSubmit(value: z.infer<typeof inputSchema>){
        console.log("VALOR DE RESOLUÇÃO");
        console.log(value)
        console.log('VALOR REQUISITADO');
        console.log(row['valor']);
        setResolverOpen(false);
    }

    console.log('ROW CLICADA');
    console.log(row);

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
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Form {...form}>
                        <FormField
                        control={form.control}
                        name="valor"
                        render={({ field }) => (
                            <FormItem style={{ marginBottom: '30px' }}>
                            <FormLabel>Valor de resolução (máximo: {row['valor']})</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Ex: 999.90"/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </Form>
                    <LoadingButton
                        loading={false}
                        className="w-[100%]"
                        type="neutral">{"Confirmar"}
                    </LoadingButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}