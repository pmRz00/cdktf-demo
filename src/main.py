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
