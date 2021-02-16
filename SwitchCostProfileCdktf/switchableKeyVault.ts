import { KeyVault, KeyVaultConfig } from './.gen/providers/azurerm/key-vault';
import { Construct } from "constructs";
import { Env } from "./environmentSwitch";
import { SwitchableTerraformResource } from "./switchableTerraformResource";

export class SwitchableKeyVault extends KeyVault implements SwitchableTerraformResource {

    constructor(scope: Construct, id: string, config: KeyVaultConfig) {         
        super(scope, id, config);
    }
    
    public switchEnvironment(env: Env): void {
        switch (env) {
            case Env.DEV: 
                this.skuName = "standard"
                this.softDeleteEnabled = false
                break
            case Env.PROD:
                this.skuName = "premium"
                this.softDeleteEnabled = true
                break
            case Env.DEFAULT:
                this.skuName = "standard"
                this.softDeleteEnabled = false
        }
    }
}