import { FeatureTitle } from "../reusable/FeatureTitle"
import { DRETable } from "./DRETable"
import { DREProvider } from "./DREContext"

export const DRE = ()=>{
    return(
        <DREProvider>
            <FeatureTitle>DRE</FeatureTitle>
            <DRETable/>
        </DREProvider>
    )
}