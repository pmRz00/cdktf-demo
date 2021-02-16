

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## About <a name = "about"></a>

This repo serves for some simple demo purposes of cdktf - Terraform Cloud Development Kit.
Follwing this GEtting started guide if you wanto to learn get started with CDKTF and Python.
If you want to see a more advanced example that illustrates how to use CDK Aspects in CDKTF in combination with polymorphic objects check out the [SwitchableTerraformResource Example](https://github.com/pmRz00/cdktf-demo/tree/master/SwitchCostProfileCdktf).
<br />
<br />

## Prerequisites <a name = "prerequisites"></a>

 - Terraform >= v0.12 [installation instructions](https://learn.hashicorp.com/tutorials/terraform/install-cli)
 - Node.js >= v12.16 [installation instructions](https://nodejs.org/en/download/)
 - Yarn >= v1.21 [installation instructions](https://classic.yarnpkg.com/en/docs/install)
 - Whatever programming language you want to use like Python&pip, JDK, etc. 
<br />
<br /> 

## Getting Started <a name = "getting_started"></a>


### Installing CDKTF

 - Clone this repository
 - Install cdktf

```
$ npm install --global cdktf-cli
```

or if you want the latest experimental version:

```
$ npm install --global cdktf-cli@next
```
<br />

### Verify installation
 Verify that  installation works by opening a new terminal session and running the cdktf command to show available subcommands.

 ```
$ cdktf --help
```
<br />

### Initialize project
We start by creating and switching to a new folder like ```HelloCdktfWithPython```. Then we need to initialize a new project. We choose the programming language with the  ```--template``` parameter. In our case we choose "python".

For that we use th cdkt init subcommand.
Run help on that subcommand to see the available options.

```
cdktf init --help
```

We are also going to make use of the ```--local``` parameter to store the state file locally for simplicity.

```
cdktf init --local --template=python --project-name "HelloCdktfWithPython"
```

The output should contain a line saying "```Your cdktf Python project is ready!```"

```init``` generates a couple of files for example ```main.py```  and ```cdktf.json```. The latter one is the CDK configuration file, where we now have to add some things like the Azure provider and a prebuilt AKS Terraform module.
<br />
<br />

### Generate constructs
Set the Azure provider and the AKS module in the ```cdktf.json``` configuration file like this:

```
{
  "language": "python",
  "app": "pipenv run python main.py",
  "terraformProviders": ["azurerm@~> 2.0.0"],
  "terraformModules": ["Azure/aks/azurerm"],
  "codeMakerOutput": "imports"
}
```

We are going to make use of a prebuilt Terraform module for Aks.
For more information on that see [the Terraform registry page](https://registry.terraform.io/modules/Azure/aks/azurerm/latest).

Next, we need to generate the Azure provider construct and the AKS module by invoking ```cdktf get```.

```
cdktf get
```
The output should be:

```
Generated python constructs in the output directory: imports
```

### Set up Azure
First make sure you are logged in to Azure.

```
az login
```

As a next step we need to set up an Azure Service Principle.

```
az ad sp create-for-rbac -n "MyCdktfApp"
```

In the output find the ```appid``` and ```password``` values and set the following environment variables

```
export SP_CLIENT_APP_ID=[appid]
export SP_CLIENT_APP_SECRET=[password]
```

Since we are going to use a module for AKS we need to make sure a resource group has been created before we run ```cdktf synth```.

```
az group create -n "cdktf_rgr" -l "West Europe"
```

### Set up the CDKTF App
Please have a look at the generated main.py file. This file currently does not deploy any Azure resources.
There is a placeholder saying ```# define resources here```. And that is what we are going to do next.
Replace the content of the main.py file with code below.
Now you can see that we have defined at least 1 resource. It's the Aks module. And that is actually all we need to deploy the AKS cluster.

```
#!/usr/bin/env python
import os
from constructs import Construct
from cdktf import App, TerraformStack, TerraformOutput
from imports.azurerm import AzurermProvider, ResourceGroup
from imports.Azure.aks.azurerm import Aks

class MyStack(TerraformStack):
    def __init__(self, scope: Construct, ns: str):
        super().__init__(scope, ns)

        AzurermProvider(self, "Azure", features=[{}])
        aks_cluster = Aks(self, "AKS", resource_group_name="cdktf_rg", prefix="akscdktftostille-42f2",            
            client_id=os.environ['SP_CLIENT_APP_ID'],
            client_secret=os.environ['SP_CLIENT_APP_SECRET'])

app = App()
MyStack(app, "HelloCdktfWithPython")
app.synth()
```

Now it is time to run ```cdktf synth```. The output will look like

```
Generated Terraform code in the output directory: cdktf.out
```

Have a look at the terraform code that has been generated.
If all looks fine then run

```
cdktf deploy
```

and confirm with ```yes```.

Finally the AKS cluster will be deployed and the output looks similar to 

```
Deploying Stack: HelloCdktfWithPython
Resources
 ✔ module.HelloCdktfWithPython_AKS_50BD9D1C.azurerm_kubernetes_cluster.main
 ~ module.HelloCdktfWithPython_AKS_50BD9D1C.azurerm_log_analytics_solution.main[0]
 ~ module.HelloCdktfWithPython_AKS_50BD9D1C.azurerm_log_analytics_workspace.main[0]
 ~ module.HelloCdktfWithPython_AKS_50BD9D1C.module.ssh-key.local_file.private_key[0]
 ~ module.HelloCdktfWithPython_AKS_50BD9D1C.module.ssh-key.tls_private_key.ssh
```


## Authors <a name = "authors"></a>

- [@pmrz00](https://github.com/pmRz00) - Idea & Initial work

See also the list of [contributors](https://github.com/hashicorp/terraform-cdk/graphs/contributors) who participated in the CDKTF project.

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Hat tip to anyone whose code was used
- Inspiration
- References
