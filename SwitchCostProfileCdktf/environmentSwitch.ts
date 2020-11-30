import { App } from "cdktf";
import { IAspect, IConstruct, Node } from "constructs";
import { SwitchableTerraformResource } from "./switchableTerraformResource";

export enum Env {
    DEFAULT,
    DEV, 
    PROD
  }
  
  export class EnvironmentSwitch implements IAspect {

    private _env: Env;

    constructor(env: Env) {
      this._env = env
    }

    public visit(node: IConstruct): void {
      if (this.instanceOfSwitchableTerraformResource(node)) {
        node.switchEnvironment(this._env)
      }
    }

    public static enable(app: App, env: Env) {
        Node.of(app).applyAspect(new EnvironmentSwitch(env));
    }
    
    private instanceOfSwitchableTerraformResource(object: any): object is SwitchableTerraformResource {
        return 'switchEnvironment' in object;
    }
}
  
  