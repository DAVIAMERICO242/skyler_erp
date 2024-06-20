import styled from "styled-components"
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/LoadingButton";

export const DREFilter = ()=>{
    const [loading,setLoading] = useState(false);
    const filterDRESchema = z.object({
        tipo_data: z.string(),
        data_inicio: z.date(),
        data_fim: z.date()
    });

    const form = useForm<z.infer<typeof filterDRESchema>>({
        resolver:zodResolver(filterDRESchema)
    })

    function onSubmit(values:z.infer<typeof filterDRESchema>){
        alert('submitado')
    }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="w-1/2 flex gap-10 mt-[80px] items-center">
                    <FormField
                        control={form.control}
                        name="tipo_data"
                        render={({ field }) => (
                            <FormItem style={{ marginBottom: '30px',transform:"translateY(-5px)"}}>
                            <FormLabel style={{textWrap:"nowrap"}}>Tipo da data</FormLabel>
                            <FormControl>
                            <Select onValueChange={(value) => { field.onChange(value); }}>
                                <SelectTrigger className="w-[100%]">
                                    <SelectValue placeholder={"Escolher"}/>
                                </SelectTrigger>
                                <SelectContent {...field }>
                                    <SelectItem value={"pagamento"}>Pagamento</SelectItem>
                                    <SelectItem value={"competencia"}>Competência</SelectItem>
                                    <SelectItem value={"vencimento"}>Vencimento</SelectItem>
                                </SelectContent>
                            </Select>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="data_inicio"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Início"}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild className="w-[100%]">
                                    <FormControl >
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Selecione uma data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start" >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                        date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="data_fim"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Fim"}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild className="w-[100%]">
                                    <FormControl >
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Selecione uma data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start" >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                        date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <LoadingButton
                            className="translate-y-[-4px]"
                            loading={loading}
                            type="skyler">{"Aplicar filtro"}
                        </LoadingButton>
                    </div>
            </form>

        </Form>
    )



}