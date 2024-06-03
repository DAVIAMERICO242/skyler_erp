import { FeatureTitle } from '../reusable/FeatureTitle';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Gerenciar } from '../reusable/Gerenciar';
import { ContasForm } from './ContasForm';

import { TerceirosProvider } from '../Terceiros/Terceiros';
import { CategoriasFiscaisProvider } from './local-contexts/categorias_fiscais-context';
import { ContasProvider } from './local-contexts/contas-context';

export const Contas = ()=>{
    return(
            <CategoriasFiscaisProvider>
                <ContasProvider>
                    <TerceirosProvider>
                        <FeatureTitle>Contas</FeatureTitle>
                        <Tabs defaultValue="cadastro" className="space-y-8 2xl:w-[30%] md:w-[45%] sm:w-[55%] w-[80%] mt-[5%]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
                            <TabsTrigger value="gerenciar">Gerenciar</TabsTrigger>
                        </TabsList>
                        <TabsContent value="cadastro">
                            <ContasForm edit={false}/>
                        </TabsContent>
                        <TabsContent value="gerenciar">
                            <Gerenciar author="contas"/>
                        </TabsContent>
                        </Tabs>
                    </TerceirosProvider>
                </ContasProvider>
            </CategoriasFiscaisProvider>
    )
}