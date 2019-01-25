<html>
<head>
<link rel="stylesheet" href="styles/layout.css" type="text/css">
<script src="js/PegaInternetApplicationComposer.js"></script>
<!--Uncomment the line below  to view client logs-->
<!--<script src="PegaInternetApplicationComposerLog.js"></script>-->

<script>
	pega.web.config.gatewayURL = "http://10.205.104.142/prweb";
	pega.web.config.systemID = "PEGA_DEV";
	pega.web.config.appName = "LabArq";
	pega.web.config.thread = "STANDARD";
	pega.web.config.encrypt=false;
</script>
</head>
<script>

function clickGadgetA()
{
//alert("cancelled");
document.getElementById("ILACaseCreation").style.display = "none";
document.getElementById("GadgetA").style.display = "block";
pega.web.api.doAction("GadgetA", "load");

}

function createNewWork()
{
//alert("Before Loading");
	document.getElementById("GadgetA").style.display = "none";
	document.getElementById("ILACaseCreation").style.display = "block";	
	pega.web.api.doAction("ILACaseCreation", "load");

}

function cancelILACaseCreation()
{
document.getElementById("ILACaseCreation").style.display = "none";
document.getElementById("GadgetA").style.display = "block";
pega.web.api.doAction("GadgetA", "load");
}

</script>
<div id="banner">
    <div id="banner-content">
    </div>
  </div>
  <div id="main-content">
  </div
<div class="wrapper row1">
<header id="header" class="clear">	 
<head><br/>
<metahttp-equiv="content-type"content="text/html; charset=utf-8"><br/>
<title>Pega Web Mashup Page</title><br/>
</head><br/>
</header>
<body>
<!--<input type="submit"  value="Create Work" onclick="createNewWork()">-->
<div id="GadgetA"
	style="overflow:auto"
	data-pega-gadgetname="GadgetA"
	data-pega-resizetype="stretch"	
	data-pega-action="display"
	data-pega-action-param-classname="Data-Portal"
	data-pega-harnessName="pyMyWorklist"
	data-pega-action-param-model=""
	data-pega-isreadonly="true"
	data-pega-action-param-parameters={UserIdentifier:"guilherme.valino",Password:"GuiAli25"}
>
	
	<script>  
	var GadgetA = {
			actionDefinitions: [  
			{
             	 	action: "openAssignment",
                    	target: {
					type: "_self"
				}
           	},
			{
             	 	action: "confirm",
                    	actionMapping: "refresh"
           	},
			{
             	 	action: "closed",
                    	actionMapping: "refresh"
           	}
          	]
	};
	</script>  

	
</div>
</body>
</html>