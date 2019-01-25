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
	
    <div id="hgroup">
      <h1><a href=""><img src="images/bradesco2.png" alt="Logo" height="42px" width="243px"></a></h1>
    </div>
	<div id="hgroup">
      <h1><a href=""><img src="images/Portal.jpg" alt="Logo" padding-left="20px" height="70px" width="180px"></a></h1>
    </div>
	

    <form action="#" method="post">
	  
	  
      <fieldset>
        <legend>Search:</legend>
        <input type="text" value="Search Our Website&hellip;" onFocus="this.value=(this.value=='Search Our Website&hellip;')? '' : this.value ;">
        <input type="submit" id="sf_submit" value="submit">
      </fieldset>
    </form>
    <nav>
      <ul>        
		<li><a href='javascript:;'>Dashboard</a></li>
		<li><a href='javascript:;' onclick='createNewWork()'>Nova Cotacao</a></li>
		<li><a href='javascript:;' >Alteracao Catacao</a></li>
		<li><a href='javascript:;' onclick='myFunction()'>My Work</a></li>
        <!-- <li><a href="tlink1.html">New Work</a></li>-->
        
        
      </ul>
    </nav>


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