import { Construct } from "constructs";
import { KubernetesCluster, KubernetesClusterConfig } from "./.gen/providers/azurerm";
import { Env } from "./environmentSwitch";
import { SwitchableTerraformResource } from "./switchableTerraformResource";

export class SwitchableKubernetesCluster extends KubernetesCluster implements SwitchableTerraformResource {

    constructor(scope: Construct, id: string, config: KubernetesClusterConfig) {         
        super(scope, id, config);
    }
    
    public switchEnvironment(env: Env): void {
        switch (env) {
            case Env.DEV: 
                this.skuTier = "Free"
                break
            case Env.PROD:
                this.skuTier = "Paid"
                break
            case Env.DEFAULT:
        }
    }
}