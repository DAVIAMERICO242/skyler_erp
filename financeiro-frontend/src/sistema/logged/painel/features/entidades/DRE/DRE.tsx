import { FeatureTitle } from "../reusable/FeatureTitle"
import { DRETable } from "./DRETable"
import { DREProvider } from "./DREContext"
import { DREUI } from "./DREUI"

export const DRE = ()=>{
    return(
        <DREProvider>
            <FeatureTitle>DRE</FeatureTitle>
            <DREUI/>
        </DREProvider>
    )
}