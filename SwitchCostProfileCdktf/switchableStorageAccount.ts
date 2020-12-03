import { StorageAccount, StorageAccountConfig } from "@cdktf/provider-azurerm";
import { Construct } from "constructs";
import { Env } from "./environmentSwitch";
import { SwitchableTerraformResource } from "./switchableTerraformResource";

export class SwitchableStorageAccount extends StorageAccount implements SwitchableTerraformResource {

    constructor(scope: Construct, id: string, config: StorageAccountConfig) {         
        super(scope, id, config);
    }
    
    public switchEnvironment(env: Env): void {
        switch (env) {
            case Env.DEV: 
                this.accountReplicationType = "LRS"
                this.accessTier = "Cool"
                break
            case Env.PROD:
                this.accountReplicationType = "RAGZRS"
                this.accessTier = "Hot"
                break
            case Env.DEFAULT:
                this.accountReplicationType = "ZRS"
                this.accessTier = "Hot"
        }
    }
}