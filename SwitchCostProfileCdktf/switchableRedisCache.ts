import { RedisCache, RedisCacheConfig } from "@cdktf/provider-azurerm";
import { Construct } from "constructs";
import { Env } from "./environmentSwitch";
import { SwitchableTerraformResource } from "./switchableTerraformResource";

export class SwitchableRedisCache extends RedisCache implements SwitchableTerraformResource {

    constructor(scope: Construct, id: string, config: RedisCacheConfig) {         
        super(scope, id, config);
    }
    
    public switchEnvironment(env: Env): void {
        
        switch (env) {
            case Env.DEV: 
                this.skuName = "Basic"
                this.enableNonSslPort = true            
                break
            case Env.PROD:
                this.skuName = "Standard"
                this.enableNonSslPort = false
                break
            case Env.DEFAULT:
        }
    }
}