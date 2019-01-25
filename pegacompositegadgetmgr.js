//<script>
try {
  if (typeof (pega.web.mgr) == "undefined")
    var bPegaIacInitialOnLoad = true;
  else
    var bPegaIacInitialOnLoad = false;
}
catch (e) {
  var bPegaIacInitialOnLoad = true;
}

// Make sure global bEncryptURLs variable is defined.
if (typeof (bEncryptURLs) == 'undefined') {
  var bEncryptURLs = true;
}

// This if statement protects the rest of this JS file from repeat inline processing
// occurring due to errors/issues in evaldomscripts. The closing brace is at the bottom.

var bPegaIacGadgetsInitialized = false;

if (bPegaIacInitialOnLoad) {
  var p_w_eval_1 = "";
  var p_w_eval_2 = "";
  var p_w_eval_3 = "";
  var p_w_eval_4 = "";
  var p_w_window = null;

  /*
     @private
     Intialize all gadget manager objects.
     @return $void$
     */
  function _initAllPegaObjects() {
      if(pega && pega.web && pega.web.isWebMashup){
        if (!bPegaIacInitialOnLoad) {
          pega.web.mgr._updateGadgets();
          return;
        }
        bPegaIacInitialOnLoad = false;
        pega.web.mgr._initLog();
        pega.web.mgr._logMsg("info", "", "Manager", "Started Pega IAC manager intialization.");
        /*BUG-270078 Logic to detect cookie enabled or not*/
        pega.web.mgr._ut._setCookie("PegaIAC", "IACtest", 1);
        if (pega.web.mgr._ut._readCookie("PegaIAC") != "IACtest") {
          pega.web.mgr.cookiesDisabled = true;					// cookies are disabled
          pega.web.mgr._logMsg("error", "", "Manager", "error: Browser cookies must be enabled for Pega IAC to function.");
        }

        bEncryptURLs = false;

        pega.web.mgr._initGadgets(window);
        bPegaIacGadgetsInitialized = true;
        return;
      }

    try {
      /* Start Benchmark for Portal */
      if (typeof bRecordEvent != "undefined" && bRecordEvent) {
        uwtUserStart = new Date().getTime();
      }
      /* End Benchmark for Portal */

      // Re-sync case

      if (!bPegaIacInitialOnLoad) {
        pega.web.mgr._updateGadgets();
        return;
      }


      // Initialize log if the implementation is present.
      bPegaIacInitialOnLoad = false;
      if (typeof (bUseOriginalResize) != "undefined")
        pega.web.mgr._bUseHarnessResizeAPI = false;
      pega.web.mgr._initLog();
      pega.web.mgr._logMsg("info", "", "Manager", "Started Pega IAC manager intialization.");

      // Test whether browser cookies are disabled.
      // BUG-167867 Bypass cookie detection if encryption is false .
      if (pega.web.config.encrypt) {
        pega.web.mgr._ut._setCookie("PegaIAC", "IACtest", 1);
        if (pega.web.mgr._ut._readCookie("PegaIAC") != "IACtest") {
          pega.web.mgr.cookiesDisabled = true;					// cookies are disabled
          pega.web.mgr._logMsg("error", "", "Manager", "error: Browser cookies must be enabled for Pega IAC to function.");
          pega.web.mgr._initGadgets(window);
          return;
        }
        else {
          pega.web.mgr._logMsg("info", "", "Manager", "Passed test: client browser cookies enabled.");
          pega.web.mgr._ut._setCookie("PegaIAC", "", 0);	// blank out test cookie
        }
      }
      // Get reference to the property conversion utility object.
      if (typeof pega.ui.property == 'function') {
        pega.web.mgr._prop = new pega.ui.property();
      } else {
        pega.web.mgr._prop = pega.ui.property;
      }

      // Initialize encryption cookie using JSESSIONID.
      pega.web.mgr._sPegaCookie = pega.web.mgr._ut._readCookie("JSESSIONID");

      // Ping the gateway, wait for the gateway response to complete the initialization.
      // In direct PRPC case ping anyway to verify that the gateway is not present.

      pega.web.mgr._pingGateway();

    } catch (e) {
    }
  }



  function _completePegaObjectsInit() {

    // Initialize gadgets on the page using methods of the manager implementation.
    if (pega.web.mgr._bIsProxy) {
      pega.web.mgr._oMgrImpl = oWin.pega.web.mgr;
      pega.web.mgr._oMgrImpl._initGadgets(window);
    }
    else {
      pega.web.mgr._initConfig();
      pega.web.mgr._initGadgets(window);
    }

    bPegaIacGadgetsInitialized = true;
  }

  // Define name spaces and register the initialization callback.
  try {
    pega.t = pega.namespace("pega.tools");
    pega.web = pega.namespace("pega.web");
    pega.ui = pega.namespace("pega.ui");

    if (typeof (pega.u) != "undefined" && typeof (pega.u.d) != "undefined") {
      pega.u.d.attachOnload(_initAllPegaObjects, true);
    }
    else {
      pega.util.Event.addListener(window, "load", _initAllPegaObjects, null, false);
      window.addEventListener("WebComponentsReady",function(e){
        _initAllPegaObjects();
       
      });
    }
  }
  catch (e) {
  }

  /* Public APIs available to customer JS */
  pega.web.apiSingleton = function() {
  };

  pega.web.DataBinder = function(){
    var pendingDB = 0;
    var callback,context,args;
    this.incrementMsgCounter = function(){
      pendingDB++;
    };
    this.decrementMsgCounter = function(){
      pendingDB--;
      this.executeCallback();
    };
    this.registerCallback = function(funObj, scope, params){
      callback = funObj;
      context = scope;
      args = params;
    };
    this.executeCallback = function(){
      if(pendingDB == 0 && callback){
        callback.call(context, args);
      }
    };
  };

  pega.web.apiSingleton.prototype = {
    /*
         @api
         Direct gadget to perform one of the supported by PRPC actions
         @param $String$sGdtId	- gadget id.
         @param $String$sAction	- action name.
         @return $action_result$
         */
    doAction: function(sGdtId, sAction) {
      //		var oGdt = top.pega.web.mgr._getGadgetByID(sGdtId);
      var oGdt = pega.web.mgr._getGadgetByID(sGdtId);
      if (oGdt == null)
        return;
      return oGdt._doApiAction(sAction, arguments);
    },

        setAuthenticationHeaders: function(sGdtId, headersObj) {
          headersObj =JSON.parse(JSON.stringify(headersObj));
          this.headersObj = this.headersObj || {};
          this.headersObj[sGdtId] = headersObj;
        },

        setAuthenticationParameters: function(sGdtId, paramsObj) {
          paramObj =JSON.parse(JSON.stringify(paramsObj));
          this.paramsObj = this.paramsObj || {};
          this.paramsObj[sGdtId] = JSON.stringify(paramsObj);
        },
    /*
         @api
         Send command to gateway, first example logoff all server accessed in session.
         @param $String$sAction	- command to send to gateway, e.g. 'logoff'
         @param $Boolean$bType	- ASYNC or SYNC
         @return $void$
         */
    doGatewayAction: function(sCommand, bSync, fCallBack) {
      pega.web.mgr._cmdGateway(sCommand, bSync, fCallBack);
    },
    /*
         @api
         Remove named gadget, close IFrame, and drop from the gadget hash table
         @param $String$sGdtId	- gadget id.
         @return $void$
         */
    removeGadget: function(sGdtId) {
      pega.web.mgr._removeGadget(sGdtId);
    },
    /*
         @api
         Initialize new gadget and add to the gadget hash table managed by the manager.
         @param $String$sDivId	- gadget container div element id.
         @param $String$window	- document window.
         @return $void$
         */
    addGadget: function(sDivId, oWin) {
      pega.web.mgr._addGadget(sDivId, oWin);
    },
    /*
         @api
         Update all gadgets embedded into the host web page.
         @return $void$
         */
    updateGadgets: function() {
      pega.web.mgr._updateGadgets();
    }
  }

  /* gadget manager object */
  pega.web.manager = function() {
    this._htGadgets = new pega.tools.Hashtable();
    this._htPopups = new pega.tools.Hashtable();
    this._htInitDivs = null;
    this._sPegaCookie = "NA_xxx";
    this._iPopupTimerID = -1;
    this._ut = new pega.web.utils();
    //Bug-108351 Default this variable to true, in dveeloper portal sometimes DC doesn't set it correctly
    this._bDirectPRPC = true;
    this._bIsProxy = false;
    this._oMgrImpl = null;
    this.gatewayURL = "";
    this.systemID = "";
    this.thread = "";
    this.appName = "";
    this.cookiesDisabled = false;
    this._logMgr = null;
    this._fLogoffCallback = null;
    this._bUseHarnessResizeAPI = true;
  }

    pega.web.serverURLsMap = {

    };

  pega.web.manager.prototype = {
    _initLog: function() {

      // Quit if log implementation not found.
      if (typeof (pega.web.logMgr) == "undefined")
        return;

      // Initialize logging infrastructure and replace _logMsg stub with the implementation.
      this._logMgr = new pega.web.logMgr();
      this._logMgr._logInit();
      this._logMsg = this._logMgr._logMsg;
    },
    _logMsg: function(sType, sGdt, sFunc, sMsg) {
    },
    _initConfig: function() {
      try {

        // In direct PRPC connect case (no gateway) finalize gatewayURL and thread config defaults.
        var thread = pega.web.config.thread;
        var configURL = pega.web.config.gatewayURL;
        if (this._bDirectPRPC) {
          var iB = configURL.search(RegExp("!"));
          if (iB > -1) {
            pega.web.config.gatewayURL = configURL.substr(0, iB)
            if (thread == "")
              pega.web.config.thread = configURL.substring(iB);
          }
        }

        // Synchronize bEncryptURLs variable  with the config object override.
        if (!pega.web.config.encrypt)
          bEncryptURLs = false;
        else
          bEncryptURLs = true;
      }
      catch (e) {
      }
    },
    _resizeCallback: function(sGdtId) {
      try {
        var oGdt = pega.web.mgr._getGadgetByID(sGdtId);
        if (oGdt != null) {
          oGdt._resizeCallback();
        }
        var iframeDoc = iframe.contentWindow || iframe.contentDocument;
        iframeDoc.pega.ui.d.avoidedScrollBars = false;
      } catch (e) {
      }
    },
    _addGadget: function(sDivId, oWin) {
      try {
        var oEl = sDivId;
        if (typeof (sDivId) == "string") {
          var oDoc = oWin.document;
          oEl = oDoc.getElementById(sDivId);
        }
        this._initGadget(oEl, oWin)
        // BUG-79132 GUJAS1 11/02/2012 Replaced attributes[] by call to getAttribute, which is faster.
        this._logMsg("info", oEl.getAttribute("PegaGadget") || oEl.getAttribute("data-pega-gadgetname"), "Manager", "Gadget added for DIV " + oEl.id);
      } catch (e) {
      }
    },
    _removeGadget: function(sGdtId) {
      try {
        var oGdt = pega.web.mgr._getGadgetByID(sGdtId);
        if (oGdt != null) {

          // Drop specified Pega gadgets from manager hashtable.
          var keys = this._htGadgets.keys();
          for (var i = 0; i < keys.length; ++i) {
            var oGt = this._htGadgets.get(keys[i]);
            if (oGt._id == sGdtId) {
              var oDiv = oGt._oDiv;
              oDiv.innerHTML = "";
              oGt.removeGadget();
              this._htGadgets.remove(oGt._id);
              this._logMsg("info", oGdt._id, "Manager", "Gadget removed");
            }
          }
        }
      } catch (e) {
      }
    },
    _initGadget: function(oEl, oWin) {
      if (oEl == null)
        return;
      // BUG-79132 GUJAS1 11/02/2012 Replaced attributes[] by call to getAttribute, which is faster.
      var sGdtId = oEl.getAttribute("PegaGadget") || oEl.getAttribute("data-pega-gadgetname");
      if (sGdtId == null)
        return;

      // If cookies are disabled, show message inside gadget div.
      if (this.cookiesDisabled) {
        var oCD = oWin.document.createElement('div');
        oCD.innerHTML = pega.web.config.cookiesDisabled;
        oEl.appendChild(oCD);
        return;			// skip this gadget
      }

      // Initialize and add this gadget to the hash table of gadgets.
      // BUG-79132 GUJAS1 11/02/2012 Replaced attributes[] by call to getAttribute, which is faster.
      this._logMsg("info", sGdtId, "Manager", "start gadget '" + sGdtId + "' initialization");

      if (this._htGadgets.containsKey(sGdtId)) {
        // BUG-79132 GUJAS1 11/02/2012 Replaced attributes[] by call to getAttribute, which is faster.
        this._logMsg("error", "", "Manager", "error: duplicate PegaGadget attribute '" + sGdtId + "' for DIV '" + oEl.getAttribute("id") + "'");
        return;			// skip this gadget
      }
      try {
        this._htGadgets.put(sGdtId, new pega.web.gadget(oEl, oWin));
        this._logMsg("info", sGdtId, "Manager", "completed gadget '" + sGdtId + "' initialization");
      } catch (e) {
      }
    },
     isCookieConsentRequired: function(oGt){
          var isNeeded = false;
          isNeeded = navigator.userAgent.indexOf("AppleWebKit") != -1 && navigator.userAgent.indexOf("Chrome") == -1 && sessionStorage.getItem(oGt._oConfigDefs.serverURL) != "true" && oGt._oDivAttrs.targetType != "_popup";
          return isNeeded;
        },
        addCookieAcceptanceMessage: function(oGt){
          // This is Mac Safari or IOS Safari or IOS WebKit WebView 
          // Append the cookie message
          var oCD = document.createElement('div');
          oCD.className = "pega-mashup–cookieconsent";
          var consentMarkup = "";
          if(pega.web.config.fnCookieConsentMessage){
            consentMarkup = pega.web.config.fnCookieConsentMessage(oGt._id);
          }else{
            var consentMessage = "";
            if(pega.web.config.strCookieConsentMessage){
              consentMessage = pega.web.config.strCookieConsentMessage;
            }else{
              consentMessage = "This page displays information that requires cookies to be set. Confirm to continue.";
            }
            consentMarkup=consentMessage+"<button onclick='pega.web.mgr.openCookieConsent(\""+ oGt._id  +"\")'> Confirm </button>";
          }
          
          oCD.innerHTML = consentMarkup;
          oGt._oDiv.appendChild(oCD);  
        },
    _initGadgets: function(oWin) {
      p_w_window = oWin;
      var oDoc = oWin.document;

      // Collect all DIVs containing Pega gadgets and initialize gadget manager objects.
      // Do not execute gadget default actions yet. This way manager will be aware of all
      // present gadgets in case any default action causes cross-gadget behavior.
      var colDivs;
      if (Polymer && pega.mashupNode && Polymer.dom(pega.mashupNode.root) ){
          colDivs = [Polymer.dom(pega.mashupNode.root).querySelector('DIV[data-pega-gadgetname]')];
      }
      else if (typeof $ == "undefined") {
        colDivs = window.document.getElementsByTagName("DIV");
      } else {
        colDivs = $('DIV[PegaGadget],DIV[data-pega-gadgetname]');
      }
      var htNewGadgets = new pega.tools.Hashtable();
      //		var o1div = null;
      for (i = 0; i < colDivs.length; ++i) {
        var oEl = colDivs[i];
        // BUG-79132 GUJAS1 11/02/2012 Replaced attributes[] by call to getAttribute, which is faster.
        var gadgetName = oEl.getAttribute("PegaGadget") || oEl.getAttribute("data-pega-gadgetname");
        if (gadgetName != null) {
          var sGdtId = gadgetName;
          try {
            var oGt = this._htGadgets.get(sGdtId);
            if (oGt != null && oGt._oWin == oWin)
              continue;		// prevent duplicate initialization.
          } catch (e) {
          }
          this._initGadget(oEl, p_w_window);
          htNewGadgets.put(sGdtId, sGdtId);
        }
      }

      // Issue http requests for gadgets whose default action requires navigation.
      var keys = htNewGadgets.keys();
            keys.forEach(function(key){
                var oGt = this._htGadgets.get(key);
                if(pega.web.isWebMashup){
                  if(oGt._oConfigDefs.tenantID == "" && oGt._oConfigDefs.redirectGuests == "false"){
                    oGt._oConfigDefs.serverURLWithHash = oGt._oConfigDefs.serverURL;
                    if (oGt._oDivAttrs.action != "") {
                          if (oGt._oDivAttrs.defer == "false"){
                            oGt._doAttrAction();
                          }
                      }
                  }else if(pega.web.serverURLsMap[oGt._oConfigDefs.serverURL] && pega.web.serverURLsMap[oGt._oConfigDefs.serverURL][oGt._oConfigDefs.tenantID]){
                    oGt._oConfigDefs.serverURLWithHash = pega.web.serverURLsMap[oGt._oConfigDefs.serverURL][oGt._oConfigDefs.tenantID];
        if (oGt._oDivAttrs.action != "") {
                      if (oGt._oDivAttrs.defer == "false") {
            oGt._doAttrAction();
        }
      }
                  } else {
                    var url = (oGt._oConfigDefs.serverURL || pega.web.config.gatewayURL)+"?pyActivity=pzGetURLHashes&TenantName="+oGt._oConfigDefs.tenantID;
                    this._loadScript(url, function(){
                      pega.web.serverURLsMap[oGt._oConfigDefs.serverURL] = pega.web.serverURLsMap[oGt._oConfigDefs.serverURL] || {};
                      pega.web.serverURLsMap[oGt._oConfigDefs.serverURL][oGt._oConfigDefs.tenantID] = oGt._oConfigDefs.serverURL + pega.web.config.tempAGHash;
                      oGt._oConfigDefs.serverURLWithHash = oGt._oConfigDefs.serverURL + pega.web.config.tempAGHash;
                      delete pega.web.config.tempAGHash;
                      if (oGt._oDivAttrs.action != "") {
                          if (oGt._oDivAttrs.defer == "false"){
                            oGt._doAttrAction();
                          }
                      }
                    });
                  }
                }else{
                  if (oGt._oDivAttrs.action != "") {
                      if (oGt._oDivAttrs.defer == "false"){
                        oGt._doAttrAction();
                      }
                  }
              }
            },this);


      /*
             if(this._sPegaCookie != "NA_xxx") {
             this._initGadget(oEl, oWin);
             continue;
             }
             if(o1div == null) {
             o1div = oEl;
             continue;
             }
             if(this._htInitDivs == null)
             this._htInitDivs = new pega.tools.Hashtable();
             this._htInitDivs.put(oEl.uniqueID, oEl);
             }
             if(this._sPegaCookie != "NA_xxx")
             return;

             // Initialize first gadget and wait for onLoad event to init remaining gadgets.
             // This is to make sure the pega cookie is present in the HTTP headers on
             // requests to the gateway servlet. This cookie is used for URL encryption.
             if(o1div != null)
             this._initGadget(o1div, oWin);
             */
    },
    /*
         _initGadgetsRest: function() {
         var keys = this._htInitDivs.keys();
         for (var i=0; i<keys.length; ++i) {
         oEl = this._htInitDivs.get(keys[i]);
         this._initGadget(oEl, p_w_window);
         }

         },
         */
    doAction: function() {
      var args = arguments;
      var oDv = args[0];

      if (oDv.pyStreamName)
        pega.ui.pyStreamName = oDv.pyStreamName;

      // oDv is window name string when called from popup, othewise - gadget div reference
      var oGdt = null;
      if (typeof (oDv) == "string") {
        var sID = oDv;
        if (this._htPopups.containsKey(oDv))
          sID = this._htPopups.get(oDv);
        if (this._htGadgets.containsKey(sID))
          oGdt = this._htGadgets.get(sID);
      }
      else if (typeof (oDv) == "object")
        oGdt = this._getGadgetFromDiv(oDv);
      if (oGdt == null)
        return;

      var sAction = args[1];
      return oGdt._doGdtAction(sAction, args);
    },
    _cmdGateway: function(sCmd, bSync, fCallBack) {
      try {
        var cmdCallbackObj = {
          success: this._cmdGatewayCallback,
          failure: this._cmdGatewayCallback
        };

        switch (sCmd.toLowerCase()) {
          case 'logoff':

            // Invoke logoff request to gateway.
            //			pega.util.Connect.asyncRequest("Post", pega.web.config.gatewayURL + pega.web.config.thread,
            pega.util.Connect.asyncRequest("Post", pega.web.config.gatewayURL,
                                           cmdCallbackObj, "pyActivity=PRGatewayLogoff");
            pega.web.mgr._logMsg("info", "", "Manager", "Sent Logoff command to gateway.");
            this._fLogoffCallback = fCallBack;
            break;
        }
      }
      catch (e) {
      }
    },
    _getDocGatewayCookie: function() {
      try {
        var sSessCook = null;
        var aCookie = window.document.cookie.split("; ");

        // Return prGatewaySESSIONID cookie if found, but look for JSESSIONID cookie as an alternative.
        for (var i = 0; i < aCookie.length; i++) {
          var aCrumb = aCookie[i].split("=");
          if ("prGatewaySESSIONID" == aCrumb[0]) {
            return aCrumb[1].toLowerCase();
          }
          else if ("JSESSIONID" == aCrumb[0]) {
            sSessCook = aCrumb[1].toLowerCase();
          }
        }

        // Return JSESSIONID cookie if prGatewaySESSIONIDis not present.
        if (sSessCook != null)
          return sSessCook;
        else
          return "";
      }
      catch (e) {
        return "";
      }
    },
    _buildURLForPing: function(url)
    {
      var originalURL = url;

      //If the threadname was not appeneded, cleaning is not needed, return as it is
      if (url.indexOf("$") == -1)
        return url;
      try
      {
        // Trim the URL upto host name
        index = url.indexOf("!");
        //Remove the system ID as well
        index = url.lastIndexOf("/", index - 2);
        url = url.substring(0, index);
        return url;
      }
      catch (e) {
        return originalURL;
      }

    },
    isSameDomain: function(){
      var baseURL = window.location.href.replace(window.location.pathname,"");
      if(pega.web.config.gatewayURL.indexOf('/') == 0){
        //Relative path
        return true;
      }
      if(pega.web.config.gatewayURL.indexOf(baseURL) == 0){
        //Same Domain
        return true;
      }
      return false;
    },
    _pingGateway: function() {
      if(!this.isSameDomain()){
        this._pingGatewayCallback();
        return;
      }
      try {
        var pingCallbackObj = {
          success: this._pingGatewayCallback,
          failure: this._pingGatewayCallback
        };

        // In the absence of Gateway (direct connect case) PRGatewayPing activity will run and
        // return "GOOD", but not the PRGatewayCookie in the response headers.
        // Bug-116327 ping request should not have any path info, so need to remove appname and thredname, call buidlURLForPing
        var pingUrl = "";
        if (pega.web.config.gatewayURL.indexOf("!") > -1 || pega.web.config.gatewayURL.indexOf("$") > -1) {
          pingUrl = pega.web.mgr._buildURLForPing(pega.web.config.gatewayURL);
        } else {
          if (pega.web.config.gatewayURL.substring(pega.web.config.gatewayURL.length - 1, pega.web.config.gatewayURL.length) == '/') {
            pingUrl = pega.web.config.gatewayURL.substring(0, pega.web.config.gatewayURL.length - 1);
          } else {
            pingUrl = pega.web.config.gatewayURL.substring(0, pega.web.config.gatewayURL.length);
          }
        }
        if (!(pingUrl.indexOf('!') > -1)) {
          //Detect if tenant ID is present
          if ((pingUrl.indexOf('http') > -1) || (pingUrl.indexOf('https') > -1)) {
            var splitUrl = pingUrl.split('/');
            if (splitUrl.length > 5) {
              var tenantID = splitUrl[5];
              if (tenantID != "") {
                //isTenantURL=true;
                if (splitUrl.length > 6) {
                  if (splitUrl[6] == "") {
                    pingUrl = pingUrl + '!STANDARD';
                  }
                } else {
                  if (pingUrl.toLowerCase().indexOf("!standard") == -1)
                    pingUrl = pingUrl + '/!STANDARD';
                }
              }
            }
          } else {
            var splitUrl = pingUrl.split('/');
            if (splitUrl.length > 3) {
              var tenantID = splitUrl[3];
              if (tenantID != "") {
                if (splitUrl.length > 4) {
                  var threadName = splitUrl[4];
                  if (threadName == "") {
                    pingUrl = pingUrl + '!STANDARD';
                  }
                } else {
                  if (pingUrl.toLowerCase().indexOf("!standard") == -1)
                    pingUrl = pingUrl + '/!STANDARD';
                }
              }

            }

          }

        }
        pega.util.Connect.asyncRequest("Post", pingUrl, pingCallbackObj, "pyActivity=PRGatewayPing&dartmouth=true");
        pega.web.mgr._logMsg("info", "", "Manager", "Pinged gateway to find gateway session cookie");
      }
      catch (e) {
      }
    },
    _cmdGatewayCallback: function(o) {
      try {
        var sRT = o.responseText;
        var bSuccess = sRT == "LOGOFF";
        if (pega.web.mgr._fLogoffCallback != null) {
          pega.web.mgr._fLogoffCallback(bSuccess);
        }
        pega.web.mgr._logMsg("info", "", "Gateway", "Completed logoff command.");
      }
      catch (e) {
      }
    },
    _pingGatewayCallback: function(o) {
      try {

        // Start with prGatewaySESSIONID or JSESSIONID cookie from the window.document.
        var sGC = pega.web.mgr._getDocGatewayCookie();
        if (sGC != "") {
          pega.web.mgr._sPegaCookie = sGC;
        }

        // Override _sPegaCookie with the returned by ping prGatewaySESSIONID cookie if any.
        var sC = o.getAllResponseHeaders;
        var iP = sC.indexOf("prGatewaySESSIONID=");
        if (iP >= 0) {

          // The gateway is present.
          pega.web.mgr._bDirectPRPC = false;
          var iB = sC.indexOf("=", iP + 1) + 1;
          var iE = sC.indexOf(";", iB);
          pega.web.mgr._sPegaCookie = (iE > 0) ? sC.substring(iB, iE) : sC.substr(iB);

          pega.web.mgr._logMsg("info", "", "Manager", "Gateway is present in configuration. Found session cookie.");
        }

        else if (sC.indexOf("prGateway:") > -1) {
          pega.web.mgr._bDirectPRPC = false;
          var ck = o.getResponseHeader['prGateway'];
          var len = ck.length;
          if (ck.charCodeAt(len - 1) == "13") {
            ck = ck.substring(0, len - 1);
          }

          pega.web.mgr._sPegaCookie = ck;
        }
        //safari is changing the header "prGateway" to "Prgateway"
        else if (sC.indexOf("Prgateway:") > -1) {
          pega.web.mgr._bDirectPRPC = false;
          var ck = o.getResponseHeader['Prgateway'];
          //response header in safari contains extra new line, so check if last charecter is new line remove it.
          var len = ck.length;
          if (ck.charCodeAt(len - 1) == "13") {
            ck = ck.substring(0, len - 1);
          }
          pega.web.mgr._sPegaCookie = ck;
        }

        else {

          // In a rare case PRWEB node is setup to expect encrypted URL, the response
          // text will not be "GOOD" but still a small stream.
          pega.web.mgr._bDirectPRPC = true;
          var IACNonGatewayKey = "";
          var I=sC.toLowerCase().indexOf("iac-nongateway:");
          if (I >= 0 && pega.web.config.encrypt) {
            var G = sC.indexOf(":", I + 1) + 1;
            var D = sC.indexOf("\r\n", G);
            IACNonGatewayKey = (D > 0) ? sC.substring(G, D) : sC.substr(G).substr(16);
            if (!(IACNonGatewayKey == "" || IACNonGatewayKey == "%22%22" || IACNonGatewayKey == "\"\"")) {
              pega.web.mgr._sPegaCookie = IACNonGatewayKey;
              pega.web.mgr._ut._setCookie("IAC-NonGateway", pega.web.mgr._sPegaCookie, 1);
            }
          }
          if (IACNonGatewayKey == "" || IACNonGatewayKey == "%22%22" || IACNonGatewayKey == "\"\"") {
            var I = sC.indexOf("Pega-RULES=");
            if (I >= 0) {
              var G = sC.indexOf("=", I + 1) + 1;
              var D = sC.indexOf(";", G);
              pega.web.mgr._sPegaCookie = (D > 0) ? sC.substring(G, D) : sC.substr(G);
              pega.web.mgr._ut._setCookie("Pega-RULES", pega.web.mgr._sPegaCookie, 1);
            }
          }
          // Direct PRPC connect case. Make sure JSESSION cookie is already in the headers.
          if (pega.web.mgr._sPegaCookie == "NA_xxx") {
            pega.web.mgr._logMsg("error", "", "Manager", "error: did not find JSESSION to use as the default session cookie.");
            return;
          }
          pega.web.mgr._logMsg("info", "", "Manager", "Gateway is not present in configuration. Use JSESSION for session cookie.");
        }
      } catch (e) {
      }

      _completePegaObjectsInit();



        },
         _loadScript : function(url, callback){
            var script = document.createElement("script")
            script.type = "text/javascript";
            if (script.readyState){  //IE
                script.onreadystatechange = function(){
                    if (script.readyState == "loaded" ||
                            script.readyState == "complete"){
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {  //Others
                script.onload = function(){
                    callback();
                };
            }
            script.src = url;
            document.body.appendChild(script);
    },
    getCookie: function() {
      if (this._sPegaCookie == "NA_xxx")
        this._sPegaCookie = this._getDocGatewayCookie();
      return this._sPegaCookie;
    },
    _getGadgetByID: function(sGdtName) {
      if (this._htGadgets.containsKey(sGdtName))
        return this._htGadgets.get(sGdtName);
      else
        return null;
    },
    _getGadgetFromDiv: function(oDv) {
      if (oDv == null)
        return;
      // BUG-79132 GUJAS1 11/02/2012 Replaced attributes[] by call to getAttribute, which is faster.
      var sGdtId = oDv.getAttribute("PegaGadget") || oDv.getAttribute("data-pega-gadgetname");
      if (sGdtId == null)
        return null;
      // BUG-79132 GUJAS1 11/02/2012 Replaced attributes[] by call to getAttribute, which is faster.
      var oGdt = pega.web.mgr._htGadgets.get(sGdtId);
      /* BUG-62922 : When workarea included in IAC gadget, gadget mgr is getting initialized inside of iframe, so checking for gadget in the outer window if not present in side */
      if (typeof (oGdt) == 'undefined' && window !== window.parent && window.parent.pega && window.parent.pega.web && window.parent.pega.web.mgr && window.parent.pega.web.mgr._htGadgets && window.parent.pega.web.mgr._htGadgets.get) {
        oGdt = window.parent.pega.web.mgr._htGadgets.get(sGdtId);
      }
      if (typeof (oGdt) == 'undefined') {
        this._logMsg("error", sGdtId, "Manager", "Gadget not found.");
        return null;
      }
      return oGdt;
    },
    _updateGadgets: function() {
      if (!bPegaIacGadgetsInitialized)
        return;

      try {
        this._logMsg("info", "", "Manager", "Start re-synchronizing gadgets.");

        // Drop deleted Pega gadgets from manager hashtable.
        var keys = this._htGadgets.keys();
        for (var i = 0; i < keys.length; ++i) {
          var oGt = this._htGadgets.get(keys[i]);
          var gadgetName = oGt._oDiv.getAttribute("PegaGadget") || oGt._oDiv.getAttribute("data-pega-gadgetname")
          // Remove gadget if the DIV no longer present in the document.
          if (oGt._oDiv.parentNode == null) {
            this._logMsg("info", oGt._id, "Manager", "Removing gadget no longer valid or present in the document.");
            this._removeGadget(oGt._id);
          }

          // Remove gadget if the PegaGadget atttribute is missing.
          // BUG-79132 GUJAS1 11/02/2012 Replaced attributes[] by call to getAttribute, which is faster.
          else if (gadgetName == null) {
            this._logMsg("info", oGt._id, "Manager", "Removing gadget with missing 'PegaGadget' attribute.");
            this._removeGadget(oGt._id);
          }
        }

        // Process newly added Pega gadgets.
        var colDivs;
        if (document.querySelector("pega-webmashup")){
          colDivs = [document.querySelector("pega-webmashup").$$("DIV[data-pega-gadgetname]")];
        }
        else if (typeof $ == "undefined") {
          colDivs = window.document.getElementsByTagName("DIV");
        } else {
          colDivs = $('DIV[PegaGadget],DIV[data-pega-gadgetname]');
        }
        for (var i = 0; i < colDivs.length; ++i) {
          var oEl = colDivs[i];
          var sId = oEl.getAttribute("PegaGadget") || oEl.getAttribute("data-pega-gadgetname");
          // BUG-79132 GUJAS1 11/02/2012 Replaced attributes[] by call to getAttribute, which is faster.
          if (sId != null) {
            if (!this._htGadgets.containsKey(sId)) {
              this._logMsg("info", sId, "Manager", "Found new gadget.");
              this._initGadget(oEl, window);
            }
          }
        }
        this._logMsg("info", "", "Manager", "Done re-synchronizing gadgets.");
      } catch (e) {
      }
    },
    _iPopupTracker: function() {
      var keys = this._htPopups.keys();
      for (var i = 0; i < keys.length; ++i) {
        var sID = this._htPopups.get(keys[i]);
        var oGt = this._htGadgets.get(sID);
        if (oGt == null)
          return;

        // If tracked popup window is closed, remove it from the hashtable.
        try {
          if (oGt._oPopWin.closed) {
            this._htPopups.remove(keys[i]);

            // Stop window tracking timer if no popups left to track.
            if (keys.length == 1) {
              window.clearInterval(this._iPopupTimerID);
              this._iPopupTimerID = -1;
            }

            // Invoke 'closed' command for the gadget used to anchor closed popup.
            oGt._doGdtAction('closed', "");
          }
        } catch (e) {
        }
      }
    },
    _getActionMappingName: function(nameToBeMapped)
    {

      switch (nameToBeMapped.toLowerCase()) {
        case "openbyassignment":
          return "openAssignment";
          break;
        case "openbyworkhandle":
          return "openWorkByHandle";
          break;
        case "openbyworkitem":
          return "openWorkItem";
          break;
        case "enternewworkfromflow":
          return "createNewWork";
          break;
        case "getnextwork":
          return "getNextWorkItem";
          break;
        default:
          return "";
      }

    },
      
    openCookieConsent : function(gadgetId){
      var oGt = pega.web.mgr._getGadgetByID(gadgetId);
      var consentWind = window.open(oGt._oConfigDefs.serverURLWithHash+"?pyActivity=pzGetURLHashes&showConsent=true",'CookieConsent','width=1,height=1');
      if (oGt._oDivAttrs.action != "") {
        oGt._processGadget();
      }
      sessionStorage.setItem(oGt._oConfigDefs.serverURL, true);
      oGt._oDiv.childNodes[0].remove();
      consentWind = undefined;
    }



  }

  /* gadget object */
  pega.web.gadget = function(oEl, oWin) {
    this._id;
    this._oApiAction = {
      action: "",
      activityQuery: ""
    };
    this._oActRefresh = {
      action: "refresh",
      activityQuery: "",
      baseURI: ""
    };
    this._oGdtActions = null;
    this._oConfigDefs = {
      gatewayURL: "",
      appName: "",
      systemID: "",
            serverURL:"",
            serverURLWithHash:"",
            tenantID:"",
      thread: ""
    };
    this._oConfigDyno = {
      //		gatewayURL: "",
      appName: "",
      systemID: "",
      thread: ""
    };
    this._oDivAttrs = {
      action: "",
      activityQuery: "",
      params: {},
      targetType: "_self",
      popupOptions: "",
      defer: "false"
    };
    this._oDivProps = null;

    //Added onResize event
    this._oEvents = {
      onBeforeLoad: "",
      onLoad: "",
      onConfirm: "",
      onCustom: "",
      onPageData: "",
      onClose: "",
      onError: "",
      onDomReady: "",
      onResize: ""
    };
    this._bMaxIframeSize = true;
    this._bFillSpace = false;
    this._sizeInPercentage = false;
    this._scrollWidth = 25;
    this._divOffsetWidth = null;
    this._divOffsetHeight = null;
    this._htInsElements = null;
    this._htCamelCaseMap = null;
    this._oFrame = null;
    this._iFrPrevHt = 0;
    this._oPopWin = null;
    this._oWin = oWin;
    this._oDoc = oWin.document;
    this._oDiv = this._init(oEl);
    this._sErrNum = "";
    this._sErrDescr = "";
    this._bLoaded = false;
    this._bAddedOnLoadListener = false;
    this._oActionModel = {
      action: "",
      actionMapping: "",
      target: {
        type: "_self",
        name: ""
      },
      params: {},
      activityQuery: "",
      pageURL: "",
      popup: {
        options: "",
        gadgetReference: ""
      }
    };
    /*
         this._oParamsModel = {
         harnessName: "",
         readOnly: "",
         frameName: "",
         harnessMode: "",
         className: "",
         performPreProcessing: "",
         pzPrimaryPageName: "",
         workID: "",
         key: "",
         flowName: ""
         };
         */
  }

  pega.web.gadget.prototype = {
    _init: function(oDiv) {
      this._camelCaseMapBuild();
      this._oDiv = oDiv;
      // BUG-79132 GUJAS1 11/02/2012 Replaced attributes[] by call to getAttribute, which is faster.
      this._id = oDiv.getAttribute("PegaGadget") || oDiv.getAttribute("data-pega-gadgetname");
      this._getProps();
      if(pega.web.isWebMashup == true){
              var urlTokens = (this._oConfigDefs.serverURL || this._oConfigDefs.gatewayURL).split('/');
        if(urlTokens.length > 0){
          var target = oDiv.getAttribute("data-pega-targettype"), ifr = "Ifr";
          if(target == "_popup"){
            ifr = "";
          }
          pega.Mashup.Communicator.addDomainToWhiteList(this._id+ifr,urlTokens[0]+"//"+urlTokens[2]);
        }
      }
      /*
             // Invoke default action defined by div PegaXxx attributes.
             if(this._oDivAttrs.action != "") {
             if(this._oDivAttrs.defer == "false")
             this._doAttrAction();
             }
             */
      return oDiv;
    },
    removeGadget: function() {
      this._oFrame = null;
      this._iFrPrevHt = 0;
      this._oPopWin = null;
      this._oWin = null;
      this._oDoc = null;
      this._oDiv = null;
    },
    _postActionToGadget: function(args){
      var config = {}, message= {},action, recConfig;
      var createSendParmeters = function(){

        var createConfigObj = function(obj){
          if(!obj){
            return;
          }
          if(obj.callback){
            config.callback = obj.callback;
            config.scope = obj.scope;
          }
        };

        message.gadgetName = args[0];
        action = args[1];
        message.name = action;
        config.target = args[0]+"Ifr";
        var gadget = pega.web.mgr._getGadgetByID(args[0]);
        if(gadget && gadget._oDivAttrs && gadget._oDivAttrs.targetType == "_popup"){
          config.target = args[0];
        }
        switch(action.toLowerCase()){
          case "getgadgetdata":
            message.propRef = args[2];
            recConfig = args[3];
            break;
          case "setgadgetdata":
            message.propRef = args[2];
            message.propValue = args[3];
            recConfig = args[4];
            break;
          case "getgadgetinfo":
            recConfig = args[2];
            break;
        }
        createConfigObj(recConfig);
      };
      createSendParmeters();
      pega.Mashup.Communicator.send(message,config);
    },
    _isGadgetAction: function(sActName){
      switch (sActName.toLowerCase()) {
        case "getgadgetdata":
        case "setgadgetdata":
        case "getgadgetinfo":
        case "print":
          //case "getuidoc":
        case "restretch":
        case "reload":
          return true;
        default:
          return false;
      }
    },
    _doApiAction: function(sAction, args) {
      if (!this._validatePageAPI(sAction)) {
        pega.web.mgr._logMsg("error", this._id, "Page API", "error: IAC does not support Page API action: " + sAction);
        return;
      }
      pega.web.mgr._logMsg("action", this._id, "Page API", "action '" + sAction + "'");
      if(pega.web.isWebMashup == true && this._isGadgetAction(sAction)){
        this._postActionToGadget(args);
        return;
      }

      // Dispatch selected special actions.
      switch (sAction.toLowerCase()) {

        case 'getgadgetinfo':
          return this._getGadgetInfo();

        case 'getgadgetdata':
          return this._getGadgetData(args[2]);

        case 'setgadgetdata':
          return this._setGadgetData(args[2], args[3]);

        case 'load':
          if (this._oDivAttrs.action != "")
            return this._doAttrAction();
          return;

        case 'logoff':
          break;

        case 'refresh':
          break;

        case 'reload':
          break;

        case 'restretch':
          this._restretchGadgetDiv();
          return;

        case 'getuidoc':
          return this._detUIDoc();

        case 'print':
          this._oFrame.contentWindow.focus();
          this._oFrame.contentWindow.print();
          return;

        case 'blank':
          this._removeGdtResizeListener();
          //BUG-81757 @cherj, updated the iframe src to blank.htm from about:blank
          this._oFrame.src = "blank.htm";
          return;
      }

      // Build parameters object depending on the action.
      var oAct = pega.web.mgr._ut._clone(this._oApiAction);
      oAct.action = sAction;
      this._buildActionParams(oAct, args);

      // Navigate gadget for this api-defined action.
      this._navigateGadgetFrame(oAct);
    },
    _doAttrAction: function () {
      if (pega.web.mgr.isCookieConsentRequired(this)) {
        pega.web.mgr.addCookieAcceptanceMessage(this);
      }else{
        this._processGadget();
      }
    },
    _processGadget: function () {
      // Data bind div attributes values.
      var oAct = pega.web.mgr._ut._clone(this._oDivAttrs);
      var dataBinder = new pega.web.DataBinder();
      var navigateFrame = function (oAct) {
        try {
          if (oAct.action.toLowerCase() == "openworkbyurl") {
            var oArgPars = {};
            p_w_eval_1 = oArgPars;
            //var oURL = SafeURL_createFromURL(oAct.params.queryString);
            var oURL = SafeURL_createFromURL(oAct.params.query);
            // BUG-23907:added to iterate over all the PegaA_params
            for (var i in oAct.params) {
              if (i != "query") {
                oURL.put(i, eval("oAct.params." + i));
              }
            }
            for (var i in oURL.hashtable) {
              var sV = oURL.get(i);
              p_w_eval_2 = sV;
              eval("p_w_eval_1." + i + "=p_w_eval_2");
            }
            oAct.params = oArgPars;
          }
        } catch (e) {}

        switch (oAct.targetType) {
          case '_self':
            this._navigateGadgetFrame(oAct);
            break;

          case '_popup':
            this._navigateSelfPopup(oAct);
            break;
        }
      };
      dataBinder.registerCallback(navigateFrame, this, oAct);
      this._objectRefBind(oAct, dataBinder);
      dataBinder.executeCallback();
    },
    _restretchGadgetDiv: function() {
      try {
        if (this._oFrame == null)
          return;
        this._resizeGadgetIframe();
        //			this._oFrame.height = (parseInt(this._oFrame.height) + 1).toString();
      } catch (e) {
      }
    },
    _resizeGadgetDiv: function() {
      //return;
      var oDiv = window.event.srcElement;
      var oGdt = pega.web.mgr._getGadgetFromDiv(window.event.srcElement);
      if (oGdt != null && oGdt._oFrame != null && oGdt._oFrame.src != "") {
        //alert("resizing div " + oGdt._id);
        //			oGdt._resizeGadgetIframe();
        //			if(oGdt._oFrame.height < oDiv.clientHeight) {
        //			oGdt._oFrame.height = oDiv.clientHeight;
        //			}
      }
    },
    _resizeCallback: function() {
      try {
        // Resize this gadget.
        var bIsDC, dHt = 0;
        if (pega && pega.u && pega.u.d) {
          bIsDC = pega.u.d._isDC();
          /* Here we are checking for DC to not to return from here for old workarea use-case */
          if (bIsDC && !pega.u.d._isJSResizeEnabled()) {
            return;
          }
        }
        if (this._oFrame.contentWindow.pega) {
          /* Here setting stretchHarness to false as we dont need this logic for dc js resize mode */
          if (bIsDC) {
            this._oFrame.contentWindow.pega.u.d.stretchHarness = false;
          }
          /* Here pasing true as a parameter only for dc strectch mode.
                     * This is to avoid setting harness height, because we dont need to fix button bar in this case
                     */
          dHt = this._oFrame.contentWindow.pega.ui.d.getDocumentHeight(bIsDC);
        }

        if (!dHt || dHt == 0) {
          if (this._divOffsetHeight > 0)
            dHt = pega.ui.d.getDocumentHeight() - this._divOffsetHeight;
          else
            dHt = pega.ui.d.getDocumentHeight() - this._oDiv.offsetHeight;
        }
        var frameBody = this._oFrame.contentWindow.document.body;
        // harness with panel set does not need any overflow setting. Panelset will take care of scrollbars.
        var isLayoutContainer = (frameBody.className.indexOf("yui-layout") >= 0);
        /* Added code to fix the scrolling issue to Modal dialog if height of workArea gadget is less than the modaldialog content height */
        /*if(this._oFrame.contentWindow.pega.ui.d.bModalDialogOpen && this._oFrame.contentWindow.document.getElementById("modaldialog")){
                 var modalDlgScrollHeight = parseInt(this._oFrame.contentWindow.document.getElementById("modaldialog").scrollHeight);
                 if(this._oFrame.scrollHeight  <  (modalDlgScrollHeight + this._oFrame.contentWindow.pega.ui.d.SCROLL_ADJUSTMENT)){
                 this._oFrame.height = dHt + (modalDlgScrollHeight + this._oFrame.contentWindow.pega.ui.d.MODALDIALOG_ADJUSTMENT - this._oFrame.scrollHeight);
                 }
                 }else{*/
        var styleIframeWidth = this._oFrame.style.width;
        var styleIframeHeight = this._oFrame.style.height;
        //var rawIFrameWidth = parseInt(styleIframeWidth);
        //var rawIFrameHeight = parseInt(styleIframeHeight); parseInt value cannot be compared with auto.
        if (styleIframeWidth == "auto" || styleIframeWidth == "" || typeof this._divOffsetWidth != "number" || this._divOffsetWidth == 0 || styleIframeWidth.indexOf("%") > 0) {/*BUG-45295 - Checking _divOffsetWitdth against 0 as the gadget div might be not visible on load*/
          this._divOffsetWidth = this._oDiv.offsetWidth;
        }
        if (styleIframeHeight == "auto" || styleIframeHeight == "" || typeof this._divOffsetHeight != "number" || styleIframeHeight.indexOf("%") > 0) {
          this._divOffsetHeight = this._oDiv.offsetHeight;
        }
        var container = new pega.util.Element(this._oDiv);
        var height100Perc = false;
        //if(!(pega && pega.u && pega.u.d && pega.u.d.isPortal())){
        var paddingTop = parseInt(container.getStyle("padding-top"));
        paddingTop = isNaN(paddingTop) ? 0 : paddingTop;
        var paddingBottom = parseInt(container.getStyle("padding-bottom"));
        paddingBottom = isNaN(paddingBottom) ? 0 : paddingBottom;
        var borderTop = parseInt(container.getStyle("border-top-width"));
        borderTop = isNaN(borderTop) ? 0 : borderTop;
        var borderBottom = parseInt(container.getStyle("border-bottom-width"));
        borderBottom = isNaN(borderBottom) ? 0 : borderBottom;
        var scrollCompensation = (pega.util.Event.isIE) ? 10 : 0;
        var heightSurplus = paddingTop + paddingBottom + borderTop + borderBottom;
        var containerContentHeight = this._divOffsetHeight - heightSurplus;
        if (this._bFillSpace && dHt <= containerContentHeight - scrollCompensation) {
          height100Perc = true;
          dHt = containerContentHeight;
        }
        //}
        if (height100Perc) {
          this._oFrame.height = "100%";
          this._oFrame.style.height = "100%";
          if (!isLayoutContainer)
            frameBody.style.overflowY = "visible";
        } else {
          if (dHt) { // BUG-74319: Added If condition. Skip if dHt is undefined or 0. Default frame height is 100%
            this._oFrame.height = dHt; /* BUG-74319: If dHt == 'undefined' this line is throwing exception in non safari browsers, but in safari height is set to 'undefined' */
            this._oFrame.style.height = (dHt + "px");
          }
          /* BUG-20738 - fixed to remove false scrollbar */
          this._oFrame.contentWindow.document.body.style.overflowY = "auto";

          if (!isLayoutContainer) {
            frameBody.style.overflowY = "auto";
            /* In case of DC js resize it stretches to its content.
                         * Auto is causing flickering on the UI because first it displays the scrollbar then after resizing scrollbar will get disappeared.
                         * To avoid that setting overflow to hidden as we are setting the height to its content.
                         */
            if (!bIsDC) {
              frameBody.style.overflowY = "auto";
            } else {
              frameBody.style.overflowY = "hidden";
            }
          }
        }
        /*}	*/
        /* In case of DC we are setting width 100% in-order to get the responsive behavior
                 * So we dont need width setting logic in case of DC.
                 */
        if (!bIsDC) {

          // Set optional width for this gadget.
          var dWt = -1;
          //BUG-166117 start, if size in percentage is allowed, make width as 100%, will add for height later when needed
          if (this._sizeInPercentage == true) {
            this._oFrame.width = "100%";
            this._oFrame.style.width = "100%";
            frameBody.style.overflowX = "auto";

          }
          // BUG-166117 end
          else {
            try {
              dWt = this._oFrame.contentWindow.pega.ui.d.getDocumentWidth(!this._bFillSpace);
            } catch (e) {
            }
            if (dWt != -1) {
              var width100Perc = false;
              //if(!(pega && pega.u && pega.u.d && pega.u.d.isPortal())){
              var paddingLeft = parseInt(container.getStyle("padding-left"));
              paddingLeft = isNaN(paddingLeft) ? 0 : paddingLeft;
              var paddingRight = parseInt(container.getStyle("padding-right"));
              paddingRight = isNaN(paddingRight) ? 0 : paddingRight;
              var borderLeft = parseInt(container.getStyle("border-left-width"));
              borderLeft = isNaN(borderLeft) ? 0 : borderLeft;
              var borderRight = parseInt(container.getStyle("border-right-width"));
              borderRight = isNaN(borderRight) ? 0 : borderRight;
              var widthSurplus = paddingLeft + paddingRight + borderLeft + borderRight;
              var containerContentWidth = this._divOffsetWidth - widthSurplus;

              if (/*this._bFillSpace && */dWt <= containerContentWidth) {
                dWt = containerContentWidth;
              } else {
                width100Perc = true;
              }
              //}
              if (width100Perc) {
                this._oFrame.width = "100%";
                this._oFrame.style.width = "100%";
                if (!isLayoutContainer)
                  frameBody.style.overflowX = "auto";
              } else {
                this._oFrame.width = dWt;
                this._oFrame.style.width = (dWt + "px");
                /*if(this._oFrame.offsetHeight < this._oFrame.contentWindow.document.body.scrollHeight) {
                                 if(!isLayoutContainer) frameBody.style.overflowY = "scroll";
                                 } else {
                                 if(!isLayoutContainer) frameBody.style.overflowX = "auto";
                                 }*/
                /* BUG-20738 - fixed to remove false scrollbar */
                if (this._oFrame.offsetHeight < this._oFrame.contentWindow.document.body.scrollHeight) {
                  this._oFrame.contentWindow.document.body.style.overflowY = "auto";
                } else {
                  this._oFrame.contentWindow.document.body.style.overflowX = "auto";
                }
              }
            }
          }
        }
        this._oFrame.style.visibility = "visible";

        //trigger the PegaE_onResize Event
        if (this._oEvents.onResize != "") {
          this._handleTimedEvent(this._oEvents.onResize);
        }

        // Resize container gadgets all the way to the top.
        var oldOCntGdt = null;
        for (var oCntGdt = this._getContainerGadget(); oCntGdt != null && oldOCntGdt != oCntGdt; oCntGdt = oCntGdt._getContainerGadget()) {
          var dHt = oCntGdt._oFrame.contentWindow.pega.ui.d.getDocumentHeight();
          oCntGdt._oFrame.height = dHt;// + 10;
          oCntGdt._oFrame.style.height = dHt + "px";// + 10;
          // Set optional width for the container gadget.
          var dWt = -1;
          try {
            dWt = oCntGdt._oFrame.contentWindow.pega.ui.d.getDocumentWidth();
          } catch (e) {
          }
          if (dWt != -1)
            oCntGdt._oFrame.width = dWt;
          oldOCntGdt = oCntGdt;
        }
      } catch (e) {
      }
    },
    _resizeGadgetIframe: function() {
      // Switch between new and old resize approach.
      if (pega.web.mgr._bUseHarnessResizeAPI) {
        this._resizeCallback();
        //		var dHt = this._oFrame.contentWindow.pega.ui.d.getDocumentHeight();
        //		this._oFrame.height = dHt;
      }
      return;
      try {
        if (!this._bMaxIframeSize) {
          return;
        }
        var oCW = this._oFrame.contentWindow;
        if (oCW == null)
          return null;
        var oHD = oCW.document;
        var oHDB = oHD.body;
        if (oHDB == null)
          return;
        var oIfr = this._oFrame;
        var hcDiv = oHD.getElementById("HARNESS_CONTENT");
        if (hcDiv == null) {

          // Assume frameset. Find harness frame containing "HARNESS_CONTENT" DIV.
          for (var i = 0; i < oHDB.childNodes.length; ++i) {
            var oFr = oHDB.childNodes[i];
            if (oFr.tagName == "FRAME") {
              if (oFr.contentWindow == null)
                continue;
              oHD = oFr.contentWindow.document;
              oHDB = oHD.body;
              hcDiv = oHD.getElementById("HARNESS_CONTENT");
              if (hcDiv != null)
                break;
            }
          }
        }

        var hbDiv = oHD.getElementById("HARNESS_BUTTONS");
        var hbOffH = (hbDiv == null) ? 0 : hbDiv.offsetHeight;

        if ((pega.util.Event.isIE != null) && (pega.util.Event.isIE[0] == "MSIE")) {
          var hcScrH = (hcDiv == null) ? 0 : hcDiv.scrollHeight;
          var dw = oHD.body.offsetWidth;
          var dvw = this._oDiv.offsetWidth;
        }
        else {
          var hcScrH = (hcDiv == null) ? 0 : hcDiv.scrollHeight;
          var dw = oHD.body.clientWidth;
          var dvw = this._oDiv.clientWidth;
        }

        // If this is not a harness show the HTML document, e.g. error screen.
        if (hcScrH + hbOffH == 0) {
          var iFrHt = oHDB.scrollHeight; // + 4;
        }
        else {
          var iFrHt = hcScrH + hbOffH; // + 4;
        }
        if (iFrHt < 100)
          iFrHt = 100;
        if ((iFrHt > this._iFrPrevHt) || ((this._iFrPrevHt - iFrHt) > 150)) {
          this._oFrame.height = iFrHt;
        }
        this._iFrPrevHt = iFrHt;
        if (hcDiv != null) {
          //			if(hcDiv.scrollWidth > this._oDiv.scrollWidth) {
          if (dw > dvw) {

            //				this._oFrame.width = hcDiv.scrollWidth;
            this._oFrame.width = dvw;
          }
          if (hcDiv.offsetWidth > 5000 || hcDiv.offsetWidth < 225) {
            oIfr.style.pixelWidth = window.document.body.clientWidth - 30;
            oIfr.width = "100%";
          }
          hcDiv.style.overflow = "hidden";
          if (typeof (hcDiv.parentElement) != "undefined") {
            hcDiv.parentElement.style.overflow = "hidden";
            if (typeof (hcDiv.parentElement) != "undefined") {
              hcDiv.parentElement.parentElement.style.overflow = "hidden";
            }
          }
        }
        oHDB.style.overflow = "hidden";

        var oCntGdt = this._getContainerGadget();
        if (oCntGdt != null) {
          oCntGdt._resizeGadgetIframe();
        }
      } catch (e) {
      }
    },
    _getContainerGadget: function() {
      try {
        var oCW = this._oFrame.contentWindow;
        if (oCW == null)
          return null;
        var oCWP = oCW.parent;
        var oFR = oCWP.frameElement;
        if (oFR == null)
          return null;
        if (typeof (oFR.PegaWebGadget) == "undefined")
          return null;
        // BUG-79132 GUJAS1 11/02/2012 Replaced attributes[] by call to getAttribute, which is faster.
        var sGdtId = typeof (oFR.parentElement) != "undefined"
        ? oFR.parentElement.getAttribute("PegaGadget") || oFR.parentElement.getAttribute("data-pega-gadgetname")
        : oFR.parentNode.getAttribute("PegaGadget") || oFR.parentNode.getAttribute("data-pega-gadgetname");
        //		var sGdtId = oFR.parentElement.PegaGadget;
        var gadgetMgr = pega.web.mgr;
        if (oCWP.parent && oCWP.parent.pega && oCWP.parent.pega.web && oCWP.parent.pega.web.mgr) {
          var oParentPega = oCWP.parent.pega;
          gadgetMgr = oParentPega.web.mgr;
          var bIsDC;
          if (oParentPega.u && oParentPega.u.d) {
            bIsDC = oParentPega.u.d._isDC();
            if (bIsDC && !oParentPega.u.d._isJSResizeEnabled()) {
              return null; /* return null if js resize is not enabled for parent gadget */
            }
          }
        }
        var oGdt = gadgetMgr._getGadgetByID(sGdtId);
        return oGdt;
      } catch (e) {
        return null;
      }
    },
    _windowResizeCallback: function() {
      this.resizeCallbackPooled = false;
      //this._oFrame.style.height = this._oFrame.style.width ="auto";

      var that = this;
      setTimeout(function() {
        that._oFrame.style.visibility = "hidden";
        var sId = that._id;
        pega.web.mgr._resizeCallback(sId);
        that._oFrame.style.visibility = "visible";
      }, 0);
    },
    _poolResizeCallback: function() {
      if (this.resizeCallbackPooled) {
        clearTimeout(this.resizeCallbackPooled);
      }
      var that = this;
      this.resizeCallbackPooled = setTimeout(function() {
        that._windowResizeCallback();
      }, 100);
    },
    _removeGdtResizeListener: function() {
      pega.util.Event.removeListener(window, "resize", this._tmpResizeCallback);
      this._tmpResizeCallback = null;
      delete this._tmpResizeCallback;


      var funcRegResize = null;

      try {
        funcRegResize = this._oFrame.contentWindow.pega.ui.d.unregisterResize; //TODO: ui.d sometimes doesnt exist? Following the pattern as in registration code below
        funcRegResize(this._gadgetResizeCall(this._id));
        if (pega.ui.d) {
          funcRegResize = pega.ui.d.unregisterResize;
          funcRegResize(this._gadgetResizeCall(this._id));
        }
        this._tmpGadgetResizeCall = null;
        funcRegResize = null;
      } catch (e) {
      }

    },
    _gadgetResizeCall: function(sId) {
      if (!this._tmpGadgetResizeCall) {
        this._tmpGadgetResizeCall = function() {
          pega.web.mgr._resizeCallback(sId);
        }
      }
      return this._tmpGadgetResizeCall;
    },
    _doGdtAction: function(sAction, args) {
      if (!this._validateGadgetAPI(sAction)) {
        pega.web.mgr._logMsg("error", this._id, "Gadget API", "error: IAC does not support Gadget API action: " + sAction);
        return;
      }
      pega.web.mgr._logMsg("action", this._id, "Gadget API", "action '" + sAction + "'");

      // For 'closed', 'loaded', 'custom', and 'confirm' actions handle defined events if any.
      // In addition for 'close' maintain hashtable of open popups.
      var sEvent = "";

      switch (sAction) {

        case 'loaded':
          if(!pega.Mashup){
            if ((pega && pega.u && pega.u.d && pega.u.d.isPortal() && !pega.util.Dom.hasClass(document.body, "with-fixed-header"))) {
              var that = this;
              if (this._tmpResizeCallback)
                this._removeGdtResizeListener();
              this._tmpResizeCallback = function() {
                that._poolResizeCallback();
              };
              pega.util.Event.addListener(window, "resize", this._tmpResizeCallback);
            }
            // If not already did, register resize callback
            try {
              if (pega.web.mgr._bUseHarnessResizeAPI && this._bMaxIframeSize) {
                //						this._resizeCallback();
                var funcRegResize = this._oFrame.contentWindow.pega.ui.d.registerResize;
                if (this._bFillSpace) {
                  this._oFrame.contentWindow.pega.ui.d.stretchHarness = true;
                }
                funcRegResize(this._gadgetResizeCall(this._id));
                if (pega.ui.d) {
                  funcRegResize = pega.ui.d.registerResize;
                  funcRegResize(this._gadgetResizeCall());
                }
                funcRegResize = null;
              }
            } catch (e) {
            }

            // Scan for INS elements inside the loaded socument at the top level.
            var oDoc = this._oFrame.contentWindow.document;
            this._htInsElements = new pega.tools.Hashtable();
            if (oDoc) {
              var oInsEls = oDoc ? oDoc.getElementsByTagName("INS") : null;
              for (var i = 0; i < oInsEls.length; ++i) {
                var oEl = oInsEls[i];
                // BUG-79132 GUJAS1 11/02/2012 Added cross browser attribute access code.
                if (oEl.getAttribute("dataBindName") != null) {
                  this._htInsElements.put(oEl.getAttribute("dataBindName"), oEl);
                }
              }

              // Scan for INS elements inside all action iframes.
              var oActIfr = oDoc.getElementsByTagName("iframe");
              for (var i = 0; i < oActIfr.length; ++i) {
                var oIfr = oActIfr[i];
                if (oActIfr[i].name == "actionIFrame") {
                  oDoc = oActIfr[i].contentWindow.document;
                  if (oDoc) {
                    oInsEls = oDoc ? oDoc.getElementsByTagName("INS") : null;
                    for (j = 0; j < oInsEls.length; ++j) {
                      var oEl = oInsEls[j];
                      // BUG-79132 GUJAS1 11/02/2012 Added cross browser attribute access code.
                      if (oEl.getAttribute("dataBindName") != null) {
                        this._htInsElements.put(oEl.getAttribute("dataBindName"), oEl);
                      }
                    }
                  }
                }
              }

            }
          }
          // Mark gadget as loaded.
          this._bLoaded = true;

          sEvent = "onLoad";
          this._doEvent(sEvent);
          break;

        case 'confirm':
          sEvent = "onConfirm";
          this._doEvent(sEvent);
          break;

        case 'closed':
          sEvent = "onClose";
          this._doEvent(sEvent);
          break;

        case 'custom':
          sEvent = "onCustom";
          this._doEvent(sEvent, args[2]);
          break;

        case 'error':

          // Log error specific info.
          this._sErrNum = (typeof (args[2]) != "undefined") ? args[2] : "";
          this._sErrDescr = (typeof (args[3]) != "undefined") ? args[3] : "";

          pega.web.mgr._logMsg("error", this._id, "Manager", "event 'error': number='" + this._sErrNum + "', description='" + this._sErrDescr + "'");

          sEvent = "onError";
          this._doEvent(sEvent);
          break;

        case 'resize':
          if (pega.Mashup) {
            if(this._oEvents && this._oEvents.onResize != ""){
              this._handleTimedEvent(this._oEvents.onResize);
            }
            return;
          }
          this._resizeGadgetIframe();
          return;

        case 'blank':
          this._removeGdtResizeListener();
          this._oFrame.src = "about:blank";
          return;
      }

      // Find all actions with sAction name defined on this gadget.
      var arActions = this._getActionDefs(sAction);
      if (arActions == null) {

        // Skip 'closed', 'loaded', 'custom', and 'confirm'
        if (sEvent != "")
          return;

        // No action with this name is defined, run it on "self"
        var oAct = pega.web.mgr._ut._clone(this._oActionModel);
        oAct.action = sAction;

        // Build and bind action parameters.
        this._buildActionParams(oAct, args);
        var dataBinder = new pega.web.DataBinder();
        var performAction = function(oActParams){
          switch (this._oDivAttrs.targetType) {
            case '_self':
              this._navigateGadgetFrame(oActParams);
              break;

            case '_popup':
              this._navigateSelfPopup(oActParams);
              break;
          }
        };
        dataBinder.registerCallback(performAction,this, oAct);
        this._objectRefBind(oAct,dataBinder);
        dataBinder.executeCallback();
        return;
      }

      // Invoke action handler for each action with this name
      for (var i = 0; i < arActions.length; ++i) {
        var oAct = arActions[i];
        oAct = pega.web.mgr._ut._clone(oAct);

        // Replace action with actionMapping if defined.
        if (typeof (oAct.actionMapping) != 'undefined' && oAct.actionMapping != "") {
          if (!this._validateGadgetAPI(oAct.actionMapping)) {
            pega.web.mgr._logMsg("error", this._id, "Gadget API", "error: IAC does not support actionDefinitions.actionMapping: " + oAct.actionMapping);
            continue;
          }
          pega.web.mgr._logMsg("info", this._id, "Manager", "mapping action '" + oAct.action + "' into action '" + oAct.actionMapping + "'");
          oAct.action = oAct.actionMapping;
        }

        // Build and bind action parameters.
        this._buildActionParams(oAct, args);

        var performAction = function(oAct){
          if(!oAct.target){
            return;
          }
          // Do action on self if explicitely defined or defaulted to self.
          var oTgtGdt = null;
          if (typeof (oAct.target) == 'undefined') {
            oAct.target = {};
          }
          if (typeof (oAct.target.type) == 'undefined') {
            oAct.target.type = "_self";
          }

          if (oAct.target.type == "_self" || oAct.target.type == "") {
            oAct.target.type = "_gadget";
            oTgtGdt = this;
          }

          // Find target and do action on target
          switch (oAct.target.type) {

            case '_gadget':
              if (oTgtGdt == null)
                oTgtGdt = pega.web.mgr._htGadgets.get(oAct.target.name);

              if (typeof (oTgtGdt) == "undefined" || oTgtGdt == null)
                return;
              if(pega.web.isWebMashup && oAct.action == "print" && oAct.target.name) {
                pega.Mashup.Communicator.send({name: "print"}, {
                  target: oAct.target.name + "Ifr"
                });
                return;
              }
              if (oAct.action == "print" && oTgtGdt._oFrame != null) {
                oTgtGdt._oFrame.contentWindow.focus();
                oTgtGdt._oFrame.contentWindow.print();
                return;
              }

              if (oAct.action == "load") {
                if (oTgtGdt._oDivAttrs.action != "") {
                  oTgtGdt._doAttrAction();
                  return;
                }
              }

              // Copy dynamic config settings of the source gadget into the target gadget.
              // Blank out dynamic overrides for the next action runtime.
              var oCfDyno = this._oConfigDyno;
              var oTgtCfDyno = oTgtGdt._oConfigDyno;
              if (oCfDyno.systemID != "") {
                oTgtCfDyno.systemID = oCfDyno.systemID;
                oCfDyno.systemID = "";
              }
              if (oCfDyno.appName != "") {
                oTgtCfDyno.appName = oCfDyno.appName;
                oCfDyno.appName = "";
              }
              if (oCfDyno.thread != "") {
                oTgtCfDyno.thread = oCfDyno.thread;
                oCfDyno.thread = "";
              }

              // Log and execute action on the target gadget.
              pega.web.mgr._logMsg("info", this._id, "Manager", "target gadget '" + oTgtGdt._id + "'");

              oTgtGdt._navigateGadgetFrame(oAct);
              break;

            case '_popup':
              this._navigateSelfPopup(oAct);
              break;
            case '_top':
              pega.web.mgr._logMsg("info", this._id, "Manager", "target is '" + oAct.target.type + "'");

              this._navigateTopPopup(oAct);
              break;

            case '_page':
              pega.web.mgr._logMsg("info", this._id, "Manager", "target page '" + oAct.pageURL + "'");
              this._navigatePortalPage(oAct);
              break;
          }
        };
        var dataBinder = new pega.web.DataBinder();
        dataBinder.registerCallback(performAction, this, oAct);
        this._objectRefBind(oAct, dataBinder);
        dataBinder.executeCallback();
      }
    },
    //WebWiz71-Sprint-9 : US-15293 : Updated ContentID and ContainerID for explicit actions : JAINB1

    _buildActionParams: function(oAct, args) {
      var oArgPars = {};
      var oParObj = null;
      var oConfObj = null;
      var sAction = oAct.action;

      switch (sAction.toLowerCase()) {

        case 'openwizard':
          oArgPars.className = args[2].className;
          oArgPars.action = args[1];
          if (typeof args[5] != "undefined")
            oArgPars.tabIndex = args[5];
          if (typeof args[6] != "undefined")
            oArgPars.contentID = args[6];
          if (typeof args[7] != "undefined")
            oArgPars.dynamicContainerID = args[7];
          if (typeof args[8] != "undefined")
            oArgPars.wizardLabel = args[8];
          var tempQuery = args[2].sQuery, keyValueArray = null;
          var queryStringArray = tempQuery.split("&");
          var wizardParams = undefined;
          for (var num in queryStringArray) {
            keyValueArray = queryStringArray[num].split("=");
            if (!wizardParams)
              wizardParams = keyValueArray[0];
            else
              wizardParams = wizardParams + "&" + keyValueArray[0];
            oArgPars[keyValueArray[0]] = keyValueArray[1];
          }
          if (wizardParams)
            oArgPars.wizardParams = wizardParams;
          break;

        case 'getgadgetdata':
          oArgPars = args[2];
          break;

        case 'display':
          if (typeof (args[2]) != "undefined")
            oArgPars.harnessName = args[2];
          if (typeof (args[3]) != "undefined")
            oArgPars.className = args[3];
          /*if (typeof (args[4]) != "undefined")
            oArgPars.pzPrimaryPageName = args[4];*/
          if (typeof (args[5]) != "undefined")
            oArgPars.readOnly = args[5];
          if (typeof (args[6]) != "undefined")
            oArgPars.model = args[6];
          oParObj = args[7];
          oConfObj = args[8];
          if (typeof (args[9]) != "undefined")
            oArgPars.preActivity = args[9];
          if (typeof (args[10]) != "undefined")
            oArgPars.preActivityParams = args[10];
          if (typeof (args[11]) != "undefined")
            oArgPars.key = args[11];
          if (typeof (args[12]) != "undefined")
            oArgPars.readOnly = args[12];
          if (typeof (args[13]) != "undefined")
            oArgPars.label = args[13];
          if (typeof (args[14]) != "undefined")
            oArgPars.pyActivity = args[14];
          if (typeof (args[15]) != "undefined")
            oArgPars.pyPreActivity = args[15];
          if (typeof (args[16]) != "undefined")
            oArgPars.pzPrimaryPage = args[16];
         /* if (typeof (args[17]) != "undefined")
            oArgPars.pzPrimaryPageName = args[17];*/
          if (typeof (args[18]) != "undefined")
            oArgPars.contentID = args[18];
          if (typeof (args[19]) != "undefined")
            oArgPars.dynamicContainerID = args[19];
          if (typeof (args[20]) != "undefined")
            oArgPars.tabIndex = args[20];
          if (typeof (args[21]) != "undefined")
            oArgPars.replaceCurrent = args[21];

          break;

        case 'displayonpage':
          oArgPars.renderAction = "displayOnPage";
          if (typeof (args[2]) != "undefined")
            oArgPars.harnessName = args[2];
          if (typeof (args[3]) != "undefined")
            oArgPars.pzPrimaryPage = args[3];
          if (typeof (args[4]) != "undefined") {
            for (var i in args[4].hashtable) {
              oArgPars[i] = args[4].hashtable[i];
            }
          }
          if (typeof (args[5]) != "undefined")
            oArgPars.contentID = args[5];
          if (typeof (args[6]) != "undefined")
            oArgPars.dynamicContainerID = args[6];
          if (typeof (args[7]) != "undefined")
            oArgPars.tabIndex = args[7];
          if (typeof (args[8]) != "undefined")
            oArgPars.className = args[8];
          if (typeof (args[9]) != "undefined")
            oArgPars.label = args[9];
          if (typeof (args[10]) != "undefined")
            oArgPars.key = args[10];
          oParObj = args[11];
          break;
        case 'openlanding':
          if (typeof (args[2]) != "undefined")
            oArgPars.harnessName = args[2];
          if (typeof (args[3]) != "undefined")
            oArgPars.className = args[3];
          if (typeof (args[4]) != "undefined")
            oArgPars.pzPrimaryPageName = args[4];
          if (typeof (args[5]) != "undefined")
            oArgPars.readOnly = args[5];
          if (typeof (args[6]) != "undefined")
            oArgPars.model = args[6];
          if (typeof (args[7]) != "undefined")
            oArgPars.action = args[7];
          if (typeof (args[8]) != "undefined")
            oArgPars.levelA = args[8];
          if (typeof (args[9]) != "undefined")
            oArgPars.levelB = args[9];
          if (typeof (args[10]) != "undefined")
            oArgPars.levelC = args[10];
          oParObj = args[11];
          oConfObj = args[12];
          if (typeof (args[13]) != "undefined")
            oArgPars.label = args[13];
          if (typeof (args[14]) != "undefined")
            oArgPars.contentID = args[14];
          if (typeof (args[15]) != "undefined")
            oArgPars.dynamicContainerID = args[15];

          if (typeof (args[16]) != "undefined") {
            for (var i in args[16]) {
              oArgPars[i] = args[16][i];
            }
          }
          if (typeof (args[17]) != "undefined") {
            for (var i in args[17]) {
              oArgPars[i] = args[17][i];
            }
          }
          if (typeof (args[18]) != "undefined") {
            oArgPars.paramKeys = args[18];
          }
          break;

        case 'reportdefinition':
          if(typeof(args[4]) != "undefined")
            oArgPars.pyReportClass = args[4];
          if(typeof(args[5]) != "undefined")
            oArgPars.pyReportName = args[5];
          if(typeof(args[6]) != "undefined")
            oArgPars.pyReportDisplay = args[6];
          if(typeof(args[7]) != "undefined")
            oArgPars.label = args[7];
          if(typeof(args[8]) != "undefined")
            oArgPars.pyShortcutHandle = args[8];
          if(typeof(args[9]) != "undefined")	{
            oArgPars.ReportAction = args[9];
          }
          if(typeof(args[10]) != "undefined")	{
            //report def params
            for(var i in args[10]){
              oArgPars[i] = args[10][i];
            }
          }
          if(typeof(args[11]) != "undefined")
            oArgPars.contentID = args[11];
          if(typeof(args[12]) != "undefined")
            oArgPars.dynamicContainerID = args[12];
          if(typeof(args[14]) != "undefined")
            oArgPars.tabIndex = args[14];
          break;

        case 'openworkbyhandle':
          if (typeof (args[2]) != "undefined")
            oArgPars.key = args[2];
          oParObj = args[3];
          oConfObj = args[4];
          if (typeof (args[5]) != "undefined")
            oArgPars.contentID = args[5];
          if (typeof (args[6]) != "undefined")
            oArgPars.dynamicContainerID = args[6];
          if (typeof (args[7]) != "undefined")
            oArgPars.tabIndex = args[7];
          break;

        case 'openrulebykeys':

          if (typeof (args[2]) != "undefined") {
            if (args[2].key == undefined) {
              for (var i in args[2].hash) {
                oArgPars[i] = args[2].hash[i];
              }


            } else {
              oArgPars.openHandle = args[2].key;
              oArgPars.Format = args[2].format;
            }
          }
          oParObj = args[3];
          oConfObj = args[4];
          if (typeof (args[5]) != "undefined")
            oArgPars.contentID = args[5];
          if (typeof (args[6]) != "undefined")
            oArgPars.dynamicContainerID = args[6];
          if (typeof (args[7]) != "undefined")
            oArgPars.tabIndex = args[7];
          break;
        case 'openrulebyclassandname':
          if (typeof (args[2]) != "undefined") {
            oArgPars.insName = args[2].insName;
            oArgPars.objClass = args[2].objClass;
            oArgPars.Format = args[2].format;
          }
          oParObj = args[3];
          oConfObj = args[4];
          if (typeof (args[5]) != "undefined")
            oArgPars.contentID = args[5];
          if (typeof (args[6]) != "undefined")
            oArgPars.dynamicContainerID = args[6];
          if (typeof (args[7]) != "undefined")
            oArgPars.tabIndex = args[7];
          break;
        case 'openrulespecific':
          if (typeof (args[2]) != "undefined") {
            oArgPars.openHandle = args[2].key;
            oArgPars.Format = args[2].format;
          }
          oParObj = args[3];
          oConfObj = args[4];
          if (typeof (args[5]) != "undefined")
            oArgPars.contentID = args[5];
          if (typeof (args[6]) != "undefined")
            oArgPars.dynamicContainerID = args[6];
          if (typeof (args[7]) != "undefined")
            oArgPars.tabIndex = args[7];
          break;

        case 'openassignment':
          if (typeof (args[2]) != "undefined")
            oArgPars.key = args[2];
          oParObj = args[3];
          oConfObj = args[4];
          if (typeof (args[5]) != "undefined")
            oArgPars.contentID = args[5];
          if (typeof (args[6]) != "undefined")
            oArgPars.dynamicContainerID = args[6];
          if (typeof (args[7]) != "undefined")
            oArgPars.tabIndex = args[7];

          break;

        case 'createnewwork':
          if (typeof (args[2]) != "undefined")
            oArgPars.className = args[2];
          if (typeof (args[3]) != "undefined")
            oArgPars.flowName = args[3];
          oParObj = args[4];
          oConfObj = args[5];
          if (typeof (args[6]) != "undefined") {
            for (var i in args[6]) {
              oArgPars[i] = args[6][i];
            }
          }
          break;

        case 'openworkitem':
          if (typeof (args[2]) != "undefined")
            oArgPars.workID = args[2];
          oParObj = args[3];
          oConfObj = args[4];
          if (typeof (args[5]) != "undefined")
            oArgPars.contentID = args[5];
          if (typeof (args[6]) != "undefined")
            oArgPars.dynamicContainerID = args[6];
          if (typeof (args[7]) != "undefined")
            oArgPars.tabIndex = args[7];

          break;

        case 'logoff':
          if (typeof (args[2]) != "undefined")
            oArgPars.harnessName = args[2];
          if (typeof (args[3]) != "undefined")
            oArgPars.className = args[3];
          oParObj = args[4];
          oConfObj = args[5];
          break;

        case 'openworkbyurl':
          if (typeof (args[2]) != "undefined") {

            // Transform URL for execution by doUIAction activity
            p_w_eval_1 = oArgPars;
            var oURL = SafeURL_createFromURL(args[2]);
            for (var i in oURL.hashtable) {
              var sV = oURL.get(i);
              p_w_eval_2 = sV;
              /*
                             if(i == "pyActivity") {
                             if(sV.indexOf(".") != -1) {
                             p_w_eval_2 = sV.split(".")[0];
                             eval("p_w_eval_1.byUrlActivityCls=p_w_eval_2");
                             i = "byUrlActivityName";
                             p_w_eval_2 = sV.split(".")[1];
                             }
                             }
                             */
              eval("p_w_eval_1." + i + "=p_w_eval_2");
            }
          }
          oParObj = args[3];
          oConfObj = args[4];
          if (typeof (args[5]) != "undefined")
            oArgPars.tabIndex = args[5];
          break;

        case 'getnextworkitem':
          pega.web.mgr._logMsg("action", this._id, "Manager", "Translating action '" + sAction + "' into action 'getNextWork'");
          sAction = 'getNextWork';
          oAct.action = 'getNextWork';
        case 'getnextwork':
          oParObj = args[2];
          oConfObj = args[3];
          if (typeof (args[4]) != "undefined")
            oArgPars.contentID = args[4];
          if (typeof (args[5]) != "undefined")
            oArgPars.dynamicContainerID = args[5];
          if (typeof (args[6]) != "undefined")
            oArgPars.tabIndex = args[6];
          break;

        case 'print':
          return;
      }

      // Append optional parameters.
      if (typeof (oParObj) != "undefined") {
        try {
          if (typeof (oParObj) == "string") {
            eval("oParObj=" + oParObj);
          }
        }
        catch (e) {
          pega.web.mgr._logMsg("error", this._id, "Manager",
                               "error: invalid Javascript object literal syntax in parameter 'paramObject' value " + oParObj);
        }
        p_w_eval_1 = oArgPars;
        for (var i in oParObj) {
          p_w_eval_2 = oParObj[i];
          //BUG-83253 Fix Starts
          if (typeof (p_w_eval_2) != "function") {
            p_w_eval_1[i] = p_w_eval_2;
          }
          //eval("p_w_eval_1." + i + "=p_w_eval_2");
          // BUG-83253 Fix Ends
          //eval("oArgPars." + i + "=oPar[i]");
        }
      }

      // Override oArgPars with params of the action definition if present.
      var oCfAct = {};
      if (typeof (oAct.params) != 'undefined') {
        try {
          p_w_eval_1 = oArgPars;
          for (var i in oAct.params) {
            p_w_eval_2 = oAct.params[i];

            // config param is special.
            if (typeof (p_w_eval_2) == "object") {
              if (typeof (p_w_eval_2.systemID) == "string")
                oCfAct.systemID = p_w_eval_2.systemID;
              if (typeof (p_w_eval_2.appName) == "string")
                oCfAct.appName = p_w_eval_2.appName;
              if (typeof (p_w_eval_2.thread) == "string")
                oCfAct.thread = p_w_eval_2.thread;
            } else
              eval("p_w_eval_1." + i + "=p_w_eval_2");
          }
        }
        catch (e) {
          pega.web.mgr._logMsg("error", this._id, "Manager",
                               "error: invalid Javascript object literal syntax in parameter '" + i + "', value '" + p_w_eval_1);
        }
      }

      if (pega && pega.u && pega.u.d && pega.u.d.isPortal()) {
        oArgPars.portalThreadName = pega.u.d.getThreadName();
        oArgPars.portalName = pega.u.d.portalName;
      }

      oAct.params = oArgPars;

      // Process dynamic config pamameters starting with the harness originated values
      // followed by action definition overrides.
      if (typeof (oConfObj) != "undefined" && oConfObj != null) {
        try {
          if (typeof (oConfObj) == "string") {
            eval("oConfObj=" + oConfObj);
          }
        }
        catch (e) {
          pega.web.mgr._logMsg("error", this._id, "Manager",
                               "error: invalid Javascript object literal syntax in parameter 'systemObject' value " + oConfObj);
        }

        // Initialize final dyno config object with the config object that came from harness.
        var oCfDyno = this._oConfigDyno;
        if (typeof (oConfObj.systemID) != "undefined")
          oCfDyno.systemID = oConfObj.systemID;
        if (typeof (oConfObj.appName) != "undefined")
          oCfDyno.appName = oConfObj.appName;
        if (typeof (oConfObj.thread) != "undefined")
          oCfDyno.thread = oConfObj.thread;

        // Override final dyno config object with the config object of this action def.
        // If $INHERIT keyword is present, use the latest config value of the source gadget.
        if (typeof (oCfAct.systemID) != "undefined" && oCfAct.systemID != "") {
          if (oCfAct.systemID.toLowerCase() == "$inherit") {
            var sysID = this._oConfigDefs.systemID;
            if (sysID != "" && oCfDyno.systemID == "")
              oCfDyno.systemID = sysID;
          }
          else
            oCfDyno.systemID = oCfAct.systemID;
        }
        if (typeof (oCfAct.appName) != "undefined" && oCfAct.appName != "") {
          if (oCfAct.appName.toLowerCase() == "$inherit") {
            var sAppName = this._oConfigDefs.appName;
            if (sAppName != "" && oCfDyno.appName == "")
              oCfDyno.appName = sAppName;
          }
          else
            oCfDyno.appName = oCfAct.appName;
        }
        if (typeof (oCfAct.thread) != "undefined" && oCfAct.thread != "") {
          if (oCfAct.thread.toLowerCase() == "$inherit") {
            var sThread = this._oConfigDefs.thread;
            if (sThread != "" && oCfDyno.thread == "")
              oCfDyno.thread = sThread;
          }
          else
            oCfDyno.thread = oCfAct.thread;
        }
      }
    },
    _doEvent: function(sEvent, sToken) {
      var oGgtDefEvt = this._oEvents;
      switch (sEvent) {

        case 'onBeforeLoad':
          this._handleTimedEvent(oGgtDefEvt.onBeforeLoad);
          break;

        case 'onLoad':
          /*
                     // If initializing the very first gadget, fetch the cookie from the IFrame
                     // and save in the manager object for encryption to work.
                     if(pega.web.mgr._sPegaCookie == "NA_xxx") {
                     pega.web.mgr._sPegaCookie = "";
                     try {
                     var sC = this._oFrame.contentWindow.document.cookie;
                     //					"prGatewaySESSIONID" "JSESSIONID"
                     var iP = sC.indexOf("prGatewaySESSIONID=");
                     if(iP >= 0) {
                     var iB = sC.indexOf("=", iP+1) + 1;
                     var iE = sC.indexOf(";", iB);
                     pega.web.mgr._sPegaCookie = (iE > 0) ? sC.substring(iB, iE) : sC.substr(iB);
                     }
                     } catch(e) {}
                     }

                     // Initialize remaining gadgets.
                     var htG = pega.web.mgr._htInitDivs;
                     if(htG != null && htG.keys().length > 0) {
                     pega.web.mgr._initGadgetsRest();
                     pega.web.mgr._htInitDivs = null;
                     }
                     */
          this._handleTimedEvent(oGgtDefEvt.onLoad);
          break;

        case 'onCustom':
          this._handleTimedEvent(oGgtDefEvt.onCustom, sToken);
          break;

        case 'onConfirm':
          this._handleTimedEvent(oGgtDefEvt.onConfirm);
          break;

        case 'onClose':
          this._handleTimedEvent(oGgtDefEvt.onClose);
          break;

        case 'onDomReady':
          this._handleTimedEvent(oGgtDefEvt.onDomReady);
          break;

        case 'onError':
          this._handleTimedError(oGgtDefEvt.onError);
          break;

      }
    },
    _getActionDefs: function(sAction) {
      if (sAction == "")
        return null;
      var arActions = null;
      var oActDefs = this._oGdtActions;
      for (var i in oActDefs) {
        var oAct = oActDefs[i];
        if (!this._validateGadgetAPI(oAct.action)) {
          pega.web.mgr._logMsg("error", this._id, "Gadget API", "error: IAC does not support actionDefinitions.action: " + oAct.action);
          continue;
        }
        if (oAct.action == sAction) {
          if (arActions == null)
            arActions = new Array();
          arActions[arActions.length] = oAct;
        }
      }
      return arActions;
    },
    _navigateGadgetFrame: function(oAct) {
      if (this._oFrame == null) {
        this._setIFrame();
      }

      // Invoke beforeLoad JS callback if specified.
      var sEvtFunc = this._oEvents.onBeforeLoad;
      if (!this._invokeEvent(sEvtFunc))
        return true;

      // Refresh action is special
      if (oAct.action == "refresh") {
        var oRefr = this._oActRefresh;
        if (this._oFrame != null && this._oFrame.src != "" && oRefr.activityQuery != "") {
          var sQry = this._queryDataBind(oRefr.activityQuery);
          var oNavURL = SafeURL_createFromURL(oRefr.baseURI + sQry);
          var sNavURL = oNavURL.toURL();
        }
      }
      //reload the current doc, where as refresh api does a last gadget action.
      else if (oAct.action == "reload") {
        var oNavURL = "";
        var oDoc = this._oFrame.contentWindow.document;
        var harness = oDoc.getElementById("PEGA_HARNESS");
        var flag = false;
        if (harness == null && typeof (this._oFrame.contentWindow.frames[0]) != "undefined") {
          flag = true;
          harness = this._oFrame.contentWindow.frames[0].document.getElementById("PEGA_HARNESS");
        }
        if (harness != null) {
          var harforms = harness.getElementsByTagName('form');
          if (!harforms || harforms.length == 0) {
            return false;
          }
          var form = harforms[0];
        }

        var purpose = "";
        if (flag)
          purpose = this._oFrame.contentWindow.frames[0].strHarnessPurpose;
        else if (typeof (this._oFrame.contentWindow.strHarnessPurpose) != "undefined")
          purpose = this._oFrame.contentWindow.strHarnessPurpose;

        var url = "";
        // This is the if condition that needs to get executed if there is no harness currently loaded in the tab. The changes above marked in green will help us avoid the javascript errors and get to this condition successfully so that the original harness is reloaded
        if (purpose == "") {
          var oRefr = this._oActRefresh;
          if (this._oFrame != null && this._oFrame.src != "" && oRefr.activityQuery != "") {
            var sQry = this._queryDataBind(oRefr.activityQuery);
            oNavURL = SafeURL_createFromURL(oRefr.baseURI + sQry);
          }
        } else {
          var strURL = form.action;
          if (strURL.indexOf("pyactivitypzZZZ=") != -1) {
            var reqUri = strURL.substr(0, strURL.indexOf("pyactivitypzZZZ="));
            var index = strURL.lastIndexOf("=");
            if (index > -1) {
              strURL = URLObfuscation.decrypt(strURL.substr(index + 1, strURL.length - (index + 2)));
              strURL = reqUri + strURL;
            }
          }

          //url = strURL+"&Purpose="+this._oFrame.contentWindow.strHarnessPurpose;
          url = strURL + "&Purpose=" + purpose;
          oNavURL = SafeURL_createFromURL(url);
        }
        if (oNavURL) {
          if (oNavURL.get("pyActivity") && oNavURL.get("pyActivity") == "FinishAssignment")
            oNavURL.put("pyActivity", "Show-Harness");
        }
        var sNavURL = oNavURL.toURL();
      }
      else {

        // Finalize gateway URL if not provided as a parameter.
        var sNavURL = this._finalizeNavURL(oAct);
        if (sNavURL == "")
          return;
      }

      // Setup handler for IFrame 'navigate_complete' event.
      if (!pega.util.Event.isIE && !this._bAddedOnLoadListener) {

        //For Firefox, check conforming.
        pega.util.Event.addListener(this._oFrame, "load", this._onDomReadyFunc, null, this);
        this._bAddedOnLoadListener = true;
      }
      /*
             * To avoid flickering we are passing parameter to the server
             * Based on this we set overflowY: hidden on the harness body tag.
             * This is to avoid flickering due to scrollbar.
             */
      if (pega && pega.u && pega.u.d && pega.u.d._isDC() && pega.u.d._isJSResizeEnabled()) {
        sNavURL += "&isDcStretch=true";
      }

      // flag to test tooling and performance measurement that load is inflight
      // bug-243677; client load times for PAL is sent in next UI interaction
      var palData = null;
      if (pega && pega.ui && pega.ui.statetracking) palData = pega.ui.statetracking.setNavigationBusy(sNavURL);
	  if (palData) {
          if (palData.serverInteractionStart && palData.serverInteractionStart==true) sNavURL += "&ClientInt=Start";
          if (palData.clientInteractionDuration && palData.clientInteractionDuration>0) sNavURL += "&ClientLoadDuration=" + palData.clientInteractionDuration;
          if (palData.clientInteractionAction && palData.clientInteractionAction!=null) sNavURL += "&ClientIntAction=" + palData.clientInteractionAction;
      }

      // Navigate gadget's iframe
      pega.web.mgr._logMsg("info", this._id, "Manager", sNavURL);
      try {
        this._bLoaded = false;

                if(pega.web.api && pega.web.api.paramsObj && pega.web.api.paramsObj[this._id]){
                  var params = JSON.parse(pega.web.api.paramsObj[this._id]);
                  for(var param in params){
                    if(params.hasOwnProperty(param)){
                      sNavURL += "&" + encodeURIComponent(param) + "=" + encodeURIComponent(params[param]);
                    }
                  }
                }
        if (pega.web.config.cmd.pegaAction.httpMethod.toUpperCase() != "POST") {
                    if(this._oFrame.src =="about:blank" && pega.web.api && pega.web.api.headersObj && pega.web.api.headersObj[this._id] && Object.keys(pega.web.api.headersObj[this._id]).length > 0){
                      this._oFrame.src = this._oConfigDefs.serverURLWithHash+"?pyActivity=pzLoadMashupPage&Headers="+ encodeURIComponent(JSON.stringify(pega.web.api.headersObj[this._id]))
                      +"&RedirectTo="+encodeURIComponent(sNavURL);
                    } else {
          this._oFrame.src = sNavURL;
                    }
        } else {
          var inner = '<html><body><scr'
          + 'ipt type="text/javascript">var  form=document.createElement("form");form.setAttribute("method","post");form.setAttribute("action","'
          + this._oActRefresh.baseURI
          + '?encodedPassword=true' + '&pyActivity=%40baseclass.doUIAction");var input=document.createElement("input");input.setAttribute("name","action");'
          + 'input.setAttribute("type","hidden");input.setAttribute("value","' + oAct.action + '");form.appendChild(input);';
          /*HFix-25608: parameters passed along with flow name should be processed to support backward compatibility */
          if(oAct.params && oAct.params.flowName && oAct.params.flowName.indexOf("&") != -1){
            var flowParams = oAct.params.flowName.split("&");
            oAct.params.flowName = flowParams[0];
            for(var l=1; l < flowParams.length ; l++){
              var currentParam = flowParams[l];
              if(currentParam && currentParam.indexOf("=") != -1){
                var eqIndex = currentParam.indexOf("=");
                oAct.params[currentParam.substring(0,eqIndex)] = currentParam.substring(eqIndex+1);
              }
            }
          }
          //Bug-136223, passing encodedPassword=true and passing UserIdentifier and Password in the body for POST method.
          for (var i in oAct.params) {
            inner += 'var input=document.createElement("input");';
            inner += 'input.setAttribute("name","' + i + '");';
            str = oAct.params[i];
            inner += 'input.setAttribute("value","' + str + '");';
            inner += 'input.setAttribute("type","hidden");';
            inner += 'form.appendChild(input);';
          }
          inner += 'document.body.appendChild(form);form.submit();</script></body></html>';
          var doc = this._oFrame.contentDocument;
          if (doc == undefined || doc == null)
            doc = this._oFrame.contentWindow.document;
          doc.open();
          doc.write(inner);
          doc.close();
        }

      } catch (e) {
        pega.web.mgr._logMsg("error", this._id, "Manager", e.description);
      }
    },
    _invokeEvent: function(sEvtFunc) {
      if (sEvtFunc == "")
        return true;
      try {
        p_w_eval_1 = sEvtFunc;
        return eval(p_w_eval_1 + "('" + this._id + "')");
      } catch (e) {
        return true;
      }
    },
    _handleTimedEvent: function(sEvtFunc, sToken) {
      if (sEvtFunc == "")
        return true;
      try {
        var oFuncRef = eval("this._oWin." + sEvtFunc);
        if (typeof (sToken) != "undefined") {
          pega.web.mgr._logMsg("info", this._id, "Manager", "invoking event handler function '" + sEvtFunc + "', with token '" + sToken + "'");
          oFuncRef(this._id, sToken);
        }
        else {
          pega.web.mgr._logMsg("info", this._id, "Manager", "invoking event handler function '" + sEvtFunc + "'");
          oFuncRef(this._id);
        }
        //			window.setTimeout(sEvtFunc + "('" + this._id + "')", 10);
      } catch (e) {
        return true;
      }
    },
    _handleTimedError: function(sEvtFunc) {
      if (sEvtFunc == "")
        return true;
      try {
        pega.web.mgr._logMsg("info", this._id, "Manager", "invoking event handler function '" + sEvtFunc + "'");
        var oFuncRef = eval("this._oWin." + sEvtFunc);
        oFuncRef(this._id, this._sErrNum, this._sErrDescr);
        this._sErrNum = "";
        this._sErrDescr = "";
      } catch (e) {
        return true;
      }
    },
    _navigateSelfPopup: function(oAct) {
      var sNavURL = this._finalizeNavURL(oAct);
      if (sNavURL == "")
        return;

      var sOptions = "";
      // Added else if for popupoptions, as this is being set on reading div attributes	Bug-106623
      if (typeof (oAct.PegaPopupOptions) != "undefined")
      {
        sOptions = oAct.PegaPopupOptions;
      }
      else if (typeof (oAct.popupOptions) != "undefined")
      {
        sOptions = oAct.popupOptions;
      }
      this._launchPopup(this, sNavURL, sOptions);

    },
    _navigateTopPopup: function(oAct) {

      switch (oAct.target.type) {

        case '_top':
          var sNavURL = this._finalizeNavURL(oAct);
          if (sNavURL == "")
            return;
          window.location.href = sNavURL;
          break;

        case '_popup':

          // Process target gadget info, virtual or real. The default is _self.
          var oTgtGdt = null;

          if (typeof (oAct.popup.gadgetReference) != 'undefined' && oAct.popup.gadgetReference)
            oTgtGdt = pega.web.mgr._getGadgetByID(oAct.popup.gadgetReference);

          else if (typeof (oAct.target.name) != 'undefined' && oAct.target.name != "")
            oTgtGdt = pega.web.mgr._getGadgetByID(oAct.target.name);

          // Find popup window options. Use popup.options of the target gadget if any, else
          // use popup.options of the source gadget if any. Default to a fixed set of options.
          var arActions = null;
          var sOptions = "";
          if (oTgtGdt == null) {
            oTgtGdt = this;
            if (typeof (oAct.popup) != 'undefined'
                && typeof (oAct.popup.options) != 'undefined'
                && oAct.popup.options != "")
              sOptions = oAct.popup.options;
          }
          else {
            arActions = oTgtGdt._getActionDefs(oAct.action);
            if (arActions != null) {
              var oTgtAct = arActions[0];
              if (typeof (oTgtAct.popup) == 'undefined'
                  || typeof (oTgtAct.popup.options) == 'undefined'
                  || oTgtAct.popup.options == "")
                sOptions = oTgtAct.popup.options;
            }
          }

          // Launch popup.
          var sNavURL = oTgtGdt._finalizeNavURL(oAct);
          if (sNavURL == "")
            return;

          this._launchPopup(oTgtGdt, sNavURL, sOptions);
          break;
      }
    },
    _launchPopup: function(oTgtGdt, sNavURL, sOptions) {
      //bug-106623
      if (sOptions == "")
        sOptions = "height=600,width=800,status=yes,toolbar=yes,menubar=yes,location=no";

      // Popup window name must be unique. Reuse window if already opened.
      var sName = oTgtGdt._id;
      if (pega.web.mgr._htPopups.containsKey(sName)) {
        //			alert("Popup window name '" + sName + "' is not unique.");
        oTgtGdt._oPopWin.close();
        pega.web.mgr._htPopups.remove(sName);
            } else {
              /* Update sNavURL with pzLoadMashupPage URL */
              if(pega.web.api && pega.web.api.paramsObj && pega.web.api.paramsObj[this._id]){
                var params = JSON.parse(pega.web.api.paramsObj[this._id]);
                for(var param in params){
                  if(params.hasOwnProperty(param)){
                    sNavURL += "&" + encodeURIComponent(param) + "=" + encodeURIComponent(params[param]);
                  }
                }
      }
              if(pega.web.api && pega.web.api.headersObj && pega.web.api.headersObj[this._id] && Object.keys(pega.web.api.headersObj[this._id]).length > 0){
                sNavURL = this._oConfigDefs.serverURLWithHash+"?pyActivity=pzLoadMashupPage&Headers="+ encodeURIComponent(JSON.stringify(pega.web.api.headersObj[this._id])) +"&RedirectTo="+encodeURIComponent(sNavURL);
		}
	}
      if (window && window.launchbox && window.launchbox.Browser) {
        
        window.launchbox.Browser.start(window.location.origin+unescape(sNavURL), {
          'external' : false
        });
        
      }else{
        window.setTimeout( function(){
          // Launch popup.
          oTgtGdt._oPopWin = window.open(sNavURL, sName, sOptions);

          // Save gadget id in a manager-level hashtable for maintenance.
          pega.web.mgr._htPopups.put(sName, oTgtGdt._id);

          // Start popup window tracker interval timer if not already active.
          if (pega.web.mgr._iPopupTimerID == -1)
            pega.web.mgr._iPopupTimerID = window.setInterval("pega.web.mgr._iPopupTracker()", 500);
        },500);
      }

    },
    _evalDataFunc: function(sDataFunc, sToken) {
      if (sDataFunc == "")
        return true;
      try {
        sDataFunc = "this._oWin." + sDataFunc + "('" + sToken + "')";
        p_w_eval_1 = sDataFunc;
        return eval(p_w_eval_1);
      } catch (e) {
        return true;
      }
    },
    _getGadgetInfo: function() {
      try {

        // Start with config defaults already in place for this gadget.
        var sysID = this._oConfigDefs.systemID;
        var sAppName = this._oConfigDefs.appName;
        var sThread = this._oConfigDefs.thread;

        // Override config settings with runtime dynamic values.
        var oCfDyno = this._oConfigDyno;
        if (oCfDyno.systemID != "") {
          sysID = oCfDyno.systemID;
        }
        if (oCfDyno.appName != "") {
          sAppName = oCfDyno.appName;
        }
        if (oCfDyno.thread != "") {
          sThread = oCfDyno.thread;
        }

        var oUIDoc = this._doApiAction('getuidoc');
        if (oUIDoc == null)
          return null;
        var bDirty = oUIDoc.isFormDirty(false);

        return {
          application: sAppName,
          thread: sThread,
          system: sysID,
          UIDoc: oUIDoc,
          isDirty: bDirty.toString(),
          isLoaded: this._bLoaded.toString()
        };

      } catch (e) {
        return true;
      }
    },
    _detUIDoc: function() {
      var oUIDoc = null;
      try {
        oUIDoc = this._oFrame.contentWindow.pega.ui.d;
      }
      catch (e) {

        // Assume frameset. Find harness frame containing "HARNESS_CONTENT" DIV.
        try {
          var oIfr = this._oFrame;
          var oFr = null;
          var oCW = oIfr.contentWindow;
          if (oCW == null)
            return null;
          var oHD = oCW.document;
          var oHDB = oHD.body;
          if (oHDB == null)
            return null;
          var hcDiv = oHD.getElementById("HARNESS_CONTENT");
          if (hcDiv == null) {
            for (var i = 0; i < oHDB.childNodes.length; ++i) {
              oFr = oHDB.childNodes[i];
              if (oFr.tagName == "FRAME") {
                if (oFr.contentWindow == null)
                  continue;
                oHD = oFr.contentWindow.document;
                oHDB = oHD.body;
                hcDiv = oHD.getElementById("HARNESS_CONTENT");
                if (hcDiv != null)
                  break;
              }
            }
          }
          //alert("typeof(oFr.contentWindow.pega.ui.d) = " + typeof(oFr.contentWindow.pega.ui.d));
          oUIDoc = oFr.contentWindow.window.pega.ui.d;
          //					oUIDoc = oFr.contentWindow.top.window.pega.ui.d;
        }
        catch (e) {
        }
      }
      return oUIDoc;
    },
    _setGadgetData: function(sProp, sVal) {
      try {
        var oUIDoc = this._detUIDoc();
        if (oUIDoc == null)
          return false;
        oUIDoc.setProperty(sProp, sVal);
      }
      catch (e) {
        return false;
      }
    },
    _getGadgetData: function(sProp) {
      var oDoc = this._oFrame.contentWindow.document;

      // Use parentWindow property IE, defaultView property in FF.
      if (typeof (oDoc.parentWindow) != "undefined")
        var sWorkPage = oDoc.parentWindow['strPrimaryPage'];
      else if (typeof (oDoc.defaultView) != "undefined")
        var sWorkPage = oDoc.defaultView['strPrimaryPage'];
      else
        return "";

      if (typeof (sWorkPage) == "undefined") {
        pega.web.mgr._logMsg("info", this._id, "Manager", "cannot find workpage name defined by an element inside gadget");
        return;
      }
      var sEntryHandle = pega.web.mgr._prop.toHandle(sProp, sWorkPage);
      //		alert(pega.web.mgr._prop.toReference(sEntryHandle));

      pega.web.mgr._logMsg("info", this._id, "Manager", "converted property reference '" + sProp + "' into property handle '" + sEntryHandle + "', Workpage '" + sWorkPage + "'");
      if (this._htInsElements != null && this._htInsElements.containsKey(sEntryHandle)) {
        var sData = this._htInsElements.get(sEntryHandle).innerHTML;
        pega.web.mgr._logMsg("info", this._id, "Manager", "resolved gadget data binding to value '" + sData + "'");
        return sData;
      }
      else {
        try {
          var oUIDoc = this._detUIDoc();
          if (oUIDoc != null)
            var sData = oUIDoc.getProperty(sProp);
          pega.web.mgr._logMsg("info", this._id, "Manager", "resolved gadget data binding to value '" + sData + "'");
          return sData;
        }
        catch (e) {
        }
        pega.web.mgr._logMsg("info", this._id, "Manager", "cannot resolve gadget data binding for property '" + sEntryHandle + "'");
        return "";
      }
      /*
             if(oDoc) {
             var oEl = oDoc.getElementsByName(sEntryHandle);
             if(typeof(oEl) == "object" && oEl.length > 0) {
             oEl = oEl[0];
             switch(oEl.tagName) {

             case 'INPUT':
             return oEl.value;

             case 'SELECT':
             return oEl(oEl.selectedIndex).value;

             case 'RADIO':
             return oEl.value;

             }
             }
             else
             return "";
             }
             */
    },
    _objectRefBind: function(oSrc, dataBinder) {
      for (var i in oSrc) {
        if (typeof (oSrc[i]) != 'object')
          this._dataRefBind(oSrc, i, dataBinder);
        else
          this._objectRefBind(oSrc[i],dataBinder);
      }
    },
    _dataRefBind: function(oSrc, key ,dataBinder) {
      var sV = oSrc[key];
      if (typeof (sV) != "string"){
        return;
      }
      if(sV.indexOf("=[")>-1) {
        var propsToDatabind = oSrc[key].match(/\[([^\[]*)\]/g); /* This will get the properties which exists in []. */
        if(propsToDatabind){
          for(var i=0;i<propsToDatabind.length; i++){
            this.mapData(oSrc, key, propsToDatabind[i], dataBinder, function(obj, key, token, value){
              obj[key] = obj[key].replace(token, value);
            });
          }
        }
        return;
      }else if (sV.substr(0, 1) != "[") {
        return;
      }
      this.mapData(oSrc, key, oSrc[key], dataBinder, function(obj, key, token, value){
        obj[key]= value;
      });
    },

    mapData: function(oSrc, key, token, dataBinder,fn) {
      var arRef = token.substr(1, token.length - 2).split("/");
      var sKind = "page", sType = "id", sTok;
      if (arRef.length == 1) {
        sKind = 'gadget';
        sType = "";
        sTok = arRef[0];
      }
      else if (arRef.length == 3) {
        sKind = arRef[0];
        sType = arRef[1];
        sTok = arRef[2];
      }
      var sVal = "";
      switch (sKind) {
        case 'page':
          if (sType && (sType.toUpperCase() == "ID" || sType.toUpperCase() == "NAME")) {
            var oEls = this._oDoc.getElementsByName(sTok);
            //					var oEls = document.getElementsByName(sTok);
            if (oEls.length == 1)
              sVal = oEls[0].value;
          }
          else if (sType && sType.toUpperCase() == "FUNCTION") {
            var sFunc = this._oEvents.onPageData;
            sVal = (sFunc != "") ? this._evalDataFunc(sFunc, sTok) : "";
          }
          fn(oSrc, key, token, sVal);
          break;

        case 'gadget':
          var oGt = this;
          if(pega.Mashup){
            if (sType == ""){
              sType = this._id;
            }
            var scallback = function(response){
              fn(oSrc, key, token, response);
              dataBinder.decrementMsgCounter();
            };
            dataBinder.incrementMsgCounter();
            pega.web.api.doAction(sType, "getGadgetData", sTok,{"callback":scallback});
          }else{
            if (sType == "")
              sVal = this._getGadgetData(sTok);
            else {
              oGt = pega.web.mgr._htGadgets.get(sType);
              if (oGt != null)
                sVal = oGt._getGadgetData(sTok);
            }
            fn(oSrc, key, token, sVal);
          }
          break;
      }
    },
    _queryDataBind: function(sQry) {
      var ar1 = sQry.split('=[');
      var sFinQry = ar1[0];
      for (var i = 1; i < ar1.length; ++i) {
        var ar2 = ar1[i].split(']');

        //			var sVal = this._dataRefBind(ar2[0].split('/'));
        var sVal = this._dataRefBind("[" + ar2[0] + "]");

        sFinQry += ('=' + sVal + ar2[1]);
      }
      return sFinQry;
    },
    _finalizeQueryURL: function(oAct) {
      var oPars = oAct.params;
      var sQry = "", sV;
      var oKeys = oPars.key;
      if (oAct.action == "openlanding") {
        sQry = "?pyActivity=@baseclass.doUIAction&landingAction=" + oAct.action;
        /*}
                 else if(oAct.action.toLowerCase().indexOf("openrule") === 0){
                 sQry = "?pyActivity=openByHandleDD";*/
      } else if (oAct.action.toLowerCase() != "openworkbyurl" || oAct.action.toLowerCase().indexOf("openrule") === 0) {
        sQry = "?pyActivity=@baseclass.doUIAction&action=" + oAct.action;
      }

      /*if(oAct.action === "openWizard"){
             sQry += "&"+oAct.params.sQuery;
             } else {*/
      for (var sN in oPars) {
        sV = oPars[sN];
        if (!sV  || typeof sV == "object")
          continue;
        sQry += ("&" + sN + "=" + sV);
      }
      //}
      if (oAct.action.toLowerCase() == "openworkbyurl" && sQry.charAt(0) == "&") {
        sQry = "?" + sQry.substring(1);
      }
      return sQry;
    },
    _finalizeNavURL: function(oAct) {

      // Bug-116327 DC loads the gadgets even before ping completes, so need to check from the previous URL that whether dolloar format URL is needed or not.
      var thredNameInDollorFormat = false;
      // in the no URL case, build query from gadget attributes if any.
            var gwURL = this._oConfigDefs.serverURLWithHash || this._oConfigDefs.gatewayURL;
      if (gwURL == "")
        return "";
      if (gwURL.indexOf("$") != -1)
        thredNameInDollorFormat = true;
      //BUG-55689 remove the appname and thread name if already added to gateway url
      if (gwURL.indexOf("/!") != -1)
      {
        gwURL = gwURL.substring(0, gwURL.indexOf("/!"));
      }
      //BUG-48049
      if (gwURL.indexOf("/", gwURL.length - 1) == -1)
        gwURL = gwURL + "/";

      // Start with config defaults already in place for this gadget.
      var sysID = this._oConfigDefs.systemID;
      var sAppName = this._oConfigDefs.appName;
      var sThread = this._oConfigDefs.thread;

      // Override config settings with runtime dynamic values.
      // Blank out dynamic overrides for the next action runtime.
      var oCfDyno = this._oConfigDyno;
      if (oCfDyno.systemID != "") {
        sysID = oCfDyno.systemID;
        oCfDyno.systemID = "";
      }
      if (oCfDyno.appName != "") {
        sAppName = oCfDyno.appName;
        oCfDyno.appName = "";
      }
      if (oCfDyno.thread != "") {
        sThread = oCfDyno.thread;
        oCfDyno.thread = "";
      }

      // Perform data binding on URL
      var sQry = this._finalizeQueryURL(oAct);
      oAct.activityQuery = sQry;
      var sRefreshQry = sQry;			// save latest query prior to binding for "refresh".

      sQry = this._queryDataBind(sQry);
      oAct.activityQuery = sQry;

      // Build URL syntax depending on whether app name is specified.
      var sSysAppThread = "";
      if (gwURL.toLowerCase().indexOf("prgateway") != -1 || pega.web.mgr._bDirectPRPC == false || ((typeof (oAct.params.isRemote) != 'undefined') && oAct.params.isRemote)) {
        sSysAppThread = sysID != "" ? (sysID + "/") : "";
      }


      //		if(sAppName == "") {
      //			if(sThread == "")
      //				sThread = "!STANDARD";
      //			var iB = sThread.search(RegExp("!"));
      //			if(iB < 0) {
      //				sThread = "!" + sThread;
      //			}
      //			sSysAppThread = sSysAppThread + sThread;
      //		}

      //		var sBaseURI = gwURL + sSysAppThread + "!" + sAppName + "/$" + sThread;
      var sBaseURI = gwURL + sSysAppThread;
      if (pega && pega.u && pega.u.d && pega.u.d.isPortal() && applicationName === sAppName &&
          sAppName != "IWM") {
        if (pega.d.csrfToken != "") {
          sBaseURI += "!@" + pega.d.csrfToken + "!" + sThread;	//dont add the appName
        } else {
          //Bug-104419 Fix starts
          if (pega.web.mgr._bDirectPRPC == false || thredNameInDollorFormat)
          {
            // This is a portal in IAC with gateway

            sBaseURI += "!" + sAppName + "/$" + sThread + "/";
          }
          //Bug-104419 Fix ends
          else
          {
            sBaseURI += "!" + sThread;
          }
        }
      } else {
        //Bug-148418 starts
        //BUG-185070 removed forward slash for static content retrival
        sBaseURI += "!" + sAppName + "/$" + sThread + "";
        //Bug-148418 ends
        /*sBaseURI += "!" + sAppName + "/$" + sThread ;*/
      }

      // Pass through the SaveUrl with encryption and return final URL for navigation.
      var oNavURL = SafeURL_createFromURL(sBaseURI + sQry);

      //		var oNavURL = SafeURL_createFromURL(sBaseURI + "?pyStream=IAC_Error");

      // Safe 'refresh' parameters.
      var oRefr = this._oActRefresh;
      oRefr.activityQuery = sRefreshQry;
      oRefr.baseURI = sBaseURI;
      /* Start Benchmark for Portal */
      if (typeof bRecordEvent != "undefined" && bRecordEvent) {
        oNavURL.put("bRecordEvent", true);
        oNavURL.put("userStart", uwtUserStart);
        uwtPreSubmit = new Date().getTime();
        oNavURL.put("preSubmit", uwtPreSubmit);
      }
      /* End Benchmark for Portal */
      if(pega && pega.web && pega.web.isWebMashup == true ){
        oNavURL.put("isWebMashup", pega.web.isWebMashup);
      }
      if(pega.web.isWebMashup == true && (pega.util.Event.isIE || navigator.userAgent.indexOf('Edge') != -1)){
        oNavURL.put('sendP3P', 'y');
      }
      oAct.sNavURL = oNavURL.toURL();
      return oAct.sNavURL;
    },
    _navigatePortalPage: function(oAct) {
      var sNavURL = this._queryDataBind(oAct.pageURL);
      pega.web.mgr._logMsg("info", this._id, "Manager", "final page URL '" + sNavURL + "'");

      window.setTimeout("window.location.href = '" + sNavURL + "'", 100);
    },
    _ifrReadyStateChange: function(e) {

      // For IE, onload of the iframe when readystate changes
      if (this._oFrame.readyState == "complete") {
        this._onDomReadyFunc();
      }
    },
    _onDomReadyFunc: function() {
      try {

        // Raise onDomReady event if defined.
        if (this._oEvents.onDomReady != "") {
          /*
                     var oCW = this._oFrame.contentWindow;
                     var bIsHarness = false;
                     try {
                     var bIsHarness = oCW.pega && typeof (oCW.pega.ui.Doc) == "function";
                     } catch (e) {}
                     */
          this._doEvent("onDomReady");
        }
        /*
                 var oCW = this._oFrame.contentWindow;
                 if (!(oCW.pega && typeof (oCW.pega.ui.Doc) == "function")) {

                 // pega.ui.doc detected - PRPC harness is loaded inside this gadget
                 if(oCW.document.body.innerHTML.search(/harness_closeresponse.js/) > 0) {

                 }
                 // The contents of the iframe is not a Harness because we cannot detect pega.ui.doc.
                 //				pega.web.mgr.doAction(this._id, "error", "234", "invalid URL");
                 }
                 else {

                 // Not a PRPC harness document loaded.
                 }
                 */
      }
      catch (e) {
        //				pega.web.mgr.doAction(this._id, "error", "234", "invalid URL");
      }
    },
    _calculateViewPortHeight: function() {
      this.viewportheight = 1000;

      try {
        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerHeight
        if (typeof window.innerWidth != 'undefined')
        {
          this.viewportheight = window.innerHeight
        }
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement != 'undefined'
                 && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0)
        {
          this.viewportheight = document.documentElement.clientHeight
        }
        // older versions of IE
        else
        {
          this.viewportheight = document.getElementsByTagName('body')[0].clientHeight;
        }
      } catch (ex) {
      }

    },
    _offsetTop: function(element)
    {
      var total = 0;
      while (element)
      {
        total += element["offsetTop"];
        try {
          element = element.offsetParent;
        }
        catch (exception) {
          break;
        }
      }
      return total;
    },
    _setIFrame: function() {
      var sIfId = this._id + "Ifr";
      var oFr = this._oDoc.getElementsByName(sIfId);
      if (oFr.length == 0) {
        if (pega.util.Event.isIE && document.compatMode && document.compatMode.toUpperCase() == "CSS1COMPAT") {
          //var oIfr = this._oDoc.createElement("<iframe name=\""+sIfId+"\">");
          var oIfr = this._oDoc.createElement("IFRAME");
          oIfr.setAttribute("name", sIfId);
        }
        else {
          var oIfr = this._oDoc.createElement('iframe');
          oIfr.name = sIfId;
        }
        oIfr.id = sIfId;

        oIfr.PegaWebGadget = true;


        // Fix Bug-83240 start
        if (!pega.util.Dom.hasClass(document.body, "with-fixed-header")) {

          if (document.compatMode && document.compatMode.toUpperCase() == "CSS1COMPAT" && this._bMaxIframeSize)
          {

            oIfr.style.height = document.documentElement.clientHeight + "px";
            //oIfr.style.width  = document.documentElement.clientWidth +"px";
            oIfr.style.width = "100%";
          }
          else
          {
            oIfr.width = "100%";
            oIfr.height = "100%";

          }

          // Fix Bug-83240 End

          if (this._bMaxIframeSize) {
            //				oIfr.scrolling = "no";
            /* BUG-42787 Code changes start */
            if ((pega && pega.u && pega.u.d && pega.u.d.isPortal()) && this._bFillSpace && pega.env.ua.gecko) {
              oIfr.style.overflow = "auto";
            } else {
              oIfr.style.overflow = "hidden";
            }
            /* BUG-42787 code changes end */
          }
          else {
            oIfr.style.overflow = "auto";
          }
        }
        oIfr.setAttribute("border", "0");
        oIfr.setAttribute("frameBorder", "0");
        oIfr.src = "about:blank";
        this._oDiv.appendChild(oIfr);
        this._oFrame = oIfr;

        // This is not required for IAC Fill mode
        if ((pega && pega.u && pega.u.d && pega.u.d.isPortal()) || !this._bFillSpace) {
          if (!pega.util.Dom.hasClass(document.body, "with-fixed-header")) {
            this._oDiv.style.overflow = "hidden";
          }
        }

        if (pega.util.Event.isIE) {
          try {
            pega.util.Event.addListener(oIfr, "readystatechange", this._ifrReadyStateChange, null, this);
          }
          catch (e) {

          }
        }

      }
    },
    _camelCaseMapBuild: function() {
      this._htCamelCaseMap = new pega.tools.Hashtable();
      this._htCamelCaseMap.put("harnessname", "harnessName");
      this._htCamelCaseMap.put("readonly", "readOnly");
      //		this._htCamelCaseMap.put("framename", "frameName");
      //		this._htCamelCaseMap.put("harnessmode", "harnessMode");
      this._htCamelCaseMap.put("classname", "className");
      this._htCamelCaseMap.put("performpreprocessing", "performPreProcessing");
      this._htCamelCaseMap.put("pzprimarypagename", "pzPrimaryPageName");
      this._htCamelCaseMap.put("workid", "workID");
      //		this._htCamelCaseMap.put("querystring", "queryString");
      this._htCamelCaseMap.put("flowname", "flowName");
      this._htCamelCaseMap.put("useridentifier", "UserIdentifier");
      this._htCamelCaseMap.put("appname", "appName");
    },
    _fillInConfigDefaults: function(oTgt) {
      var oSrc = pega.web.config;

      if (typeof (oSrc.gatewayURL) != 'undefined' && oSrc.gatewayURL != "" && oTgt.gatewayURL == "")
        oTgt.gatewayURL = oSrc.gatewayURL;

      if (typeof (oSrc.appName) != 'undefined' && oSrc.appName != "" && oTgt.appName == "")
        oTgt.appName = oSrc.appName;

      if (typeof (oSrc.systemID) != 'undefined' && oSrc.systemID != "" && oTgt.systemID == "")
        oTgt.systemID = oSrc.systemID;

      if (typeof (oSrc.thread) != 'undefined' && oSrc.thread != "" && oTgt.thread == "")
        oTgt.thread = oSrc.thread;
    },
    _validatePageAPI: function(sActName) {
      switch (sActName.toLowerCase()) {
        case "load":
        case "refresh":
        case "reload":
        case "openrulebykeys":
        case "openrulebyclassandname":
        case "openrulespecific":
        case "openassignment":
        case "createnewwork":
        case "openworkitem":
        case "openworkbyhandle":
        case "getnextwork":
        case "getnextworkitem":
        case "openlanding":
        case "openworkbyurl":
        case "display":
        case "displayonpage":
        case "logoff":
        case "getgadgetdata":
        case "setgadgetdata":
        case "getgadgetinfo":
        case "print":
        case "restretch":
        case "getuidoc":
        case "openwizard":
        case "showharness":
        case "blank":
        case "reportdefinition":
          return true;

        default:
          return false;
      }
    },
    _validateGadgetAPI: function(sActName) {
      switch (sActName.toLowerCase()) {
        case "openrulebykeys":
        case "openrulebyclassandname":
        case "openrulespecific":
        case "load":
        case "refresh":
        case "openassignment":
        case "createnewwork":
        case "openworkitem":
        case "openworkbyhandle":
        case "openlanding":
        case "displayonpage":
        case "getnextwork":
        case "getnextworkitem":
        case "openworkbyurl":
        case "display":
        case "getgadgetdata":
        case "setgadgetdata":
        case "print":
        case "resize":
        case "restretch":
        case "loaded":
        case "closed":
        case "confirm":
        case "custom":
        case "error":
        case "blank":
          return true;

        default:
          return false;
      }
    },
    _validateAttrAction: function(sActName) {
      switch (sActName.toLowerCase()) {
        case "openassignment":
        case "createnewwork":
        case "openworkitem":
        case "openlanding":
        case "openworkbyhandle":
        case "getnextwork":
        case "getnextworkitem":
        case "openworkbyurl":
        case "display":
          return true;

        default:
          return false;
      }
    },
    _getGadgetAttribsMap: function(oDivAttr){

      var iacAttr = [];
      var attributeMap = [];
      attributeMap[0] =  ["PegaA", "data-pega-action"];
      attributeMap[1] =  ["PegaA", "PegaAction"];
      attributeMap[2] =  [ "PegaSystemID", "data-pega-systemid"];
      attributeMap[3] =  [ "PegaThread", "data-pega-threadname"];
      attributeMap[4] =  [ "PegaAppName", "data-pega-applicationname"];
      attributeMap[5] =  [ "PegaDefer", "data-pega-isdeferloaded"];
      attributeMap[6] =  [ "PegaTargetType", "data-pega-targettype"];
      attributeMap[7] =  [ "PegaPopupOptions", "data-pega-popupoptions"];
      attributeMap[8] =  [ "PegaResize", "data-pega-resizetype"];
      attributeMap[9] =  [ "PegaE_onLoad", "data-pega-event-onload"];
      attributeMap[10] = [ "PegaE_onBeforeLoad", "data-pega-event-onbeforeload"];
      attributeMap[11] = [ "PegaE_onConfirm", "data-pega-event-onconfirm"];
      attributeMap[12] = [ "PegaE_onClose", "data-pega-event-onclose"];
      attributeMap[13] = [ "PegaE_onCustom", "data-pega-event-oncustom"];
      attributeMap[14] = [ "PegaE_onPageData", "data-pega-event-onpagedata"];
      attributeMap[15] = [ "PegaE_onResize", "data-pega-event-onresize"];
      attributeMap[16] = [ "PegaE_onError", "data-pega-event-onerror"];
      attributeMap[17] = [ "PegaE_onDomReady", "data-pega-event-ondomready"];
      attributeMap[18] = [ "PegaA_harnessName", "data-pega-action-param-harnessname"];
      attributeMap[19] = [ "PegaA_className", "data-pega-action-param-classname"];
      attributeMap[20] = [ "PegaA_readOnly", "data-pega-action-param-isreadonly"];
      attributeMap[21] = [ "PegaA_page", "data-pega-action-param-pagename"];
      attributeMap[22] = [ "PegaA_query", "data-pega-action-param-query"];
      attributeMap[23] = [ "PegaA_key", "data-pega-action-param-key"];
      attributeMap[24] = [ "PegaA_workID", "data-pega-action-param-workid"];
      attributeMap[25] = [ "PegaA_params", "data-pega-action-param-parameters"];
      attributeMap[26] = [ "PegaA_flowName", "data-pega-action-param-flowname"];
      attributeMap[27] = [ "PegaA_model", "data-pega-action-param-model"];
      var actionCount = 0;
      for(var count=0; count<attributeMap.length; count++){
        var legacyAttr = attributeMap[count][0];
        var newAttr = attributeMap[count][1];
        iacAttr[legacyAttr] = (oDivAttr[legacyAttr] || oDivAttr[newAttr])?(oDivAttr[legacyAttr] || oDivAttr[newAttr]):iacAttr[legacyAttr];
        if(legacyAttr.indexOf("PegaA_")!=-1){
          iacAttr[actionCount] = (oDivAttr[legacyAttr] || oDivAttr[newAttr])?(oDivAttr[legacyAttr] || oDivAttr[newAttr]):iacAttr[legacyAttr];
          if(iacAttr[actionCount]){
            iacAttr[actionCount].keyName = legacyAttr;
            actionCount++;
          }
        }
      }
      return iacAttr;
    },
    _getProps: function() {

      // DIV pega attributes only used if PegaA of PegaAction attribute is defined.
      var oDA = this._getGadgetAttribsMap(this._oDiv.attributes);

      if (typeof (oDA["PegaA"]) != "undefined") {
        this._oDivAttrs.action = oDA["PegaA"].nodeValue;
      }
      else {
        this._oDivAttrs.action = "display";	// default to 'display'
      }
      if (!this._validateAttrAction(this._oDivAttrs.action)) {
        pega.web.mgr._logMsg("error", this._id, "Manager", "error: IAC does not support PegaA or PegaAction attribute: " + this._oDivAttrs.action);
        this._oDivAttrs.action = "";
      }

      //		if(this._oDivAttrs.action != "") {

      // Process common attributes
      if (typeof (oDA["PegaSystemID"]) != "undefined") {
        this._oConfigDefs.systemID = oDA["PegaSystemID"].nodeValue;
      }

            if(pega && pega.web && pega.web.isWebMashup){
              if (this._oDiv.attributes["data-pega-url"]) {
                  this._oConfigDefs.serverURL = this._oDiv.attributes["data-pega-url"].nodeValue;
                  this._oConfigDefs.serverURLWithHash = this._oConfigDefs.serverURL;
              }
              if (this._oDiv.attributes["data-pega-tenantid"]) {
                  this._oConfigDefs.tenantID = this._oDiv.attributes["data-pega-tenantid"].nodeValue;
              }
	      if(this._oDiv.attributes["data-pega-redirectguests"]){
	      this._oConfigDefs.redirectGuests = this._oDiv.attributes["data-pega-redirectguests"].nodeValue;
	      }
            }          

      if (typeof (oDA["PegaThread"]) != "undefined") {
        this._oConfigDefs.thread = oDA["PegaThread"].nodeValue;
      }
      if (typeof (oDA["PegaAppName"]) != "undefined") {
        this._oConfigDefs.appName = oDA["PegaAppName"].nodeValue;
      }
      if (typeof (oDA["PegaDefer"]) != "undefined") {
        this._oDivAttrs.defer = oDA["PegaDefer"].nodeValue;
      }
      if (typeof (oDA["PegaTargetType"]) != "undefined") {
        this._oDivAttrs.targetType = oDA["PegaTargetType"].nodeValue;
      }
      if (typeof (oDA["PegaPopupOptions"]) != "undefined") {
        this._oDivAttrs.popupOptions = oDA["PegaPopupOptions"].nodeValue;
      }
      if (typeof (oDA["PegaResize"]) != "undefined") {
        this._bMaxIframeSize = ((oDA["PegaResize"].nodeValue) == "stretch" || (oDA["PegaResize"].nodeValue) == "fill") ? true : false;
        this._bFillSpace = (oDA["PegaResize"].nodeValue) == "fill" ? true : false;
        if (this._bFillSpace) {
          this._divOffsetWidth = this._oDiv.offsetWidth;
          this._divOffsetHeight = this._oDiv.offsetHeight;
        }
      }

      //BUG-166117 start , provide one custom attribute for percentage height/width as necessary
      if (typeof (oDA["PegaSizeInPercentage"]) != "undefined" && oDA["PegaSizeInPercentage"].nodeValue == "true") {
        this._sizeInPercentage = true;
      }
      //BUG-166117 end


      if (this._oConfigDefs.thread == "") {
        this._oConfigDefs.thread = "STANDARD";
      }

      // Process PegaA_xxx user defined attributes.
      var oPar = this._oDivAttrs.params;
      p_w_eval_1 = oPar;
      for (var i = 0, oA, sN, sV; i < oDA.length; ++i) {
        oA = oDA[i];
        if(!oA)continue;
        sN = oA.keyName;
        if (sN.substr(0, 6).toLowerCase() != "pegaa_")
          continue;
        sN = sN.substring(6);
        sV = oA.nodeValue;
        if (sN != "params") {

          // Value is a string. Append name:value pair to this._oDivAttrs.params object.
          if (this._htCamelCaseMap.containsKey(sN))
            sN = this._htCamelCaseMap.get(sN);
          p_w_eval_2 = sN;
          p_w_eval_3 = sV;
          eval("p_w_eval_1." + p_w_eval_2 + " = p_w_eval_3");
        }
        else {
          // FireFox attribute lowercasing workaround. Value is an object.
          // Allow syntactical leniency by accepting both object literal and
          // string containing object literal definition.
          p_w_eval_3 = sV;
          try {
            eval("p_w_eval_2 = " + p_w_eval_3);
            for (p_w_eval_4 in p_w_eval_2) {
              p_w_eval_3 = p_w_eval_2[p_w_eval_4];
              if (p_w_eval_3 == "")
                continue;
              eval("p_w_eval_1." + p_w_eval_4 + " = p_w_eval_3");
            }
          }
          catch (e) {
            pega.web.mgr._logMsg("error", this._id, "Manager",
                                 "error: invalid Javascript object literal syntax in attribute 'PegaA_params' value " + p_w_eval_3);
          }
        }
      }
      //		}

      // Process event definition attributes.
      if (typeof (oDA["PegaE_onLoad"]) != "undefined") {
        this._oEvents.onLoad = oDA["PegaE_onLoad"].nodeValue;
      }
      if (typeof (oDA["PegaE_onBeforeLoad"]) != "undefined") {
        this._oEvents.onBeforeLoad = oDA["PegaE_onBeforeLoad"].nodeValue;
      }
      if (typeof (oDA["PegaE_onConfirm"]) != "undefined") {
        this._oEvents.onConfirm = oDA["PegaE_onConfirm"].nodeValue;
      }
      if (typeof (oDA["PegaE_onCustom"]) != "undefined") {
        this._oEvents.onCustom = oDA["PegaE_onCustom"].nodeValue;
      }
      if (typeof (oDA["PegaE_onClose"]) != "undefined") {
        this._oEvents.onClose = oDA["PegaE_onClose"].nodeValue;
      }
      if (typeof (oDA["PegaE_onError"]) != "undefined") {
        this._oEvents.onError = oDA["PegaE_onError"].nodeValue;
      }
      if (typeof (oDA["PegaE_onDomReady"]) != "undefined") {
        this._oEvents.onDomReady = oDA["PegaE_onDomReady"].nodeValue;
      }
      if (typeof (oDA["PegaE_onPageData"]) != "undefined") {
        this._oEvents.onPageData = oDA["PegaE_onPageData"].nodeValue;
      }
      // onResize event
      if (typeof (oDA["PegaE_onResize"]) != "undefined") {
        this._oEvents.onResize = oDA["PegaE_onResize"].nodeValue;
      }

      // Fill in common attributes using config object.
      this._fillInConfigDefaults(this._oConfigDefs);

      // Get gadget definition JS object in script island if present.
      // Define _oGdtActions array of gadget action objects.
      try {
        this._oDivProps = eval("this._oWin." + this._id);


        if (this._oDivProps != null && typeof (this._oDivProps.actionDefinitions) != 'undefined') {

          this._oGdtActions = this._oDivProps.actionDefinitions;
        }
      }
      catch (e) {
      }
      /*
             // Get referenced by gadget JS object if present.
             // Otherwise try find default 'PegaGadgetDefault' JS object.
             try {
             this._oRefProps = eval(this._oDivProps.baseAttributeRef);
             } catch(e) {}

             try {
             this._oRefProps = eval("PegaGadgetDefault");
             } catch(e) {}

             if(typeof(this._oRefProps) == 'undefined')
             this._oRefProps = null;

             // Assemble final gadget JS object by merging base, div island, and div attribute
             // derived object. Override matching attributes according to object precedence.
             if(this._oRefProps != null) {

             // Start with referenced base object's actionDefinitions array of action sub-objects.
             if(typeof(this._oRefProps.actionDefinitions) != 'undefined') {
             for(var iA in this._oRefProps.actionDefinitions) {
             var oSrcAct = this._oRefProps.actionDefinitions[iA];
             if(typeof(oSrcAct.action) == "undefined" || oSrcAct.action == "")
             continue;

             // Clone action object model, append to the gadget object
             var oAct = pega.web.mgr._ut._clone(this._oActionModel);
             oGgtDef.actionDefinitions[oGgtDef.actionDefinitions.length] = oAct;

             // Merge base properties actions into the gadget object
             pega.web.mgr._ut._mergeTgtSrc(oAct, oSrcAct);
             }
             }

             // Merge base properties clientEvent(s) into the gadget object
             if(typeof(this._oRefProps.clientEvent) != 'undefined') {
             pega.web.mgr._ut._mergeTgtSrc(oGgtDef.clientEvent, this._oRefProps.clientEvent);
             }

             // Update default gateway data with attributes of the referenced object.
             this._updateCommonDefaults(this._oRefProps);
             }

             // Update gadget JS object action with the overrides defined in div island script object
             if(this._oDivProps != null) {

             // Start with referenced div object's actionDefinitions array of action sub-objects.
             if(typeof(this._oDivProps.actionDefinitions) != 'undefined') {
             for(var iA in this._oDivProps.actionDefinitions) {
             var oSrcAct = this._oDivProps.actionDefinitions[iA];
             if(typeof(oSrcAct.action) == "undefined" || oSrcAct.action == "")
             continue;

             // Try to find like-named action in the assembled gadget definition
             var oAct = null;
             for(var j=0; j < oGgtDef.actionDefinitions.length; ++j) {
             oAct = oGgtDef.actionDefinitions[j];
             if(oSrcAct.action == oAct.action)
             break;
             }

             // If did not find in loop, clone action object model, append to
             // the gadget object, and merge with div island defined action
             if(j >= oGgtDef.actionDefinitions.length) {
             oAct = pega.web.mgr._ut._clone(this._oActionModel);
             oGgtDef.actionDefinitions[oGgtDef.actionDefinitions.length] = oAct;
             }
             pega.web.mgr._ut._mergeTgtSrc(oAct, oSrcAct);
             }
             }

             // Update default gateway data with attributes of the div island object.
             //			this._updateCommonDefaults(this._oDivProps);

             // Merge div island properties clientEvent(s) into the gadget object
             if(typeof(this._oDivProps.clientEvent) != 'undefined') {
             pega.web.mgr._ut._mergeTgtSrc(oGgtDef.clientEvent, this._oDivProps.clientEvent);
             }
             this._fillInConfigDefaults(oGgtDef);
             }

             // Override default gateway data with PegaXxx attributes of the div element.
             this._updateCommonDefaults(this._oDivAttrs);

             // Update gadget definition object's 'navigate' action with PegaXxx attributes.
             var oAct = null;

             if(typeof(this._oDivAttrs.action) != "undefined" && this._oDivAttrs.action != "") {
             for(var j=0; j < oGgtDef.actionDefinitions.length; ++j) {
             oAct = oGgtDef.actionDefinitions[j];
             if(oAct.action == this._oDivAttrs.action)
             break;
             }

             // If attributes defined action was not found in the object,
             // add one derived from div attributes data.
             if(j >= oGgtDef.actionDefinitions.length) {
             oAct = pega.web.mgr._ut._clone(this._oActionModel);
             oGgtDef.actionDefinitions[oGgtDef.actionDefinitions.length] = oAct;
             }
             pega.web.mgr._ut._mergeTgtSrc(oAct, this._oDivAttrs);
             }
             */
    }//,
    /*
         _doAction: function(oAction, args) {
         if(typeof(oAction) == 'string') {
         var sAction = oAction;
         if(sAction == "getGadgetData") {
         return this._getGadgetData(args);
         }
         else {
         var oActDef = this._getActionDef(sAction);
         if(oActDef == null
         && sAction == "refresh"
         && this._oFrame != null
         && this._oFrame.src != "") {
         this._oFrame.contentWindow.location.reload();
         return;
         }
         var bHaveArgs = false;
         if(typeof(args) == "object") {
         for(i in args) {
         bHaveArgs = true;
         break;
         }
         }
         var oAct = null;
         if(oActDef == null) {

         // No sAction called action defined on gadget. Create action definition object.
         if(bHaveArgs) {
         oAct = pega.web.mgr._ut._clone(this._oActionModel);
         oAct.action = sAction;
         pega.web.mgr._ut._mergeTgtSrc(oAct.params, args);
         }
         }
         else {

         // Override action definition with parameters passed in the client API doAction call.
         //					if(bHaveArgs) {
         //						oAct = pega.web.mgr._ut._clone(oActDef);
         //						pega.web.mgr._ut._mergeTgtSrc(oAct.params, args);
         //					}
         }
         if(oAct == null)
         oAct = oActDef;
         if(oAct != null) {
         this._execAction(oAct);
         }
         }
         }
         },

         _execAction: function(oAct) {

         // Data bind action definition object.
         this._objectRefBind(oAct);

         if(oAct.target.type == "") {
         this._navigateGadgetFrame(oAct);
         return;
         }
         switch (oAct.target.type) {

         case '_self':
         this._navigateGadgetFrame(oAct);
         break;

         case '_gadget':
         var oTgtGdt = pega.web.mgr._htGadgets.get(oAct.target.name);
         if(oTgtGdt == null)
         return;
         //			if(oAct.target.action != "")
         //				oTgtGdt._doAction(oAct.target.action);
         if(oAct.actionMapping != "")
         oTgtGdt._doAction(oAct.actionMapping);
         else
         oTgtGdt._navigateGadgetFrame(oAct);
         break;

         case '_popup':
         this._navigateTopPopup(oAct);
         break;

         case '_top':
         this._navigateTopPopup(oAct);
         break;

         case '_page':
         this._navigatePortalPage(oAct);
         break;
         }
         },

         _updateCommonDefaults: function(oSrc) {
         // Update default gateway and display data in final properties object.
         var oTgt = this._oGadgetDef;

         if(typeof(oSrc.gatewayURL) != 'undefined' && oSrc.gatewayURL != "")
         oTgt.gatewayURL = oSrc.gatewayURL;

         if(typeof(oSrc.appName) != 'undefined' && oSrc.appName != "")
         oTgt.appName = oSrc.appName;

         if(typeof(oSrc.systemID) != 'undefined' && oSrc.systemID != "")
         oTgt.systemID = oSrc.systemID;

         if(typeof(oSrc.thread) != 'undefined' && oSrc.thread != "")
         oTgt.thread = oSrc.thread;
         },
         */
  }

  /* utilities object */
  pega.web.utils = function() {
  }

  pega.web.utils.prototype = {
    _clone: function(o) {
      if (o == null || typeof (o) != 'object')
        return o;
      var c = {};
      for (var i in o)
        c[i] = pega.web.mgr._ut._clone(o[i]);
      return c;
    },
    _isInteger: function(sText) {
      var sValidChars = "0123456789";
      var bIsInt = true;
      var sCh;
      for (i = 0; i < sText.length && bIsInt; ++i) {
        sCh = sText.charAt(i);
        if (sValidChars.indexOf(sCh) == -1)
          bIsInt = false;
      }
      return bIsInt;
    },
    _mergeTgtSrc: function(oTgt, oSrc) {
      for (var i in oSrc) {
        if (typeof (oSrc[i]) != 'object')
          oTgt[i] = oSrc[i];
        else
          this._mergeTgtSrc(oTgt[i], oSrc[i]);
      }
    },
    _setCookie: function(name, value, days) {
      var date = new Date();
      days = (days == null || days == 0) ? 1 : days;
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + escape(value) +
        ";expires=" + date.toGMTString();
    },
    _readCookie: function(name) {
      var cookies = "" + document.cookie;
      var startIndex = cookies.indexOf(name);
      if (startIndex == -1 || name == "")
        return "";
      var endIndex = cookies.indexOf(';', startIndex);
      if (endIndex == -1)
        endIndex = cookies.length;
      return unescape(cookies.substring(startIndex + name.length + 1, endIndex));
    }
  }

  /* config object template */
  pega.web.config = {
    gatewayURL: "",
    appName: "",
    systemID: "",
    cookiesDisabled: "<div>Browser cookies must be enabled for PRPC Internet Application Composer to function.</div>",
    thread: "!STANDARD",
    encrypt: true
  }
  pega.web.config.cmd = {"pegaAction": {"httpMethod": "GET"}};

  // New the IAC manager and API objects.
  pega.web.mgr = new pega.web.manager();
  pega.web.api = new pega.web.apiSingleton();

}	// This is the closing brace for the if(bPegaIacInitialOnLoad) statement at the top.
//</script>