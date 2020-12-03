import { RedisCache, RedisCacheConfig } from "@cdktf/provider-azurerm";
import { Construct } from "constructs";
import { Env } from "./environmentSwitch";
import { SwitchableTerraformResource } from "./switchableTerraformResource";

export class SwitchableRedisCache extends RedisCache implements SwitchableTerraformResource {

    constructor(scope: Construct, id: string, config: RedisCacheConfig) {         
        super(scope, id, config);
    }
    
    public switchEnvironment(env: Env): void {
        this.enableNonSslPort = true
        this.family = "C"
        switch (env) {
            case Env.DEV: 
                this.skuName = "Basic"             
                break
            case Env.PROD:
                this.skuName = "Standard"
                break
            case Env.DEFAULT:
        }
    }
}