import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import { Env, EnvironmentSwitch } from './environmentSwitch';
import { SwitchableKubernetesCluster } from './switchableKubernetesCuster';
import { SwitchableRedisCache } from './switchableRedisCache';
import { SwitchableKeyVault } from './switchableKeyVault';
import { RedisCacheConfig } from './.gen/providers/azurerm/redis-cache';
import { AzurermProvider, KeyVaultConfig, KubernetesClusterConfig, KubernetesClusterDefaultNodePool, KubernetesClusterServicePrincipal, ResourceGroup, ResourceGroupConfig } from '@cdktf/provider-azurerm';


class DemoStack extends TerraformStack {
    constructor(scope: Construct, name: string) {
        super(scope, name);

        new AzurermProvider(this, 'AzureRm', {
            features: [{}]
        })

        const LOCATION = 'northeurope'
        const RG_NAME = 'hdemo'
        const AKS_NAME = 'hdemo'
        const AKS_DNS_PREFIX = 'hdemo'

        // Resource Group --------------------------------------------------------------------

        const rgConfig: ResourceGroupConfig = {
            location: LOCATION,
            name: RG_NAME
        }
        const rg = new ResourceGroup(this, 'rg', rgConfig)

        // Azure Redis -----------------------------------------------------------------------

        const rcConfig: RedisCacheConfig = {
            location: LOCATION,
            name: 'hdemoredisCC',
            resourceGroupName: RG_NAME,
            capacity: 2,
            family: 'C',
            skuName: 'Standard',
            dependsOn: [rg],

        }
        new SwitchableRedisCache(this, 'redis', rcConfig)


        // Key Vault -------------------------------------------------------------------------

        const kvConfig: KeyVaultConfig = {
            location: LOCATION,
            name: 'keyVaulthdemo',
            resourceGroupName: RG_NAME,
            skuName: 'standard',
            tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
            dependsOn: [rg]
        }
        new SwitchableKeyVault(this, 'keyvault', kvConfig)


        // AKS -------------------------------------------------------------------------------

        const pool: KubernetesClusterDefaultNodePool = {
            name: 'default',
            vmSize: 'Standard_D2_v2',
            nodeCount: 1
        }

        const ident: KubernetesClusterServicePrincipal = {
            clientId: process.env.AZ_SP_CLIENT_ID as string,
            clientSecret: process.env.AZ_SP_CLIENT_SECRET as string
        }

        const k8sconfig: KubernetesClusterConfig = {
            dnsPrefix: AKS_DNS_PREFIX,
            location: "westeurope",
            name: AKS_NAME,
            resourceGroupName: rg.name,
            servicePrincipal: [ident],
            defaultNodePool: [pool],
            dependsOn: [rg]
        };

        new SwitchableKubernetesCluster(this, 'k8scluster', k8sconfig)
    }
}

const app = new App();
new DemoStack(app, 'typescript-azurerm-k8s')
EnvironmentSwitch.enable(app, Env.DEV)
app.synth();