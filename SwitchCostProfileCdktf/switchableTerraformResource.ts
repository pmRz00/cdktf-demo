import { Env } from "./environmentSwitch";

export interface SwitchableTerraformResource {
    switchEnvironment(env: Env):void;
}