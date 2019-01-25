/*  PegaInternetApplicationComposer V3.1 Revision: 01   Date: Tue Aug 13 16:30:54 IST 2013   */
if(typeof pega=="undefined"||!pega){
    var pega={}
}
pega.namespace=function(){
    var F=arguments,G=null,I,J,H;
    for(I=0;
    I<F.length;
    I=I+1){
        H=F[I].split(".");
        G=pega;
        for(J=(H[0]=="pega")?1:0;
        J<H.length;
        J=J+1){
            G[H[J]]=G[H[J]]||{};
            G=G[H[J]]
        }
        
    }
    return G
};
pega.log=function(F,E,G){
    var H=pega.widget.Logger;
    if(H&&H.log){
        return H.log(F,E,G)
    }
    else{
        return false
    }
    
};
pega.register=function(M,R,J){
    var N=pega.env.modules;
    if(!N[M]){
        N[M]={
            versions:[],builds:[]
        }
        
    }
    var L=N[M],O=J.version,P=J.build,Q=pega.env.listeners;
    L.name=M;
    L.version=O;
    L.build=P;
    L.versions.push(O);
    L.builds.push(P);
    L.mainClass=R;
    for(var K=0;
    K<Q.length;
    K=K+1){
        Q[K](L)
    }
    if(R){
        R.VERSION=O;
        R.BUILD=P
    }
    else{
        pega.log("mainClass is undefined for module "+M,"warn")
    }
    
};
pega.env=pega.env||{
    modules:[],listeners:[]
};
pega.env.getVersion=function(B){
    return pega.env.modules[B]||null
};
pega.env.ua=function(){
    var E={
        ie:0,opera:0,gecko:0,webkit:0,mobile:null,air:0
    };
    var F=navigator.userAgent,D;
    if((/KHTML/).test(F)){
        E.webkit=1
    }
    D=F.match(/AppleWebKit\/([^\s]*)/);
    if(D&&D[1]){
        E.webkit=parseFloat(D[1]);
        if(/ Mobile\//.test(F)){
            E.mobile="Apple"
        }
        else{
            D=F.match(/NokiaN[^\/]*/);
            if(D){
                E.mobile=D[0]
            }
            
        }
        D=F.match(/AdobeAIR\/([^\s]*)/);
        if(D){
            E.air=D[0]
        }
        
    }
    if(!E.webkit){
        D=F.match(/Opera[\s\/]([^\s]*)/);
        if(D&&D[1]){
            E.opera=parseFloat(D[1]);
            D=F.match(/Opera Mini[^;]*/);
            if(D){
                E.mobile=D[0]
            }
            
        }
        else{
            D=F.match(/MSIE\s([^;]*)/);
            if(D&&D[1]){
                E.ie=parseFloat(D[1])
            }
            else{
                D=F.match(/Gecko\/([^\s]*)/);
                if(D){
                    E.gecko=1;
                    D=F.match(/rv:([^\s\)]*)/);
                    if(D&&D[1]){
                        E.gecko=parseFloat(D[1])
                    }
                    
                }
                
            }
            
        }
        
    }
    return E
}
();
(function(){
    pega.namespace("util","widget","example");
    if("undefined"!==typeof pega_config){
        var H=pega_config.listener,E=pega.env.listeners,F=true,G;
        if(H){
            for(G=0;
            G<E.length;
            G=G+1){
                if(E[G]==H){
                    F=false;
                    break
                }
                
            }
            if(F){
                E.push(H)
            }
            
        }
        
    }
    
})();
pega.lang=pega.lang||{};
(function(){
    var D=pega.lang,E=["toString","valueOf"],F={
        isArray:function(A){
            if(A){
                return D.isNumber(A.length)&&D.isFunction(A.splice)
            }
            return false
        }
        ,isBoolean:function(A){
            return typeof A==="boolean"
        }
        ,isFunction:function(A){
            return typeof A==="function"
        }
        ,isNull:function(A){
            return A===null
        }
        ,isNumber:function(A){
            return typeof A==="number"&&isFinite(A)
        }
        ,isObject:function(A){
            return(A&&(typeof A==="object"||D.isFunction(A)))||false
        }
        ,isString:function(A){
            return typeof A==="string"
        }
        ,isUndefined:function(A){
            return typeof A==="undefined"
        }
        ,_IEEnumFix:(pega.env.ua.ie)?function(C,I){
            for(var J=0;
            J<E.length;
            J=J+1){
                var A=E[J],B=I[A];
                if(D.isFunction(B)&&B!=Object.prototype[A]){
                    C[A]=B
                }
                
            }
            
        }
        :function(){},extend:function(B,A,C){
            if(!A||!B){
                throw new Error("extend failed, please check that all dependencies are included.")
            }
            var J=function(){};
            J.prototype=A.prototype;
            B.prototype=new J();
            B.prototype.constructor=B;
            B.superclass=A.prototype;
            if(A.prototype.constructor==Object.prototype.constructor){
                A.prototype.constructor=A
            }
            if(C){
                for(var K in C){
                    if(D.hasOwnProperty(C,K)){
                        B.prototype[K]=C[K]
                    }
                    
                }
                D._IEEnumFix(B.prototype,C)
            }
            
        }
        ,augmentObject:function(B,C){
            if(!C||!B){
                throw new Error("Absorb failed, verify dependencies.")
            }
            var L=arguments,J,A,K=L[2];
            if(K&&K!==true){
                for(J=2;
                J<L.length;
                J=J+1){
                    B[L[J]]=C[L[J]]
                }
                
            }
            else{
                for(A in C){
                    if(K||!(A in B)){
                        B[A]=C[A]
                    }
                    
                }
                D._IEEnumFix(B,C)
            }
            
        }
        ,augmentProto:function(A,B){
            if(!B||!A){
                throw new Error("Augment failed, verify dependencies.")
            }
            var H=[A.prototype,B.prototype];
            for(var C=2;
            C<arguments.length;
            C=C+1){
                H.push(arguments[C])
            }
            D.augmentObject.apply(this,H)
        }
        ,dump:function(A,N){
            var Q,O,C=[],B="{...}",R="f(){...}",M=", ",P=" => ";
            if(!D.isObject(A)){
                return A+""
            }
            else{
                if(A instanceof Date||("nodeType" in A&&"tagName" in A)){
                    return A
                }
                else{
                    if(D.isFunction(A)){
                        return R
                    }
                    
                }
                
            }
            N=(D.isNumber(N))?N:3;
            if(D.isArray(A)){
                C.push("[");
                for(Q=0,O=A.length;
                Q<O;
                Q=Q+1){
                    if(D.isObject(A[Q])){
                        C.push((N>0)?D.dump(A[Q],N-1):B)
                    }
                    else{
                        C.push(A[Q])
                    }
                    C.push(M)
                }
                if(C.length>1){
                    C.pop()
                }
                C.push("]")
            }
            else{
                C.push("{");
                for(Q in A){
                    if(D.hasOwnProperty(A,Q)){
                        C.push(Q+P);
                        if(D.isObject(A[Q])){
                            C.push((N>0)?D.dump(A[Q],N-1):B)
                        }
                        else{
                            C.push(A[Q])
                        }
                        C.push(M)
                    }
                    
                }
                if(C.length>1){
                    C.pop()
                }
                C.push("}")
            }
            return C.join("")
        }
        ,substitute:function(B,f,Y){
            var b,c,d,V,U,C,W=[],e,a="dump",X=" ",A="{",T="}";
            for(;
            ;
            ){
                b=B.lastIndexOf(A);
                if(b<0){
                    break
                }
                c=B.indexOf(T,b);
                if(b+1>=c){
                    break
                }
                e=B.substring(b+1,c);
                V=e;
                C=null;
                d=V.indexOf(X);
                if(d>-1){
                    C=V.substring(d+1);
                    V=V.substring(0,d)
                }
                U=f[V];
                if(Y){
                    U=Y(V,U,C)
                }
                if(D.isObject(U)){
                    if(D.isArray(U)){
                        U=D.dump(U,parseInt(C,10))
                    }
                    else{
                        C=C||"";
                        var Z=C.indexOf(a);
                        if(Z>-1){
                            C=C.substring(4)
                        }
                        if(U.toString===Object.prototype.toString||Z>-1){
                            U=D.dump(U,parseInt(C,10))
                        }
                        else{
                            U=U.toString()
                        }
                        
                    }
                    
                }
                else{
                    if(!D.isString(U)&&!D.isNumber(U)){
                        U="~-"+W.length+"-~";
                        W[W.length]=e
                    }
                    
                }
                B=B.substring(0,b)+U+B.substring(c+1)
            }
            for(b=W.length-1;
            b>=0;
            b=b-1){
                B=B.replace(new RegExp("~-"+b+"-~"),"{"+W[b]+"}","g")
            }
            return B
        }
        ,trim:function(B){
            try{
                return B.replace(/^\s+|\s+$/g,"")
            }
            catch(A){
                return B
            }
            
        }
        ,merge:function(){
            var A={},C=arguments;
            for(var B=0,H=C.length;
            B<H;
            B=B+1){
                D.augmentObject(A,C[B],true)
            }
            return A
        }
        ,later:function(C,R,B,P,O){
            C=C||0;
            R=R||{};
            var Q=B,M=P,N,A;
            if(D.isString(B)){
                Q=R[B]
            }
            if(!Q){
                throw new TypeError("method undefined")
            }
            if(!D.isArray(M)){
                M=[P]
            }
            N=function(){
                Q.apply(R,M)
            };
            A=(O)?setInterval(N,C):setTimeout(N,C);
            return{
                interval:O,cancel:function(){
                    if(this.interval){
                        clearInterval(A)
                    }
                    else{
                        clearTimeout(A)
                    }
                    
                }
                
            }
            
        }
        ,isValue:function(A){
            return(D.isObject(A)||D.isString(A)||D.isNumber(A)||D.isBoolean(A))
        }
        
    };
    D.hasOwnProperty=(Object.prototype.hasOwnProperty)?function(B,A){
        return B&&B.hasOwnProperty(A)
    }
    :function(B,A){
        return !D.isUndefined(B[A])&&B.constructor.prototype[A]!==B[A]
    };
    F.augmentObject(D,F,true);
    pega.util.Lang=D;
    D.augment=D.augmentProto;
    pega.augment=D.augmentProto;
    pega.extend=D.extend
})();
pega.register("yahoo",pega,{
    version:"2.5.2",build:"1076"
});
pega.util.Get=function(){
    var X={},Y=0,T=0,f=false,W=pega.env.ua,S=pega.lang;
    var a=function(B,E,A){
        var D=A||window,G=D.document,F=G.createElement(B);
        for(var C in E){
            if(E[C]&&pega.lang.hasOwnProperty(E,C)){
                F.setAttribute(C,E[C])
            }
            
        }
        return F
    };
    var c=function(D,C,A){
        var B=A||"utf-8";
        return a("link",{
            id:"yui__dyn_"+(T++),type:"text/css",charset:B,rel:"stylesheet",href:D
        }
        ,C)
    };
    var V=function(D,C,A){
        var B=A||"utf-8";
        return a("script",{
            id:"yui__dyn_"+(T++),type:"text/javascript",charset:B,src:D
        }
        ,C)
    };
    var j=function(B,A){
        return{
            tId:B.tId,win:B.win,data:B.data,nodes:B.nodes,msg:A,purge:function(){
                g(this.tId)
            }
            
        }
        
    };
    var i=function(D,A){
        var C=X[A],B=(S.isString(D))?C.win.document.getElementById(D):D;
        if(!B){
            U(A,"target node not found: "+D)
        }
        return B
    };
    var U=function(A,B){
        var D=X[A];
        if(D.onFailure){
            var C=D.scope||D.win;
            D.onFailure.call(C,j(D,B))
        }
        
    };
    var h=function(A){
        var D=X[A];
        D.finished=true;
        if(D.aborted){
            var B="transaction "+A+" was aborted";
            U(A,B);
            return 
        }
        if(D.onSuccess){
            var C=D.scope||D.win;
            D.onSuccess.call(C,j(D))
        }
        
    };
    var d=function(F,B){
        var G=X[F];
        if(G.aborted){
            var D="transaction "+F+" was aborted";
            U(F,D);
            return 
        }
        if(B){
            G.url.shift();
            if(G.varName){
                G.varName.shift()
            }
            
        }
        else{
            G.url=(S.isString(G.url))?[G.url]:G.url;
            if(G.varName){
                G.varName=(S.isString(G.varName))?[G.varName]:G.varName
            }
            
        }
        var J=G.win,K=J.document,A=K.getElementsByTagName("head")[0],E;
        if(G.url.length===0){
            if(G.type==="script"&&W.webkit&&W.webkit<420&&!G.finalpass&&!G.varName){
                var C=V(null,G.win,G.charset);
                C.innerHTML='pega.util.Get._finalize("'+F+'");';
                G.nodes.push(C);
                A.appendChild(C)
            }
            else{
                h(F)
            }
            return 
        }
        var H=G.url[0];
        if(G.type==="script"){
            E=V(H,J,G.charset)
        }
        else{
            E=c(H,J,G.charset)
        }
        e(G.type,E,F,H,J,G.url.length);
        G.nodes.push(E);
        if(G.insertBefore){
            var I=i(G.insertBefore,F);
            if(I){
                I.parentNode.insertBefore(E,I)
            }
            
        }
        else{
            A.appendChild(E)
        }
        if((W.webkit||W.gecko)&&G.type==="css"){
            d(F,H)
        }
        
    };
    var Z=function(){
        if(f){
            return 
        }
        f=true;
        for(var B in X){
            var A=X[B];
            if(A.autopurge&&A.finished){
                g(A.tId);
                delete X[B]
            }
            
        }
        f=false
    };
    var g=function(F){
        var A=X[F];
        if(A){
            var G=A.nodes,E=G.length,H=A.win.document,B=H.getElementsByTagName("head")[0];
            if(A.insertBefore){
                var C=i(A.insertBefore,F);
                if(C){
                    B=C.parentNode
                }
                
            }
            for(var D=0;
            D<E;
            D=D+1){
                B.removeChild(G[D])
            }
            
        }
        A.nodes=[]
    };
    var b=function(D,E,C){
        var A="q"+(Y++);
        C=C||{};
        if(Y%pega.util.Get.PURGE_THRESH===0){
            Z()
        }
        X[A]=S.merge(C,{
            tId:A,type:D,url:E,finished:false,nodes:[]
        });
        var B=X[A];
        B.win=B.win||window;
        B.scope=B.scope||B.win;
        B.autopurge=("autopurge" in B)?B.autopurge:(D==="script")?true:false;
        S.later(0,B,d,A);
        return{
            tId:A
        }
        
    };
    var e=function(I,D,E,G,C,B,J){
        var A=J||d;
        if(W.ie){
            D.onreadystatechange=function(){
                var K=this.readyState;
                if("loaded"===K||"complete"===K){
                    A(E,G)
                }
                
            }
            
        }
        else{
            if(W.webkit){
                if(I==="script"){
                    if(W.webkit>=420){
                        D.addEventListener("load",function(){
                            A(E,G)
                        })
                    }
                    else{
                        var H=X[E];
                        if(H.varName){
                            var F=pega.util.Get.POLL_FREQ;
                            H.maxattempts=pega.util.Get.TIMEOUT/F;
                            H.attempts=0;
                            H._cache=H.varName[0].split(".");
                            H.timer=S.later(F,H,function(K){
                                var N=this._cache,O=N.length,P=this.win,M;
                                for(M=0;
                                M<O;
                                M=M+1){
                                    P=P[N[M]];
                                    if(!P){
                                        this.attempts++;
                                        if(this.attempts++>this.maxattempts){
                                            var L="Over retry limit, giving up";
                                            H.timer.cancel();
                                            U(E,L)
                                        }
                                        else{}return 
                                    }
                                    
                                }
                                H.timer.cancel();
                                A(E,G)
                            }
                            ,null,true)
                        }
                        else{
                            S.later(pega.util.Get.POLL_FREQ,null,A,[E,G])
                        }
                        
                    }
                    
                }
                
            }
            else{
                D.onload=function(){
                    A(E,G)
                }
                
            }
            
        }
        
    };
    return{
        POLL_FREQ:10,PURGE_THRESH:20,TIMEOUT:2000,_finalize:function(A){
            S.later(0,null,h,A)
        }
        ,abort:function(B){
            var A=(S.isString(B))?B:B.tId;
            var C=X[A];
            if(C){
                C.aborted=true
            }
            
        }
        ,script:function(B,A){
            return b("script",B,A)
        }
        ,css:function(B,A){
            return b("css",B,A)
        }
        
    }
    
}
();
pega.register("get",pega.util.Get,{
    version:"2.5.2",build:"1076"
});
(function(){
    var Y=pega,util=Y.util,lang=Y.lang,env=Y.env,PROV="_provides",SUPER="_supersedes",REQ="expanded",AFTER="_after";
    var YUI={
        dupsAllowed:{
            yahoo:true,get:true
        }
        ,info:{
            base:"http://yui.yahooapis.com/2.5.2/build/",skin:{
                defaultSkin:"sam",base:"assets/skins/",path:"skin.css",after:["reset","fonts","grids","base"],rollup:3
            }
            ,dupsAllowed:["yahoo","get"],moduleInfo:{
                animation:{
                    type:"js",path:"animation/animation-min.js",requires:["dom","event"]
                }
                ,autocomplete:{
                    type:"js",path:"autocomplete/autocomplete-min.js",requires:["dom","event"],optional:["connection","animation"],skinnable:true
                }
                ,base:{
                    type:"css",path:"base/base-min.css",after:["reset","fonts","grids"]
                }
                ,button:{
                    type:"js",path:"button/button-min.js",requires:["element"],optional:["menu"],skinnable:true
                }
                ,calendar:{
                    type:"js",path:"calendar/calendar-min.js",requires:["event","dom"],skinnable:true
                }
                ,charts:{
                    type:"js",path:"charts/charts-experimental-min.js",requires:["element","json","datasource"]
                }
                ,colorpicker:{
                    type:"js",path:"colorpicker/colorpicker-min.js",requires:["slider","element"],optional:["animation"],skinnable:true
                }
                ,connection:{
                    type:"js",path:"connection/connection-min.js",requires:["event"]
                }
                ,container:{
                    type:"js",path:"container/container-min.js",requires:["dom","event"],optional:["dragdrop","animation","connection"],supersedes:["containercore"],skinnable:true
                }
                ,containercore:{
                    type:"js",path:"container/container_core-min.js",requires:["dom","event"],pkg:"container"
                }
                ,cookie:{
                    type:"js",path:"cookie/cookie-beta-min.js",requires:["yahoo"]
                }
                ,datasource:{
                    type:"js",path:"datasource/datasource-beta-min.js",requires:["event"],optional:["connection"]
                }
                ,datatable:{
                    type:"js",path:"datatable/datatable-beta-min.js",requires:["element","datasource"],optional:["calendar","dragdrop"],skinnable:true
                }
                ,dom:{
                    type:"js",path:"dom/dom-min.js",requires:["yahoo"]
                }
                ,dragdrop:{
                    type:"js",path:"dragdrop/dragdrop-min.js",requires:["dom","event"]
                }
                ,editor:{
                    type:"js",path:"editor/editor-beta-min.js",requires:["menu","element","button"],optional:["animation","dragdrop"],supersedes:["simpleeditor"],skinnable:true
                }
                ,element:{
                    type:"js",path:"element/element-beta-min.js",requires:["dom","event"]
                }
                ,event:{
                    type:"js",path:"event/event-min.js",requires:["yahoo"]
                }
                ,fonts:{
                    type:"css",path:"fonts/fonts-min.css"
                }
                ,get:{
                    type:"js",path:"get/get-min.js",requires:["yahoo"]
                }
                ,grids:{
                    type:"css",path:"grids/grids-min.css",requires:["fonts"],optional:["reset"]
                }
                ,history:{
                    type:"js",path:"history/history-min.js",requires:["event"]
                }
                ,imagecropper:{
                    type:"js",path:"imagecropper/imagecropper-beta-min.js",requires:["dom","event","dragdrop","element","resize"],skinnable:true
                }
                ,imageloader:{
                    type:"js",path:"imageloader/imageloader-min.js",requires:["event","dom"]
                }
                ,json:{
                    type:"js",path:"json/json-min.js",requires:["yahoo"]
                }
                ,layout:{
                    type:"js",path:"layout/layout-beta-min.js",requires:["dom","event","element"],optional:["animation","dragdrop","resize","selector"],skinnable:true
                }
                ,logger:{
                    type:"js",path:"logger/logger-min.js",requires:["event","dom"],optional:["dragdrop"],skinnable:true
                }
                ,menu:{
                    type:"js",path:"menu/menu-min.js",requires:["containercore"],skinnable:true
                }
                ,profiler:{
                    type:"js",path:"profiler/profiler-beta-min.js",requires:["yahoo"]
                }
                ,profilerviewer:{
                    type:"js",path:"profilerviewer/profilerviewer-beta-min.js",requires:["profiler","yuiloader","element"],skinnable:true
                }
                ,reset:{
                    type:"css",path:"reset/reset-min.css"
                }
                ,"reset-fonts-grids":{
                    type:"css",path:"reset-fonts-grids/reset-fonts-grids.css",supersedes:["reset","fonts","grids","reset-fonts"],rollup:4
                }
                ,"reset-fonts":{
                    type:"css",path:"reset-fonts/reset-fonts.css",supersedes:["reset","fonts"],rollup:2
                }
                ,resize:{
                    type:"js",path:"resize/resize-beta-min.js",requires:["dom","event","dragdrop","element"],optional:["animation"],skinnable:true
                }
                ,selector:{
                    type:"js",path:"selector/selector-beta-min.js",requires:["yahoo","dom"]
                }
                ,simpleeditor:{
                    type:"js",path:"editor/simpleeditor-beta-min.js",requires:["element"],optional:["containercore","menu","button","animation","dragdrop"],skinnable:true,pkg:"editor"
                }
                ,slider:{
                    type:"js",path:"slider/slider-min.js",requires:["dragdrop"],optional:["animation"]
                }
                ,tabview:{
                    type:"js",path:"tabview/tabview-min.js",requires:["element"],optional:["connection"],skinnable:true
                }
                ,treeview:{
                    type:"js",path:"treeview/treeview-min.js",requires:["event"],skinnable:true
                }
                ,uploader:{
                    type:"js",path:"uploader/uploader-experimental.js",requires:["element"]
                }
                ,utilities:{
                    type:"js",path:"utilities/utilities.js",supersedes:["yahoo","event","dragdrop","animation","dom","connection","element","yahoo-dom-event","get","yuiloader","yuiloader-dom-event"],rollup:8
                }
                ,yahoo:{
                    type:"js",path:"yahoo/yahoo-min.js"
                }
                ,"yahoo-dom-event":{
                    type:"js",path:"yahoo-dom-event/yahoo-dom-event.js",supersedes:["yahoo","event","dom"],rollup:3
                }
                ,yuiloader:{
                    type:"js",path:"yuiloader/yuiloader-beta-min.js",supersedes:["yahoo","get"]
                }
                ,"yuiloader-dom-event":{
                    type:"js",path:"yuiloader-dom-event/yuiloader-dom-event.js",supersedes:["yahoo","dom","event","get","yuiloader","yahoo-dom-event"],rollup:5
                }
                ,yuitest:{
                    type:"js",path:"yuitest/yuitest-min.js",requires:["logger"],skinnable:true
                }
                
            }
            
        }
        ,ObjectUtil:{
            appendArray:function(o,a){
                if(a){
                    for(var i=0;
                    i<a.length;
                    i=i+1){
                        o[a[i]]=true
                    }
                    
                }
                
            }
            ,keys:function(o,ordered){
                var a=[],i;
                for(i in o){
                    if(lang.hasOwnProperty(o,i)){
                        a.push(i)
                    }
                    
                }
                return a
            }
            
        }
        ,ArrayUtil:{
            appendArray:function(a1,a2){
                Array.prototype.push.apply(a1,a2)
            }
            ,indexOf:function(a,val){
                for(var i=0;
                i<a.length;
                i=i+1){
                    if(a[i]===val){
                        return i
                    }
                    
                }
                return -1
            }
            ,toObject:function(a){
                var o={};
                for(var i=0;
                i<a.length;
                i=i+1){
                    o[a[i]]=true
                }
                return o
            }
            ,uniq:function(a){
                return YUI.ObjectUtil.keys(YUI.ArrayUtil.toObject(a))
            }
            
        }
        
    };
    pega.util.YUILoader=function(o){
        this._internalCallback=null;
        this._useYahooListener=false;
        this.onSuccess=null;
        this.onFailure=Y.log;
        this.onProgress=null;
        this.scope=this;
        this.data=null;
        this.insertBefore=null;
        this.charset=null;
        this.varName=null;
        this.base=YUI.info.base;
        this.ignore=null;
        this.force=null;
        this.allowRollup=true;
        this.filter=null;
        this.required={};
        this.moduleInfo=lang.merge(YUI.info.moduleInfo);
        this.rollups=null;
        this.loadOptional=false;
        this.sorted=[];
        this.loaded={};
        this.dirty=true;
        this.inserted={};
        var self=this;
        env.listeners.push(function(m){
            if(self._useYahooListener){
                self.loadNext(m.name)
            }
            
        });
        this.skin=lang.merge(YUI.info.skin);
        this._config(o)
    };
    Y.util.YUILoader.prototype={
        FILTERS:{
            RAW:{
                searchExp:"-min\\.js",replaceStr:".js"
            }
            ,DEBUG:{
                searchExp:"-min\\.js",replaceStr:"-debug.js"
            }
            
        }
        ,SKIN_PREFIX:"skin-",_config:function(o){
            if(o){
                for(var i in o){
                    if(lang.hasOwnProperty(o,i)){
                        if(i=="require"){
                            this.require(o[i])
                        }
                        else{
                            this[i]=o[i]
                        }
                        
                    }
                    
                }
                
            }
            var f=this.filter;
            if(lang.isString(f)){
                f=f.toUpperCase();
                if(f==="DEBUG"){
                    this.require("logger")
                }
                if(!Y.widget.LogWriter){
                    Y.widget.LogWriter=function(){
                        return Y
                    }
                    
                }
                this.filter=this.FILTERS[f]
            }
            
        }
        ,addModule:function(o){
            if(!o||!o.name||!o.type||(!o.path&&!o.fullpath)){
                return false
            }
            o.ext=("ext" in o)?o.ext:true;
            o.requires=o.requires||[];
            this.moduleInfo[o.name]=o;
            this.dirty=true;
            return true
        }
        ,require:function(what){
            var a=(typeof what==="string")?arguments:what;
            this.dirty=true;
            YUI.ObjectUtil.appendArray(this.required,a)
        }
        ,_addSkin:function(skin,mod){
            var name=this.formatSkin(skin),info=this.moduleInfo,sinf=this.skin,ext=info[mod]&&info[mod].ext;
            if(!info[name]){
                this.addModule({
                    name:name,type:"css",path:sinf.base+skin+"/"+sinf.path,after:sinf.after,rollup:sinf.rollup,ext:ext
                })
            }
            if(mod){
                name=this.formatSkin(skin,mod);
                if(!info[name]){
                    var mdef=info[mod],pkg=mdef.pkg||mod;
                    this.addModule({
                        name:name,type:"css",after:sinf.after,path:pkg+"/"+sinf.base+skin+"/"+mod+".css",ext:ext
                    })
                }
                
            }
            return name
        }
        ,getRequires:function(mod){
            if(!mod){
                return[]
            }
            if(!this.dirty&&mod.expanded){
                return mod.expanded
            }
            mod.requires=mod.requires||[];
            var i,d=[],r=mod.requires,o=mod.optional,info=this.moduleInfo,m;
            for(i=0;
            i<r.length;
            i=i+1){
                d.push(r[i]);
                m=info[r[i]];
                YUI.ArrayUtil.appendArray(d,this.getRequires(m))
            }
            if(o&&this.loadOptional){
                for(i=0;
                i<o.length;
                i=i+1){
                    d.push(o[i]);
                    YUI.ArrayUtil.appendArray(d,this.getRequires(info[o[i]]))
                }
                
            }
            mod.expanded=YUI.ArrayUtil.uniq(d);
            return mod.expanded
        }
        ,getProvides:function(name,notMe){
            var addMe=!(notMe),ckey=(addMe)?PROV:SUPER,m=this.moduleInfo[name],o={};
            if(!m){
                return o
            }
            if(m[ckey]){
                return m[ckey]
            }
            var s=m.supersedes,done={},me=this;
            var add=function(mm){
                if(!done[mm]){
                    done[mm]=true;
                    lang.augmentObject(o,me.getProvides(mm))
                }
                
            };
            if(s){
                for(var i=0;
                i<s.length;
                i=i+1){
                    add(s[i])
                }
                
            }
            m[SUPER]=o;
            m[PROV]=lang.merge(o);
            m[PROV][name]=true;
            return m[ckey]
        }
        ,calculate:function(o){
            if(this.dirty){
                this._config(o);
                this._setup();
                this._explode();
                if(this.allowRollup){
                    this._rollup()
                }
                this._reduce();
                this._sort();
                this.dirty=false
            }
            
        }
        ,_setup:function(){
            var info=this.moduleInfo,name,i,j;
            for(name in info){
                var m=info[name];
                if(m&&m.skinnable){
                    var o=this.skin.overrides,smod;
                    if(o&&o[name]){
                        for(i=0;
                        i<o[name].length;
                        i=i+1){
                            smod=this._addSkin(o[name][i],name)
                        }
                        
                    }
                    else{
                        smod=this._addSkin(this.skin.defaultSkin,name)
                    }
                    m.requires.push(smod)
                }
                
            }
            var l=lang.merge(this.inserted);
            if(!this._sandbox){
                l=lang.merge(l,env.modules)
            }
            if(this.ignore){
                YUI.ObjectUtil.appendArray(l,this.ignore)
            }
            if(this.force){
                for(i=0;
                i<this.force.length;
                i=i+1){
                    if(this.force[i] in l){
                        delete l[this.force[i]]
                    }
                    
                }
                
            }
            for(j in l){
                if(lang.hasOwnProperty(l,j)){
                    lang.augmentObject(l,this.getProvides(j))
                }
                
            }
            this.loaded=l
        }
        ,_explode:function(){
            var r=this.required,i,mod;
            for(i in r){
                mod=this.moduleInfo[i];
                if(mod){
                    var req=this.getRequires(mod);
                    if(req){
                        YUI.ObjectUtil.appendArray(r,req)
                    }
                    
                }
                
            }
            
        }
        ,_skin:function(){},formatSkin:function(skin,mod){
            var s=this.SKIN_PREFIX+skin;
            if(mod){
                s=s+"-"+mod
            }
            return s
        }
        ,parseSkin:function(mod){
            if(mod.indexOf(this.SKIN_PREFIX)===0){
                var a=mod.split("-");
                return{
                    skin:a[1],module:a[2]
                }
                
            }
            return null
        }
        ,_rollup:function(){
            var i,j,m,s,rollups={},r=this.required,roll;
            if(this.dirty||!this.rollups){
                for(i in this.moduleInfo){
                    m=this.moduleInfo[i];
                    if(m&&m.rollup){
                        rollups[i]=m
                    }
                    
                }
                this.rollups=rollups
            }
            for(;
            ;
            ){
                var rolled=false;
                for(i in rollups){
                    if(!r[i]&&!this.loaded[i]){
                        m=this.moduleInfo[i];
                        s=m.supersedes;
                        roll=false;
                        if(!m.rollup){
                            continue
                        }
                        var skin=(m.ext)?false:this.parseSkin(i),c=0;
                        if(skin){
                            for(j in r){
                                if(i!==j&&this.parseSkin(j)){
                                    c++;
                                    roll=(c>=m.rollup);
                                    if(roll){
                                        break
                                    }
                                    
                                }
                                
                            }
                            
                        }
                        else{
                            for(j=0;
                            j<s.length;
                            j=j+1){
                                if(this.loaded[s[j]]&&(!YUI.dupsAllowed[s[j]])){
                                    roll=false;
                                    break
                                }
                                else{
                                    if(r[s[j]]){
                                        c++;
                                        roll=(c>=m.rollup);
                                        if(roll){
                                            break
                                        }
                                        
                                    }
                                    
                                }
                                
                            }
                            
                        }
                        if(roll){
                            r[i]=true;
                            rolled=true;
                            this.getRequires(m)
                        }
                        
                    }
                    
                }
                if(!rolled){
                    break
                }
                
            }
            
        }
        ,_reduce:function(){
            var i,j,s,m,r=this.required;
            for(i in r){
                if(i in this.loaded){
                    delete r[i]
                }
                else{
                    var skinDef=this.parseSkin(i);
                    if(skinDef){
                        if(!skinDef.module){
                            var skin_pre=this.SKIN_PREFIX+skinDef.skin;
                            for(j in r){
                                m=this.moduleInfo[j];
                                var ext=m&&m.ext;
                                if(!ext&&j!==i&&j.indexOf(skin_pre)>-1){
                                    delete r[j]
                                }
                                
                            }
                            
                        }
                        
                    }
                    else{
                        m=this.moduleInfo[i];
                        s=m&&m.supersedes;
                        if(s){
                            for(j=0;
                            j<s.length;
                            j=j+1){
                                if(s[j] in r){
                                    delete r[s[j]]
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                }
                
            }
            
        }
        ,_sort:function(){
            var s=[],info=this.moduleInfo,loaded=this.loaded,checkOptional=!this.loadOptional,me=this;
            var requires=function(aa,bb){
                if(loaded[bb]){
                    return false
                }
                var ii,mm=info[aa],rr=mm&&mm.expanded,after=mm&&mm.after,other=info[bb],optional=mm&&mm.optional;
                if(rr&&YUI.ArrayUtil.indexOf(rr,bb)>-1){
                    return true
                }
                if(after&&YUI.ArrayUtil.indexOf(after,bb)>-1){
                    return true
                }
                if(checkOptional&&optional&&YUI.ArrayUtil.indexOf(optional,bb)>-1){
                    return true
                }
                var ss=info[bb]&&info[bb].supersedes;
                if(ss){
                    for(ii=0;
                    ii<ss.length;
                    ii=ii+1){
                        if(requires(aa,ss[ii])){
                            return true
                        }
                        
                    }
                    
                }
                if(mm.ext&&mm.type=="css"&&(!other.ext)){
                    return true
                }
                return false
            };
            for(var i in this.required){
                s.push(i)
            }
            var p=0;
            for(;
            ;
            ){
                var l=s.length,a,b,j,k,moved=false;
                for(j=p;
                j<l;
                j=j+1){
                    a=s[j];
                    for(k=j+1;
                    k<l;
                    k=k+1){
                        if(requires(a,s[k])){
                            b=s.splice(k,1);
                            s.splice(j,0,b[0]);
                            moved=true;
                            break
                        }
                        
                    }
                    if(moved){
                        break
                    }
                    else{
                        p=p+1
                    }
                    
                }
                if(!moved){
                    break
                }
                
            }
            this.sorted=s
        }
        ,toString:function(){
            var o={
                type:"YUILoader",base:this.base,filter:this.filter,required:this.required,loaded:this.loaded,inserted:this.inserted
            };
            lang.dump(o,1)
        }
        ,insert:function(o,type){
            this.calculate(o);
            if(!type){
                var self=this;
                this._internalCallback=function(){
                    self._internalCallback=null;
                    self.insert(null,"js")
                };
                this.insert(null,"css");
                return 
            }
            this._loading=true;
            this.loadType=type;
            this.loadNext()
        }
        ,sandbox:function(o,type){
            if(o){}else{}this._config(o);
            if(!this.onSuccess){
                throw new Error("You must supply an onSuccess handler for your sandbox")
            }
            this._sandbox=true;
            var self=this;
            if(!type||type!=="js"){
                this._internalCallback=function(){
                    self._internalCallback=null;
                    self.sandbox(null,"js")
                };
                this.insert(null,"css");
                return 
            }
            if(!util.Connect){
                var ld=new pega.util.YUILoader();
                ld.insert({
                    base:this.base,filter:this.filter,require:"connection",insertBefore:this.insertBefore,charset:this.charset,onSuccess:function(){
                        this.sandbox(null,"js")
                    }
                    ,scope:this
                }
                ,"js");
                return 
            }
            this._scriptText=[];
            this._loadCount=0;
            this._stopCount=this.sorted.length;
            this._xhr=[];
            this.calculate();
            var s=this.sorted,l=s.length,i,m,url;
            for(i=0;
            i<l;
            i=i+1){
                m=this.moduleInfo[s[i]];
                if(!m){
                    this.onFailure.call(this.scope,{
                        msg:"undefined module "+m,data:this.data
                    });
                    for(var j=0;
                    j<this._xhr.length;
                    j=j+1){
                        this._xhr[j].abort()
                    }
                    return 
                }
                if(m.type!=="js"){
                    this._loadCount++;
                    continue
                }
                url=m.fullpath||this._url(m.path);
                var xhrData={
                    success:function(o){
                        var idx=o.argument[0],name=o.argument[2];
                        this._scriptText[idx]=o.responseText;
                        if(this.onProgress){
                            this.onProgress.call(this.scope,{
                                name:name,scriptText:o.responseText,xhrResponse:o,data:this.data
                            })
                        }
                        this._loadCount++;
                        if(this._loadCount>=this._stopCount){
                            var v=this.varName||"pega";
                            var t="(function() {\n";
                            var b="\nreturn "+v+";\n})();";
                            var ref=eval(t+this._scriptText.join("\n")+b);
                            this._pushEvents(ref);
                            if(ref){
                                this.onSuccess.call(this.scope,{
                                    reference:ref,data:this.data
                                })
                            }
                            else{
                                this.onFailure.call(this.scope,{
                                    msg:this.varName+" reference failure",data:this.data
                                })
                            }
                            
                        }
                        
                    }
                    ,failure:function(o){
                        this.onFailure.call(this.scope,{
                            msg:"XHR failure",xhrResponse:o,data:this.data
                        })
                    }
                    ,scope:this,argument:[i,url,s[i]]
                };
                this._xhr.push(util.Connect.asyncRequest("GET",url,xhrData))
            }
            
        }
        ,loadNext:function(mname){
            if(!this._loading){
                return 
            }
            if(mname){
                if(mname!==this._loading){
                    return 
                }
                this.inserted[mname]=true;
                if(this.onProgress){
                    this.onProgress.call(this.scope,{
                        name:mname,data:this.data
                    })
                }
                
            }
            var s=this.sorted,len=s.length,i,m;
            for(i=0;
            i<len;
            i=i+1){
                if(s[i] in this.inserted){
                    continue
                }
                if(s[i]===this._loading){
                    return 
                }
                m=this.moduleInfo[s[i]];
                if(!m){
                    this.onFailure.call(this.scope,{
                        msg:"undefined module "+m,data:this.data
                    });
                    return 
                }
                if(!this.loadType||this.loadType===m.type){
                    this._loading=s[i];
                    var fn=(m.type==="css")?util.Get.css:util.Get.script,url=m.fullpath||this._url(m.path),self=this,c=function(o){
                        self.loadNext(o.data)
                    };
                    if(env.ua.webkit&&env.ua.webkit<420&&m.type==="js"&&!m.varName){
                        c=null;
                        this._useYahooListener=true
                    }
                    fn(url,{
                        data:s[i],onSuccess:c,insertBefore:this.insertBefore,charset:this.charset,varName:m.varName,scope:self
                    });
                    return 
                }
                
            }
            this._loading=null;
            if(this._internalCallback){
                var f=this._internalCallback;
                this._internalCallback=null;
                f.call(this)
            }
            else{
                if(this.onSuccess){
                    this._pushEvents();
                    this.onSuccess.call(this.scope,{
                        data:this.data
                    })
                }
                
            }
            
        }
        ,_pushEvents:function(ref){
            var r=ref||pega;
            if(r.util&&r.util.Event){
                r.util.Event._load()
            }
            
        }
        ,_url:function(path){
            var u=this.base||"",f=this.filter;
            u=u+path;
            if(f){
                u=u.replace(new RegExp(f.searchExp),f.replaceStr)
            }
            return u
        }
        
    }
    
})();
(function(){
    var R=pega.util,X,Z,Y={},c={},V=window.document;
    pega.env._id_counter=pega.env._id_counter||0;
    var Q=pega.env.ua.opera,W=pega.env.ua.webkit,S=pega.env.ua.gecko,b=pega.env.ua.ie;
    var d={
        HYPHEN:/(-[a-z])/i,ROOT_TAG:/^body|html$/i,OP_SCROLL:/^(?:inline|table-row)$/i
    };
    var U=function(B){
        if(!d.HYPHEN.test(B)){
            return B
        }
        if(Y[B]){
            return Y[B]
        }
        var A=B;
        while(d.HYPHEN.exec(A)){
            A=A.replace(RegExp.$1,RegExp.$1.substr(1).toUpperCase())
        }
        Y[B]=A;
        return A
    };
    var T=function(A){
        var B=c[A];
        if(!B){
            B=new RegExp("(?:^|\\s+)"+A+"(?:\\s+|$)");
            c[A]=B
        }
        return B
    };
    if(V.defaultView&&V.defaultView.getComputedStyle){
        X=function(D,A){
            var B=null;
            if(A=="float"){
                A="cssFloat"
            }
            var C=D.ownerDocument.defaultView.getComputedStyle(D,"");
            if(C){
                B=C[U(A)]
            }
            return D.style[A]||B
        }
        
    }
    else{
        if(V.documentElement.currentStyle&&b){
            X=function(E,C){
                switch(U(C)){
                    case"opacity":var A=100;
                    try{
                        A=E.filters["DXImageTransform.Microsoft.Alpha"].opacity
                    }
                    catch(B){
                        try{
                            A=E.filters("alpha").opacity
                        }
                        catch(B){}
                    }
                    return A/100;
                    case"float":C="styleFloat";
                    default:var D=E.currentStyle?E.currentStyle[C]:null;
                    return(E.style[C]||D)
                }
                
            }
            
        }
        else{
            X=function(B,A){
                return B.style[A]
            }
            
        }
        
    }
    if(b){
        Z=function(C,B,A){
            switch(B){
                case"opacity":if(pega.lang.isString(C.style.filter)){
                    C.style.filter="alpha(opacity="+A*100+")";
                    if(!C.currentStyle||!C.currentStyle.hasLayout){
                        C.style.zoom=1
                    }
                    
                }
                break;
                case"float":B="styleFloat";
                default:C.style[B]=A
            }
            
        }
        
    }
    else{
        Z=function(C,B,A){
            if(B=="float"){
                B="cssFloat"
            }
            C.style[B]=A
        }
        
    }
    var P=function(B,A){
        return B&&B.nodeType==1&&(!A||A(B))
    };
    pega.util.Dom={
        get:function(B){
            if(B&&(B.nodeType||B.item)){
                return B
            }
            if(pega.lang.isString(B)||!B){
                return V.getElementById(B)
            }
            if(B.length!==undefined){
                var A=[];
                for(var C=0,D=B.length;
                C<D;
                ++C){
                    A[A.length]=R.Dom.get(B[C])
                }
                return A
            }
            return B
        }
        ,getStyle:function(C,A){
            A=U(A);
            var B=function(D){
                return X(D,A)
            };
            return R.Dom.batch(C,B,R.Dom,true)
        }
        ,setStyle:function(D,B,A){
            B=U(B);
            var C=function(E){
                Z(E,B,A)
            };
            R.Dom.batch(D,C,R.Dom,true)
        }
        ,getXY:function(B){
            var A=function(C){
                if((C.parentNode===null||C.offsetParent===null||this.getStyle(C,"display")=="none")&&C!=C.ownerDocument.body){
                    return false
                }
                return a(C)
            };
            return R.Dom.batch(B,A,R.Dom,true)
        }
        ,getX:function(B){
            var A=function(C){
                return R.Dom.getXY(C)[0]
            };
            return R.Dom.batch(B,A,R.Dom,true)
        }
        ,getY:function(B){
            var A=function(C){
                return R.Dom.getXY(C)[1]
            };
            return R.Dom.batch(B,A,R.Dom,true)
        }
        ,setXY:function(D,A,B){
            var C=function(F){
                var G=this.getStyle(F,"position");
                if(G=="static"){
                    this.setStyle(F,"position","relative");
                    G="relative"
                }
                var I=this.getXY(F);
                if(I===false){
                    return false
                }
                var E=[parseInt(this.getStyle(F,"left"),10),parseInt(this.getStyle(F,"top"),10)];
                if(isNaN(E[0])){
                    E[0]=(G=="relative")?0:F.offsetLeft
                }
                if(isNaN(E[1])){
                    E[1]=(G=="relative")?0:F.offsetTop
                }
                if(A[0]!==null){
                    F.style.left=A[0]-I[0]+E[0]+"px"
                }
                if(A[1]!==null){
                    F.style.top=A[1]-I[1]+E[1]+"px"
                }
                if(!B){
                    var H=this.getXY(F);
                    if((A[0]!==null&&H[0]!=A[0])||(A[1]!==null&&H[1]!=A[1])){
                        this.setXY(F,A,true)
                    }
                    
                }
                
            };
            R.Dom.batch(D,C,R.Dom,true)
        }
        ,setX:function(A,B){
            R.Dom.setXY(A,[B,null])
        }
        ,setY:function(B,A){
            R.Dom.setXY(B,[null,A])
        }
        ,getRegion:function(B){
            var A=function(D){
                if((D.parentNode===null||D.offsetParent===null||this.getStyle(D,"display")=="none")&&D!=D.ownerDocument.body){
                    return false
                }
                var C=R.Region.getRegion(D);
                return C
            };
            return R.Dom.batch(B,A,R.Dom,true)
        }
        ,getClientWidth:function(){
            return R.Dom.getViewportWidth()
        }
        ,getClientHeight:function(){
            return R.Dom.getViewportHeight()
        }
        ,getElementsByClassName:function(E,A,D,C){
            A=A||"*";
            D=(D)?R.Dom.get(D):null||V;
            if(!D){
                return[]
            }
            var H=[],I=D.getElementsByTagName(A),B=T(E);
            for(var G=0,F=I.length;
            G<F;
            ++G){
                if(B.test(I[G].className)){
                    H[H.length]=I[G];
                    if(C){
                        C.call(I[G],I[G])
                    }
                    
                }
                
            }
            return H
        }
        ,hasClass:function(B,C){
            var D=T(C);
            var A=function(E){
                return D.test(E.className)
            };
            return R.Dom.batch(B,A,R.Dom,true)
        }
        ,addClass:function(B,C){
            var A=function(D){
                if(this.hasClass(D,C)){
                    return false
                }
                D.className=pega.lang.trim([D.className,C].join(" "));
                return true
            };
            return R.Dom.batch(B,A,R.Dom,true)
        }
        ,removeClass:function(B,C){
            var D=T(C);
            var A=function(F){
                if(!C||!this.hasClass(F,C)){
                    return false
                }
                var E=F.className;
                F.className=E.replace(D," ");
                if(this.hasClass(F,C)){
                    this.removeClass(F,C)
                }
                F.className=pega.lang.trim(F.className);
                return true
            };
            return R.Dom.batch(B,A,R.Dom,true)
        }
        ,replaceClass:function(B,D,E){
            if(!E||D===E){
                return false
            }
            var C=T(D);
            var A=function(F){
                if(!this.hasClass(F,D)){
                    this.addClass(F,E);
                    return true
                }
                F.className=F.className.replace(C," "+E+" ");
                if(this.hasClass(F,D)){
                    this.replaceClass(F,D,E)
                }
                F.className=pega.lang.trim(F.className);
                return true
            };
            return R.Dom.batch(B,A,R.Dom,true)
        }
        ,generateId:function(C,A){
            A=A||"yui-gen";
            var B=function(E){
                if(E&&E.id){
                    return E.id
                }
                var D=A+pega.env._id_counter++;
                if(E){
                    E.id=D
                }
                return D
            };
            return R.Dom.batch(C,B,R.Dom,true)||B.apply(R.Dom,arguments)
        }
        ,isAncestor:function(B,A){
            B=R.Dom.get(B);
            A=R.Dom.get(A);
            if(!B||!A){
                return false
            }
            if(B.contains&&A.nodeType&&!W){
                return B.contains(A)
            }
            else{
                if(B.compareDocumentPosition&&A.nodeType){
                    return !!(B.compareDocumentPosition(A)&16)
                }
                else{
                    if(A.nodeType){
                        return !!this.getAncestorBy(A,function(C){
                            return C==B
                        })
                    }
                    
                }
                
            }
            return false
        }
        ,inDocument:function(A){
            return this.isAncestor(V.documentElement,A)
        }
        ,getElementsBy:function(A,G,F,D){
            G=G||"*";
            F=(F)?R.Dom.get(F):null||V;
            if(!F){
                return[]
            }
            var E=[],B=F.getElementsByTagName(G);
            for(var C=0,H=B.length;
            C<H;
            ++C){
                if(A(B[C])){
                    E[E.length]=B[C];
                    if(D){
                        D(B[C])
                    }
                    
                }
                
            }
            return E
        }
        ,batch:function(D,A,B,F){
            D=(D&&(D.tagName||D.item))?D:R.Dom.get(D);
            if(!D||!A){
                return false
            }
            var E=(F)?B:window;
            if(D.tagName||D.length===undefined){
                return A.call(E,D,B)
            }
            var C=[];
            for(var G=0,H=D.length;
            G<H;
            ++G){
                C[C.length]=A.call(E,D[G],B)
            }
            return C
        }
        ,getDocumentHeight:function(){
            var A=(V.compatMode!="CSS1Compat")?V.body.scrollHeight:V.documentElement.scrollHeight;
            var B=Math.max(A,R.Dom.getViewportHeight());
            return B
        }
        ,getDocumentWidth:function(){
            var A=(V.compatMode!="CSS1Compat")?V.body.scrollWidth:V.documentElement.scrollWidth;
            var B=Math.max(A,R.Dom.getViewportWidth());
            return B
        }
        ,getViewportHeight:function(){
            var B=self.innerHeight;
            var A=V.compatMode;
            if((A||b)&&!Q){
                B=(A=="CSS1Compat")?V.documentElement.clientHeight:V.body.clientHeight
            }
            return B
        }
        ,getViewportWidth:function(){
            var B=self.innerWidth;
            var A=V.compatMode;
            if(A||b){
                B=(A=="CSS1Compat")?V.documentElement.clientWidth:V.body.clientWidth
            }
            return B
        }
        ,getAncestorBy:function(B,A){
            while(B=B.parentNode){
                if(P(B,A)){
                    return B
                }
                
            }
            return null
        }
        ,getAncestorByClassName:function(B,C){
            B=R.Dom.get(B);
            if(!B){
                return null
            }
            var A=function(D){
                return R.Dom.hasClass(D,C)
            };
            return R.Dom.getAncestorBy(B,A)
        }
        ,getAncestorByTagName:function(B,C){
            B=R.Dom.get(B);
            if(!B){
                return null
            }
            var A=function(D){
                return D.tagName&&D.tagName.toUpperCase()==C.toUpperCase()
            };
            return R.Dom.getAncestorBy(B,A)
        }
        ,getPreviousSiblingBy:function(B,A){
            while(B){
                B=B.previousSibling;
                if(P(B,A)){
                    return B
                }
                
            }
            return null
        }
        ,getPreviousSibling:function(A){
            A=R.Dom.get(A);
            if(!A){
                return null
            }
            return R.Dom.getPreviousSiblingBy(A)
        }
        ,getNextSiblingBy:function(B,A){
            while(B){
                B=B.nextSibling;
                if(P(B,A)){
                    return B
                }
                
            }
            return null
        }
        ,getNextSibling:function(A){
            A=R.Dom.get(A);
            if(!A){
                return null
            }
            return R.Dom.getNextSiblingBy(A)
        }
        ,getFirstChildBy:function(C,A){
            var B=(P(C.firstChild,A))?C.firstChild:null;
            return B||R.Dom.getNextSiblingBy(C.firstChild,A)
        }
        ,getFirstChild:function(B,A){
            B=R.Dom.get(B);
            if(!B){
                return null
            }
            return R.Dom.getFirstChildBy(B)
        }
        ,getLastChildBy:function(C,A){
            if(!C){
                return null
            }
            var B=(P(C.lastChild,A))?C.lastChild:null;
            return B||R.Dom.getPreviousSiblingBy(C.lastChild,A)
        }
        ,getLastChild:function(A){
            A=R.Dom.get(A);
            return R.Dom.getLastChildBy(A)
        }
        ,getChildrenBy:function(C,A){
            var B=R.Dom.getFirstChildBy(C,A);
            var D=B?[B]:[];
            R.Dom.getNextSiblingBy(B,function(E){
                if(!A||A(E)){
                    D[D.length]=E
                }
                return false
            });
            return D
        }
        ,getChildren:function(A){
            A=R.Dom.get(A);
            if(!A){}return R.Dom.getChildrenBy(A)
        }
        ,getDocumentScrollLeft:function(A){
            A=A||V;
            return Math.max(A.documentElement.scrollLeft,A.body.scrollLeft)
        }
        ,getDocumentScrollTop:function(A){
            A=A||V;
            return Math.max(A.documentElement.scrollTop,A.body.scrollTop)
        }
        ,insertBefore:function(A,B){
            A=R.Dom.get(A);
            B=R.Dom.get(B);
            if(!A||!B||!B.parentNode){
                return null
            }
            return B.parentNode.insertBefore(A,B)
        }
        ,insertAfter:function(A,B){
            A=R.Dom.get(A);
            B=R.Dom.get(B);
            if(!A||!B||!B.parentNode){
                return null
            }
            if(B.nextSibling){
                return B.parentNode.insertBefore(A,B.nextSibling)
            }
            else{
                return B.parentNode.appendChild(A)
            }
            
        }
        ,getClientRegion:function(){
            var B=R.Dom.getDocumentScrollTop(),C=R.Dom.getDocumentScrollLeft(),A=R.Dom.getViewportWidth()+C,D=R.Dom.getViewportHeight()+B;
            return new R.Region(B,A,D,C)
        }
        
    };
    var a=function(){
        if(V.documentElement.getBoundingClientRect){
            return function(B){
                var A=B.getBoundingClientRect();
                var C=B.ownerDocument;
                return[A.left+R.Dom.getDocumentScrollLeft(C),A.top+R.Dom.getDocumentScrollTop(C)]
            }
            
        }
        else{
            return function(B){
                var A=[B.offsetLeft,B.offsetTop];
                var C=B.offsetParent;
                var D=(W&&R.Dom.getStyle(B,"position")=="absolute"&&B.offsetParent==B.ownerDocument.body);
                if(C!=B){
                    while(C){
                        A[0]+=C.offsetLeft;
                        A[1]+=C.offsetTop;
                        if(!D&&W&&R.Dom.getStyle(C,"position")=="absolute"){
                            D=true
                        }
                        C=C.offsetParent
                    }
                    
                }
                if(D){
                    A[0]-=B.ownerDocument.body.offsetLeft;
                    A[1]-=B.ownerDocument.body.offsetTop
                }
                C=B.parentNode;
                while(C.tagName&&!d.ROOT_TAG.test(C.tagName)){
                    if(C.scrollTop||C.scrollLeft){
                        if(!d.OP_SCROLL.test(R.Dom.getStyle(C,"display"))){
                            if(!Q||R.Dom.getStyle(C,"overflow")!=="visible"){
                                A[0]-=C.scrollLeft;
                                A[1]-=C.scrollTop
                            }
                            
                        }
                        
                    }
                    C=C.parentNode
                }
                return A
            }
            
        }
        
    }
    ()
})();
pega.util.Region=function(G,F,E,H){
    this.top=G;
    this[1]=G;
    this.right=F;
    this.bottom=E;
    this.left=H;
    this[0]=H
};
pega.util.Region.prototype.contains=function(B){
    return(B.left>=this.left&&B.right<=this.right&&B.top>=this.top&&B.bottom<=this.bottom)
};
pega.util.Region.prototype.getArea=function(){
    return((this.bottom-this.top)*(this.right-this.left))
};
pega.util.Region.prototype.intersect=function(G){
    var I=Math.max(this.top,G.top);
    var H=Math.min(this.right,G.right);
    var F=Math.min(this.bottom,G.bottom);
    var J=Math.max(this.left,G.left);
    if(F>=I&&H>=J){
        return new pega.util.Region(I,H,F,J)
    }
    else{
        return null
    }
    
};
pega.util.Region.prototype.union=function(G){
    var I=Math.min(this.top,G.top);
    var H=Math.max(this.right,G.right);
    var F=Math.max(this.bottom,G.bottom);
    var J=Math.min(this.left,G.left);
    return new pega.util.Region(I,H,F,J)
};
pega.util.Region.prototype.toString=function(){
    return("Region {top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+"}")
};
pega.util.Region.getRegion=function(J){
    var H=pega.util.Dom.getXY(J);
    var K=H[1];
    var I=H[0]+J.offsetWidth;
    var G=H[1]+J.offsetHeight;
    var L=H[0];
    return new pega.util.Region(K,I,G,L)
};
pega.util.Point=function(C,D){
    if(pega.lang.isArray(C)){
        D=C[1];
        C=C[0]
    }
    this.x=this.right=this.left=this[0]=C;
    this.y=this.top=this.bottom=this[1]=D
};
pega.util.Point.prototype=new pega.util.Region();
pega.register("dom",pega.util.Dom,{
    version:"2.5.2",build:"1076"
});
pega.util.CustomEvent=function(H,J,I,F){
    this.type=H;
    this.scope=J||window;
    this.silent=I;
    this.signature=F||pega.util.CustomEvent.LIST;
    this.subscribers=[];
    if(!this.silent){}var G="_YUICEOnSubscribe";
    if(H!==G){
        this.subscribeEvent=new pega.util.CustomEvent(G,this,true)
    }
    this.lastError=null
};
pega.util.CustomEvent.LIST=0;
pega.util.CustomEvent.FLAT=1;
pega.util.CustomEvent.prototype={
    subscribe:function(F,E,D){
        if(!F){
            throw new Error("Invalid callback for subscriber to '"+this.type+"'")
        }
        if(this.subscribeEvent){
            this.subscribeEvent.fire(F,E,D)
        }
        this.subscribers.push(new pega.util.Subscriber(F,E,D))
    }
    ,unsubscribe:function(J,H){
        if(!J){
            return this.unsubscribeAll()
        }
        var I=false;
        for(var L=0,G=this.subscribers.length;
        L<G;
        ++L){
            var K=this.subscribers[L];
            if(K&&K.contains(J,H)){
                this._delete(L);
                I=true
            }
            
        }
        return I
    }
    ,fire:function(){
        this.lastError=null;
        var T=[],Z=this.subscribers.length;
        if(!Z&&this.silent){
            return true
        }
        var V=[].slice.call(arguments,0),X=true,N,U=false;
        if(!this.silent){}var O=this.subscribers.slice(),Q=pega.util.Event.throwErrors;
        for(N=0;
        N<Z;
        ++N){
            var R=O[N];
            if(!R){
                U=true
            }
            else{
                if(!this.silent){}var S=R.getScope(this.scope);
                if(this.signature==pega.util.CustomEvent.FLAT){
                    var P=null;
                    if(V.length>0){
                        P=V[0]
                    }
                    try{
                        X=R.fn.call(S,P,R.obj)
                    }
                    catch(Y){
                        this.lastError=Y;
                        if(Q){
                            throw Y
                        }
                        
                    }
                    
                }
                else{
                    try{
                        X=R.fn.call(S,this.type,V,R.obj)
                    }
                    catch(W){
                        this.lastError=W;
                        if(Q){
                            throw W
                        }
                        
                    }
                    
                }
                if(false===X){
                    if(!this.silent){}break
                }
                
            }
            
        }
        return(X!==false)
    }
    ,unsubscribeAll:function(){
        for(var B=this.subscribers.length-1;
        B>-1;
        B--){
            this._delete(B)
        }
        this.subscribers=[];
        return B
    }
    ,_delete:function(C){
        var D=this.subscribers[C];
        if(D){
            delete D.fn;
            delete D.obj
        }
        this.subscribers.splice(C,1)
    }
    ,toString:function(){
        return"CustomEvent: '"+this.type+"', scope: "+this.scope
    }
    
};
pega.util.Subscriber=function(F,E,D){
    this.fn=F;
    this.obj=pega.lang.isUndefined(E)?null:E;
    this.override=D
};
pega.util.Subscriber.prototype.getScope=function(B){
    if(this.override){
        if(this.override===true){
            return this.obj
        }
        else{
            return this.override
        }
        
    }
    return B
};
pega.util.Subscriber.prototype.contains=function(C,D){
    if(D){
        return(this.fn==C&&this.obj==D)
    }
    else{
        return(this.fn==C)
    }
    
};
pega.util.Subscriber.prototype.toString=function(){
    return"Subscriber { obj: "+this.obj+", override: "+(this.override||"no")+" }"
};
if(!pega.util.Event){
    pega.util.Event=function(){
        var Q=false;
        var P=[];
        var O=[];
        var R=[];
        var T=[];
        var L=0;
        var S=[];
        var M=[];
        var N=0;
        var K={
            63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9
        };
        return{
            POLL_RETRYS:2000,POLL_INTERVAL:20,EL:0,TYPE:1,FN:2,WFN:3,UNLOAD_OBJ:3,ADJ_SCOPE:4,OBJ:5,OVERRIDE:6,lastError:null,isSafari:pega.env.ua.webkit,webkit:pega.env.ua.webkit,isIE:pega.env.ua.ie,_interval:null,_dri:null,DOMReady:false,throwErrors:false,startInterval:function(){
                if(!this._interval){
                    var B=this;
                    var A=function(){
                        B._tryPreloadAttach()
                    };
                    this._interval=setInterval(A,this.POLL_INTERVAL)
                }
                
            }
            ,onAvailable:function(D,G,C,E,F){
                var B=(pega.lang.isString(D))?[D]:D;
                for(var A=0;
                A<B.length;
                A=A+1){
                    S.push({
                        id:B[A],fn:G,obj:C,override:E,checkReady:F
                    })
                }
                L=this.POLL_RETRYS;
                this.startInterval()
            }
            ,onContentReady:function(D,B,C,A){
                this.onAvailable(D,B,C,A,true)
            }
            ,onDOMReady:function(B,C,A){
                if(this.DOMReady){
                    setTimeout(function(){
                        var D=window;
                        if(A){
                            if(A===true){
                                D=C
                            }
                            else{
                                D=A
                            }
                            
                        }
                        B.call(D,"DOMReady",[],C)
                    }
                    ,0)
                }
                else{
                    this.DOMReadyEvent.subscribe(B,C,A)
                }
                
            }
            ,addListener:function(b,d,D,I,c){
                if(!D||!D.call){
                    return false
                }
                if(this._isValidCollection(b)){
                    var C=true;
                    for(var H=0,F=b.length;
                    H<F;
                    ++H){
                        C=this.on(b[H],d,D,I,c)&&C
                    }
                    return C
                }
                else{
                    if(pega.lang.isString(b)){
                        var J=this.getEl(b);
                        if(J){
                            b=J
                        }
                        else{
                            this.onAvailable(b,function(){
                                pega.util.Event.on(b,d,D,I,c)
                            });
                            return true
                        }
                        
                    }
                    
                }
                if(!b){
                    return false
                }
                if("unload"==d&&I!==this){
                    O[O.length]=[b,d,D,I,c];
                    return true
                }
                var A=b;
                if(c){
                    if(c===true){
                        A=I
                    }
                    else{
                        A=c
                    }
                    
                }
                var a=function(U){
                    return D.call(A,pega.util.Event.getEvent(U,b),I)
                };
                var B=[b,d,D,a,A,I,c];
                var G=P.length;
                P[G]=B;
                if(this.useLegacyEvent(b,d)){
                    var Z=this.getLegacyIndex(b,d);
                    if(Z==-1||b!=R[Z][0]){
                        Z=R.length;
                        M[b.id+d]=Z;
                        R[Z]=[b,d,b["on"+d]];
                        T[Z]=[];
                        b["on"+d]=function(U){
                            pega.util.Event.fireLegacyEvent(pega.util.Event.getEvent(U),Z)
                        }
                        
                    }
                    T[Z].push(B)
                }
                else{
                    try{
                        this._simpleAdd(b,d,a,false)
                    }
                    catch(E){
                        this.lastError=E;
                        this.removeListener(b,d,D);
                        return false
                    }
                    
                }
                return true
            }
            ,fireLegacyEvent:function(F,H){
                var D=true,J,B,C,A,E;
                B=T[H].slice();
                for(var I=0,G=B.length;
                I<G;
                ++I){
                    C=B[I];
                    if(C&&C[this.WFN]){
                        A=C[this.ADJ_SCOPE];
                        E=C[this.WFN].call(A,F);
                        D=(D&&E)
                    }
                    
                }
                J=R[H];
                if(J&&J[2]){
                    J[2](F)
                }
                return D
            }
            ,getLegacyIndex:function(A,C){
                var B=this.generateId(A)+C;
                if(typeof M[B]=="undefined"){
                    return -1
                }
                else{
                    return M[B]
                }
                
            }
            ,useLegacyEvent:function(A,C){
                if(this.webkit&&("click"==C||"dblclick"==C)){
                    var B=parseInt(this.webkit,10);
                    if(!isNaN(B)&&B<418){
                        return true
                    }
                    
                }
                return false
            }
            ,removeListener:function(W,X,C){
                var H,E,A;
                if(typeof W=="string"){
                    W=this.getEl(W)
                }
                else{
                    if(this._isValidCollection(W)){
                        var B=true;
                        for(H=W.length-1;
                        H>-1;
                        H--){
                            B=(this.removeListener(W[H],X,C)&&B)
                        }
                        return B
                    }
                    
                }
                if(!C||!C.call){
                    return this.purgeElement(W,false,X)
                }
                if("unload"==X){
                    for(H=O.length-1;
                    H>-1;
                    H--){
                        A=O[H];
                        if(A&&A[0]==W&&A[1]==X&&A[2]==C){
                            O.splice(H,1);
                            return true
                        }
                        
                    }
                    return false
                }
                var G=null;
                var F=arguments[3];
                if("undefined"===typeof F){
                    F=this._getCacheIndex(W,X,C)
                }
                if(F>=0){
                    G=P[F]
                }
                if(!W||!G){
                    return false
                }
                if(this.useLegacyEvent(W,X)){
                    var I=this.getLegacyIndex(W,X);
                    var J=T[I];
                    if(J){
                        for(H=0,E=J.length;
                        H<E;
                        ++H){
                            A=J[H];
                            if(A&&A[this.EL]==W&&A[this.TYPE]==X&&A[this.FN]==C){
                                J.splice(H,1);
                                break
                            }
                            
                        }
                        
                    }
                    
                }
                else{
                    try{
                        this._simpleRemove(W,X,G[this.WFN],false)
                    }
                    catch(D){
                        this.lastError=D;
                        return false
                    }
                    
                }
                delete P[F][this.WFN];
                delete P[F][this.FN];
                P.splice(F,1);
                return true
            }
            ,getTarget:function(C,A){
                var B=C.target||C.srcElement;
                return this.resolveTextNode(B)
            }
            ,resolveTextNode:function(A){
                try{
                    if(A&&3==A.nodeType){
                        return A.parentNode
                    }
                    
                }
                catch(B){}return A
            }
            ,getPageX:function(A){
                var B=A.pageX;
                if(!B&&0!==B){
                    B=A.clientX||0;
                    if(this.isIE){
                        B+=this._getScrollLeft()
                    }
                    
                }
                return B
            }
            ,getPageY:function(B){
                var A=B.pageY;
                if(!A&&0!==A){
                    A=B.clientY||0;
                    if(this.isIE){
                        A+=this._getScrollTop()
                    }
                    
                }
                return A
            }
            ,getXY:function(A){
                return[this.getPageX(A),this.getPageY(A)]
            }
            ,getRelatedTarget:function(A){
                var B=A.relatedTarget;
                if(!B){
                    if(A.type=="mouseout"){
                        B=A.toElement
                    }
                    else{
                        if(A.type=="mouseover"){
                            B=A.fromElement
                        }
                        
                    }
                    
                }
                return this.resolveTextNode(B)
            }
            ,getTime:function(C){
                if(!C.time){
                    var A=new Date().getTime();
                    try{
                        C.time=A
                    }
                    catch(B){
                        this.lastError=B;
                        return A
                    }
                    
                }
                return C.time
            }
            ,stopEvent:function(A){
                this.stopPropagation(A);
                this.preventDefault(A)
            }
            ,stopPropagation:function(A){
                if(A.stopPropagation){
                    A.stopPropagation()
                }
                else{
                    A.cancelBubble=true
                }
                
            }
            ,preventDefault:function(A){
                if(A.preventDefault){
                    A.preventDefault()
                }
                else{
                    A.returnValue=false
                }
                
            }
            ,getEvent:function(D,B){
                var A=D||window.event;
                if(!A){
                    var C=this.getEvent.caller;
                    while(C){
                        A=C.arguments[0];
                        if(A&&Event==A.constructor){
                            break
                        }
                        C=C.caller
                    }
                    
                }
                return A
            }
            ,getCharCode:function(A){
                var B=A.keyCode||A.charCode||0;
                if(pega.env.ua.webkit&&(B in K)){
                    B=K[B]
                }
                return B
            }
            ,_getCacheIndex:function(D,C,E){
                for(var F=0,A=P.length;
                F<A;
                F=F+1){
                    var B=P[F];
                    if(B&&B[this.FN]==E&&B[this.EL]==D&&B[this.TYPE]==C){
                        return F
                    }
                    
                }
                return -1
            }
            ,generateId:function(B){
                var A=B.id;
                if(!A){
                    A="yuievtautoid-"+N;
                    ++N;
                    B.id=A
                }
                return A
            }
            ,_isValidCollection:function(A){
                try{
                    return(A&&typeof A!=="string"&&A.length&&!A.tagName&&!A.alert&&typeof A[0]!=="undefined")
                }
                catch(B){
                    return false
                }
                
            }
            ,elCache:{},getEl:function(A){
                return(typeof A==="string")?document.getElementById(A):A
            }
            ,clearCache:function(){},DOMReadyEvent:new pega.util.CustomEvent("DOMReady",this),_load:function(A){
                if(!Q){
                    Q=true;
                    var B=pega.util.Event;
                    B._ready();
                    B._tryPreloadAttach()
                }
                
            }
            ,_ready:function(A){
                var B=pega.util.Event;
                if(!B.DOMReady){
                    B.DOMReady=true;
                    B.DOMReadyEvent.fire();
                    B._simpleRemove(document,"DOMContentLoaded",B._ready)
                }
                
            }
            ,_tryPreloadAttach:function(){
                if(S.length===0){
                    L=0;
                    clearInterval(this._interval);
                    this._interval=null;
                    return 
                }
                if(this.locked){
                    return 
                }
                if(this.isIE){
                    if(!this.DOMReady){
                        this.startInterval();
                        return 
                    }
                    
                }
                this.locked=true;
                var D=!Q;
                if(!D){
                    D=(L>0&&S.length>0)
                }
                var E=[];
                var C=function(J,I){
                    var V=J;
                    if(I.override){
                        if(I.override===true){
                            V=I.obj
                        }
                        else{
                            V=I.override
                        }
                        
                    }
                    I.fn.call(V,I.obj)
                };
                var A,B,F,G,H=[];
                for(A=0,B=S.length;
                A<B;
                A=A+1){
                    F=S[A];
                    if(F){
                        G=this.getEl(F.id);
                        if(G){
                            if(F.checkReady){
                                if(Q||G.nextSibling||!D){
                                    H.push(F);
                                    S[A]=null
                                }
                                
                            }
                            else{
                                C(G,F);
                                S[A]=null
                            }
                            
                        }
                        else{
                            E.push(F)
                        }
                        
                    }
                    
                }
                for(A=0,B=H.length;
                A<B;
                A=A+1){
                    F=H[A];
                    C(this.getEl(F.id),F)
                }
                L--;
                if(D){
                    for(A=S.length-1;
                    A>-1;
                    A--){
                        F=S[A];
                        if(!F||!F.id){
                            S.splice(A,1)
                        }
                        
                    }
                    this.startInterval()
                }
                else{
                    clearInterval(this._interval);
                    this._interval=null
                }
                this.locked=false
            }
            ,purgeElement:function(F,E,C){
                var H=(pega.lang.isString(F))?this.getEl(F):F;
                var D=this.getListeners(H,C),G,B;
                if(D){
                    for(G=D.length-1;
                    G>-1;
                    G--){
                        var A=D[G];
                        this.removeListener(H,A.type,A.fn)
                    }
                    
                }
                if(E&&H&&H.childNodes){
                    for(G=0,B=H.childNodes.length;
                    G<B;
                    ++G){
                        this.purgeElement(H.childNodes[G],E,C)
                    }
                    
                }
                
            }
            ,getListeners:function(H,J){
                var E=[],I;
                if(!J){
                    I=[P,O]
                }
                else{
                    if(J==="unload"){
                        I=[O]
                    }
                    else{
                        I=[P]
                    }
                    
                }
                var C=(pega.lang.isString(H))?this.getEl(H):H;
                for(var F=0;
                F<I.length;
                F=F+1){
                    var A=I[F];
                    if(A){
                        for(var D=0,B=A.length;
                        D<B;
                        ++D){
                            var G=A[D];
                            if(G&&G[this.EL]===C&&(!J||J===G[this.TYPE])){
                                E.push({
                                    type:G[this.TYPE],fn:G[this.FN],obj:G[this.OBJ],adjust:G[this.OVERRIDE],scope:G[this.ADJ_SCOPE],index:D
                                })
                            }
                            
                        }
                        
                    }
                    
                }
                return(E.length)?E:null
            }
            ,_unload:function(C){
                var I=pega.util.Event,F,G,H,D,E,B=O.slice();
                for(F=0,D=O.length;
                F<D;
                ++F){
                    H=B[F];
                    if(H){
                        var A=window;
                        if(H[I.ADJ_SCOPE]){
                            if(H[I.ADJ_SCOPE]===true){
                                A=H[I.UNLOAD_OBJ]
                            }
                            else{
                                A=H[I.ADJ_SCOPE]
                            }
                            
                        }
                        H[I.FN].call(A,I.getEvent(C,H[I.EL]),H[I.UNLOAD_OBJ]);
                        B[F]=null;
                        H=null;
                        A=null
                    }
                    
                }
                O=null;
                if(P){
                    for(G=P.length-1;
                    G>-1;
                    G--){
                        H=P[G];
                        if(H){
                            I.removeListener(H[I.EL],H[I.TYPE],H[I.FN],G)
                        }
                        
                    }
                    H=null
                }
                R=null;
                I._simpleRemove(window,"unload",I._unload)
            }
            ,_getScrollLeft:function(){
                return this._getScroll()[1]
            }
            ,_getScrollTop:function(){
                return this._getScroll()[0]
            }
            ,_getScroll:function(){
                var B=document.documentElement,A=document.body;
                if(B&&(B.scrollTop||B.scrollLeft)){
                    return[B.scrollTop,B.scrollLeft]
                }
                else{
                    if(A){
                        return[A.scrollTop,A.scrollLeft]
                    }
                    else{
                        return[0,0]
                    }
                    
                }
                
            }
            ,regCE:function(){},_simpleAdd:function(){
                if(window.addEventListener){
                    return function(D,C,A,B){
                        D.addEventListener(C,A,(B))
                    }
                    
                }
                else{
                    if(window.attachEvent){
                        return function(D,C,A,B){
                            D.attachEvent("on"+C,A)
                        }
                        
                    }
                    else{
                        return function(){}
                    }
                    
                }
                
            }
            (),_simpleRemove:function(){
                if(window.removeEventListener){
                    return function(D,C,A,B){
                        D.removeEventListener(C,A,(B))
                    }
                    
                }
                else{
                    if(window.detachEvent){
                        return function(A,C,B){
                            A.detachEvent("on"+C,B)
                        }
                        
                    }
                    else{
                        return function(){}
                    }
                    
                }
                
            }
            ()
        }
        
    }
    ();
    (function(){
        var A=pega.util.Event;
        A.on=A.addListener;
        if(A.isIE){
            pega.util.Event.onDOMReady(pega.util.Event._tryPreloadAttach,pega.util.Event,true);
            var B=document.createElement("p");
            A._dri=setInterval(function(){
                try{
                    B.doScroll("left");
                    clearInterval(A._dri);
                    A._dri=null;
                    A._ready();
                    B=null
                }
                catch(C){}
            }
            ,A.POLL_INTERVAL)
        }
        else{
            if(A.webkit&&A.webkit<525){
                A._dri=setInterval(function(){
                    var C=document.readyState;
                    if("loaded"==C||"complete"==C){
                        clearInterval(A._dri);
                        A._dri=null;
                        A._ready()
                    }
                    
                }
                ,A.POLL_INTERVAL)
            }
            else{
                A._simpleAdd(document,"DOMContentLoaded",A._ready)
            }
            
        }
        A._simpleAdd(window,"load",A._load);
        A._simpleAdd(window,"unload",A._unload);
        A._tryPreloadAttach()
    })()
}
pega.util.EventProvider=function(){};
pega.util.EventProvider.prototype={
    __yui_events:null,__yui_subscribers:null,subscribe:function(G,K,H,I){
        this.__yui_events=this.__yui_events||{};
        var J=this.__yui_events[G];
        if(J){
            J.subscribe(K,H,I)
        }
        else{
            this.__yui_subscribers=this.__yui_subscribers||{};
            var L=this.__yui_subscribers;
            if(!L[G]){
                L[G]=[]
            }
            L[G].push({
                fn:K,obj:H,override:I
            })
        }
        
    }
    ,unsubscribe:function(M,K,I){
        this.__yui_events=this.__yui_events||{};
        var H=this.__yui_events;
        if(M){
            var J=H[M];
            if(J){
                return J.unsubscribe(K,I)
            }
            
        }
        else{
            var N=true;
            for(var L in H){
                if(pega.lang.hasOwnProperty(H,L)){
                    N=N&&H[L].unsubscribe(K,I)
                }
                
            }
            return N
        }
        return false
    }
    ,unsubscribeAll:function(B){
        return this.unsubscribe(B)
    }
    ,createEvent:function(P,J){
        this.__yui_events=this.__yui_events||{};
        var M=J||{};
        var N=this.__yui_events;
        if(N[P]){}else{
            var O=M.scope||this;
            var R=(M.silent);
            var L=new pega.util.CustomEvent(P,O,R,pega.util.CustomEvent.FLAT);
            N[P]=L;
            if(M.onSubscribeCallback){
                L.subscribeEvent.subscribe(M.onSubscribeCallback)
            }
            this.__yui_subscribers=this.__yui_subscribers||{};
            var Q=this.__yui_subscribers[P];
            if(Q){
                for(var K=0;
                K<Q.length;
                ++K){
                    L.subscribe(Q[K].fn,Q[K].obj,Q[K].override)
                }
                
            }
            
        }
        return N[P]
    }
    ,fireEvent:function(K,L,H,M){
        this.__yui_events=this.__yui_events||{};
        var I=this.__yui_events[K];
        if(!I){
            return null
        }
        var N=[];
        for(var J=1;
        J<arguments.length;
        ++J){
            N.push(arguments[J])
        }
        return I.fire.apply(I,N)
    }
    ,hasEvent:function(B){
        if(this.__yui_events){
            if(this.__yui_events[B]){
                return true
            }
            
        }
        return false
    }
    
};
pega.util.KeyListener=function(G,H,L,K){
    if(!G){}else{
        if(!H){}else{
            if(!L){}
        }
        
    }
    if(!K){
        K=pega.util.KeyListener.KEYDOWN
    }
    var J=new pega.util.CustomEvent("keyPressed");
    this.enabledEvent=new pega.util.CustomEvent("enabled");
    this.disabledEvent=new pega.util.CustomEvent("disabled");
    if(typeof G=="string"){
        G=document.getElementById(G)
    }
    if(typeof L=="function"){
        J.subscribe(L)
    }
    else{
        J.subscribe(L.fn,L.scope,L.correctScope)
    }
    function I(A,B){
        if(!H.shift){
            H.shift=false
        }
        if(!H.alt){
            H.alt=false
        }
        if(!H.ctrl){
            H.ctrl=false
        }
        if(A.shiftKey==H.shift&&A.altKey==H.alt&&A.ctrlKey==H.ctrl){
            var D;
            if(H.keys instanceof Array){
                for(var C=0;
                C<H.keys.length;
                C++){
                    D=H.keys[C];
                    if(D==A.charCode){
                        J.fire(A.charCode,A);
                        break
                    }
                    else{
                        if(D==A.keyCode){
                            J.fire(A.keyCode,A);
                            break
                        }
                        
                    }
                    
                }
                
            }
            else{
                D=H.keys;
                if(D==A.charCode){
                    J.fire(A.charCode,A)
                }
                else{
                    if(D==A.keyCode){
                        J.fire(A.keyCode,A)
                    }
                    
                }
                
            }
            
        }
        
    }
    this.enable=function(){
        if(!this.enabled){
            pega.util.Event.addListener(G,K,I);
            this.enabledEvent.fire(H)
        }
        this.enabled=true
    };
    this.disable=function(){
        if(this.enabled){
            pega.util.Event.removeListener(G,K,I);
            this.disabledEvent.fire(H)
        }
        this.enabled=false
    };
    this.toString=function(){
        return"KeyListener ["+H.keys+"] "+G.tagName+(G.id?"["+G.id+"]":"")
    }
    
};
pega.util.KeyListener.KEYDOWN="keydown";
pega.util.KeyListener.KEYUP="keyup";
pega.util.KeyListener.KEY={
    ALT:18,BACK_SPACE:8,CAPS_LOCK:20,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,META:224,NUM_LOCK:144,PAGE_DOWN:34,PAGE_UP:33,PAUSE:19,PRINTSCREEN:44,RIGHT:39,SCROLL_LOCK:145,SHIFT:16,SPACE:32,TAB:9,UP:38
};
pega.register("event",pega.util.Event,{
    version:"2.5.2",build:"1076"
});
pega.util.Connect={
    _msxml_progid:["Microsoft.XMLHTTP","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP"],_http_headers:{},_has_http_headers:false,_use_default_post_header:true,_default_post_header:"application/x-www-form-urlencoded; charset=UTF-8",_default_form_header:"application/x-www-form-urlencoded",_use_default_xhr_header:true,_default_xhr_header:"XMLHttpRequest",_has_default_headers:true,_default_headers:{},_isFormSubmit:false,_isFileUpload:false,_formNode:null,_sFormData:null,_poll:{},_timeOut:{},_polling_interval:50,_transaction_id:0,_submitElementValue:null,_hasSubmitListener:(function(){
        if(pega.util.Event){
            pega.util.Event.addListener(document,"click",function(D){
                var C=pega.util.Event.getTarget(D);
                if(C.nodeName.toLowerCase()=="input"&&(C.type&&C.type.toLowerCase()=="submit")){
                    pega.util.Connect._submitElementValue=encodeURIComponent(C.name)+"="+encodeURIComponent(C.value)
                }
                
            });
            return true
        }
        return false
    })(),startEvent:new pega.util.CustomEvent("start"),completeEvent:new pega.util.CustomEvent("complete"),successEvent:new pega.util.CustomEvent("success"),failureEvent:new pega.util.CustomEvent("failure"),uploadEvent:new pega.util.CustomEvent("upload"),abortEvent:new pega.util.CustomEvent("abort"),_customEvents:{
        onStart:["startEvent","start"],onComplete:["completeEvent","complete"],onSuccess:["successEvent","success"],onFailure:["failureEvent","failure"],onUpload:["uploadEvent","upload"],onAbort:["abortEvent","abort"]
    }
    ,setProgId:function(B){
        this._msxml_progid.unshift(B);
        pega.log("ActiveX Program Id  "+B+" added to _msxml_progid.","info","Connection")
    }
    ,setDefaultPostHeader:function(B){
        if(typeof B=="string"){
            this._default_post_header=B;
            pega.log("Default POST header set to  "+B,"info","Connection")
        }
        else{
            if(typeof B=="boolean"){
                this._use_default_post_header=B
            }
            
        }
        
    }
    ,setDefaultXhrHeader:function(B){
        if(typeof B=="string"){
            this._default_xhr_header=B;
            pega.log("Default XHR header set to  "+B,"info","Connection")
        }
        else{
            this._use_default_xhr_header=B
        }
        
    }
    ,setPollingInterval:function(B){
        if(typeof B=="number"&&isFinite(B)){
            this._polling_interval=B;
            pega.log("Default polling interval set to "+B+"ms","info","Connection")
        }
        
    }
    ,createXhrObject:function(G){
        var H,F;
        try{
            F=new XMLHttpRequest();
            H={
                conn:F,tId:G
            };
            pega.log("XHR object created for transaction "+G,"info","Connection")
        }
        catch(I){
            for(var J=0;
            J<this._msxml_progid.length;
            ++J){
                try{
                    F=new ActiveXObject(this._msxml_progid[J]);
                    H={
                        conn:F,tId:G
                    };
                    pega.log("ActiveX XHR object created for transaction "+G,"info","Connection");
                    break
                }
                catch(I){}
            }
            
        }
        finally{
            return H
        }
        
    }
    ,getConnectionObject:function(E){
        var G;
        var F=this._transaction_id;
        try{
            if(!E){
                G=this.createXhrObject(F)
            }
            else{
                G={};
                G.tId=F;
                G.isUpload=true
            }
            if(G){
                this._transaction_id++
            }
            
        }
        catch(H){}finally{
            return G
        }
        
    }
    ,asyncRequest:function(H,K,I,G){
        var J=(this._isFileUpload)?this.getConnectionObject(true):this.getConnectionObject();
        var L=(I&&I.argument)?I.argument:null;
        if(!J){
            pega.log("Unable to create connection object.","error","Connection");
            return null
        }
        else{
            if(I&&I.customevents){
                this.initCustomEvents(J,I)
            }
            if(this._isFormSubmit){
                if(this._isFileUpload){
                    this.uploadFile(J,I,K,G);
                    return J
                }
                if(H.toUpperCase()=="GET"){
                    if(this._sFormData.length!==0){
                        K+=((K.indexOf("?")==-1)?"?":"&")+this._sFormData
                    }
                    
                }
                else{
                    if(H.toUpperCase()=="POST"){
                        G=G?this._sFormData+"&"+G:this._sFormData
                    }
                    
                }
                
            }
            if(H.toUpperCase()=="GET"&&(I&&I.cache===false)){
                K+=((K.indexOf("?")==-1)?"?":"&")+"rnd="+new Date().valueOf().toString()
            }
            J.conn.open(H,K,true);
            if(this._use_default_xhr_header){
                if(!this._default_headers["X-Requested-With"]){
                    this.initHeader("X-Requested-With",this._default_xhr_header,true);
                    pega.log("Initialize transaction header X-Request-Header to XMLHttpRequest.","info","Connection")
                }
                
            }
            if((H.toUpperCase()=="POST"&&this._use_default_post_header)&&this._isFormSubmit===false){
                this.initHeader("Content-Type",this._default_post_header);
                pega.log("Initialize header Content-Type to application/x-www-form-urlencoded; UTF-8 for POST transaction.","info","Connection")
            }
            if(this._has_default_headers||this._has_http_headers){
                this.setHeader(J)
            }
            this.handleReadyState(J,I);
            J.conn.send(G||"");
            pega.log("Transaction "+J.tId+" sent.","info","Connection");
            if(this._isFormSubmit===true){
                this.resetFormState()
            }
            this.startEvent.fire(J,L);
            if(J.startEvent){
                J.startEvent.fire(J,L)
            }
            return J
        }
        
    }
    ,initCustomEvents:function(D,E){
        for(var F in E.customevents){
            if(this._customEvents[F][0]){
                D[this._customEvents[F][0]]=new pega.util.CustomEvent(this._customEvents[F][1],(E.scope)?E.scope:null);
                pega.log("Transaction-specific Custom Event "+D[this._customEvents[F][1]]+" created.","info","Connection");
                D[this._customEvents[F][0]].subscribe(E.customevents[F]);
                pega.log("Transaction-specific Custom Event "+D[this._customEvents[F][1]]+" subscribed.","info","Connection")
            }
            
        }
        
    }
    ,handleReadyState:function(G,F){
        var H=this;
        var E=(F&&F.argument)?F.argument:null;
        if(F&&F.timeout){
            this._timeOut[G.tId]=window.setTimeout(function(){
                H.abort(G,F,true)
            }
            ,F.timeout)
        }
        this._poll[G.tId]=window.setInterval(function(){
            if(G.conn&&G.conn.readyState===4){
                window.clearInterval(H._poll[G.tId]);
                delete H._poll[G.tId];
                if(F&&F.timeout){
                    window.clearTimeout(H._timeOut[G.tId]);
                    delete H._timeOut[G.tId]
                }
                H.completeEvent.fire(G,E);
                if(G.completeEvent){
                    G.completeEvent.fire(G,E)
                }
                H.handleTransactionResponse(G,F)
            }
            
        }
        ,this._polling_interval)
    }
    ,handleTransactionResponse:function(J,I,H){
        var L,M;
        var N=(I&&I.argument)?I.argument:null;
        try{
            if(J.conn.status!==undefined&&J.conn.status!==0){
                L=J.conn.status
            }
            else{
                L=13030
            }
            
        }
        catch(K){
            L=13030
        }
        if(L>=200&&L<300||L===1223){
            M=this.createResponseObject(J,N);
            if(I&&I.success){
                if(!I.scope){
                    I.success(M);
                    pega.log("Success callback. HTTP code is "+L,"info","Connection")
                }
                else{
                    I.success.apply(I.scope,[M]);
                    pega.log("Success callback with scope. HTTP code is "+L,"info","Connection")
                }
                
            }
            this.successEvent.fire(M);
            if(J.successEvent){
                J.successEvent.fire(M)
            }
            
        }
        else{
            switch(L){
                case 12002:case 12029:case 12030:case 12031:case 12152:case 13030:M=this.createExceptionObject(J.tId,N,(H?H:false));
                if(I&&I.failure){
                    if(!I.scope){
                        I.failure(M);
                        pega.log("Failure callback. Exception detected. Status code is "+L,"warn","Connection")
                    }
                    else{
                        I.failure.apply(I.scope,[M]);
                        pega.log("Failure callback with scope. Exception detected. Status code is "+L,"warn","Connection")
                    }
                    
                }
                break;
                default:M=this.createResponseObject(J,N);
                if(I&&I.failure){
                    if(!I.scope){
                        I.failure(M);
                        pega.log("Failure callback. HTTP status code is "+L,"warn","Connection")
                    }
                    else{
                        I.failure.apply(I.scope,[M]);
                        pega.log("Failure callback with scope. HTTP status code is "+L,"warn","Connection")
                    }
                    
                }
                
            }
            this.failureEvent.fire(M);
            if(J.failureEvent){
                J.failureEvent.fire(M)
            }
            
        }
        this.releaseObject(J);
        M=null
    }
    ,createResponseObject:function(M,P){
        var J={};
        var N={};
        try{
            var K=M.conn.getAllResponseHeaders();
            var Q=K.split("\n");
            for(var R=0;
            R<Q.length;
            R++){
                var L=Q[R].indexOf(":");
                if(L!=-1){
                    N[Q[R].substring(0,L)]=Q[R].substring(L+2)
                }
                
            }
            
        }
        catch(O){}J.tId=M.tId;
        J.status=(M.conn.status==1223)?204:M.conn.status;
        J.statusText=(M.conn.status==1223)?"No Content":M.conn.statusText;
        J.getResponseHeader=N;
        J.getAllResponseHeaders=K;
        J.responseText=M.conn.responseText;
        J.responseXML=M.conn.responseXML;
        if(P){
            J.argument=P
        }
        return J
    }
    ,createExceptionObject:function(J,N,I){
        var L=0;
        var K="communication failure";
        var O=-1;
        var P="transaction aborted";
        var M={};
        M.tId=J;
        if(I){
            M.status=O;
            M.statusText=P
        }
        else{
            M.status=L;
            M.statusText=K
        }
        if(N){
            M.argument=N
        }
        return M
    }
    ,initHeader:function(E,F,G){
        var H=(G)?this._default_headers:this._http_headers;
        H[E]=F;
        if(G){
            this._has_default_headers=true
        }
        else{
            this._has_http_headers=true
        }
        
    }
    ,setHeader:function(C){
        if(this._has_default_headers){
            for(var D in this._default_headers){
                if(pega.lang.hasOwnProperty(this._default_headers,D)){
                    C.conn.setRequestHeader(D,this._default_headers[D]);
                    pega.log("Default HTTP header "+D+" set with value of "+this._default_headers[D],"info","Connection")
                }
                
            }
            
        }
        if(this._has_http_headers){
            for(var D in this._http_headers){
                if(pega.lang.hasOwnProperty(this._http_headers,D)){
                    C.conn.setRequestHeader(D,this._http_headers[D]);
                    pega.log("HTTP header "+D+" set with value of "+this._http_headers[D],"info","Connection")
                }
                
            }
            delete this._http_headers;
            this._http_headers={};
            this._has_http_headers=false
        }
        
    }
    ,resetDefaultHeaders:function(){
        delete this._default_headers;
        this._default_headers={};
        this._has_default_headers=false
    }
    ,setForm:function(R,X,O){
        this.resetFormState();
        var S;
        if(typeof R=="string"){
            S=(document.getElementById(R)||document.forms[R])
        }
        else{
            if(typeof R=="object"){
                S=R
            }
            else{
                pega.log("Unable to create form object "+R,"warn","Connection");
                return 
            }
            
        }
        if(X){
            var W=this.createFrame((window.location.href.toLowerCase().indexOf("https")===0||O)?true:false);
            this._isFormSubmit=true;
            this._isFileUpload=true;
            this._formNode=S;
            return 
        }
        var P,T,V,Q;
        var U=false;
        for(var M=0;
        M<S.elements.length;
        M++){
            P=S.elements[M];
            Q=P.disabled;
            T=P.name;
            V=P.value;
            if(!Q&&T){
                switch(P.type){
                    case"select-one":case"select-multiple":for(var N=0;
                    N<P.options.length;
                    N++){
                        if(P.options[N].selected){
                            if(window.ActiveXObject){
                                this._sFormData+=encodeURIComponent(T)+"="+encodeURIComponent(P.options[N].attributes.value.specified?P.options[N].value:P.options[N].text)+"&"
                            }
                            else{
                                this._sFormData+=encodeURIComponent(T)+"="+encodeURIComponent(P.options[N].hasAttribute("value")?P.options[N].value:P.options[N].text)+"&"
                            }
                            
                        }
                        
                    }
                    break;
                    case"radio":case"checkbox":if(P.checked){
                        this._sFormData+=encodeURIComponent(T)+"="+encodeURIComponent(V)+"&"
                    }
                    break;
                    case"file":case undefined:case"reset":case"button":break;
                    case"submit":if(U===false){
                        if(this._hasSubmitListener&&this._submitElementValue){
                            this._sFormData+=this._submitElementValue+"&"
                        }
                        else{
                            this._sFormData+=encodeURIComponent(T)+"="+encodeURIComponent(V)+"&"
                        }
                        U=true
                    }
                    break;
                    default:this._sFormData+=encodeURIComponent(T)+"="+encodeURIComponent(V)+"&"
                }
                
            }
            
        }
        this._isFormSubmit=true;
        this._sFormData=this._sFormData.substr(0,this._sFormData.length-1);
        pega.log("Form initialized for transaction. HTML form POST message is: "+this._sFormData,"info","Connection");
        this.initHeader("Content-Type",this._default_form_header);
        pega.log("Initialize header Content-Type to application/x-www-form-urlencoded for setForm() transaction.","info","Connection");
        return this._sFormData
    }
    ,resetFormState:function(){
        this._isFormSubmit=false;
        this._isFileUpload=false;
        this._formNode=null;
        this._sFormData=""
    }
    ,createFrame:function(D){
        var F="yuiIO"+this._transaction_id;
        var E;
        if(window.ActiveXObject){
            E=document.createElement('<iframe id="'+F+'" name="'+F+'" />');
            if(typeof D=="boolean"){
                E.src="javascript:false"
            }
            
        }
        else{
            E=document.createElement("iframe");
            E.id=F;
            E.name=F
        }
        E.style.position="absolute";
        E.style.top="-1000px";
        E.style.left="-1000px";
        document.body.appendChild(E);
        pega.log("File upload iframe created. Id is:"+F,"info","Connection")
    }
    ,appendPostData:function(F){
        var H=[];
        var J=F.split("&");
        for(var I=0;
        I<J.length;
        I++){
            var G=J[I].indexOf("=");
            if(G!=-1){
                H[I]=document.createElement("input");
                H[I].type="hidden";
                H[I].name=J[I].substring(0,G);
                H[I].value=J[I].substring(G+1);
                this._formNode.appendChild(H[I])
            }
            
        }
        return H
    }
    ,uploadFile:function(O,T,b,P){
        var S=this;
        var Y="yuiIO"+O.tId;
        var X="multipart/form-data";
        var V=document.getElementById(Y);
        var W=(T&&T.argument)?T.argument:null;
        var Q={
            action:this._formNode.getAttribute("action"),method:this._formNode.getAttribute("method"),target:this._formNode.getAttribute("target")
        };
        this._formNode.setAttribute("action",b);
        this._formNode.setAttribute("method","POST");
        this._formNode.setAttribute("target",Y);
        if(pega.env.ua.ie){
            this._formNode.setAttribute("encoding",X)
        }
        else{
            this._formNode.setAttribute("enctype",X)
        }
        if(P){
            var U=this.appendPostData(P)
        }
        this._formNode.submit();
        this.startEvent.fire(O,W);
        if(O.startEvent){
            O.startEvent.fire(O,W)
        }
        if(T&&T.timeout){
            this._timeOut[O.tId]=window.setTimeout(function(){
                S.abort(O,T,true)
            }
            ,T.timeout)
        }
        if(U&&U.length>0){
            for(var Z=0;
            Z<U.length;
            Z++){
                this._formNode.removeChild(U[Z])
            }
            
        }
        for(var R in Q){
            if(pega.lang.hasOwnProperty(Q,R)){
                if(Q[R]){
                    this._formNode.setAttribute(R,Q[R])
                }
                else{
                    this._formNode.removeAttribute(R)
                }
                
            }
            
        }
        this.resetFormState();
        var a=function(){
            if(T&&T.timeout){
                window.clearTimeout(S._timeOut[O.tId]);
                delete S._timeOut[O.tId]
            }
            S.completeEvent.fire(O,W);
            if(O.completeEvent){
                O.completeEvent.fire(O,W)
            }
            var A={};
            A.tId=O.tId;
            A.argument=T.argument;
            try{
                A.responseText=V.contentWindow.document.body?V.contentWindow.document.body.innerHTML:V.contentWindow.document.documentElement.textContent;
                A.responseXML=V.contentWindow.document.XMLDocument?V.contentWindow.document.XMLDocument:V.contentWindow.document
            }
            catch(B){}if(T&&T.upload){
                if(!T.scope){
                    T.upload(A);
                    pega.log("Upload callback.","info","Connection")
                }
                else{
                    T.upload.apply(T.scope,[A]);
                    pega.log("Upload callback with scope.","info","Connection")
                }
                
            }
            S.uploadEvent.fire(A);
            if(O.uploadEvent){
                O.uploadEvent.fire(A)
            }
            pega.util.Event.removeListener(V,"load",a);
            setTimeout(function(){
                document.body.removeChild(V);
                S.releaseObject(O);
                pega.log("File upload iframe destroyed. Id is:"+Y,"info","Connection")
            }
            ,100)
        };
        pega.util.Event.addListener(V,"load",a)
    }
    ,abort:function(K,I,H){
        var L;
        var N=(I&&I.argument)?I.argument:null;
        if(K&&K.conn){
            if(this.isCallInProgress(K)){
                K.conn.abort();
                window.clearInterval(this._poll[K.tId]);
                delete this._poll[K.tId];
                if(H){
                    window.clearTimeout(this._timeOut[K.tId]);
                    delete this._timeOut[K.tId]
                }
                L=true
            }
            
        }
        else{
            if(K&&K.isUpload===true){
                var M="yuiIO"+K.tId;
                var J=document.getElementById(M);
                if(J){
                    pega.util.Event.removeListener(J,"load");
                    document.body.removeChild(J);
                    pega.log("File upload iframe destroyed. Id is:"+M,"info","Connection");
                    if(H){
                        window.clearTimeout(this._timeOut[K.tId]);
                        delete this._timeOut[K.tId]
                    }
                    L=true
                }
                
            }
            else{
                L=false
            }
            
        }
        if(L===true){
            this.abortEvent.fire(K,N);
            if(K.abortEvent){
                K.abortEvent.fire(K,N)
            }
            this.handleTransactionResponse(K,I,true);
            pega.log("Transaction "+K.tId+" aborted.","info","Connection")
        }
        return L
    }
    ,isCallInProgress:function(D){
        if(D&&D.conn){
            return D.conn.readyState!==4&&D.conn.readyState!==0
        }
        else{
            if(D&&D.isUpload===true){
                var C="yuiIO"+D.tId;
                return document.getElementById(C)?true:false
            }
            else{
                return false
            }
            
        }
        
    }
    ,releaseObject:function(B){
        if(B&&B.conn){
            B.conn=null;
            pega.log("Connection object for transaction "+B.tId+" destroyed.","info","Connection");
            B=null
        }
        
    }
    
};
pega.register("connection",pega.util.Connect,{
    version:"2.5.2",build:"1076"
});
(function(){
    var D=pega.util;
    var C=function(G,H,B,A){
        if(!G){}this.init(G,H,B,A)
    };
    C.NAME="Anim";
    C.prototype={
        toString:function(){
            var B=this.getEl()||{};
            var A=B.id||B.tagName;
            return(this.constructor.NAME+": "+A)
        }
        ,patterns:{
            noNegatives:/width|height|opacity|padding/i,offsetAttribute:/^((width|height)|(top|left))$/,defaultUnit:/width|height|top$|bottom$|left$|right$/i,offsetUnit:/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i
        }
        ,doMethod:function(F,A,B){
            return this.method(this.currentFrame,A,B-A,this.totalFrames)
        }
        ,setAttribute:function(F,A,B){
            if(this.patterns.noNegatives.test(F)){
                A=(A>0)?A:0
            }
            D.Dom.setStyle(this.getEl(),F,A+B)
        }
        ,getAttribute:function(L){
            var J=this.getEl();
            var B=D.Dom.getStyle(J,L);
            if(B!=="auto"&&!this.patterns.offsetUnit.test(B)){
                return parseFloat(B)
            }
            var K=this.patterns.offsetAttribute.exec(L)||[];
            var A=!!(K[3]);
            var I=!!(K[2]);
            if(I||(D.Dom.getStyle(J,"position")=="absolute"&&A)){
                B=J["offset"+K[0].charAt(0).toUpperCase()+K[0].substr(1)]
            }
            else{
                B=0
            }
            return B
        }
        ,getDefaultUnit:function(A){
            if(this.patterns.defaultUnit.test(A)){
                return"px"
            }
            return""
        }
        ,setRuntimeAttribute:function(M){
            var A;
            var L;
            var K=this.attributes;
            this.runtimeAttributes[M]={};
            var B=function(E){
                return(typeof E!=="undefined")
            };
            if(!B(K[M]["to"])&&!B(K[M]["by"])){
                return false
            }
            A=(B(K[M]["from"]))?K[M]["from"]:this.getAttribute(M);
            if(B(K[M]["to"])){
                L=K[M]["to"]
            }
            else{
                if(B(K[M]["by"])){
                    if(A.constructor==Array){
                        L=[];
                        for(var J=0,N=A.length;
                        J<N;
                        ++J){
                            L[J]=A[J]+K[M]["by"][J]*1
                        }
                        
                    }
                    else{
                        L=A+K[M]["by"]*1
                    }
                    
                }
                
            }
            this.runtimeAttributes[M].start=A;
            this.runtimeAttributes[M].end=L;
            this.runtimeAttributes[M].unit=(B(K[M].unit))?K[M]["unit"]:this.getDefaultUnit(M);
            return true
        }
        ,init:function(T,O,P,B){
            var A=false;
            var S=null;
            var Q=0;
            T=D.Dom.get(T);
            this.attributes=O||{};
            this.duration=!pega.lang.isUndefined(P)?P:1;
            this.method=B||D.Easing.easeNone;
            this.useSeconds=true;
            this.currentFrame=0;
            this.totalFrames=D.AnimMgr.fps;
            this.setEl=function(E){
                T=D.Dom.get(E)
            };
            this.getEl=function(){
                return T
            };
            this.isAnimated=function(){
                return A
            };
            this.getStartTime=function(){
                return S
            };
            this.runtimeAttributes={};
            this.animate=function(){
                if(this.isAnimated()){
                    return false
                }
                this.currentFrame=0;
                this.totalFrames=(this.useSeconds)?Math.ceil(D.AnimMgr.fps*this.duration):this.duration;
                if(this.duration===0&&this.useSeconds){
                    this.totalFrames=1
                }
                D.AnimMgr.registerElement(this);
                return true
            };
            this.stop=function(E){
                if(!this.isAnimated()){
                    return false
                }
                if(E){
                    this.currentFrame=this.totalFrames;
                    this._onTween.fire()
                }
                D.AnimMgr.stop(this)
            };
            var M=function(){
                this.onStart.fire();
                this.runtimeAttributes={};
                for(var E in this.attributes){
                    this.setRuntimeAttribute(E)
                }
                A=true;
                Q=0;
                S=new Date()
            };
            var N=function(){
                var E={
                    duration:new Date()-this.getStartTime(),currentFrame:this.currentFrame
                };
                E.toString=function(){
                    return("duration: "+E.duration+", currentFrame: "+E.currentFrame)
                };
                this.onTween.fire(E);
                var F=this.runtimeAttributes;
                for(var G in F){
                    this.setAttribute(G,this.doMethod(G,F[G].start,F[G].end),F[G].unit)
                }
                Q+=1
            };
            var R=function(){
                var F=(new Date()-S)/1000;
                var E={
                    duration:F,frames:Q,fps:Q/F
                };
                E.toString=function(){
                    return("duration: "+E.duration+", frames: "+E.frames+", fps: "+E.fps)
                };
                A=false;
                Q=0;
                this.onComplete.fire(E)
            };
            this._onStart=new D.CustomEvent("_start",this,true);
            this.onStart=new D.CustomEvent("start",this);
            this.onTween=new D.CustomEvent("tween",this);
            this._onTween=new D.CustomEvent("_tween",this,true);
            this.onComplete=new D.CustomEvent("complete",this);
            this._onComplete=new D.CustomEvent("_complete",this,true);
            this._onStart.subscribe(M);
            this._onTween.subscribe(N);
            this._onComplete.subscribe(R)
        }
        
    };
    D.Anim=C
})();
pega.util.AnimMgr=new function(){
    var I=null;
    var J=[];
    var F=0;
    this.fps=1000;
    this.delay=1;
    this.registerElement=function(A){
        J[J.length]=A;
        F+=1;
        A._onStart.fire();
        this.start()
    };
    this.unRegister=function(A,B){
        B=B||G(A);
        if(!A.isAnimated()||B==-1){
            return false
        }
        A._onComplete.fire();
        J.splice(B,1);
        F-=1;
        if(F<=0){
            this.stop()
        }
        return true
    };
    this.start=function(){
        if(I===null){
            I=setInterval(this.run,this.delay)
        }
        
    };
    this.stop=function(A){
        if(!A){
            clearInterval(I);
            for(var B=0,C=J.length;
            B<C;
            ++B){
                this.unRegister(J[0],0)
            }
            J=[];
            I=null;
            F=0
        }
        else{
            this.unRegister(A)
        }
        
    };
    this.run=function(){
        for(var A=0,C=J.length;
        A<C;
        ++A){
            var B=J[A];
            if(!B||!B.isAnimated()){
                continue
            }
            if(B.currentFrame<B.totalFrames||B.totalFrames===null){
                B.currentFrame+=1;
                if(B.useSeconds){
                    H(B)
                }
                B._onTween.fire()
            }
            else{
                pega.util.AnimMgr.stop(B,A)
            }
            
        }
        
    };
    var G=function(A){
        for(var B=0,C=J.length;
        B<C;
        ++B){
            if(J[B]==A){
                return B
            }
            
        }
        return -1
    };
    var H=function(E){
        var B=E.totalFrames;
        var C=E.currentFrame;
        var D=(E.currentFrame*E.duration*1000/E.totalFrames);
        var L=(new Date()-E.getStartTime());
        var A=0;
        if(L<E.duration*1000){
            A=Math.round((L/D-1)*E.currentFrame)
        }
        else{
            A=B-(C+1)
        }
        if(A>0&&isFinite(A)){
            if(E.currentFrame+A>=B){
                A=B-(C+1)
            }
            E.currentFrame+=A
        }
        
    }
    
};
pega.util.Bezier=new function(){
    this.getPosition=function(I,J){
        var H=I.length;
        var K=[];
        for(var L=0;
        L<H;
        ++L){
            K[L]=[I[L][0],I[L][1]]
        }
        for(var G=1;
        G<H;
        ++G){
            for(L=0;
            L<H-G;
            ++L){
                K[L][0]=(1-J)*K[L][0]+J*K[parseInt(L+1,10)][0];
                K[L][1]=(1-J)*K[L][1]+J*K[parseInt(L+1,10)][1]
            }
            
        }
        return[K[0][0],K[0][1]]
    }
    
};
(function(){
    var E=function(C,D,B,A){
        E.superclass.constructor.call(this,C,D,B,A)
    };
    E.NAME="ColorAnim";
    var G=pega.util;
    pega.extend(E,G.Anim);
    var F=E.superclass;
    var H=E.prototype;
    H.patterns.color=/color$/i;
    H.patterns.rgb=/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
    H.patterns.hex=/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
    H.patterns.hex3=/^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
    H.patterns.transparent=/^transparent|rgba\(0, 0, 0, 0\)$/;
    H.parseColor=function(B){
        if(B.length==3){
            return B
        }
        var A=this.patterns.hex.exec(B);
        if(A&&A.length==4){
            return[parseInt(A[1],16),parseInt(A[2],16),parseInt(A[3],16)]
        }
        A=this.patterns.rgb.exec(B);
        if(A&&A.length==4){
            return[parseInt(A[1],10),parseInt(A[2],10),parseInt(A[3],10)]
        }
        A=this.patterns.hex3.exec(B);
        if(A&&A.length==4){
            return[parseInt(A[1]+A[1],16),parseInt(A[2]+A[2],16),parseInt(A[3]+A[3],16)]
        }
        return null
    };
    H.getAttribute=function(D){
        var B=this.getEl();
        if(this.patterns.color.test(D)){
            var A=pega.util.Dom.getStyle(B,D);
            if(this.patterns.transparent.test(A)){
                var C=B.parentNode;
                A=G.Dom.getStyle(C,D);
                while(C&&this.patterns.transparent.test(A)){
                    C=C.parentNode;
                    A=G.Dom.getStyle(C,D);
                    if(C.tagName.toUpperCase()=="HTML"){
                        A="#fff"
                    }
                    
                }
                
            }
            
        }
        else{
            A=F.getAttribute.call(this,D)
        }
        return A
    };
    H.doMethod=function(K,A,D){
        var B;
        if(this.patterns.color.test(K)){
            B=[];
            for(var C=0,L=A.length;
            C<L;
            ++C){
                B[C]=F.doMethod.call(this,K,A[C],D[C])
            }
            B="rgb("+Math.floor(B[0])+","+Math.floor(B[1])+","+Math.floor(B[2])+")"
        }
        else{
            B=F.doMethod.call(this,K,A,D)
        }
        return B
    };
    H.setRuntimeAttribute=function(K){
        F.setRuntimeAttribute.call(this,K);
        if(this.patterns.color.test(K)){
            var C=this.attributes;
            var A=this.parseColor(this.runtimeAttributes[K].start);
            var D=this.parseColor(this.runtimeAttributes[K].end);
            if(typeof C[K]["to"]==="undefined"&&typeof C[K]["by"]!=="undefined"){
                D=this.parseColor(C[K].by);
                for(var B=0,L=A.length;
                B<L;
                ++B){
                    D[B]=A[B]+D[B]
                }
                
            }
            this.runtimeAttributes[K].start=A;
            this.runtimeAttributes[K].end=D
        }
        
    };
    G.ColorAnim=E
})();
pega.util.Easing={
    easeNone:function(H,E,F,G){
        return F*H/G+E
    }
    ,easeIn:function(H,E,F,G){
        return F*(H/=G)*H+E
    }
    ,easeOut:function(H,E,F,G){
        return -F*(H/=G)*(H-2)+E
    }
    ,easeBoth:function(H,E,F,G){
        if((H/=G/2)<1){
            return F/2*H*H+E
        }
        return -F/2*((--H)*(H-2)-1)+E
    }
    ,easeInStrong:function(H,E,F,G){
        return F*(H/=G)*H*H*H+E
    }
    ,easeOutStrong:function(H,E,F,G){
        return -F*((H=H/G-1)*H*H*H-1)+E
    }
    ,easeBothStrong:function(H,E,F,G){
        if((H/=G/2)<1){
            return F/2*H*H*H*H+E
        }
        return -F/2*((H-=2)*H*H*H-2)+E
    }
    ,elasticIn:function(M,H,I,J,N,K){
        if(M==0){
            return H
        }
        if((M/=J)==1){
            return H+I
        }
        if(!K){
            K=J*0.3
        }
        if(!N||N<Math.abs(I)){
            N=I;
            var L=K/4
        }
        else{
            var L=K/(2*Math.PI)*Math.asin(I/N)
        }
        return -(N*Math.pow(2,10*(M-=1))*Math.sin((M*J-L)*(2*Math.PI)/K))+H
    }
    ,elasticOut:function(M,H,I,J,N,K){
        if(M==0){
            return H
        }
        if((M/=J)==1){
            return H+I
        }
        if(!K){
            K=J*0.3
        }
        if(!N||N<Math.abs(I)){
            N=I;
            var L=K/4
        }
        else{
            var L=K/(2*Math.PI)*Math.asin(I/N)
        }
        return N*Math.pow(2,-10*M)*Math.sin((M*J-L)*(2*Math.PI)/K)+I+H
    }
    ,elasticBoth:function(M,H,I,J,N,K){
        if(M==0){
            return H
        }
        if((M/=J/2)==2){
            return H+I
        }
        if(!K){
            K=J*(0.3*1.5)
        }
        if(!N||N<Math.abs(I)){
            N=I;
            var L=K/4
        }
        else{
            var L=K/(2*Math.PI)*Math.asin(I/N)
        }
        if(M<1){
            return -0.5*(N*Math.pow(2,10*(M-=1))*Math.sin((M*J-L)*(2*Math.PI)/K))+H
        }
        return N*Math.pow(2,-10*(M-=1))*Math.sin((M*J-L)*(2*Math.PI)/K)*0.5+I+H
    }
    ,backIn:function(J,F,G,H,I){
        if(typeof I=="undefined"){
            I=1.70158
        }
        return G*(J/=H)*J*((I+1)*J-I)+F
    }
    ,backOut:function(J,F,G,H,I){
        if(typeof I=="undefined"){
            I=1.70158
        }
        return G*((J=J/H-1)*J*((I+1)*J+I)+1)+F
    }
    ,backBoth:function(J,F,G,H,I){
        if(typeof I=="undefined"){
            I=1.70158
        }
        if((J/=H/2)<1){
            return G/2*(J*J*(((I*=(1.525))+1)*J-I))+F
        }
        return G/2*((J-=2)*J*(((I*=(1.525))+1)*J+I)+2)+F
    }
    ,bounceIn:function(H,E,F,G){
        return F-pega.util.Easing.bounceOut(G-H,0,F,G)+E
    }
    ,bounceOut:function(H,E,F,G){
        if((H/=G)<(1/2.75)){
            return F*(7.5625*H*H)+E
        }
        else{
            if(H<(2/2.75)){
                return F*(7.5625*(H-=(1.5/2.75))*H+0.75)+E
            }
            else{
                if(H<(2.5/2.75)){
                    return F*(7.5625*(H-=(2.25/2.75))*H+0.9375)+E
                }
                
            }
            
        }
        return F*(7.5625*(H-=(2.625/2.75))*H+0.984375)+E
    }
    ,bounceBoth:function(H,E,F,G){
        if(H<G/2){
            return pega.util.Easing.bounceIn(H*2,0,F,G)*0.5+E
        }
        return pega.util.Easing.bounceOut(H*2-G,0,F,G)*0.5+F*0.5+E
    }
    
};
(function(){
    var G=function(C,D,B,A){
        if(C){
            G.superclass.constructor.call(this,C,D,B,A)
        }
        
    };
    G.NAME="Motion";
    var I=pega.util;
    pega.extend(G,I.ColorAnim);
    var H=G.superclass;
    var K=G.prototype;
    K.patterns.points=/^points$/i;
    K.setAttribute=function(C,A,B){
        if(this.patterns.points.test(C)){
            B=B||"px";
            H.setAttribute.call(this,"left",A[0],B);
            H.setAttribute.call(this,"top",A[1],B)
        }
        else{
            H.setAttribute.call(this,C,A,B)
        }
        
    };
    K.getAttribute=function(B){
        if(this.patterns.points.test(B)){
            var A=[H.getAttribute.call(this,"left"),H.getAttribute.call(this,"top")]
        }
        else{
            A=H.getAttribute.call(this,B)
        }
        return A
    };
    K.doMethod=function(E,A,D){
        var B=null;
        if(this.patterns.points.test(E)){
            var C=this.method(this.currentFrame,0,100,this.totalFrames)/100;
            B=I.Bezier.getPosition(this.runtimeAttributes[E],C)
        }
        else{
            B=H.doMethod.call(this,E,A,D)
        }
        return B
    };
    K.setRuntimeAttribute=function(A){
        if(this.patterns.points.test(A)){
            var S=this.getEl();
            var Q=this.attributes;
            var T;
            var E=Q.points["control"]||[];
            var R;
            var D,B;
            if(E.length>0&&!(E[0] instanceof Array)){
                E=[E]
            }
            else{
                var F=[];
                for(D=0,B=E.length;
                D<B;
                ++D){
                    F[D]=E[D]
                }
                E=F
            }
            if(I.Dom.getStyle(S,"position")=="static"){
                I.Dom.setStyle(S,"position","relative")
            }
            if(J(Q.points["from"])){
                I.Dom.setXY(S,Q.points["from"])
            }
            else{
                I.Dom.setXY(S,I.Dom.getXY(S))
            }
            T=this.getAttribute("points");
            if(J(Q.points["to"])){
                R=L.call(this,Q.points["to"],T);
                var C=I.Dom.getXY(this.getEl());
                for(D=0,B=E.length;
                D<B;
                ++D){
                    E[D]=L.call(this,E[D],T)
                }
                
            }
            else{
                if(J(Q.points["by"])){
                    R=[T[0]+Q.points["by"][0],T[1]+Q.points["by"][1]];
                    for(D=0,B=E.length;
                    D<B;
                    ++D){
                        E[D]=[T[0]+E[D][0],T[1]+E[D][1]]
                    }
                    
                }
                
            }
            this.runtimeAttributes[A]=[T];
            if(E.length>0){
                this.runtimeAttributes[A]=this.runtimeAttributes[A].concat(E)
            }
            this.runtimeAttributes[A][this.runtimeAttributes[A].length]=R
        }
        else{
            H.setRuntimeAttribute.call(this,A)
        }
        
    };
    var L=function(C,A){
        var B=I.Dom.getXY(this.getEl());
        C=[C[0]-B[0]+A[0],C[1]-B[1]+A[1]];
        return C
    };
    var J=function(A){
        return(typeof A!=="undefined")
    };
    I.Motion=G
})();
(function(){
    var F=function(C,D,B,A){
        if(C){
            F.superclass.constructor.call(this,C,D,B,A)
        }
        
    };
    F.NAME="Scroll";
    var H=pega.util;
    pega.extend(F,H.ColorAnim);
    var G=F.superclass;
    var E=F.prototype;
    E.doMethod=function(D,A,C){
        var B=null;
        if(D=="scroll"){
            B=[this.method(this.currentFrame,A[0],C[0]-A[0],this.totalFrames),this.method(this.currentFrame,A[1],C[1]-A[1],this.totalFrames)]
        }
        else{
            B=G.doMethod.call(this,D,A,C)
        }
        return B
    };
    E.getAttribute=function(C){
        var A=null;
        var B=this.getEl();
        if(C=="scroll"){
            A=[B.scrollLeft,B.scrollTop]
        }
        else{
            A=G.getAttribute.call(this,C)
        }
        return A
    };
    E.setAttribute=function(D,A,B){
        var C=this.getEl();
        if(D=="scroll"){
            C.scrollLeft=A[0];
            C.scrollTop=A[1]
        }
        else{
            G.setAttribute.call(this,D,A,B)
        }
        
    };
    H.Scroll=F
})();
pega.register("animation",pega.util.Anim,{
    version:"2.5.2",build:"1076"
});
if(!pega.util.DragDropMgr){
    pega.util.DragDropMgr=function(){
        var B=pega.util.Event;
        return{
            ids:{},handleIds:{},dragCurrent:null,dragOvers:{},deltaX:0,deltaY:0,preventDefault:true,stopPropagation:true,initialized:false,locked:false,interactionInfo:null,init:function(){
                this.initialized=true
            }
            ,POINT:0,INTERSECT:1,STRICT_INTERSECT:2,mode:0,_execOnAll:function(H,I){
                for(var G in this.ids){
                    for(var J in this.ids[G]){
                        var A=this.ids[G][J];
                        if(!this.isTypeOfDD(A)){
                            continue
                        }
                        A[H].apply(A,I)
                    }
                    
                }
                
            }
            ,_onLoad:function(){
                this.init();
                B.on(document,"mouseup",this.handleMouseUp,this,true);
                B.on(document,"mousemove",this.handleMouseMove,this,true);
                B.on(window,"unload",this._onUnload,this,true);
                B.on(window,"resize",this._onResize,this,true)
            }
            ,_onResize:function(A){
                this._execOnAll("resetConstraints",[])
            }
            ,lock:function(){
                this.locked=true
            }
            ,unlock:function(){
                this.locked=false
            }
            ,isLocked:function(){
                return this.locked
            }
            ,locationCache:{},useCache:true,clickPixelThresh:3,clickTimeThresh:1000,dragThreshMet:false,clickTimeout:null,startX:0,startY:0,fromTimeout:false,regDragDrop:function(A,D){
                if(!this.initialized){
                    this.init()
                }
                if(!this.ids[D]){
                    this.ids[D]={}
                }
                this.ids[D][A.id]=A
            }
            ,removeDDFromGroup:function(A,F){
                if(!this.ids[F]){
                    this.ids[F]={}
                }
                var E=this.ids[F];
                if(E&&E[A.id]){
                    delete E[A.id]
                }
                
            }
            ,_remove:function(A){
                for(var D in A.groups){
                    if(D&&this.ids[D][A.id]){
                        delete this.ids[D][A.id]
                    }
                    
                }
                delete this.handleIds[A.id]
            }
            ,regHandle:function(A,D){
                if(!this.handleIds[A]){
                    this.handleIds[A]={}
                }
                this.handleIds[A][D]=D
            }
            ,isDragDrop:function(A){
                return(this.getDDById(A))?true:false
            }
            ,getRelated:function(A,K){
                var H=[];
                for(var I in A.groups){
                    for(var J in this.ids[I]){
                        var L=this.ids[I][J];
                        if(!this.isTypeOfDD(L)){
                            continue
                        }
                        if(!K||L.isTarget){
                            H[H.length]=L
                        }
                        
                    }
                    
                }
                return H
            }
            ,isLegalTarget:function(A,G){
                var I=this.getRelated(A,true);
                for(var H=0,J=I.length;
                H<J;
                ++H){
                    if(I[H].id==G.id){
                        return true
                    }
                    
                }
                return false
            }
            ,isTypeOfDD:function(A){
                return(A&&A.__ygDragDrop)
            }
            ,isHandle:function(A,D){
                return(this.handleIds[A]&&this.handleIds[A][D])
            }
            ,getDDById:function(A){
                for(var D in this.ids){
                    if(this.ids[D][A]){
                        return this.ids[D][A]
                    }
                    
                }
                return null
            }
            ,handleMouseDown:function(A,E){
                this.currentTarget=pega.util.Event.getTarget(A);
                this.dragCurrent=E;
                var F=E.getEl();
                this.startX=pega.util.Event.getPageX(A);
                this.startY=pega.util.Event.getPageY(A);
                this.deltaX=this.startX-F.offsetLeft;
                this.deltaY=this.startY-F.offsetTop;
                this.dragThreshMet=false;
                this.clickTimeout=setTimeout(function(){
                    var C=pega.util.DDM;
                    C.startDrag(C.startX,C.startY);
                    C.fromTimeout=true
                }
                ,this.clickTimeThresh)
            }
            ,startDrag:function(F,A){
                clearTimeout(this.clickTimeout);
                var E=this.dragCurrent;
                if(E&&E.events.b4StartDrag){
                    E.b4StartDrag(F,A);
                    E.fireEvent("b4StartDragEvent",{
                        x:F,y:A
                    })
                }
                if(E&&E.events.startDrag){
                    E.startDrag(F,A);
                    E.fireEvent("startDragEvent",{
                        x:F,y:A
                    })
                }
                this.dragThreshMet=true
            }
            ,handleMouseUp:function(A){
                if(this.dragCurrent){
                    clearTimeout(this.clickTimeout);
                    if(this.dragThreshMet){
                        if(this.fromTimeout){
                            this.fromTimeout=false;
                            this.handleMouseMove(A)
                        }
                        this.fromTimeout=false;
                        this.fireEvents(A,true)
                    }
                    else{}this.stopDrag(A);
                    this.stopEvent(A)
                }
                
            }
            ,stopEvent:function(A){
                if(this.stopPropagation){
                    pega.util.Event.stopPropagation(A)
                }
                if(this.preventDefault){
                    pega.util.Event.preventDefault(A)
                }
                
            }
            ,stopDrag:function(A,E){
                var F=this.dragCurrent;
                if(F&&!E){
                    if(this.dragThreshMet){
                        if(F.events.b4EndDrag){
                            F.b4EndDrag(A);
                            F.fireEvent("b4EndDragEvent",{
                                e:A
                            })
                        }
                        if(F.events.endDrag){
                            F.endDrag(A);
                            F.fireEvent("endDragEvent",{
                                e:A
                            })
                        }
                        
                    }
                    if(F.events.mouseUp){
                        F.onMouseUp(A);
                        F.fireEvent("mouseUpEvent",{
                            e:A
                        })
                    }
                    
                }
                this.dragCurrent=null;
                this.dragOvers={}
            }
            ,handleMouseMove:function(A){
                var H=this.dragCurrent;
                if(H){
                    if(pega.util.Event.isIE&&!A.button){
                        this.stopEvent(A);
                        return this.handleMouseUp(A)
                    }
                    else{
                        if(A.clientX<0||A.clientY<0){}
                    }
                    if(!this.dragThreshMet){
                        var F=Math.abs(this.startX-pega.util.Event.getPageX(A));
                        var G=Math.abs(this.startY-pega.util.Event.getPageY(A));
                        if(F>this.clickPixelThresh||G>this.clickPixelThresh){
                            this.startDrag(this.startX,this.startY)
                        }
                        
                    }
                    if(this.dragThreshMet){
                        if(H&&H.events.b4Drag){
                            H.b4Drag(A);
                            H.fireEvent("b4DragEvent",{
                                e:A
                            })
                        }
                        if(H&&H.events.drag){
                            H.onDrag(A);
                            H.fireEvent("dragEvent",{
                                e:A
                            })
                        }
                        if(H){
                            this.fireEvents(A,false)
                        }
                        
                    }
                    this.stopEvent(A)
                }
                
            }
            ,fireEvents:function(g,q){
                var A=this.dragCurrent;
                if(!A||A.isLocked()||A.dragOnly){
                    return 
                }
                var o=pega.util.Event.getPageX(g),p=pega.util.Event.getPageY(g),m=new pega.util.Point(o,p),r=A.getTargetCoord(m.x,m.y),w=A.getDragEl(),x=["out","over","drop","enter"],h=new pega.util.Region(r.y,r.x+w.offsetWidth,r.y+w.offsetHeight,r.x),t=[],y={},l=[],AB={
                    outEvts:[],overEvts:[],dropEvts:[],enterEvts:[]
                };
                for(var j in this.dragOvers){
                    var AA=this.dragOvers[j];
                    if(!this.isTypeOfDD(AA)){
                        continue
                    }
                    if(!this.isOverTarget(m,AA,this.mode,h)){
                        AB.outEvts.push(AA)
                    }
                    t[j]=true;
                    delete this.dragOvers[j]
                }
                for(var k in A.groups){
                    if("string"!=typeof k){
                        continue
                    }
                    for(j in this.ids[k]){
                        var v=this.ids[k][j];
                        if(!this.isTypeOfDD(v)){
                            continue
                        }
                        if(v.isTarget&&!v.isLocked()&&v!=A){
                            if(this.isOverTarget(m,v,this.mode,h)){
                                y[k]=true;
                                if(q){
                                    AB.dropEvts.push(v)
                                }
                                else{
                                    if(!t[v.id]){
                                        AB.enterEvts.push(v)
                                    }
                                    else{
                                        AB.overEvts.push(v)
                                    }
                                    this.dragOvers[v.id]=v
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                }
                this.interactionInfo={
                    out:AB.outEvts,enter:AB.enterEvts,over:AB.overEvts,drop:AB.dropEvts,point:m,draggedRegion:h,sourceRegion:this.locationCache[A.id],validDrop:q
                };
                for(var z in y){
                    l.push(z)
                }
                if(q&&!AB.dropEvts.length){
                    this.interactionInfo.validDrop=false;
                    if(A.events.invalidDrop){
                        A.onInvalidDrop(g);
                        A.fireEvent("invalidDropEvent",{
                            e:g
                        })
                    }
                    
                }
                for(j=0;
                j<x.length;
                j++){
                    var d=null;
                    if(AB[x[j]+"Evts"]){
                        d=AB[x[j]+"Evts"]
                    }
                    if(d&&d.length){
                        var u=x[j].charAt(0).toUpperCase()+x[j].substr(1),e="onDrag"+u,s="b4Drag"+u,n="drag"+u+"Event",f="drag"+u;
                        if(this.mode){
                            if(A.events[s]){
                                A[s](g,d,l);
                                A.fireEvent(s+"Event",{
                                    event:g,info:d,group:l
                                })
                            }
                            if(A.events[f]){
                                A[e](g,d,l);
                                A.fireEvent(n,{
                                    event:g,info:d,group:l
                                })
                            }
                            
                        }
                        else{
                            for(var b=0,i=d.length;
                            b<i;
                            ++b){
                                if(A.events[s]){
                                    A[s](g,d[b].id,l[0]);
                                    A.fireEvent(s+"Event",{
                                        event:g,info:d[b].id,group:l[0]
                                    })
                                }
                                if(A.events[f]){
                                    A[e](g,d[b].id,l[0]);
                                    A.fireEvent(n,{
                                        event:g,info:d[b].id,group:l[0]
                                    })
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                }
                
            }
            ,getBestMatch:function(H){
                var A=null;
                var I=H.length;
                if(I==1){
                    A=H[0]
                }
                else{
                    for(var G=0;
                    G<I;
                    ++G){
                        var J=H[G];
                        if(this.mode==this.INTERSECT&&J.cursorIsOver){
                            A=J;
                            break
                        }
                        else{
                            if(!A||!A.overlap||(J.overlap&&A.overlap.getArea()<J.overlap.getArea())){
                                A=J
                            }
                            
                        }
                        
                    }
                    
                }
                return A
            }
            ,refreshCache:function(K){
                var I=K||this.ids;
                for(var L in I){
                    if("string"!=typeof L){
                        continue
                    }
                    for(var J in this.ids[L]){
                        var H=this.ids[L][J];
                        if(this.isTypeOfDD(H)){
                            var A=this.getLocation(H);
                            if(A){
                                this.locationCache[H.id]=A
                            }
                            else{
                                delete this.locationCache[H.id]
                            }
                            
                        }
                        
                    }
                    
                }
                
            }
            ,verifyEl:function(E){
                try{
                    if(E){
                        var F=E.offsetParent;
                        if(F){
                            return true
                        }
                        
                    }
                    
                }
                catch(A){}return false
            }
            ,getLocation:function(V){
                if(!this.isTypeOfDD(V)){
                    return null
                }
                var X=V.getEl(),S,A,N,Q,R,P,O,T,W;
                try{
                    S=pega.util.Dom.getXY(X)
                }
                catch(U){}if(!S){
                    return null
                }
                A=S[0];
                N=A+X.offsetWidth;
                Q=S[1];
                R=Q+X.offsetHeight;
                P=Q-V.padding[0];
                O=N+V.padding[1];
                T=R+V.padding[2];
                W=A-V.padding[3];
                return new pega.util.Region(P,O,T,W)
            }
            ,isOverTarget:function(M,L,A,R){
                var Q=this.locationCache[L.id];
                if(!Q||!this.useCache){
                    Q=this.getLocation(L);
                    this.locationCache[L.id]=Q
                }
                if(!Q){
                    return false
                }
                L.cursorIsOver=Q.contains(M);
                var N=this.dragCurrent;
                if(!N||(!A&&!N.constrainX&&!N.constrainY)){
                    return L.cursorIsOver
                }
                L.overlap=null;
                if(!R){
                    var P=N.getTargetCoord(M.x,M.y);
                    var K=N.getDragEl();
                    R=new pega.util.Region(P.y,P.x+K.offsetWidth,P.y+K.offsetHeight,P.x)
                }
                var O=R.intersect(Q);
                if(O){
                    L.overlap=O;
                    return(A)?true:L.cursorIsOver
                }
                else{
                    return false
                }
                
            }
            ,_onUnload:function(A,D){
                this.unregAll()
            }
            ,unregAll:function(){
                if(this.dragCurrent){
                    this.stopDrag();
                    this.dragCurrent=null
                }
                this._execOnAll("unreg",[]);
                this.ids={}
            }
            ,elementCache:{},getElWrapper:function(A){
                var D=this.elementCache[A];
                if(!D||!D.el){
                    D=this.elementCache[A]=new this.ElementWrapper(pega.util.Dom.get(A))
                }
                return D
            }
            ,getElement:function(A){
                return pega.util.Dom.get(A)
            }
            ,getCss:function(A){
                var D=pega.util.Dom.get(A);
                return(D)?D.style:null
            }
            ,ElementWrapper:function(A){
                this.el=A||null;
                this.id=this.el&&A.id;
                this.css=this.el&&A.style
            }
            ,getPosX:function(A){
                return pega.util.Dom.getX(A)
            }
            ,getPosY:function(A){
                return pega.util.Dom.getY(A)
            }
            ,swapNode:function(F,H){
                if(F.swapNode){
                    F.swapNode(H)
                }
                else{
                    var A=H.parentNode;
                    var G=H.nextSibling;
                    if(G==F){
                        A.insertBefore(F,H)
                    }
                    else{
                        if(H==F.nextSibling){
                            A.insertBefore(H,F)
                        }
                        else{
                            F.parentNode.replaceChild(H,F);
                            A.insertBefore(F,G)
                        }
                        
                    }
                    
                }
                
            }
            ,getScroll:function(){
                var F,H,A=document.documentElement,G=document.body;
                if(A&&(A.scrollTop||A.scrollLeft)){
                    F=A.scrollTop;
                    H=A.scrollLeft
                }
                else{
                    if(G){
                        F=G.scrollTop;
                        H=G.scrollLeft
                    }
                    else{}
                }
                return{
                    top:F,left:H
                }
                
            }
            ,getStyle:function(A,D){
                return pega.util.Dom.getStyle(A,D)
            }
            ,getScrollTop:function(){
                return this.getScroll().top
            }
            ,getScrollLeft:function(){
                return this.getScroll().left
            }
            ,moveToEl:function(F,A){
                var E=pega.util.Dom.getXY(A);
                pega.util.Dom.setXY(F,E)
            }
            ,getClientHeight:function(){
                return pega.util.Dom.getViewportHeight()
            }
            ,getClientWidth:function(){
                return pega.util.Dom.getViewportWidth()
            }
            ,numericSort:function(A,D){
                return(A-D)
            }
            ,_timeoutCount:0,_addListeners:function(){
                var A=pega.util.DDM;
                if(pega.util.Event&&document){
                    A._onLoad()
                }
                else{
                    if(A._timeoutCount>2000){}else{
                        setTimeout(A._addListeners,10);
                        if(document&&document.body){
                            A._timeoutCount+=1
                        }
                        
                    }
                    
                }
                
            }
            ,handleWasClicked:function(F,A){
                if(this.isHandle(A,F.id)){
                    return true
                }
                else{
                    var E=F.parentNode;
                    while(E){
                        if(this.isHandle(A,E.id)){
                            return true
                        }
                        else{
                            E=E.parentNode
                        }
                        
                    }
                    
                }
                return false
            }
            
        }
        
    }
    ();
    pega.util.DDM=pega.util.DragDropMgr;
    pega.util.DDM._addListeners()
}
(function(){
    var C=pega.util.Event;
    var D=pega.util.Dom;
    pega.util.DragDrop=function(A,F,B){
        if(A){
            this.init(A,F,B)
        }
        
    };
    pega.util.DragDrop.prototype={
        events:null,on:function(){
            this.subscribe.apply(this,arguments)
        }
        ,id:null,config:null,dragElId:null,handleElId:null,invalidHandleTypes:null,invalidHandleIds:null,invalidHandleClasses:null,startPageX:0,startPageY:0,groups:null,locked:false,lock:function(){
            this.locked=true
        }
        ,unlock:function(){
            this.locked=false
        }
        ,isTarget:true,padding:null,dragOnly:false,_domRef:null,__ygDragDrop:true,constrainX:false,constrainY:false,minX:0,maxX:0,minY:0,maxY:0,deltaX:0,deltaY:0,maintainOffset:false,xTicks:null,yTicks:null,primaryButtonOnly:true,available:false,hasOuterHandles:false,cursorIsOver:false,overlap:null,b4StartDrag:function(B,A){},startDrag:function(B,A){},b4Drag:function(A){},onDrag:function(A){},onDragEnter:function(B,A){},b4DragOver:function(A){},onDragOver:function(B,A){},b4DragOut:function(A){},onDragOut:function(B,A){},b4DragDrop:function(A){},onDragDrop:function(B,A){},onInvalidDrop:function(A){},b4EndDrag:function(A){},endDrag:function(A){},b4MouseDown:function(A){},onMouseDown:function(A){},onMouseUp:function(A){},onAvailable:function(){},getEl:function(){
            if(!this._domRef){
                this._domRef=D.get(this.id)
            }
            return this._domRef
        }
        ,getDragEl:function(){
            return D.get(this.dragElId)
        }
        ,init:function(A,H,G){
            this.initTarget(A,H,G);
            C.on(this._domRef||this.id,"mousedown",this.handleMouseDown,this,true);
            for(var B in this.events){
                this.createEvent(B+"Event")
            }
            
        }
        ,initTarget:function(A,F,B){
            this.config=B||{};
            this.events={};
            this.DDM=pega.util.DDM;
            this.groups={};
            if(typeof A!=="string"){
                this._domRef=A;
                A=D.generateId(A)
            }
            this.id=A;
            this.addToGroup((F)?F:"default");
            this.handleElId=A;
            C.onAvailable(A,this.handleOnAvailable,this,true);
            this.setDragElId(A);
            this.invalidHandleTypes={
                A:"A"
            };
            this.invalidHandleIds={};
            this.invalidHandleClasses=[];
            this.applyConfig()
        }
        ,applyConfig:function(){
            this.events={
                mouseDown:true,b4MouseDown:true,mouseUp:true,b4StartDrag:true,startDrag:true,b4EndDrag:true,endDrag:true,drag:true,b4Drag:true,invalidDrop:true,b4DragOut:true,dragOut:true,dragEnter:true,b4DragOver:true,dragOver:true,b4DragDrop:true,dragDrop:true
            };
            if(this.config.events){
                for(var A in this.config.events){
                    if(this.config.events[A]===false){
                        this.events[A]=false
                    }
                    
                }
                
            }
            this.padding=this.config.padding||[0,0,0,0];
            this.isTarget=(this.config.isTarget!==false);
            this.maintainOffset=(this.config.maintainOffset);
            this.primaryButtonOnly=(this.config.primaryButtonOnly!==false);
            this.dragOnly=((this.config.dragOnly===true)?true:false)
        }
        ,handleOnAvailable:function(){
            this.available=true;
            this.resetConstraints();
            this.onAvailable()
        }
        ,setPadding:function(B,H,A,G){
            if(!H&&0!==H){
                this.padding=[B,B,B,B]
            }
            else{
                if(!A&&0!==A){
                    this.padding=[B,H,B,H]
                }
                else{
                    this.padding=[B,H,A,G]
                }
                
            }
            
        }
        ,setInitPosition:function(I,J){
            var B=this.getEl();
            if(!this.DDM.verifyEl(B)){
                if(B&&B.style&&(B.style.display=="none")){}else{}return 
            }
            var K=I||0;
            var L=J||0;
            var A=D.getXY(B);
            this.initPageX=A[0]-K;
            this.initPageY=A[1]-L;
            this.lastPageX=A[0];
            this.lastPageY=A[1];
            this.setStartPosition(A)
        }
        ,setStartPosition:function(A){
            var B=A||D.getXY(this.getEl());
            this.deltaSetXY=null;
            this.startPageX=B[0];
            this.startPageY=B[1]
        }
        ,addToGroup:function(A){
            this.groups[A]=true;
            this.DDM.regDragDrop(this,A)
        }
        ,removeFromGroup:function(A){
            if(this.groups[A]){
                delete this.groups[A]
            }
            this.DDM.removeDDFromGroup(this,A)
        }
        ,setDragElId:function(A){
            this.dragElId=A
        }
        ,setHandleElId:function(A){
            if(typeof A!=="string"){
                A=D.generateId(A)
            }
            this.handleElId=A;
            this.DDM.regHandle(this.id,A)
        }
        ,setOuterHandleElId:function(A){
            if(typeof A!=="string"){
                A=D.generateId(A)
            }
            C.on(A,"mousedown",this.handleMouseDown,this,true);
            this.setHandleElId(A);
            this.hasOuterHandles=true
        }
        ,unreg:function(){
            C.removeListener(this.id,"mousedown",this.handleMouseDown);
            this._domRef=null;
            this.DDM._remove(this)
        }
        ,isLocked:function(){
            return(this.DDM.isLocked()||this.locked)
        }
        ,handleMouseDown:function(A,B){
            var K=A.which||A.button;
            if(this.primaryButtonOnly&&K>1){
                return 
            }
            if(this.isLocked()){
                return 
            }
            var L=this.b4MouseDown(A);
            if(this.events.b4MouseDown){
                L=this.fireEvent("b4MouseDownEvent",A)
            }
            var J=this.onMouseDown(A);
            if(this.events.mouseDown){
                J=this.fireEvent("mouseDownEvent",A)
            }
            if((L===false)||(J===false)){
                return 
            }
            this.DDM.refreshCache(this.groups);
            var I=new pega.util.Point(C.getPageX(A),C.getPageY(A));
            if(!this.hasOuterHandles&&!this.DDM.isOverTarget(I,this)){}else{
                if(this.clickValidator(A)){
                    this.setStartPosition();
                    this.DDM.handleMouseDown(A,this);
                    this.DDM.stopEvent(A)
                }
                else{}
            }
            
        }
        ,clickValidator:function(A){
            var B=pega.util.Event.getTarget(A);
            return(this.isValidHandleChild(B)&&(this.id==this.handleElId||this.DDM.handleWasClicked(B,this.id)))
        }
        ,getTargetCoord:function(B,G){
            var H=B-this.deltaX;
            var A=G-this.deltaY;
            if(this.constrainX){
                if(H<this.minX){
                    H=this.minX
                }
                if(H>this.maxX){
                    H=this.maxX
                }
                
            }
            if(this.constrainY){
                if(A<this.minY){
                    A=this.minY
                }
                if(A>this.maxY){
                    A=this.maxY
                }
                
            }
            H=this.getTick(H,this.xTicks);
            A=this.getTick(A,this.yTicks);
            return{
                x:H,y:A
            }
            
        }
        ,addInvalidHandleType:function(B){
            var A=B.toUpperCase();
            this.invalidHandleTypes[A]=A
        }
        ,addInvalidHandleId:function(A){
            if(typeof A!=="string"){
                A=D.generateId(A)
            }
            this.invalidHandleIds[A]=A
        }
        ,addInvalidHandleClass:function(A){
            this.invalidHandleClasses.push(A)
        }
        ,removeInvalidHandleType:function(B){
            var A=B.toUpperCase();
            delete this.invalidHandleTypes[A]
        }
        ,removeInvalidHandleId:function(A){
            if(typeof A!=="string"){
                A=D.generateId(A)
            }
            delete this.invalidHandleIds[A]
        }
        ,removeInvalidHandleClass:function(B){
            for(var A=0,F=this.invalidHandleClasses.length;
            A<F;
            ++A){
                if(this.invalidHandleClasses[A]==B){
                    delete this.invalidHandleClasses[A]
                }
                
            }
            
        }
        ,isValidHandleChild:function(I){
            var J=true;
            var A;
            try{
                A=I.nodeName.toUpperCase()
            }
            catch(B){
                A=I.nodeName
            }
            J=J&&!this.invalidHandleTypes[A];
            J=J&&!this.invalidHandleIds[I.id];
            for(var K=0,L=this.invalidHandleClasses.length;
            J&&K<L;
            ++K){
                J=!D.hasClass(I,this.invalidHandleClasses[K])
            }
            return J
        }
        ,setXTicks:function(A,H){
            this.xTicks=[];
            this.xTickSize=H;
            var B={};
            for(var G=this.initPageX;
            G>=this.minX;
            G=G-H){
                if(!B[G]){
                    this.xTicks[this.xTicks.length]=G;
                    B[G]=true
                }
                
            }
            for(G=this.initPageX;
            G<=this.maxX;
            G=G+H){
                if(!B[G]){
                    this.xTicks[this.xTicks.length]=G;
                    B[G]=true
                }
                
            }
            this.xTicks.sort(this.DDM.numericSort)
        }
        ,setYTicks:function(A,H){
            this.yTicks=[];
            this.yTickSize=H;
            var B={};
            for(var G=this.initPageY;
            G>=this.minY;
            G=G-H){
                if(!B[G]){
                    this.yTicks[this.yTicks.length]=G;
                    B[G]=true
                }
                
            }
            for(G=this.initPageY;
            G<=this.maxY;
            G=G+H){
                if(!B[G]){
                    this.yTicks[this.yTicks.length]=G;
                    B[G]=true
                }
                
            }
            this.yTicks.sort(this.DDM.numericSort)
        }
        ,setXConstraint:function(A,B,F){
            this.leftConstraint=parseInt(A,10);
            this.rightConstraint=parseInt(B,10);
            this.minX=this.initPageX-this.leftConstraint;
            this.maxX=this.initPageX+this.rightConstraint;
            if(F){
                this.setXTicks(this.initPageX,F)
            }
            this.constrainX=true
        }
        ,clearConstraints:function(){
            this.constrainX=false;
            this.constrainY=false;
            this.clearTicks()
        }
        ,clearTicks:function(){
            this.xTicks=null;
            this.yTicks=null;
            this.xTickSize=0;
            this.yTickSize=0
        }
        ,setYConstraint:function(F,A,B){
            this.topConstraint=parseInt(F,10);
            this.bottomConstraint=parseInt(A,10);
            this.minY=this.initPageY-this.topConstraint;
            this.maxY=this.initPageY+this.bottomConstraint;
            if(B){
                this.setYTicks(this.initPageY,B)
            }
            this.constrainY=true
        }
        ,resetConstraints:function(){
            if(this.initPageX||this.initPageX===0){
                var A=(this.maintainOffset)?this.lastPageX-this.initPageX:0;
                var B=(this.maintainOffset)?this.lastPageY-this.initPageY:0;
                this.setInitPosition(A,B)
            }
            else{
                this.setInitPosition()
            }
            if(this.constrainX){
                this.setXConstraint(this.leftConstraint,this.rightConstraint,this.xTickSize)
            }
            if(this.constrainY){
                this.setYConstraint(this.topConstraint,this.bottomConstraint,this.yTickSize)
            }
            
        }
        ,getTick:function(A,K){
            if(!K){
                return A
            }
            else{
                if(K[0]>=A){
                    return K[0]
                }
                else{
                    for(var M=0,N=K.length;
                    M<N;
                    ++M){
                        var L=M+1;
                        if(K[L]&&K[L]>=A){
                            var B=A-K[M];
                            var J=K[L]-A;
                            return(J>B)?K[M]:K[L]
                        }
                        
                    }
                    return K[K.length-1]
                }
                
            }
            
        }
        ,toString:function(){
            return("DragDrop "+this.id)
        }
        
    };
    pega.augment(pega.util.DragDrop,pega.util.EventProvider)
})();
pega.util.DD=function(E,D,F){
    if(E){
        this.init(E,D,F)
    }
    
};
pega.extend(pega.util.DD,pega.util.DragDrop,{
    scroll:true,autoOffset:function(G,H){
        var E=G-this.startPageX;
        var F=H-this.startPageY;
        this.setDelta(E,F)
    }
    ,setDelta:function(D,C){
        this.deltaX=D;
        this.deltaY=C
    }
    ,setDragElPos:function(E,F){
        var D=this.getDragEl();
        this.alignElWithMouse(D,E,F)
    }
    ,alignElWithMouse:function(O,K,L){
        var M=this.getTargetCoord(K,L);
        if(!this.deltaSetXY){
            var J=[M.x,M.y];
            pega.util.Dom.setXY(O,J);
            var N=parseInt(pega.util.Dom.getStyle(O,"left"),10);
            var P=parseInt(pega.util.Dom.getStyle(O,"top"),10);
            this.deltaSetXY=[N-M.x,P-M.y]
        }
        else{
            pega.util.Dom.setStyle(O,"left",(M.x+this.deltaSetXY[0])+"px");
            pega.util.Dom.setStyle(O,"top",(M.y+this.deltaSetXY[1])+"px")
        }
        this.cachePosition(M.x,M.y);
        var I=this;
        setTimeout(function(){
            I.autoScroll.call(I,M.x,M.y,O.offsetHeight,O.offsetWidth)
        }
        ,0)
    }
    ,cachePosition:function(F,D){
        if(F){
            this.lastPageX=F;
            this.lastPageY=D
        }
        else{
            var E=pega.util.Dom.getXY(this.getEl());
            this.lastPageX=E[0];
            this.lastPageY=E[1]
        }
        
    }
    ,autoScroll:function(W,X,b,V){
        if(this.scroll){
            var U=this.DDM.getClientHeight();
            var Q=this.DDM.getClientWidth();
            var S=this.DDM.getScrollTop();
            var O=this.DDM.getScrollLeft();
            var Y=b+X;
            var T=V+W;
            var Z=(U+S-X-this.deltaY);
            var a=(Q+O-W-this.deltaX);
            var P=40;
            var R=(document.all)?80:30;
            if(Y>U&&Z<P){
                window.scrollTo(O,S+R)
            }
            if(X<S&&S>0&&X-S<P){
                window.scrollTo(O,S-R)
            }
            if(T>Q&&a<P){
                window.scrollTo(O+R,S)
            }
            if(W<O&&O>0&&W-O<P){
                window.scrollTo(O-R,S)
            }
            
        }
        
    }
    ,applyConfig:function(){
        pega.util.DD.superclass.applyConfig.call(this);
        this.scroll=(this.config.scroll!==false)
    }
    ,b4MouseDown:function(B){
        this.setStartPosition();
        this.autoOffset(pega.util.Event.getPageX(B),pega.util.Event.getPageY(B))
    }
    ,b4Drag:function(B){
        this.setDragElPos(pega.util.Event.getPageX(B),pega.util.Event.getPageY(B))
    }
    ,toString:function(){
        return("DD "+this.id)
    }
    
});
pega.util.DDProxy=function(E,D,F){
    if(E){
        this.init(E,D,F);
        this.initFrame()
    }
    
};
pega.util.DDProxy.dragElId="ygddfdiv";
pega.extend(pega.util.DDProxy,pega.util.DD,{
    resizeFrame:true,centerFrame:false,createFrame:function(){
        var N=this,H=document.body;
        if(!H||!H.firstChild){
            setTimeout(function(){
                N.createFrame()
            }
            ,50);
            return 
        }
        var I=this.getDragEl(),K=pega.util.Dom;
        if(!I){
            I=document.createElement("div");
            I.id=this.dragElId;
            var L=I.style;
            L.position="absolute";
            L.visibility="hidden";
            L.cursor="move";
            L.border="2px solid #aaa";
            L.zIndex=999;
            L.height="25px";
            L.width="25px";
            var M=document.createElement("div");
            K.setStyle(M,"height","100%");
            K.setStyle(M,"width","100%");
            K.setStyle(M,"background-color","#ccc");
            K.setStyle(M,"opacity","0");
            I.appendChild(M);
            if(pega.env.ua.ie){
                var J=document.createElement("iframe");
                J.setAttribute("src","javascript:");
                J.setAttribute("scrolling","no");
                J.setAttribute("frameborder","0");
                I.insertBefore(J,I.firstChild);
                K.setStyle(J,"height","100%");
                K.setStyle(J,"width","100%");
                K.setStyle(J,"position","absolute");
                K.setStyle(J,"top","0");
                K.setStyle(J,"left","0");
                K.setStyle(J,"opacity","0");
                K.setStyle(J,"zIndex","-1");
                K.setStyle(J.nextSibling,"zIndex","2")
            }
            H.insertBefore(I,H.firstChild)
        }
        
    }
    ,initFrame:function(){
        this.createFrame()
    }
    ,applyConfig:function(){
        pega.util.DDProxy.superclass.applyConfig.call(this);
        this.resizeFrame=(this.config.resizeFrame!==false);
        this.centerFrame=(this.config.centerFrame);
        this.setDragElId(this.config.dragElId||pega.util.DDProxy.dragElId)
    }
    ,showFrame:function(G,H){
        var I=this.getEl();
        var F=this.getDragEl();
        var J=F.style;
        this._resizeProxy();
        if(this.centerFrame){
            this.setDelta(Math.round(parseInt(J.width,10)/2),Math.round(parseInt(J.height,10)/2))
        }
        this.setDragElPos(G,H);
        pega.util.Dom.setStyle(F,"visibility","visible")
    }
    ,_resizeProxy:function(){
        if(this.resizeFrame){
            var O=pega.util.Dom;
            var L=this.getEl();
            var K=this.getDragEl();
            var P=parseInt(O.getStyle(K,"borderTopWidth"),10);
            var N=parseInt(O.getStyle(K,"borderRightWidth"),10);
            var Q=parseInt(O.getStyle(K,"borderBottomWidth"),10);
            var J=parseInt(O.getStyle(K,"borderLeftWidth"),10);
            if(isNaN(P)){
                P=0
            }
            if(isNaN(N)){
                N=0
            }
            if(isNaN(Q)){
                Q=0
            }
            if(isNaN(J)){
                J=0
            }
            var R=Math.max(0,L.offsetWidth-N-J);
            var M=Math.max(0,L.offsetHeight-P-Q);
            O.setStyle(K,"width",R+"px");
            O.setStyle(K,"height",M+"px")
        }
        
    }
    ,b4MouseDown:function(F){
        this.setStartPosition();
        var D=pega.util.Event.getPageX(F);
        var E=pega.util.Event.getPageY(F);
        this.autoOffset(D,E)
    }
    ,b4StartDrag:function(C,D){
        this.showFrame(C,D)
    }
    ,b4EndDrag:function(B){
        pega.util.Dom.setStyle(this.getDragEl(),"visibility","hidden")
    }
    ,endDrag:function(F){
        var G=pega.util.Dom;
        var H=this.getEl();
        var E=this.getDragEl();
        G.setStyle(E,"visibility","");
        G.setStyle(H,"visibility","hidden");
        pega.util.DDM.moveToEl(H,E);
        G.setStyle(E,"visibility","hidden");
        G.setStyle(H,"visibility","")
    }
    ,toString:function(){
        return("DDProxy "+this.id)
    }
    
});
pega.util.DDTarget=function(E,D,F){
    if(E){
        this.initTarget(E,D,F)
    }
    
};
pega.extend(pega.util.DDTarget,pega.util.DragDrop,{
    toString:function(){
        return("DDTarget "+this.id)
    }
    
});
pega.register("dragdrop",pega.util.DragDropMgr,{
    version:"2.5.2",build:"1076"
});
pega.util.Attribute=function(D,C){
    if(C){
        this.owner=C;
        this.configure(D,true)
    }
    
};
pega.util.Attribute.prototype={
    name:undefined,value:null,owner:null,readOnly:false,writeOnce:false,_initialConfig:null,_written:false,method:null,validator:null,getValue:function(){
        return this.value
    }
    ,setValue:function(H,L){
        var I;
        var G=this.owner;
        var K=this.name;
        var J={
            type:K,prevValue:this.getValue(),newValue:H
        };
        if(this.readOnly||(this.writeOnce&&this._written)){
            return false
        }
        if(this.validator&&!this.validator.call(G,H)){
            return false
        }
        if(!L){
            I=G.fireBeforeChangeEvent(J);
            if(I===false){
                return false
            }
            
        }
        if(this.method){
            this.method.call(G,H)
        }
        this.value=H;
        this._written=true;
        J.type=K;
        if(!L){
            this.owner.fireChangeEvent(J)
        }
        return true
    }
    ,configure:function(F,E){
        F=F||{};
        this._written=false;
        this._initialConfig=this._initialConfig||{};
        for(var D in F){
            if(D&&pega.lang.hasOwnProperty(F,D)){
                this[D]=F[D];
                if(E){
                    this._initialConfig[D]=F[D]
                }
                
            }
            
        }
        
    }
    ,resetValue:function(){
        return this.setValue(this._initialConfig.value)
    }
    ,resetConfig:function(){
        this.configure(this._initialConfig)
    }
    ,refresh:function(B){
        this.setValue(this.value,B)
    }
    
};
(function(){
    var B=pega.util.Lang;
    pega.util.AttributeProvider=function(){};
    pega.util.AttributeProvider.prototype={
        _configs:null,get:function(A){
            this._configs=this._configs||{};
            var D=this._configs[A];
            if(!D){
                return undefined
            }
            return D.value
        }
        ,set:function(F,A,H){
            this._configs=this._configs||{};
            var G=this._configs[F];
            if(!G){
                return false
            }
            return G.setValue(A,H)
        }
        ,getAttributeKeys:function(){
            this._configs=this._configs;
            var A=[];
            var F;
            for(var E in this._configs){
                F=this._configs[E];
                if(B.hasOwnProperty(this._configs,E)&&!B.isUndefined(F)){
                    A[A.length]=E
                }
                
            }
            return A
        }
        ,setAttributes:function(A,F){
            for(var E in A){
                if(B.hasOwnProperty(A,E)){
                    this.set(E,A[E],F)
                }
                
            }
            
        }
        ,resetValue:function(A,D){
            this._configs=this._configs||{};
            if(this._configs[A]){
                this.set(A,this._configs[A]._initialConfig.value,D);
                return true
            }
            return false
        }
        ,refresh:function(A,G){
            this._configs=this._configs;
            A=((B.isString(A))?[A]:A)||this.getAttributeKeys();
            for(var F=0,H=A.length;
            F<H;
            ++F){
                if(this._configs[A[F]]&&!B.isUndefined(this._configs[A[F]].value)&&!B.isNull(this._configs[A[F]].value)){
                    this._configs[A[F]].refresh(G)
                }
                
            }
            
        }
        ,register:function(D,A){
            this.setAttributeConfig(D,A)
        }
        ,getAttributeConfig:function(E){
            this._configs=this._configs||{};
            var F=this._configs[E]||{};
            var A={};
            for(E in F){
                if(B.hasOwnProperty(F,E)){
                    A[E]=F[E]
                }
                
            }
            return A
        }
        ,setAttributeConfig:function(F,E,A){
            this._configs=this._configs||{};
            E=E||{};
            if(!this._configs[F]){
                E.name=F;
                this._configs[F]=this.createAttribute(E)
            }
            else{
                this._configs[F].configure(E,A)
            }
            
        }
        ,configureAttribute:function(F,E,A){
            this.setAttributeConfig(F,E,A)
        }
        ,resetAttributeConfig:function(A){
            this._configs=this._configs||{};
            this._configs[A].resetConfig()
        }
        ,subscribe:function(D,A){
            this._events=this._events||{};
            if(!(D in this._events)){
                this._events[D]=this.createEvent(D)
            }
            pega.util.EventProvider.prototype.subscribe.apply(this,arguments)
        }
        ,on:function(){
            this.subscribe.apply(this,arguments)
        }
        ,addListener:function(){
            this.subscribe.apply(this,arguments)
        }
        ,fireBeforeChangeEvent:function(A){
            var D="before";
            D+=A.type.charAt(0).toUpperCase()+A.type.substr(1)+"Change";
            A.type=D;
            return this.fireEvent(A.type,A)
        }
        ,fireChangeEvent:function(A){
            A.type+="Change";
            return this.fireEvent(A.type,A)
        }
        ,createAttribute:function(A){
            return new pega.util.Attribute(A,this)
        }
        
    };
    pega.augment(pega.util.AttributeProvider,pega.util.EventProvider)
})();
(function(){
    var J=pega.util.Dom,H=pega.util.AttributeProvider;
    pega.util.Element=function(B,A){
        if(arguments.length){
            this.init(B,A)
        }
        
    };
    pega.util.Element.prototype={
        DOM_EVENTS:null,appendChild:function(A){
            A=A.get?A.get("element"):A;
            this.get("element").appendChild(A)
        }
        ,getElementsByTagName:function(A){
            return this.get("element").getElementsByTagName(A)
        }
        ,hasChildNodes:function(){
            return this.get("element").hasChildNodes()
        }
        ,insertBefore:function(B,A){
            B=B.get?B.get("element"):B;
            A=(A&&A.get)?A.get("element"):A;
            this.get("element").insertBefore(B,A)
        }
        ,removeChild:function(A){
            A=A.get?A.get("element"):A;
            this.get("element").removeChild(A);
            return true
        }
        ,replaceChild:function(B,A){
            B=B.get?B.get("element"):B;
            A=A.get?A.get("element"):A;
            return this.get("element").replaceChild(B,A)
        }
        ,initAttributes:function(A){},addListener:function(B,C,A,D){
            var E=this.get("element");
            D=D||this;
            E=this.get("id")||E;
            var F=this;
            if(!this._events[B]){
                if(this.DOM_EVENTS[B]){
                    pega.util.Event.addListener(E,B,function(N){
                        if(N.srcElement&&!N.target){
                            N.target=N.srcElement
                        }
                        F.fireEvent(B,N)
                    }
                    ,A,D)
                }
                this.createEvent(B,this)
            }
            pega.util.EventProvider.prototype.subscribe.apply(this,arguments)
        }
        ,on:function(){
            this.addListener.apply(this,arguments)
        }
        ,subscribe:function(){
            this.addListener.apply(this,arguments)
        }
        ,removeListener:function(A,B){
            this.unsubscribe.apply(this,arguments)
        }
        ,addClass:function(A){
            J.addClass(this.get("element"),A)
        }
        ,getElementsByClassName:function(A,B){
            return J.getElementsByClassName(A,B,this.get("element"))
        }
        ,hasClass:function(A){
            return J.hasClass(this.get("element"),A)
        }
        ,removeClass:function(A){
            return J.removeClass(this.get("element"),A)
        }
        ,replaceClass:function(A,B){
            return J.replaceClass(this.get("element"),A,B)
        }
        ,setStyle:function(A,B){
            var C=this.get("element");
            if(!C){
                return this._queue[this._queue.length]=["setStyle",arguments]
            }
            return J.setStyle(C,A,B)
        }
        ,getStyle:function(A){
            return J.getStyle(this.get("element"),A)
        }
        ,fireQueue:function(){
            var B=this._queue;
            for(var A=0,C=B.length;
            A<C;
            ++A){
                this[B[A][0]].apply(this,B[A][1])
            }
            
        }
        ,appendTo:function(B,A){
            B=(B.get)?B.get("element"):J.get(B);
            this.fireEvent("beforeAppendTo",{
                type:"beforeAppendTo",target:B
            });
            A=(A&&A.get)?A.get("element"):J.get(A);
            var C=this.get("element");
            if(!C){
                return false
            }
            if(!B){
                return false
            }
            if(C.parent!=B){
                if(A){
                    B.insertBefore(C,A)
                }
                else{
                    B.appendChild(C)
                }
                
            }
            this.fireEvent("appendTo",{
                type:"appendTo",target:B
            })
        }
        ,get:function(C){
            var A=this._configs||{};
            var B=A.element;
            if(B&&!A[C]&&!pega.lang.isUndefined(B.value[C])){
                return B.value[C]
            }
            return H.prototype.get.call(this,C)
        }
        ,setAttributes:function(A,E){
            var B=this.get("element");
            for(var C in A){
                if(!this._configs[C]&&!pega.lang.isUndefined(B[C])){
                    this.setAttributeConfig(C)
                }
                
            }
            for(var D=0,F=this._configOrder.length;
            D<F;
            ++D){
                if(A[this._configOrder[D]]!==undefined){
                    this.set(this._configOrder[D],A[this._configOrder[D]],E)
                }
                
            }
            
        }
        ,set:function(C,A,D){
            var B=this.get("element");
            if(!B){
                this._queue[this._queue.length]=["set",arguments];
                if(this._configs[C]){
                    this._configs[C].value=A
                }
                return 
            }
            if(!this._configs[C]&&!pega.lang.isUndefined(B[C])){
                K.call(this,C)
            }
            return H.prototype.set.apply(this,arguments)
        }
        ,setAttributeConfig:function(D,B,A){
            var C=this.get("element");
            if(C&&!this._configs[D]&&!pega.lang.isUndefined(C[D])){
                K.call(this,D,B)
            }
            else{
                H.prototype.setAttributeConfig.apply(this,arguments)
            }
            this._configOrder.push(D)
        }
        ,getAttributeKeys:function(){
            var B=this.get("element");
            var A=H.prototype.getAttributeKeys.call(this);
            for(var C in B){
                if(!this._configs[C]){
                    A[C]=A[C]||B[C]
                }
                
            }
            return A
        }
        ,createEvent:function(A,B){
            this._events[A]=true;
            H.prototype.createEvent.apply(this,arguments)
        }
        ,init:function(A,B){
            G.apply(this,arguments)
        }
        
    };
    var G=function(B,C){
        this._queue=this._queue||[];
        this._events=this._events||{};
        this._configs=this._configs||{};
        this._configOrder=[];
        C=C||{};
        C.element=C.element||B||null;
        this.DOM_EVENTS={
            click:true,dblclick:true,keydown:true,keypress:true,keyup:true,mousedown:true,mousemove:true,mouseout:true,mouseover:true,mouseup:true,focus:true,blur:true,submit:true
        };
        var A=false;
        if(pega.lang.isString(B)){
            K.call(this,"id",{
                value:C.element
            })
        }
        if(J.get(B)){
            A=true;
            I.call(this,C);
            L.call(this,C)
        }
        pega.util.Event.onAvailable(C.element,function(){
            if(!A){
                I.call(this,C)
            }
            this.fireEvent("available",{
                type:"available",target:C.element
            })
        }
        ,this,true);
        pega.util.Event.onContentReady(C.element,function(){
            if(!A){
                L.call(this,C)
            }
            this.fireEvent("contentReady",{
                type:"contentReady",target:C.element
            })
        }
        ,this,true)
    };
    var I=function(A){
        this.setAttributeConfig("element",{
            value:J.get(A.element),readOnly:true
        })
    };
    var L=function(A){
        this.initAttributes(A);
        this.setAttributes(A,true);
        this.fireQueue()
    };
    var K=function(C,A){
        var B=this.get("element");
        A=A||{};
        A.name=C;
        A.method=A.method||function(D){
            B[C]=D
        };
        A.value=A.value||B[C];
        this._configs[C]=new pega.util.Attribute(A,this)
    };
    pega.augment(pega.util.Element,H)
})();
pega.register("element",pega.util.Element,{
    version:"2.5.2",build:"1076"
});
pega.register("utilities",pega,{
    version:"2.5.2",build:"1076"
});
pega.util.Dom.getElementsById=function(B,I,M){
    if(!B){
        return null
    }
    var C=B.toUpperCase();
    if(!I){
        I=document
    }
    var A=new Array();
    var J=false;
    var D="";
    if(M!=null&&typeof (M)!="undefined"){
        J=true;
        if(pega.util.Event.isSafari){
            D=M.toLowerCase()
        }
        else{
            D=M.toUpperCase()
        }
        
    }
    if(pega.util.Event.isIE){
        var H=I.all(B);
        if(!H){
            return null
        }
        var F=H.length;
        if(!F||F==0){
            if(H.tagName=="OPTION"){
                A[0]=H.parentNode
            }
            else{
                A[0]=H
            }
            if(!A[0].id||A[0].id.toUpperCase()!=C){
                return null
            }
            if(J){
                if(A[0].tagName==D){
                    return A
                }
                else{
                    return null
                }
                
            }
            else{
                return A
            }
            
        }
        if(H[0].tagName=="OPTION"){
            A[0]=H[0].parentNode;
            if(A[0].id.toUpperCase()!=C){
                return null
            }
            if(J){
                if(A[0].tagName==D){
                    return A
                }
                else{
                    return null
                }
                
            }
            else{
                return A
            }
            
        }
        for(var G=0;
        G<F;
        G++){
            if(H[G].id.toUpperCase()!=C){
                continue
            }
            if(J){
                if(H[G].tagName==D){
                    A[A.length]=H[G]
                }
                
            }
            else{
                A[A.length]=H[G]
            }
            
        }
        
    }
    else{
        if(document.evaluate){
            try{
                var L="";
                if(J){
                    L=".//"+D+"[@id]"
                }
                else{
                    L=".//*[@id]"
                }
                var K=document.evaluate(L,I,null,0,null);
                var E=K.iterateNext();
                while(E){
                    if(E.getAttribute("id").toUpperCase()!=C){
                        E=K.iterateNext();
                        continue
                    }
                    A[A.length]=E;
                    E=K.iterateNext()
                }
                
            }
            catch(H){
                var K=pega.util.Dom.getElementsBy(function(N){
                    var O=N.getAttribute("id");
                    if(O!=null&&O.toUpperCase()==C){
                        return true
                    }
                    return false
                }
                ,M,I);
                if(K==null||K.length==0){
                    return null
                }
                return K
            }
            
        }
        
    }
    if(A.length==0){
        return null
    }
    return A
};
pega.util.Dom.getElementsByAttribute=function(C,D,A,B){
    var E=function(G){
        var F=new RegExp("(?:^|\\s+)"+D+"(?:\\s+|$)");
        if(G.getAttribute(C)&&F.test(G.getAttribute(C))){
            return true
        }
        return false
    };
    return this.getElementsBy(E,A,B)
};
pega.util.Dom.getInnerText=function(A){
    return A.innerText&&!window.opera?A.innerText:pega.util.Dom.findInnerText(A)
};
pega.util.Dom.setInnerText=function(A,B){
    A.textContent===undefined?A.innerText=B:A.textContent=B
};
pega.util.Dom.stripScripts=function(A){
    return A.replace(new RegExp("(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)","img"),"")
};
pega.util.Dom.unescapeHTML=function(A){
    var C=document.createElement("div");
    C.innerHTML=pega.util.Dom.stripTags(A);
    var B=new Array(C.childNodes);
    return C.childNodes[0]?(C.childNodes.length>1?pega.util.Dom.inject(B,"",function(D,E){
        return D+E.nodeValue
    }):C.childNodes[0].nodeValue):""
};
pega.util.Dom.stripTags=function(A){
    return A.replace(/<\/?[^>]+>/gi,"")
};
pega.util.Dom.inject=function(B,A,C){
    B.each(function(E,D){
        A=C(A,E,D)
    });
    return A
};
pega.util.Dom.findInnerText=function(B){
    var A=pega.util.Dom.stripScripts(B.innerHTML);
    var C=pega.util.Dom.unescapeHTML(A);
    return C.replace(/[\n\r\s]+/g," ")
};
pega.util.Dom.getCoords=function(A){
    var B={
        left:2,top:2,right:A.offsetWidth,bottom:A.offsetHeight
    };
    while(A&&typeof A.offsetParent!="unknown"){
        B.left+=A.offsetLeft;
        B.top+=A.offsetTop;
        A=A.offsetParent
    }
    B.right+=B.left;
    B.bottom+=B.top;
    return B
};
pega.util.Dom.getOuterHTML=function(C){
    if(!pega.util.Event.isIE){
        var D={
            IMG:true,BR:true,INPUT:true,META:true,LINK:true,PARAM:true,HR:true
        };
        var A=C.attributes;
        var E="<"+C.tagName;
        for(var B=0;
        B<A.length;
        B++){
            E+=" "+A[B].name+'="'+A[B].value+'"'
        }
        if(D[C.tagName]){
            return E+">"
        }
        return E+">"+C.innerHTML+"</"+C.tagName+">"
    }
    else{
        return C.outerHTML
    }
    
};
pega.util.Event.fireEvent=function(D,C,B){
    if(C.substring(0,2).toLowerCase()=="on"){
        C=C.substring(2)
    }
    if(pega.util.Event.isIE){
        D.fireEvent("on"+C)
    }
    else{
        if(!B){
            B=window
        }
        if(C=="click"||C=="mousedown"||C=="mouseup"||C=="mouseover"||C=="mousemove"||C=="mouseout"||C=="dblclick"){
            var A=B.document.createEvent("MouseEvents");
            A.initMouseEvent(C,true,true,window,0,0,0,0,0,false,false,false,false,0,null)
        }
        else{
            if(C=="load"||C=="unload"||C=="abort "||C=="error"||C=="select"||C=="change"||C=="submit"||C=="reset"||C=="resize"||C=="scroll"||C=="focus"||C=="blur"){
                var A=B.document.createEvent("Events");
                A.initEvent(C,false,false)
            }
            else{
                if(C=="DOMFocusIn"||C=="DOMFocusOut"||C=="DOMActivate"){
                    var A=B.document.createEvent("UIEvents");
                    A.initUIEvent(C,false,false,window,1)
                }
                
            }
            
        }
        D.dispatchEvent(A)
    }
    
};
pega.util.Dom.getElementsByName=function(D,I,M){
    if(!D){
        return null
    }
    var H=D.toUpperCase();
    if(!I){
        I=document
    }
    var A=new Array();
    var J=false;
    var B="";
    if(M!=null&&typeof (M)!="undefined"){
        J=true;
        B=M.toUpperCase()
    }
    if(pega.util.Event.isIE){
        var G=I.all(D);
        if(!G){
            return null
        }
        var E=G.length;
        if(!E||E==0){
            if(G.tagName=="OPTION"){
                A[0]=G.parentNode
            }
            else{
                A[0]=G
            }
            if(!A[0].name||A[0].name.toUpperCase()!=H){
                return null
            }
            if(J){
                if(A[0].tagName==B){
                    return A
                }
                else{
                    return null
                }
                
            }
            else{
                return A
            }
            
        }
        if(G[0].tagName=="OPTION"){
            A[0]=G[0].parentNode;
            if(A[0].name.toUpperCase()!=H){
                return null
            }
            if(J){
                if(A[0].tagName==B){
                    return A
                }
                else{
                    return null
                }
                
            }
            else{
                return A
            }
            
        }
        for(var F=0;
        F<E;
        F++){
            if(!G[F].name||G[F].name.toUpperCase()!=H){
                continue
            }
            if(J){
                if(G[F].tagName==B){
                    A[A.length]=G[F]
                }
                
            }
            else{
                A[A.length]=G[F]
            }
            
        }
        
    }
    else{
        if(document.evaluate){
            var L="";
            if(J){
                L=".//"+M+"[@name]"
            }
            else{
                L=".//*[@name]"
            }
            var K=document.evaluate(L,I,null,0,null);
            var C=K.iterateNext();
            while(C){
                if(C.getAttribute("name").toUpperCase()!=H){
                    C=K.iterateNext();
                    continue
                }
                A[A.length]=C;
                C=K.iterateNext()
            }
            
        }
        
    }
    if(A.length==0){
        return null
    }
    return A
};
pega.util.Dom.getElementsByIdOrName=function(B,L,Q){
    if(!B){
        return null
    }
    var C=B.toUpperCase();
    if(!L){
        L=document
    }
    var A=new Array();
    var M=false;
    var E="";
    if(Q!=null&&typeof (Q)!="undefined"){
        M=true;
        E=Q.toUpperCase()
    }
    if(pega.util.Event.isIE){
        var J=L.all(B);
        if(!J){
            return null
        }
        var H=J.length;
        if(!H||H==0){
            if(J.tagName=="OPTION"){
                A[0]=J.parentNode
            }
            else{
                A[0]=J
            }
            if(M){
                if(A[0].tagName==E){
                    return A
                }
                else{
                    return null
                }
                
            }
            else{
                return A
            }
            
        }
        if(J[0].tagName=="OPTION"){
            A[0]=J[0].parentNode;
            if(M){
                if(A[0].tagName==E){
                    return A
                }
                else{
                    return null
                }
                
            }
            else{
                return A
            }
            
        }
        for(var I=0;
        I<H;
        I++){
            if(M){
                if(J[I].tagName==E){
                    A[A.length]=J[I]
                }
                
            }
            else{
                A[A.length]=J[I]
            }
            
        }
        
    }
    else{
        if(document.evaluate){
            var P="";
            if(M){
                P=".//"+Q+"[@id | @name]"
            }
            else{
                P=".//*[@id | @name]"
            }
            var O=document.evaluate(P,L,null,0,null);
            var G=O.iterateNext();
            while(G){
                var D=G.getAttribute("id");
                var F=G.getAttribute("name");
                var K="";
                var N="";
                if(D!=null&&D!="undefined"){
                    K=D.toUpperCase()
                }
                if(F!=null&&F!="undefined"){
                    N=F.toUpperCase()
                }
                if((K==C)||(N==C)){
                    A[A.length]=G
                }
                else{
                    G=O.iterateNext();
                    continue
                }
                G=O.iterateNext()
            }
            
        }
        
    }
    if(A.length==0){
        return null
    }
    return A
};
pega.util.Dom.removeElements=function(D,A,B,C){
    arrEl=pega.util.Dom.getElementsBy(D,A,B,C);
    for(i=arrEl.length;
    i>0;
    i--){
        arrEl[i-1].parentNode.removeChild(arrEl[i-1]);
        arrEl[i-1]=null
    }
    
};
pega.util.Dom.clearEvents=function(oRoot,bRecursive){
    clearEventProps=function(oEl){
        for(propName in oEl){
            if(propName.indexOf("on")!=-1){
                try{
                    var prop=eval("oEl."+propName+"="+value)
                }
                catch(e){}
            }
            
        }
        
    };
    innerClearEvents=function(root,value,bRecursive){
        var oEls=pega.util.Dom.getChildren(root);
        for(var i=0;
        i<oEls.length;
        i++){
            var oEl=oEls[i];
            if(bRecursive){
                if(pega.util.Dom.getFirstChild(oEl)){
                    innerClearEvents(oEl,value,bRecursive)
                }
                
            }
            clearEventProps(oEl)
        }
        
    };
    if(arguments.length<2){
        bRecursive=false
    }
    if(pega.lang.isObject(oRoot.forms)&&pega.lang.isObject(oRoot.anchors)){
        oRoot=oRoot.getElementsByTagName("HTML")[0]
    }
    var oEls=pega.util.Dom.get(oRoot);
    if(pega.lang.isArray(oEls)){
        for(var i=0;
        i<oEls.length;
        i++){
            var oEl=oEls[i];
            innerClearEvents(oEl,null,bRecursive);
            clearEventProps(oEl)
        }
        
    }
    else{
        innerClearEvents(oEls,null,bRecursive);
        clearEventProps(oEls)
    }
    
};
pega.util.Dom.selectSingleNode=function(C,A){
    if(document.all){
        var B=C.selectNodes(A);
        if(B&&B.length>0){
            return B[0]
        }
        else{
            return null
        }
        
    }
    else{
        var B=C.evaluate(A,C,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);
        if(B!=null){
            return B.singleNodeValue
        }
        
    }
    return null
};
pega.util.Dom.updateInnerHTML=function(B){
    if(typeof B==="string"){
        B=document.getElementById(B)
    }
    if(B.type==="select-one"){
        while(B.options===undefined){
            var D=B.options
        }
        var A=B.selectedIndex;
        for(var C=0;
        C<B.options.length;
        C++){
            if(C!==A&&(B.options[C].getAttribute("selected")!=null)){
                B.options[C].attributes.removeNamedItem("selected")
            }
            if(C===A){
                B.options[A].setAttribute("selected","selected")
            }
            
        }
        
    }
    else{
        if(B.type==="text"){
            B.setAttribute("value",B.value)
        }
        else{
            if(B.type==="textarea"){
                B.innerHTML=B.value
            }
            else{
                if((B.type==="checkbox")||(B.type==="radio")){
                    if(B.checked){
                        B.setAttribute("checked","checked")
                    }
                    else{
                        B.removeAttribute("checked")
                    }
                    
                }
                
            }
            
        }
        
    }
    
};
pega.util.Dom.updateInnerHTMLForFields=function(C){
    var B=C.getElementsByTagName("input");
    var F=C.getElementsByTagName("select");
    var D=C.getElementsByTagName("textarea");
    var E=new Array(B,F,D);
    for(var A=0;
    A<E.length;
    A++){
        var H=E[A];
        for(var G=0;
        G<H.length;
        G++){
            pega.util.Dom.updateInnerHTML(E[A][G])
        }
        
    }
    
};
pega.util.Dom.changeStyle=function(F,B,A){
    var K={
        focusevent:{
            add:"focus",remove:"blur"
        }
        ,iefocusevent:{
            add:"focusin",remove:"focusout"
        }
        ,mouseevent:{
            add:"mouseover",remove:"mouseout"
        }
        
    };
    F.styleArr=F.styleArr||[];
    if(F.styleArr.length==0){
        F.styleArr.push({
            eventGroup:"default",style:F.style.cssText
        })
    }
    var I=false;
    var H=false;
    var D;
    for(D in K){
        if(K[D].add==B){
            I=true;
            break
        }
        else{
            if(K[D].remove==B){
                H=true;
                break
            }
            
        }
        
    }
    if(I){
        F.styleArr.push({
            eventGroup:D,style:A
        })
    }
    else{
        if(H){
            var J=-1;
            var G=F.styleArr.length;
            for(var E=0;
            E<G;
            E++){
                if(F.styleArr[E].eventGroup==D){
                    J=E;
                    break
                }
                
            }
            if(J!=-1){
                F.styleArr.splice(J,1)
            }
            
        }
        else{
            return false
        }
        
    }
    var C="";
    for(var E=0;
    E<F.styleArr.length;
    E++){
        C+=";"+F.styleArr[E].style
    }
    F.style.cssText=C;
    return true
};
pega.namespace("pega.tools");
pega.tools.Hashtable=function(A){
    if(!A){
        this.hashtable=new Object()
    }
    else{
        this.hashtable=A
    }
    
};
pega.tools.Hashtable.prototype.clear=function(){
    this.hashtable=new Object()
};
pega.tools.Hashtable.prototype.containsKey=function(B){
    var C=false;
    for(var A in this.hashtable){
        if(A==B&&this.hashtable[A]!=null){
            C=true;
            break
        }
        
    }
    return C
};
pega.tools.Hashtable.prototype.containsValue=function(C){
    var B=false;
    if(C!=null){
        for(var A in this.hashtable){
            if(this.hashtable[A]==C){
                B=true;
                break
            }
            
        }
        
    }
    return B
};
pega.tools.Hashtable.prototype.get=function(A){
    return this.hashtable[A]
};
pega.tools.Hashtable.prototype.isEmpty=function(){
    return(this.size()==0)?true:false
};
pega.tools.Hashtable.prototype.keys=function(){
    var B=new Array();
    for(var A in this.hashtable){
        if(this.hashtable[A]!=null){
            B.push(A)
        }
        
    }
    return B
};
pega.tools.Hashtable.prototype.put=function(A,B){
    if(A==null||B==null){
        throw"NullPointerException {"+A+"}, {"+B+"}"
    }
    else{
        this.hashtable[A]=B;
        return true
    }
    
};
pega.tools.Hashtable.prototype.remove=function(A){
    var B=this.hashtable[A];
    this.hashtable[A]=null;
    return B
};
pega.tools.Hashtable.prototype.size=function(){
    var B=0;
    for(var A in this.hashtable){
        if(this.hashtable[A]!=null){
            B++
        }
        
    }
    return B
};
pega.tools.Hashtable.prototype.toString=function(){
    var A="";
    for(var B in this.hashtable){
        if(this.hashtable[B]!=null){
            A+="{"+B+"},{"+this.hashtable[B]+"}\n"
        }
        
    }
    return A
};
pega.tools.Hashtable.prototype.values=function(){
    var A=new Array();
    for(var B in this.hashtable){
        if(this.hashtable[B]!=null){
            A.push(this.hashtable[B])
        }
        
    }
    return A
};
var Hashtable=function(){
    Hashtable.superclass.constructor.call(this)
};
pega.lang.extend(Hashtable,pega.tools.Hashtable);
SafeURL.prototype=new Hashtable;
function SafeURL(B,A){
    this.hashtable={};
    this.name="safeURL";
    if(B!=undefined&&B!=null&&B!=""){
        this.setActivityAction(B)
    }
    if(arguments.length>1&&A!=""){
        this.put("pxReqURI",A)
    }
    
}
SafeURL.prototype.copy=function(C,B){
    if(arguments.length>1&&B){
        for(var A in C.hashtable){
            if(C.get(A)!=null){
                this.put(A,C.get(A))
            }
            
        }
        
    }
    for(var A in C.hashtable){
        if(C.get(A)!=null){
            this.put(A,C.get(A))
        }
        
    }
    
};
SafeURL.prototype.toQueryStringWithEscape=function(){
    return this.toQueryString(false)
};
SafeURL.prototype.toQueryStringWithoutEscape=function(){
    return this.toQueryString(true)
};
SafeURL.prototype.nullify=function(){
    var B=this.size();
    var C=this.keys();
    for(var A=0;
    A<B;
    A++){
        this.hashtable[C[A]]=null
    }
    
};
SafeURL.prototype.mayBeEscaped=function(A){
    if(A==null||A==""){
        return false
    }
    if(A.indexOf("%20")!=-1||A.indexOf("%22")!=-1||A.indexOf("%23")!=-1||A.indexOf("%24")!=-1||A.indexOf("%25")!=-1||A.indexOf("%26")!=-1||A.indexOf("%27")!=-1||A.indexOf("%2B")!=-1||A.indexOf("%2C")!=-1||A.indexOf("%2F")!=-1||A.indexOf("%3A")!=-1||A.indexOf("%3B")!=-1||A.indexOf("%3C")!=-1||A.indexOf("%3D")!=-1||A.indexOf("%3E")!=-1||A.indexOf("%3F")!=-1||A.indexOf("%40")!=-1||A.indexOf("%5B")!=-1||A.indexOf("%5C")!=-1||A.indexOf("%5D")!=-1||A.indexOf("%5E")!=-1||A.indexOf("%60")!=-1||A.indexOf("%7B")!=-1||A.indexOf("%7C")!=-1||A.indexOf("%7D")!=-1||A.indexOf("%7E")!=-1){
        return true
    }
    return false
};
SafeURL.prototype.toEncodedPostBody=function(){
    return this.toQueryString(false,false)
};
SafeURL.prototype.toEncodedQueryString=function(){
    return this.toQueryString(false,false)
};
SafeURL.prototype.toUnencodedQueryString=function(){
    return this.toQueryString(true,false)
};
SafeURL.prototype.toQueryString=function(B,A){
    var E="";
    var C="";
    var G=true;
    var F=true;
    if(arguments.length>0){
        G=!B
    }
    if(arguments.length>1){
        F=A
    }
    for(var D in this.hashtable){
        if(D!="pxReqURI"){
            var H=this.hashtable[D];
            if(typeof (H)=="string"){
                if(F){
                    H=unescape(H)
                }
                if(G){
                    H=encodeURIComponent(H)
                }
                
            }
            if(D=="pyActivity"||D=="pyStream"){
                E=D+"="+H
            }
            else{
                if(this.hashtable[D]!=null){
                    if(typeof (H)=="object"&&H.name=="safeURL"){
                        H=H.toURL()
                    }
                    C+="&"+D+"="+H
                }
                
            }
            
        }
        
    }
    if(E==""){
        if(C==""){
            return""
        }
        else{
            return C.substring(1,C.length)
        }
        
    }
    else{
        return E+C
    }
    
};
SafeURL.prototype.toEncryptedURL=function(){
    return this.toURL(false,false)
};
SafeURL.prototype.toURL=function(C,B){
    var A=false;
    var F=true;
    if(arguments.length>0){
        A=C
    }
    if(arguments.length>1){
        F=B
    }
    var E="";
    if(this.hashtable.pxReqURI){
        E=this.hashtable.pxReqURI
    }
    else{
        if(typeof safeUrlRequestURI!="undefined"){
            E=safeUrlRequestURI
        }
        else{
            if(typeof gRuleFormManager!="undefined"&&typeof gRuleFormManager.wrapperAPI=="object"&&typeof gRuleFormManager.wrapperAPI.safeUrlRequestURI!="undefined"){
                E=gRuleFormManager.wrapperAPI.safeUrlRequestURI
            }
            
        }
        
    }
    if(typeof bRecordEvent!="undefined"&&bRecordEvent==true&&E.indexOf("/prhelp")==-1){
        if(typeof uwtUserStart!="undefined"&&uwtUserStart>0){
            this.put("$PpxRequestor$ppyBenchmarkStartTime",uwtUserStart);
            uwtUserStart=0
        }
        else{
            if(typeof this.get("userStart")!="undefined"&&this.get("userStart")>0){
                this.put("$PpxRequestor$ppyBenchmarkStartTime",this.get("userStart"));
                this.put("userStart",0)
            }
            else{
                this.put("$PpxRequestor$ppyBenchmarkStartTime",0)
            }
            
        }
        this.put("$PpxRequestor$ppyBenchmarkSubmitTime",new Date().getTime())
    }
    var H=this.toQueryString(A,F);
    if(H==null||H==""){
        return E
    }
    else{
        var G="?";
        var D=E.indexOf("?");
        if(D>-1&&typeof (pega)!="undefined"&&typeof (pega.d)!="undefined"&&typeof (pega.d.isPortlet)!="undefined"&&pega.d.isPortlet==true){
            G="&"
        }
        if(typeof bEncryptURLs!="undefined"&&bEncryptURLs&&(H.indexOf("pyActivity")>-1||H.indexOf("pyStream")>-1)){
            return E+G+URLObfuscation.encrypt(H)
        }
        else{
            return E+G+H
        }
        
    }
    
};
SafeURL.prototype.put=function(B,C){
    try{
        if(B==undefined||B==null||C==undefined||C==null){
            throw"NullPointerException in SafeURL.put(key,value) {"+B+"}, {"+C+"}"
        }
        else{
            this.hashtable[B]=C;
            return true
        }
        
    }
    catch(A){
        window.alert(A);
        return false
    }
    
};
SafeURL.prototype.get=function(A,B){
    return this.hashtable[A]
};
SafeURL.prototype.setStreamAction=function(A){
    this.put("pyStream",A)
};
SafeURL.prototype.setActivityAction=function(A){
    this.put("pyActivity",A)
};
function SafeURL_createFromURL(G){
    if(G.indexOf("pyactivitypzZZZ=")!=-1){
        var B=G.lastIndexOf("=");
        if(B>-1){
            var F=URLObfuscation.decrypt(G.substr(B+1,G.length-(B+2)));
            if(F){
                G=F
            }
            
        }
        
    }
    var B=G.lastIndexOf("?");
    var D;
    var E=new SafeURL();
    if(B>-1){
        D=G.substr(0,B);
        E.put("pxReqURI",D)
    }
    var A=SafeURL_getNameValuePairsAsObject(G.substr(B+1,G.length));
    for(var C in A){
        if(A[C]==null){
            E.put("pxReqURI",C)
        }
        else{
            E.put(C,A[C])
        }
        
    }
    return E
}
function SafeURL_createFromEncryptedURL(A){
    return SafeURL_createFromURL(A)
}
function SafeURL_createFromEncryptedURLwithQueryString(A){
    var D="";
    var I="";
    if(A.indexOf("pyactivitypzZZZ=")!=-1){
        if(A.indexOf("*&")!=-1){
            var B=A.lastIndexOf("*&");
            if(B>-1){
                var I=A.substr(B+1,A.length-(B+2));
                var G=A.lastIndexOf("pyactivitypzZZZ=");
                if(G>-1){
                    D=A.substr(G+16,B-(G+16));
                    A=URLObfuscation.decrypt(D)
                }
                
            }
            
        }
        else{
            var G=A.lastIndexOf("=");
            if(G>-1){
                A=URLObfuscation.decrypt(A.substr(G+1,A.length-(G+2)))
            }
            
        }
        
    }
    if(I!=""){
        A=A+I
    }
    var G=A.lastIndexOf("?");
    var F;
    var C=new SafeURL();
    if(G>-1){
        F=A.substr(0,G);
        C.put("pxReqURI",F)
    }
    var H=SafeURL_getNameValuePairsAsObject(A.substr(G+1,A.length));
    for(var E in H){
        if(H[E]==null){
            C.put("pxReqURI",E)
        }
        else{
            C.put(E,H[E])
        }
        
    }
    return C
}
function SafeURL_getParameterParamNameList(D){
    var A=new Array();
    try{
        var C=SafeURL_getNameValuePairsAsObject(D);
        var B=0;
        for(var F in C){
            A[B++]=F
        }
        
    }
    catch(E){}return A
}
function SafeURL_getParameterParamValueList(C){
    var F=new Array();
    try{
        var B=SafeURL_getNameValuePairsAsObject(C);
        var A=0;
        for(var E in B){
            F[A++]=B[E]
        }
        
    }
    catch(D){}return F
}
function SafeURL_getNameValuePairsAsObject(H){
    var I=H;
    var J=new Object();
    try{
        var G="";
        var B="";
        if(I==null||I==""){
            return J
        }
        var D=I.split("&");
        for(var C=0;
        C<D.length;
        ++C){
            var A=D[C];
            if(A!=""){
                if(A.indexOf("=")!=-1){
                    var F=A.split("=");
                    G=F[0];
                    B=F[1];
                    J[G]=B
                }
                else{
                    if(I==A){
                        J[A]=null
                    }
                    else{
                        J[G]=((typeof (J[G])!="undefined")?J[G].toString():"")+"&"+A
                    }
                    
                }
                
            }
            else{
                J[G]=((typeof (J[G])!="undefined")?J[G].toString():"")+"&"
            }
            
        }
        
    }
    catch(E){}return J
}
function SafeURL_clone(B){
    var C=new SafeURL();
    for(var A in B.hashtable){
        if(B.hashtable[A]!=null){
            if(typeof (B.hashtable[A])=="object"&&B.hashtable[A].name=="safeURL"){
                B.hashtable[A]=SafeURL_clone(B.hashtable[A])
            }
            C.put(A,B.hashtable[A])
        }
        
    }
    return C
}
function serializeSafeURL(B){
    var D="<SafeURL>";
    for(var A in B.hashtable){
        var C=B.hashtable[A];
        if(typeof (C)=="object"&&C.name=="safeURL"){
            C=serializeSafeURL(C);
            D+="<param name='safeURL' key='"+A+"'>"+C+"</param>"
        }
        else{
            D+="<param key='"+A+"'>"+C+"</param>"
        }
        
    }
    D+="</SafeURL>";
    return D
}
function deserializeSafeURL(E){
    var C=new SafeURL();
    var F=new ActiveXObject("microsoft.xmldom");
    if(F.loadXML(E)){
        var I=F.firstChild.childNodes;
        var B=I.length;
        for(var D=0;
        D<B;
        D++){
            var H=I[D].getAttribute("key");
            var A=I[D].getAttribute("name");
            var G=I[D].text;
            if(A=="safeURL"){
                G=deserializeSafeURL(I[D].firstChild.xml)
            }
            C.put(H,G)
        }
        return C
    }
    return null
}
function Hashtable(){
    this.clear=hashtable_clear;
    this.containsKey=hashtable_containsKey;
    this.containsValue=hashtable_containsValue;
    this.get=hashtable_get;
    this.isEmpty=hashtable_isEmpty;
    this.keys=hashtable_keys;
    this.put=hashtable_put;
    this.remove=hashtable_remove;
    this.size=hashtable_size;
    this.toString=hashtable_toString;
    this.values=hashtable_values;
    this.hashtable=new Object()
}
function hashtable_clear(){
    this.hashtable=new Object()
}
function hashtable_containsKey(B){
    var C=false;
    for(var A in this.hashtable){
        if(A==B&&this.hashtable[A]!=null){
            C=true;
            break
        }
        
    }
    return C
}
function hashtable_containsValue(C){
    var B=false;
    if(C!=null){
        for(var A in this.hashtable){
            if(this.hashtable[A]==C){
                B=true;
                break
            }
            
        }
        
    }
    return B
}
function hashtable_get(A){
    return this.hashtable[A]
}
function hashtable_isEmpty(){
    return(this.size()==0)?true:false
}
function hashtable_keys(){
    var B=new Array();
    for(var A in this.hashtable){
        if(this.hashtable[A]!=null){
            B.push(A)
        }
        
    }
    return B
}
function hashtable_put(A,B){
    if(A==null||B==null){
        throw"NullPointerException {"+A+"}, {"+B+"}"
    }
    else{
        this.hashtable[A]=B;
        return true
    }
    
}
function hashtable_remove(A){
    var B=this.hashtable[A];
    this.hashtable[A]=null;
    return B
}
function hashtable_size(){
    var B=0;
    for(var A in this.hashtable){
        if(this.hashtable[A]!=null){
            B++
        }
        
    }
    return B
}
function hashtable_toString(){
    var A="";
    for(var B in this.hashtable){
        if(this.hashtable[B]!=null){
            A+="{"+B+"},{"+this.hashtable[B]+"}\n"
        }
        
    }
    return A
}
function hashtable_values(){
    var A=new Array();
    for(var B in this.hashtable){
        if(this.hashtable[B]!=null){
            A.push(this.hashtable[B])
        }
        
    }
    return A
}
var URLObfuscation={
    _keyStr:"-_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[",encrypt:function(A){
        var C=getObfuscationKey();
        if(C==null){
            return URLObfuscation.encode(A)
        }
        var D=stringToByteArray(C);
        var F=rijndaelEncrypt(A,formatKey(D));
        var E=byteArrayToHex(F);
        var B="pyactivitypzZZZ="+E+"*";
        return B
    }
    ,decrypt:function(A){
        var B=getObfuscationKey();
        if(B==null){
            return URLObfuscation.decode(A)
        }
        var C=stringToByteArray(B);
        var D=rijndaelDecrypt(hexToByteArray(A),formatKey(C));
        return byteArrayToString(D)
    }
    ,encode:function(E){
        if(E.indexOf("pyactivitypzZZZ=")==0){
            return E
        }
        var D=90;
        var A="";
        var L,J,H,K,I,G,F;
        var B=0;
        E=URLObfuscation._utf8_encode(E);
        while(B<E.length){
            L=E.charCodeAt(B++)^D;
            J=E.charCodeAt(B++)^D;
            H=E.charCodeAt(B++)^D;
            K=L>>2;
            I=((L&3)<<4)|(J>>4);
            G=((J&15)<<2)|(H>>6);
            F=H&63;
            if(isNaN(J)){
                G=F=64
            }
            else{
                if(isNaN(H)){
                    F=64
                }
                
            }
            A=A+this._keyStr.charAt(K)+this._keyStr.charAt(I)+this._keyStr.charAt(G)+this._keyStr.charAt(F)
        }
        var C="pyactivitypzZZZ="+A+"*";
        return C
    }
    ,decode:function(D){
        var C=90;
        var A="";
        var K,I,G;
        var J,H,F,E;
        var B=0;
        D=D.replace(/[^\-\_0-9a-zA-Z\[]/g,"");
        while(B<D.length){
            J=this._keyStr.indexOf(D.charAt(B++));
            H=this._keyStr.indexOf(D.charAt(B++));
            F=this._keyStr.indexOf(D.charAt(B++));
            E=this._keyStr.indexOf(D.charAt(B++));
            K=(J<<2)|(H>>4);
            I=((H&15)<<4)|(F>>2);
            G=((F&3)<<6)|E;
            K^=C;
            A=A+String.fromCharCode(K);
            if(F!=64){
                I^=C;
                A=A+String.fromCharCode(I)
            }
            if(E!=64){
                G^=C;
                A=A+String.fromCharCode(G)
            }
            
        }
        A=URLObfuscation._utf8_decode(A);
        return A
    }
    ,_utf8_encode:function(B){
        B=B.replace(/\r\n/g,"\n");
        var A="";
        for(var D=0;
        D<B.length;
        D++){
            var C=B.charCodeAt(D);
            if(C<128){
                A+=String.fromCharCode(C)
            }
            else{
                if((C>127)&&(C<2048)){
                    A+=String.fromCharCode((C>>6)|192);
                    A+=String.fromCharCode((C&63)|128)
                }
                else{
                    A+=String.fromCharCode((C>>12)|224);
                    A+=String.fromCharCode(((C>>6)&63)|128);
                    A+=String.fromCharCode((C&63)|128)
                }
                
            }
            
        }
        return A
    }
    ,_utf8_decode:function(A){
        var B="";
        var C=0;
        var D=c1=c2=0;
        while(C<A.length){
            D=A.charCodeAt(C);
            if(D<128){
                B+=String.fromCharCode(D);
                C++
            }
            else{
                if((D>191)&&(D<224)){
                    c2=A.charCodeAt(C+1);
                    B+=String.fromCharCode(((D&31)<<6)|(c2&63));
                    C+=2
                }
                else{
                    c2=A.charCodeAt(C+1);
                    c3=A.charCodeAt(C+2);
                    B+=String.fromCharCode(((D&15)<<12)|((c2&63)<<6)|(c3&63));
                    C+=3
                }
                
            }
            
        }
        return B
    }
    
};
var BS=128;
var BB=128;
var RA=[,,,,[,,,,10,,12,,14],,[,,,,12,,12,,14],,[,,,,14,,14,,14]];
var SO=[,,,,[,1,2,3],,[,1,2,3],,[,1,3,4]];
var RC=[1,2,4,8,16,32,64,128,27,54,108,216,171,77,154,47,94,188,99,198,151,53,106,212,179,125,250,239,197,145];
var SB=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22];
var SBI=[82,9,106,213,48,54,165,56,191,64,163,158,129,243,215,251,124,227,57,130,155,47,255,135,52,142,67,68,196,222,233,203,84,123,148,50,166,194,35,61,238,76,149,11,66,250,195,78,8,46,161,102,40,217,36,178,118,91,162,73,109,139,209,37,114,248,246,100,134,104,152,22,212,164,92,204,93,101,182,146,108,112,72,80,253,237,185,218,94,21,70,87,167,141,157,132,144,216,171,0,140,188,211,10,247,228,88,5,184,179,69,6,208,44,30,143,202,63,15,2,193,175,189,3,1,19,138,107,58,145,17,65,79,103,220,234,151,242,207,206,240,180,230,115,150,172,116,34,231,173,53,133,226,249,55,232,28,117,223,110,71,241,26,113,29,41,197,137,111,183,98,14,170,24,190,27,252,86,62,75,198,210,121,32,154,219,192,254,120,205,90,244,31,221,168,51,136,7,199,49,177,18,16,89,39,128,236,95,96,81,127,169,25,181,74,13,45,229,122,159,147,201,156,239,160,224,59,77,174,42,245,176,200,235,187,60,131,83,153,97,23,43,4,126,186,119,214,38,225,105,20,99,85,33,12,125];
var xorMask=[226,200,245,50,92,38,185,101,55,65,48,82,245,164,137,213,115,22,204,69,175,142,22,63,241,39,28,231,134,7,60,170,222,140,92,237,69,228,230,220,124,240,0,240,231,1,72,78,246,34,15,247,86,17,185,200,88,144,232,207,254,107,213,4,177,11,238,14,12,45,35,58,100,18,89,155,85,228,118,204,47,236,21,206,52,19,193,80,128,230,246,119,233,16,3,142,252,237,228,120,50,67,88,39,114,7,10,30,65,153,128,136,145,49,146,215,54,58,230,38,13,27,149,90,194,45,15,85,32,101,107,214,172,188,253,138,143,240,251,137,65,48,137,241,145,131,142,10,248,194,42,86,75,1,41,187,218,209,62,56,199,255,209,32,99,253,91,252,135,215,247,71,255,185,228,239,39,224,237,110,80,35,204,245,167,127,164,27,211,138,221,109,89,142,28,239,178,129,212,221,138,103,94,233,184,214,166,111,80,95,146,116,193,124,181,9,51,80,31,46,38,91,167,251,136,23,151,191,235,248,248,234,172,53,205,215,190,148,37,127,142,239,252,162,8,223,221,146,38,81,184,202,158,0,11,12];
function cSL(C,B){
    var A=C.slice(0,B);
    C=C.slice(B).concat(A);
    return C
}
var Nk=BS/32;
var Nb=BB/32;
var Nr=RA[Nk][Nb];
function XT(A){
    A<<=1;
    return((A&256)?(A^283):(A))
}
function GF(A,E){
    var D,C=0;
    for(D=1;
    D<256;
    D*=2,E=XT(E)){
        if(A&D){
            C^=E
        }
        
    }
    return C
}
function bS(D,E){
    var C;
    if(E=="e"){
        C=SB
    }
    else{
        C=SBI
    }
    for(var B=0;
    B<4;
    B++){
        for(var A=0;
        A<Nb;
        A++){
            D[B][A]=C[D[B][A]]
        }
        
    }
    
}
function sR(B,C){
    for(var A=1;
    A<4;
    A++){
        if(C=="e"){
            B[A]=cSL(B[A],SO[Nb][A])
        }
        else{
            B[A]=cSL(B[A],Nb-SO[Nb][A])
        }
        
    }
    
}
function mC(D,E){
    var A=[];
    for(var B=0;
    B<Nb;
    B++){
        for(var C=0;
        C<4;
        C++){
            if(E=="e"){
                A[C]=GF(D[C][B],2)^GF(D[(C+1)%4][B],3)^D[(C+2)%4][B]^D[(C+3)%4][B]
            }
            else{
                A[C]=GF(D[C][B],14)^GF(D[(C+1)%4][B],11)^GF(D[(C+2)%4][B],13)^GF(D[(C+3)%4][B],9)
            }
            
        }
        for(var C=0;
        C<4;
        C++){
            D[C][B]=A[C]
        }
        
    }
    
}
function aRK(C,A){
    for(var B=0;
    B<Nb;
    B++){
        C[0][B]^=(A[B]&255);
        C[1][B]^=((A[B]>>8)&255);
        C[2][B]^=((A[B]>>16)&255);
        C[3][B]^=((A[B]>>24)&255)
    }
    
}
function OY(F){
    var D=F.length;
    var B=[];
    var C=D%256;
    var A,E;
    for(A=0;
    A<C;
    A++){
        B[A]=F[A]^xorMask[A]
    }
    while(A<D){
        for(E=0;
        E<256;
        E++){
            B[A]=F[A]^xorMask[E];
            A++
        }
        
    }
    return B
}
function YE(D){
    var C=[];
    var B;
    Nk=BS/32;
    Nb=BB/32;
    Nr=RA[Nk][Nb];
    for(var A=0;
    A<Nk;
    A++){
        C[A]=(D[4*A])|(D[4*A+1]<<8)|(D[4*A+2]<<16)|(D[4*A+3]<<24)
    }
    for(A=Nk;
    A<Nb*(Nr+1);
    A++){
        B=C[A-1];
        if(A%Nk==0){
            B=((SB[(B>>8)&255])|(SB[(B>>16)&255]<<8)|(SB[(B>>24)&255]<<16)|(SB[B&255]<<24))^RC[Math.floor(A/Nk)-1]
        }
        else{
            if(Nk>6&&A%Nk==4){
                B=(SB[(B>>24)&255]<<24)|(SB[(B>>16)&255]<<16)|(SB[(B>>8)&255]<<8)|(SB[B&255])
            }
            
        }
        C[A]=C[A-Nk]^B
    }
    return C
}
function Rd(B,A){
    bS(B,"e");
    sR(B,"e");
    mC(B,"e");
    aRK(B,A)
}
function iRd(B,A){
    aRK(B,A);
    mC(B,"d");
    sR(B,"d");
    bS(B,"d")
}
function FRd(B,A){
    bS(B,"e");
    sR(B,"e");
    aRK(B,A)
}
function iFRd(B,A){
    aRK(B,A);
    sR(B,"d");
    bS(B,"d")
}
function encrypt(A,C){
    var B;
    if(!A||A.length*8!=BB){
        return 
    }
    if(!C){
        return 
    }
    A=pB(A);
    aRK(A,C);
    for(B=1;
    B<Nr;
    B++){
        Rd(A,C.slice(Nb*B,Nb*(B+1)))
    }
    FRd(A,C.slice(Nb*Nr));
    return uPB(A)
}
function decrypt(A,C){
    var B;
    if(!A||A.length*8!=BB){
        return 
    }
    if(!C){
        return 
    }
    A=pB(A);
    iFRd(A,C.slice(Nb*Nr));
    for(B=Nr-1;
    B>0;
    B--){
        iRd(A,C.slice(Nb*B,Nb*(B+1)))
    }
    aRK(A,C);
    return uPB(A)
}
function pB(B){
    var C=[];
    if(!B||B.length%4){
        return 
    }
    C[0]=[];
    C[1]=[];
    C[2]=[];
    C[3]=[];
    for(var A=0;
    A<B.length;
    A+=4){
        C[0][A/4]=B[A];
        C[1][A/4]=B[A+1];
        C[2][A/4]=B[A+2];
        C[3][A/4]=B[A+3]
    }
    return C
}
function uPB(C){
    var B=[];
    for(var A=0;
    A<C[0].length;
    A++){
        B[B.length]=C[0][A];
        B[B.length]=C[1][A];
        B[B.length]=C[2][A];
        B[B.length]=C[3][A]
    }
    return B
}
function fPT(C){
    var B=BB/8;
    var A;
    if(typeof C=="string"||C.indexOf){
        C=C.split("");
        for(A=0;
        A<C.length;
        A++){
            C[A]=C[A].charCodeAt(0)&255
        }
        
    }
    for(A=B-(C.length%B);
    A>0&&A<B;
    A--){
        C[C.length]=0
    }
    return C
}
function rijndaelEncrypt(H,G){
    var D,C,F;
    var E=BB/8;
    var B;
    if(!H||!G){
        return 
    }
    if(G.length*8!=BS){
        return 
    }
    B=[];
    H=fPT(H);
    G=OY(G);
    D=YE(G);
    for(var A=0;
    A<H.length/E;
    A++){
        F=H.slice(A*E,(A+1)*E);
        B=B.concat(encrypt(F,D))
    }
    return B
}
function rijndaelDecrypt(C,G){
    var B;
    var F=BB/8;
    var E=[];
    var D;
    var A;
    if(!C||!G||typeof C=="string"){
        return 
    }
    if(G.length*8!=BS){
        return 
    }
    G=OY(G);
    B=YE(G);
    for(A=(C.length/F)-1;
    A>0;
    A--){
        D=decrypt(C.slice(A*F,(A+1)*F),B);
        E=D.concat(E)
    }
    E=decrypt(C.slice(0,F),B).concat(E);
    return E
}
function stringToByteArray(A){
    var C=[];
    for(var B=0;
    B<A.length;
    B++){
        C[B]=A.charCodeAt(B)
    }
    return C
}
function byteArrayToString(C){
    var B="";
    if(!C){
        return 
    }
    for(var A=0;
    A<C.length;
    A++){
        if(C[A]!=0){
            B+=String.fromCharCode(C[A])
        }
        
    }
    return B
}
function byteArrayToHex(C){
    var B="";
    if(!C){
        return 
    }
    for(var A=0;
    A<C.length;
    A++){
        B+=((C[A]<16)?"0":"")+C[A].toString(16)
    }
    return B
}
function hexToByteArray(A){
    var C=[];
    if(A.length%2){
        return 
    }
    if(A.indexOf("0x")==0||A.indexOf("0X")==0){
        A=A.substring(2)
    }
    for(var B=0;
    B<A.length;
    B+=2){
        C[Math.floor(B/2)]=parseInt(A.slice(B,B+2),16)
    }
    return C
}
function formatKey(F){
    var E;
    var B=0;
    var D=BS/8;
    var C=[];
    for(E=F.length-1;
    E>-1;
    E--){
        C[B++]=F[E];
        if(B==D){
            break
        }
        
    }
    if(B<D){
        for(var A=B;
        A<D;
        A++){
            C[A]=B+60
        }
        
    }
    return C
}
function getCookie(){
    try{
        var A="";
        if(pega&&pega.web&&pega.web.mgr&&!pega.web.mgr._bDirectPRPC){
            return pega.web.mgr.getCookie()
        }
        else{
            var C=window.document.cookie.split("; ");
            for(var E=0;
            E<C.length;
            E++){
                var B=C[E].split("=");
                if("prGatewaySESSIONID"==B[0]){
                    return B[1].toLowerCase()
                }
                else{
                    if("JSESSIONID"==B[0]){
                        A=B[1].toLowerCase()
                    }
                    
                }
                
            }
            
        }
        
    }
    catch(D){}return A
}
function getObfuscationKey(){
    try{
        var A="";
        if(pega&&pega.web&&pega.web.mgr&&!pega.web.mgr._bDirectPRPC){
            return pega.web.mgr.getCookie()
        }
        else{
            var C=window.document.cookie.split("; ");
            for(var E=0;
            E<C.length;
            E++){
                var B=C[E].split("=");
                if("prGatewaySESSIONID"==B[0]){
                    return B[1].toLowerCase()
                }
                else{
                    if("Pega-RULES"==B[0]){
                        A=B[1].toLowerCase()
                    }
                    
                }
                
            }
            
        }
        
    }
    catch(D){}return A
};
if(!pega){
    var pega={}
}
if(!pega.desktop){
    pega.desktop={};
    pega.d=pega.desktop
}
pega.d.desktopType="Composite";
pega.d.desktopSubType="IAC";
pega.desktop.availableSpaces=new Array();
pega.d.activeSpaceName="Work";
var DesktopUserSessionInfo_gStrOperatorId=null;
var DesktopUserSessionInfo_gStrUserName=null;
var DesktopUserSessionInfo_gStrCurrentWorkPool=null;
var DesktopUserSessionInfo_gStrStartPage=null;
var DesktopUserSessionInfo_gStrDesktopType=null;
var SYNC="SYNC";
var ASYNC="ASYNC";
var ASYNC_REPLACE="ASYNC_REPLACE";
var ASYNC_COPY="ASYNC_COPY";
var ASYNC_COPY_REPLACE="ASYNC_COPY_REPLACE";
pega.desktop.sendEvent=function(D,C,E,A){
    var B=pega.desktop.support.getDesktopApplication();
    if(B){
        B.getEventManager().sendEvent(D,C,E,A)
    }
    
};
if(!pega.clientLog){
    pega.clientLog={}
}
pega.clientLog.isActive=function(){
    return false
};
pega.clientLog.log=function(){
    return false
};
if(!pega.desktop.support){
    pega.desktop.support={}
}
pega.desktop.support.getDesktopWindow=function(){
    return window
};
pega.desktop.support.getDesktopApplication=function(){
    return pega.d.CompositeAppController
};
pega.desktop.support.isSpaceAvailable=function(A){
    for(var B=0;
    B<pega.desktop.availableSpaces.length;
    B++){
        var C=pega.desktop.availableSpaces[B];
        if(C.toLowerCase()==A.toLowerCase()){
            return true
        }
        
    }
    return false
};
pega.desktop.nextSpace="";
pega.desktop.nextGadget="";
pega.desktop.showNextInSpace=function(B,A){
    pega.desktop.nextSpace=B;
    if(A){
        pega.desktop.nextGadget=A
    }
    
};
pega.desktop.showNextInGadget=function(A){
    pega.desktop.nextGadget=A
};
pega.desktop.compositeOpenSpace=function(F,M,L){
    var C=L.toLowerCase();
    switch(C){
        case"rulespecific":case"rulebyclassandname":case"rulebyurl":case"rulebykeys":case"spacehomewithurl":case"listbybasket":case"listbyurl":case"listbyuser":return false
    }
    if(L==""&&pega.desktop.nextSpace!=""&&(pega.desktop.nextSpace==pega.desktop.getCurrentSpaceName())){
        return true
    }
    else{
        if(pega.desktop.nextSpace!=""&&pega.desktop.nextSpace!=pega.desktop.getCurrentSpaceName()){
            pega.desktop.doDesktopAction(pega.desktop.nextSpace,M,L);
            pega.desktop.nextSpace="";
            return true
        }
        
    }
    var D=pega.desktop.support.getDesktopApplication();
    var E=D.gadgetPool.findAvailableGadget(pega.desktop.nextGadget);
    if(!E){
        if(pega.desktop.support.isSpaceAvailable("work")&&pega.desktop.getCurrentSpaceName().toLowerCase()!="work"){
            pega.desktop.doDesktopAction("work",M,L);
            return true
        }
        return false
    }
    var G={};
    G.appName=M.get("appName");
    G.systemID=M.get("systemID");
    var H=false;
    switch(C){
        case"display":case"showharness":M.put("api","display");
        pega.desktop.sendEvent("DesktopAction",M,SYNC);
        break;
        case"formbyurl":M.put("api","openWorkByURL");
        pega.desktop.sendEvent("DesktopAction",M,SYNC);
        break;
        case"getnextwork":M.put("api","getNextWork");
        pega.desktop.sendEvent("DesktopAction",M,SYNC);
        break;
        case"openbyassignment":M.put("api","openAssignment");
        pega.desktop.sendEvent("DesktopAction",M,SYNC);
        break;
        case"openbyworkhandle":M.put("api","openWorkByHandle");
        pega.desktop.sendEvent("DesktopAction",M,SYNC);
        break;
        case"openbyworkitem":M.put("api","openWorkItem");
        pega.desktop.sendEvent("DesktopAction",M,SYNC);
        break;
        case"openwizard":M.put("api","openWizard");
        pega.desktop.sendEvent("DesktopAction",M,SYNC);
        break;
        case"enternewworkfromflow":case"enternewwork":M.put("api","createNewWork");
        pega.desktop.sendEvent("DesktopAction",M,SYNC);
        break;
        case"openlanding":var B=M.get("ActionParams");
        var J=M.get("Navigation");
        var N=M.get("Name");
        var I=M.get("Action");
        var A=M.get("Name");
        if(B){
            var K=B.thread;
            if(K&K!=""){
                N=K
            }
            
        }
        oSafeUrl=new SafeURL();
        for(i in B){
            oSafeUrl.put(i,B[i])
        }
        for(i in J){
            oSafeUrl.put(i,J[i])
        }
        oSafeUrl.put("api","openLanding");
        oSafeUrl.put("Name",N);
        oSafeUrl.put("Action",I);
        oSafeUrl.put("landingPageTitle",A);
        pega.desktop.sendEvent("DesktopAction",oSafeUrl,SYNC);
        break;
        default:H=true
    }
    return true
};
pega.desktop.compositeOpenUrlInSpace=function(C,B){
    if(B!=pega.desktop.getCurrentSpaceName()){
        pega.desktop.doDesktopAction(B,C.toURL(),"openURL")
    }
    var D=pega.desktop.support.getDesktopApplication();
    var A=D.gadgetPool.findAvailableGadget(pega.desktop.nextGadget);
    if(A){
        A.openURL(C.toURL())
    }
    else{
        pega.desktop.doDesktopAction(B,C.toURL(),"openURL")
    }
    
};
pega.desktop.doDesktopAction=function(B,E,C){
    if(C.toLowerCase()=="openurl"){
        var D=new SafeURL("DoDesktopAction");
        D.put("sourceType",C);
        D.put("navURL",E)
    }
    else{
        if(C!=null&&C!=""){
            var D=pega.desktop.support.constructUrl(E,C);
            D.put("pyActivity","DoDesktopAction");
            D.put("sourceType",C);
            D.put("spaceName",B);
            if(D.get("pyClassName")!=null){
                D.put("pyClassName","@baseclass")
            }
            
        }
        else{
            var D=new SafeURL("Data-Portal.ShowSpaceHarness");
            D.put("spaceName",B);
            D.put("pzPrimaryPageName","pyPortal")
        }
        
    }
    D.put("nextGadget",pega.desktop.nextGadget);
    if(E.get("systemID")){
        D.put("systemID",E.get("systemID"))
    }
    if(E.get("appName")){
        D.put("appName",E.get("appName"))
    }
    pega.desktop.nextGadget="";
    var A=pega.desktop.support.getDesktopWindow();
    A.location.href=D.toURL();
    A.focus()
};
pega.desktop.display=function(D,A){
    var B=arguments[0];
    if(typeof B=="object"&&B.name=="safeURL"){
        var E=SafeURL_clone(B)
    }
    if(!E){
        var E=new SafeURL();
        E.put("ClassName",D);
        E.put("HarnessName",A)
    }
    var C=pega.desktop.getCurrentSpaceName();
    pega.desktop.compositeOpenSpace(C,E,"display")
};
pega.desktop.registerDocumentGadget=function(A){
    var B=pega.desktop.support.getDesktopApplication();
    B.gadgetPool.addGadget(A)
};
pega.desktop.setStartupCommand=function(){
    var D=top.startupCommand;
    var C=SafeURL_clone(D);
    var A=top.sourceType;
    var B="Work";
    pega.desktop.compositeOpenSpace(B,C,A)
};
pega.desktop.attachStartupCommand=function(){
    if(pega.u.d){
        pega.u.d.attachOnload(pega.desktop.invokeStartupCommand)
    }
    else{
        setTimeout("pega.desktop.attachStartupCommand()",100)
    }
    
};
pega.desktop.invokeStartupCommand=function(){
    setTimeout("pega.desktop.setStartupCommand()",500)
};
try{
    if(top.startupCommand){
        pega.desktop.attachStartupCommand()
    }
    
}
catch(e){};
pega.namespace("pega.desktop");
var gModEM="EventManager";
pega.desktop.EventManager=function(){
    this.eventControllers=new Array();
    this.eventObjects=new Array();
    this.eventId=1;
    this.currentEventName=""
};
pega.desktop.EventManager.prototype={
    cancelEventListener:function(D,C){
        logEvent("EventName="+D,gModEM,"cancelEventListener");
        var A=this.getEventController(D);
        if(A){
            for(var B=0;
            B<A.eventListeners.length;
            B++){
                if(A.eventListeners[B].eventFunction==C){
                    A.eventListeners[B].eventFunction=null;
                    A.eventListeners[B].data=null;
                    A.eventListeners.splice(B,1);
                    break
                }
                
            }
            
        }
        
    }
    ,clearEventTimeout:function(B){
        var A=0;
        while(A<this.eventObjects.length){
            if(this.eventObjects[A].eventName==B){
                window.clearTimeout(this.eventObjects[A].timeoutId);
                this.eventObjects.splice(A,1)
            }
            
        }
        
    }
    ,getCurrentEvent:function(){
        return this.currentEventName
    }
    ,getEventController:function(C){
        for(var B=0;
        B<this.eventControllers.length;
        B++){
            if(this.eventControllers[B].eventName==C){
                return this.eventControllers[B]
            }
            
        }
        var A=new EventController(C);
        this.eventControllers.push(A);
        return A
    }
    ,invokeEvent:function(F,H){
        var A=new Array();
        var G=this.getEventController(F);
        var B=G.eventListeners;
        for(var C=0;
        C<B.length;
        C++){
            if(!B[C].execute(H)){
                try{
                    B[C].eventFunction=null;
                    B[C].data=null
                }
                catch(E){}A.push(C)
            }
            
        }
        var I=A.length;
        for(var C=I-1;
        C>=0;
        C--){
            var D=A[C];
            B.splice(D,1)
        }
        
    }
    ,registerEventListener:function(F,D,A,E){
        logEvent("EventName="+F,gModEM,"registerEventListener");
        var C=this.getEventController(F);
        var B=new EventListener(D,A,E);
        C.eventListeners.push(B)
    }
    ,registerWorkPoolChangeListener:function(B,A){
        this.registerEventListener(AppChange,B,A)
    }
    ,sendEvent:function(J,L,G,F){
        if(typeof J=="object"){
            J=J.domain+"$"+J.ruleSet+"$"+J.name
        }
        if(pega.clientLog.isActive()){
            var K="";
            var E=0;
            if(typeof L=="string"){
                K=L
            }
            else{
                for(var B in L){
                    if(E++>40){
                        K+="...";
                        break
                    }
                    K=K+" | "+B+":"+L[B]
                }
                
            }
            logEvent("EventName="+J+" Data="+K+" Mode="+G+" delay="+F,gModEM,"sendEvent")
        }
        if(G==undefined||G==null){
            G=ASYNC
        }
        if(F==undefined||F==null||isNaN(F)){
            F=1
        }
        this.setCurrentEvent(J);
        switch(G){
            case SYNC:this.invokeEvent(J,L);
            break;
            case ASYNC_COPY_REPLACE:if(typeof L!="string"){
                var C=new Array();
                C["$(mode)"]=G;
                alert(getLocalString("pyMessageLabel","Event Data sent using $(mode) mode must be passed as a serialized string",C));
                return false
            }
            L=deserialize(L);
            case ASYNC_REPLACE:this.clearEventTimeout(J);
            this.sendEvent(J,this.getFormData(),ASYNC,F);
            break;
            case ASYNC_COPY:if(typeof L!="string"){
                var C=new Array();
                C["$(mode)"]=G;
                alert(getLocalString("pyMessageLabel","Event Data sent using $(mode) mode must be passed as a serialized string",C));
                return false
            }
            L=deserialize(L);
            case ASYNC:var D=(new Date()).getTime();
            var A=D+"_"+this.eventId;
            var I=window.setTimeout("EventManager_eventTimeoutHandler('"+J+"','"+A+"')",F);
            var H=new EventObj(J,A,I,L);
            this.eventObjects.push(H);
            this.eventId++;
            break
        }
        
    }
    ,setCurrentEvent:function(A){
        this.currentEventName=A
    }
    
};
EventManager_eventTimeoutHandler=function(D,A){
    var C=top.application.getEventManager();
    for(var B=0;
    B<C.eventObjects.length;
    B++){
        if(C.eventObjects[B].eventName==D&&C.eventObjects[B].timeStamp==A){
            C.invokeEvent(C.eventObjects[B].eventName,C.eventObjects[B].eventData);
            C.eventObjects.splice(B,1);
            break
        }
        
    }
    
};
function EventObj(B,A,D,C){
    this.eventName=B;
    this.timeStamp=A;
    this.timeoutId=D;
    this.eventData=C
}
function EventController(A){
    this.eventName=A;
    this.eventListeners=new Array()
}
function EventListener(B,A,C){
    this.eventFunction=B;
    this.data=A;
    this.execute=EventListener_executeFunction;
    this.scope=C
}
function EventListener_executeFunction(C){
    var A=true;
    try{
        if(this.scope){
            this.eventFunction.call(this.scope,C,this.data)
        }
        else{
            this.eventFunction(C,this.data)
        }
        
    }
    catch(B){
        A=false
    }
    return A
};
pega.namespace("pega.desktop");
pega.desktop.AppControllerLite=function(){
    this.name="PegaDesktopApplicationController";
    this.eventManager=new pega.desktop.EventManager();
    this.model=new pega.desktop.AppModelLite();
    this.openedWindows=new Array();
    this.portalType="Composite";
    this.gadgetPool=new pega.desktop.gadgetPoolImpl()
};
pega.desktop.AppControllerLite.prototype={
    getEventManager:function(){
        return this.eventManager
    }
    ,getModel:function(){
        return this.model
    }
    ,getView:function(A){
        return null
    }
    ,getUserSessionInfo:function(){
        return this.model.getUserSessionInfo()
    }
    
};
pega.desktop.AppModelLite=function(){
    this.userSessionInfo=new pega.desktop.UserSessionInfo()
};
pega.desktop.AppModelLite.prototype={
    getUserSessionInfo:function(){
        return this.userSessionInfo
    }
    ,getPreferences:function(){
        return null
    }
    
};
pega.desktop.UserSessionInfo=function(){
    this.operatorId=DesktopUserSessionInfo_gStrOperatorId;
    this.userName=DesktopUserSessionInfo_gStrUserName;
    this.currentWorkPool=DesktopUserSessionInfo_gStrCurrentWorkPool;
    this.startPage=DesktopUserSessionInfo_gStrStartPage
};
pega.desktop.UserSessionInfo.prototype={
    setOperatorID:function(A){
        this.operatorId=A
    }
    ,getOperatorId:function(){
        return this.operatorId
    }
    ,setUserName:function(A){
        this.userName=A
    }
    ,getUserName:function(){
        return this.userName
    }
    ,setStartPage:function(A){
        this.startPage=A
    }
    ,getStartPage:function(){
        if(DesktopUserSessionInfo_gStrStartPage){
            return DesktopUserSessionInfo_gStrStartPage
        }
        else{
            return""
        }
        
    }
    ,getCurrentWorkPool:function(){
        return DesktopUserSessionInfo_gStrCurrentWorkPool
    }
    ,setCurrentWorkPool:function(A){
        this.currentWorkPool=A
    }
    
};
function framesetscript_restartTimeoutWarningTimer(){
    return null
}
function logEvent(){
    return null
}
pega.desktop.gadgetPoolImpl=function(){
    this._pool=new Array()
};
pega.desktop.gadgetPoolImpl.prototype={
    addGadget:function(A){
        this._pool.push(A)
    }
    ,findAvailableGadget:function(A){
        if(this._pool.length>=1){
            return this._pool[0]
        }
        else{
            return null
        }
        
    }
    ,findGadgetByID:function(B){
        for(var A=0;
        A<this._pool.length;
        A++){
            var C=this._pool[A];
            if(C.getID()==B){
                return C
            }
            
        }
        return null
    }
    
};
pega.d.desktopType="Composite";
var DesktopUserSessionInfo_gStrDesktopType="Composite";
var application=new pega.desktop.AppControllerLite();
pega.d.CompositeAppController=application;
try{
    if(typeof (pega.web.mgr)=="undefined"){
        var bPegaIacInitialOnLoad=true
    }
    else{
        var bPegaIacInitialOnLoad=false
    }
    
}
catch(e){
    var bPegaIacInitialOnLoad=true
}
if(typeof (bEncryptURLs)=="undefined"){
    var bEncryptURLs=true
}
var bPegaIacGadgetsInitialized=false;
if(bPegaIacInitialOnLoad){
    var p_w_eval_1="";
    var p_w_eval_2="";
    var p_w_eval_3="";
    var p_w_eval_4="";
    var p_w_window=null;
    function _initAllPegaObjects(){
        try{
            if(typeof bRecordEvent!="undefined"&&bRecordEvent){
                uwtUserStart=new Date().getTime()
            }
            if(!bPegaIacInitialOnLoad){
                pega.web.mgr._updateGadgets();
                return 
            }
            bPegaIacInitialOnLoad=false;
            if(typeof (bUseOriginalResize)!="undefined"){
                pega.web.mgr._bUseHarnessResizeAPI=false
            }
            pega.web.mgr._initLog();
            pega.web.mgr._logMsg("info","","Manager","Started Pega IAC manager intialization.");
            pega.web.mgr._ut._setCookie("PegaIAC","IACtest",1);
            if(pega.web.mgr._ut._readCookie("PegaIAC")!="IACtest"){
                pega.web.mgr.cookiesDisabled=true;
                pega.web.mgr._logMsg("error","","Manager","error: Browser cookies must be enabled for Pega IAC to function.");
                pega.web.mgr._initGadgets(window);
                return 
            }
            else{
                pega.web.mgr._logMsg("info","","Manager","Passed test: client browser cookies enabled.");
                pega.web.mgr._ut._setCookie("PegaIAC","",0)
            }
            if(typeof pega.ui.property=="function"){
                pega.web.mgr._prop=new pega.ui.property()
            }
            else{
                pega.web.mgr._prop=pega.ui.property
            }
            pega.web.mgr._sPegaCookie=pega.web.mgr._ut._readCookie("JSESSIONID");
			// SOP BEGIN
			// Do not ping in case the Same Origin Policy is not satisfied.
            if(_isPingGatewayRequired()){
                pega.web.mgr._pingGateway()
            }
            else{
                pega.web.mgr._bDirectPRPC=true;
                _completePegaObjectsInit()
            }
            // SOP END
        }
        catch(A){}
    }
	// SOP BEGIN
    function _isPingGatewayRequired(){
        try{
            var D=document.URL;
            var I=pega.web.config.gatewayURL;
            if(I.search("http://")==-1&&I.search("https://")==-1){
                return true
            }
            var H=D.split("://");
            var B=I.split("://");
            if(H.length>1&&B.length>1){
                if(!(H[0].toLowerCase()===B[0].toLowerCase())){
                    return false
                }
                var G=H[1].split("/");
                var E=B[1].split("/");
                var C=G[0].split(":");
                var A=E[0].split(":");
                if(C.length!=A.length){
                    return false
                }
                else{
                    if(!(C[0].toLowerCase()===A[0].toLowerCase())){
                        return false
                    }
                    else{
                        if(C.length>0&&A.length>0&&!(C[1]===A[1])){
                            return false
                        }
                        
                    }
                    return true
                }
                
            }
            return false
        }
        catch(F){
            return false
        }
        
    }
	// SOP END
    function _completePegaObjectsInit(){
        if(pega.web.mgr._bIsProxy){
            pega.web.mgr._oMgrImpl=oWin.pega.web.mgr;
            pega.web.mgr._oMgrImpl._initGadgets(window)
        }
        else{
            pega.web.mgr._initConfig();
            pega.web.mgr._initGadgets(window)
        }
        bPegaIacGadgetsInitialized=true
    }
    try{
        pega.t=pega.namespace("pega.tools");
        pega.web=pega.namespace("pega.web");
        pega.ui=pega.namespace("pega.ui");
        if(typeof (pega.u)!="undefined"&&typeof (pega.u.d)!="undefined"){
            pega.u.d.attachOnload(_initAllPegaObjects,true)
        }
        else{
            pega.util.Event.addListener(window,"load",_initAllPegaObjects,null,false)
        }
        
    }
    catch(e){}pega.web.apiSingleton=function(){};
    pega.web.apiSingleton.prototype={
        doAction:function(B,A){
            var C=pega.web.mgr._getGadgetByID(B);
            if(C==null){
                return 
            }
            return C._doApiAction(A,arguments)
        }
        ,doGatewayAction:function(B,C,A){
            pega.web.mgr._cmdGateway(B,C,A)
        }
        ,removeGadget:function(A){
            pega.web.mgr._removeGadget(A)
        }
        ,addGadget:function(B,A){
            pega.web.mgr._addGadget(B,A)
        }
        ,updateGadgets:function(){
            pega.web.mgr._updateGadgets()
        }
        
    };
    pega.web.manager=function(){
        this._htGadgets=new pega.tools.Hashtable();
        this._htPopups=new pega.tools.Hashtable();
        this._htInitDivs=null;
        this._sPegaCookie="NA_xxx";
        this._iPopupTimerID=-1;
        this._ut=new pega.web.utils();
        this._bDirectPRPC=false;
        this._bIsProxy=false;
        this._oMgrImpl=null;
        this.gatewayURL="";
        this.systemID="";
        this.thread="";
        this.appName="";
        this.cookiesDisabled=false;
        this._logMgr=null;
        this._fLogoffCallback=null;
        this._bUseHarnessResizeAPI=true
    };
    pega.web.manager.prototype={
        _initLog:function(){
            if(typeof (pega.web.logMgr)=="undefined"){
                return 
            }
            this._logMgr=new pega.web.logMgr();
            this._logMgr._logInit();
            this._logMsg=this._logMgr._logMsg
        }
        ,_logMsg:function(D,C,A,B){},_initConfig:function(){
            try{
                var B=pega.web.config.thread;
                var C=pega.web.config.gatewayURL;
                if(this._bDirectPRPC){
                    var A=C.search(RegExp("!"));
                    if(A>-1){
                        pega.web.config.gatewayURL=C.substr(0,A);
                        if(B==""){
                            pega.web.config.thread=C.substring(A)
                        }
                        
                    }
                    
                }
                if(!pega.web.config.encrypt){
                    bEncryptURLs=false
                }
                else{
                    bEncryptURLs=true
                }
                
            }
            catch(D){}
        }
        ,_resizeCallback:function(A){
            try{
                var B=pega.web.mgr._getGadgetByID(A);
                if(B!=null){
                    B._resizeCallback()
                }
                this._oFrame.contentWindow.pega.ui.d.avoidedScrollBars=false
            }
            catch(C){}
        }
        ,_addGadget:function(D,B){
            try{
                var C=D;
                if(typeof (D)=="string"){
                    var A=B.document;
                    C=A.getElementById(D)
                }
                this._initGadget(C,B);
                this._logMsg("info",C.attributes.PegaGadget.nodeValue,"Manager","Gadget added for DIV "+C.id)
            }
            catch(E){}
        }
        ,_removeGadget:function(A){
            try{
                var D=pega.web.mgr._getGadgetByID(A);
                if(D!=null){
                    var E=this._htGadgets.keys();
                    for(var C=0;
                    C<E.length;
                    ++C){
                        var G=this._htGadgets.get(E[C]);
                        if(G._id==A){
                            var B=G._oDiv;
                            B.innerHTML="";
                            this._htGadgets.remove(G._id);
                            this._logMsg("info",D._id,"Manager","Gadget removed")
                        }
                        
                    }
                    
                }
                
            }
            catch(F){}
        }
        ,_initGadget:function(C,B){
            if(C==null){
                return 
            }
            if(typeof (C.attributes.PegaGadget)=="undefined"){
                return 
            }
            if(this.cookiesDisabled){
                var D=B.document.createElement("div");
                D.innerHTML=pega.web.config.cookiesDisabled;
                C.appendChild(D);
                return 
            }
            var A=C.attributes.PegaGadget.nodeValue;
            this._logMsg("info",A,"Manager","start gadget '"+A+"' initialization");
            if(this._htGadgets.containsKey(A)){
                this._logMsg("error","","Manager","error: duplicate PegaGadget attribute '"+A+"' for DIV '"+C.attributes.id.nodeValue+"'");
                return 
            }
            try{
                this._htGadgets.put(A,new pega.web.gadget(C,B));
                this._logMsg("info",A,"Manager","completed gadget '"+A+"' initialization")
            }
            catch(E){}
        }
        ,_initGadgets:function(H){
            p_w_window=H;
            var I=H.document;
            var C=I.body.getElementsByTagName("DIV");
            var D=new pega.tools.Hashtable();
            for(B=0;
            B<C.length;
            ++B){
                var E=C[B];
                if(typeof (E.attributes.PegaGadget)!="undefined"){
                    var F=E.attributes.PegaGadget.nodeValue;
                    try{
                        var A=this._htGadgets.get(F);
                        if(A!=null&&A._oWin==H){
                            continue
                        }
                        
                    }
                    catch(G){}this._initGadget(E,p_w_window);
                    D.put(F,F)
                }
                
            }
            var J=D.keys();
            for(var B=0;
            B<J.length;
            ++B){
                var A=this._htGadgets.get(J[B]);
                if(A._oDivAttrs.action!=""){
                    if(A._oDivAttrs.defer=="false"){
                        A._doAttrAction()
                    }
                    
                }
                
            }
            D=null
        }
        ,doAction:function(){
            var D=arguments;
            var C=D[0];
            var E=null;
            if(typeof (C)=="string"){
                var B=C;
                if(this._htPopups.containsKey(C)){
                    B=this._htPopups.get(C)
                }
                if(this._htGadgets.containsKey(B)){
                    E=this._htGadgets.get(B)
                }
                
            }
            else{
                if(typeof (C)=="object"){
                    E=this._getGadgetFromDiv(C)
                }
                
            }
            if(E==null){
                return 
            }
            var A=D[1];
            return E._doGdtAction(A,D)
        }
        ,_cmdGateway:function(E,D,A){
            try{
                var B={
                    success:this._cmdGatewayCallback,failure:this._cmdGatewayCallback
                };
                switch(E.toLowerCase()){
                    case"logoff":pega.util.Connect.asyncRequest("Post",pega.web.config.gatewayURL,B,"pyActivity=PRGatewayLogoff");
                    pega.web.mgr._logMsg("info","","Manager","Sent Logoff command to gateway.");
                    this._fLogoffCallback=A;
                    break
                }
                
            }
            catch(C){}
        }
        ,_getDocGatewayCookie:function(){
            try{
                var B=null;
                var C=window.document.cookie.split("; ");
                for(var D=0;
                D<C.length;
                D++){
                    var A=C[D].split("=");
                    if("prGatewaySESSIONID"==A[0]){
                        return A[1].toLowerCase()
                    }
                    else{
                        if("JSESSIONID"==A[0]){
                            B=A[1].toLowerCase()
                        }
                        
                    }
                    
                }
                if(B!=null){
                    return B
                }
                else{
                    return""
                }
                
            }
            catch(E){
                return""
            }
            
        }
        ,_pingGateway:function(){
            try{
                var A={
                    success:this._pingGatewayCallback,failure:this._pingGatewayCallback
                };
                pega.util.Connect.asyncRequest("Post",pega.web.config.gatewayURL,A,"pyActivity=PRGatewayPing&dartmouth=true");
                pega.web.mgr._logMsg("info","","Manager","Pinged gateway to find gateway session cookie")
            }
            catch(B){}
        }
        ,_cmdGatewayCallback:function(D){
            try{
                var B=D.responseText;
                var A=B=="LOGOFF";
                if(pega.web.mgr._fLogoffCallback!=null){
                    pega.web.mgr._fLogoffCallback(A)
                }
                pega.web.mgr._logMsg("info","","Gateway","Completed logoff command.")
            }
            catch(C){}
        }
        ,_pingGatewayCallback:function(B){
            try{
                var C=pega.web.mgr._getDocGatewayCookie();
                if(C!=""){
                    pega.web.mgr._sPegaCookie=C
                }
                var A=B.getAllResponseHeaders;
                var I=A.indexOf("prGatewaySESSIONID=");
                if(I>=0){
                    var G=A.indexOf("=",I+1)+1;
                    var D=A.indexOf(";",G);
                    pega.web.mgr._sPegaCookie=(D>0)?A.substring(G,D):A.substr(G);
                    pega.web.mgr._logMsg("info","","Manager","Gateway is present in configuration. Found session cookie.")
                }
                else{
                    if(A.indexOf("prGateway:")>-1){
                        var H=B.getResponseHeader.prGateway;
                        var E=H.length;
                        if(H.charCodeAt(E-1)=="13"){
                            H=H.substring(0,E-1)
                        }
                        pega.web.mgr._sPegaCookie=H
                    }
                    else{
                        if(A.indexOf("Prgateway:")>-1){
                            var H=B.getResponseHeader.Prgateway;
                            var E=H.length;
                            if(H.charCodeAt(E-1)=="13"){
                                H=H.substring(0,E-1)
                            }
                            pega.web.mgr._sPegaCookie=H
                        }
                        else{
                            pega.web.mgr._bDirectPRPC=true;
                            if(pega.web.mgr._sPegaCookie=="NA_xxx"){
                                pega.web.mgr._logMsg("error","","Manager","error: did not find JSESSION to use as the default session cookie.");
                                return 
                            }
                            pega.web.mgr._logMsg("info","","Manager","Gateway is not present in configuration. Use JSESSION for session cookie.")
                        }
                        
                    }
                    
                }
                
            }
            catch(F){}_completePegaObjectsInit()
        }
        ,getCookie:function(){
            if(this._sPegaCookie=="NA_xxx"){
                this._sPegaCookie=this._getDocGatewayCookie()
            }
            return this._sPegaCookie
        }
        ,_getGadgetByID:function(A){
            if(this._htGadgets.containsKey(A)){
                return this._htGadgets.get(A)
            }
            else{
                return null
            }
            
        }
        ,_getGadgetFromDiv:function(B){
            if(B==null){
                return 
            }
            if(typeof (B.attributes.PegaGadget)=="undefined"){
                return null
            }
            var A=B.attributes.PegaGadget.nodeValue;
            var C=pega.web.mgr._htGadgets.get(A);
            if(typeof (C)=="undefined"){
                this._logMsg("error",A,"Manager","Gadget not found.");
                return null
            }
            return C
        }
        ,_updateGadgets:function(){
            if(!bPegaIacGadgetsInitialized){
                return 
            }
            try{
                this._logMsg("info","","Manager","Start re-synchronizing gadgets.");
                var D=this._htGadgets.keys();
                for(var C=0;
                C<D.length;
                ++C){
                    var G=this._htGadgets.get(D[C]);
                    if(G._oDiv.parentNode==null){
                        this._logMsg("info",G._id,"Manager","Removing gadget no longer valid or present in the document.");
                        this._removeGadget(G._id)
                    }
                    else{
                        if(G._oDiv.attributes.PegaGadget.nodeValue==""){
                            this._logMsg("info",G._id,"Manager","Removing gadget with missing 'PegaGadget' attribute.");
                            this._removeGadget(G._id)
                        }
                        
                    }
                    
                }
                var E=window.document.getElementsByTagName("DIV");
                for(var C=0;
                C<E.length;
                ++C){
                    var B=E[C];
                    if(typeof (B.attributes.PegaGadget)!="undefined"){
                        var A=B.attributes.PegaGadget.nodeValue;
                        if(!this._htGadgets.containsKey(A)){
                            this._logMsg("info",A,"Manager","Found new gadget.");
                            this._initGadget(B,window)
                        }
                        
                    }
                    
                }
                this._logMsg("info","","Manager","Done re-synchronizing gadgets.")
            }
            catch(F){}
        }
        ,_iPopupTracker:function(){
            var C=this._htPopups.keys();
            for(var B=0;
            B<C.length;
            ++B){
                var A=this._htPopups.get(C[B]);
                var E=this._htGadgets.get(A);
                if(E==null){
                    return 
                }
                try{
                    if(E._oPopWin.closed){
                        this._htPopups.remove(C[B]);
                        if(C.length==1){
                            window.clearInterval(this._iPopupTimerID);
                            this._iPopupTimerID=-1
                        }
                        E._doGdtAction("closed","")
                    }
                    
                }
                catch(D){}
            }
            
        }
        
    };
    pega.web.gadget=function(B,A){
        this._id;
        this._oApiAction={
            action:"",activityQuery:""
        };
        this._oActRefresh={
            action:"refresh",activityQuery:"",baseURI:""
        };
        this._oGdtActions=null;
        this._oConfigDefs={
            gatewayURL:"",appName:"",systemID:"",thread:""
        };
        this._oConfigDyno={
            appName:"",systemID:"",thread:""
        };
        this._oDivAttrs={
            action:"",activityQuery:"",params:{},targetType:"_self",popupOptions:"",defer:"false"
        };
        this._oDivProps=null;
        this._oEvents={
            onBeforeLoad:"",onLoad:"",onConfirm:"",onCustom:"",onPageData:"",onClose:"",onError:"",onDomReady:"",onResize:""
        };
        this._bMaxIframeSize=true;
        this._bFillSpace=false;
        this._scrollWidth=25;
        this._divOffsetWidth=null;
        this._divOffsetHeight=null;
        this._htInsElements=null;
        this._htCamelCaseMap=null;
        this._oFrame=null;
        this._iFrPrevHt=0;
        this._oPopWin=null;
        this._oWin=A;
        this._oDoc=A.document;
        this._oDiv=this._init(B);
        this._sErrNum="";
        this._sErrDescr="";
        this._bLoaded=false;
        this._bAddedOnLoadListener=false;
        this._oActionModel={
            action:"",actionMapping:"",target:{
                type:"_self",name:""
            }
            ,params:{},activityQuery:"",pageURL:"",popup:{
                options:"",gadgetReference:""
            }
            
        }
        
    };
    pega.web.gadget.prototype={
        _init:function(A){
            this._camelCaseMapBuild();
            this._oDiv=A;
            this._id=A.attributes.PegaGadget.nodeValue;
            this._getProps();
            return A
        }
        ,_doApiAction:function(A,B){
            if(!this._validatePageAPI(A)){
                pega.web.mgr._logMsg("error",this._id,"Page API","error: IAC does not support Page API action: "+A);
                return 
            }
            pega.web.mgr._logMsg("action",this._id,"Page API","action '"+A+"'");
            switch(A.toLowerCase()){
                case"getgadgetinfo":return this._getGadgetInfo();
                case"getgadgetdata":return this._getGadgetData(B[2]);
                case"setgadgetdata":return this._setGadgetData(B[2],B[3]);
                case"load":if(this._oDivAttrs.action!=""){
                    return this._doAttrAction()
                }
                return ;
                case"logoff":break;
                case"refresh":break;
                case"reload":break;
                case"restretch":this._restretchGadgetDiv();
                return ;
                case"getuidoc":return this._detUIDoc();
                case"print":this._oFrame.contentWindow.focus();
                this._oFrame.contentWindow.print();
                return ;
                case"blank":this._oFrame.src="about:blank";
                return 
            }
            var C=pega.web.mgr._ut._clone(this._oApiAction);
            C.action=A;
            this._buildActionParams(C,B);
            this._navigateGadgetFrame(C)
        }
        ,_doAttrAction:function(){
            var oAct=pega.web.mgr._ut._clone(this._oDivAttrs);
            this._objectRefBind(oAct);
            try{
                if(oAct.action.toLowerCase()=="openworkbyurl"){
                    var oArgPars={};
                    p_w_eval_1=oArgPars;
                    var oURL=SafeURL_createFromURL(oAct.params.query);
                    for(var i in oAct.params){
                        if(i!="query"){
                            oURL.put(i,eval("oAct.params."+i))
                        }
                        
                    }
                    for(var i in oURL.hashtable){
                        var sV=oURL.get(i);
                        p_w_eval_2=sV;
                        eval("p_w_eval_1."+i+"=p_w_eval_2")
                    }
                    oAct.params=oArgPars
                }
                
            }
            catch(e){}switch(oAct.targetType){
                case"_self":this._navigateGadgetFrame(oAct);
                break;
                case"_popup":this._navigateSelfPopup(oAct);
                break
            }
            
        }
        ,_restretchGadgetDiv:function(){
            try{
                if(this._oFrame==null){
                    return 
                }
                this._resizeGadgetIframe()
            }
            catch(A){}
        }
        ,_resizeGadgetDiv:function(){
            var A=window.event.srcElement;
            var B=pega.web.mgr._getGadgetFromDiv(window.event.srcElement);
            if(B!=null&&B._oFrame!=null&&B._oFrame.src!=""){}
        }
        ,_resizeCallback:function(){
            try{
                var J=this._oFrame.contentWindow.pega.ui.d.getDocumentHeight();
                var H=this._oFrame.style.width;
                var E=this._oFrame.style.height;
                if(H=="auto"||H==""||typeof this._divOffsetWidth!="number"||this._divOffsetWidth==0){
                    this._divOffsetWidth=this._oDiv.offsetWidth
                }
                if(E=="auto"||E==""||typeof this._divOffsetHeight!="number"){
                    this._divOffsetHeight=this._oDiv.offsetHeight
                }
                if(this._bFillSpace&&!document.all&&!(pega&&pega.u&&pega.u.d&&pega.u.d.isPortal())){
                    this._oDiv.style.display="table"
                }
                var M=new pega.util.Element(this._oDiv);
                var C=false;
                var S=parseInt(M.getStyle("padding-top"));
                S=isNaN(S)?0:S;
                var I=parseInt(M.getStyle("padding-bottom"));
                I=isNaN(I)?0:I;
                var N=parseInt(M.getStyle("border-top-width"));
                N=isNaN(N)?0:N;
                var G=parseInt(M.getStyle("border-bottom-width"));
                G=isNaN(G)?0:G;
                var O=(pega.util.Event.isIE)?10:0;
                var F=S+I+N+G;
                var Q=this._divOffsetHeight-F;
                if(this._bFillSpace&&J<=Q-O){
                    C=true;
                    J=Q
                }
                if(C){
                    this._oFrame.height="100%";
                    this._oFrame.style.height="100%";
                    this._oFrame.contentWindow.document.body.style.overflowY="visible"
                }
                else{
                    this._oFrame.height=J;
                    this._oFrame.style.height=(J+"px");
                    this._oFrame.contentWindow.document.body.style.overflowY="auto"
                }
                var L=-1;
                try{
                    L=this._oFrame.contentWindow.pega.ui.d.getDocumentWidth()
                }
                catch(R){}if(L!=-1){
                    var P=false;
                    var V=parseInt(M.getStyle("padding-left"));
                    V=isNaN(V)?0:V;
                    var A=parseInt(M.getStyle("padding-right"));
                    A=isNaN(A)?0:A;
                    var B=parseInt(M.getStyle("border-left-width"));
                    B=isNaN(B)?0:B;
                    var D=parseInt(M.getStyle("border-right-width"));
                    D=isNaN(D)?0:D;
                    var U=V+A+B+D;
                    var T=this._divOffsetWidth-U;
                    if(L<=T-O||this._divOffsetWidth<this._oDiv.offsetWidth){
                        P=true;
                        L=T
                    }
                    if(P){
                        this._oFrame.width="100%";
                        this._oFrame.style.width="100%";
                        this._oFrame.contentWindow.document.body.style.overflowX="hidden"
                    }
                    else{
                        this._oFrame.width=L;
                        this._oFrame.style.width=(L+"px");
                        this._oFrame.contentWindow.document.body.style.overflowX="auto"
                    }
                    
                }
                this._oFrame.style.visibility="visible";
                if(this._oEvents.onResize!=""){
                    this._handleTimedEvent(this._oEvents.onResize)
                }
                for(var K=this._getContainerGadget();
                K!=null;
                K=K._getContainerGadget()){
                    var J=K._oFrame.contentWindow.pega.ui.d.getDocumentHeight();
                    K._oFrame.height=J;
                    var L=-1;
                    try{
                        L=K._oFrame.contentWindow.pega.ui.d.getDocumentWidth()
                    }
                    catch(R){}if(L!=-1){
                        K._oFrame.width=L
                    }
                    
                }
                
            }
            catch(R){}
        }
        ,_resizeGadgetIframe:function(){
            if(pega.web.mgr._bUseHarnessResizeAPI){
                this._resizeCallback()
            }
            return ;
            try{
                if(!this._bMaxIframeSize){
                    return 
                }
                var B=this._oFrame.contentWindow;
                if(B==null){
                    return null
                }
                var C=B.document;
                var D=C.body;
                if(D==null){
                    return 
                }
                var K=this._oFrame;
                var E=C.getElementById("HARNESS_CONTENT");
                if(E==null){
                    for(var J=0;
                    J<D.childNodes.length;
                    ++J){
                        var O=D.childNodes[J];
                        if(O.tagName=="FRAME"){
                            if(O.contentWindow==null){
                                continue
                            }
                            C=O.contentWindow.document;
                            D=C.body;
                            E=C.getElementById("HARNESS_CONTENT");
                            if(E!=null){
                                break
                            }
                            
                        }
                        
                    }
                    
                }
                var M=C.getElementById("HARNESS_BUTTONS");
                var G=(M==null)?0:M.offsetHeight;
                if((pega.util.Event.isIE!=null)&&(pega.util.Event.isIE[0]=="MSIE")){
                    var H=(E==null)?0:E.scrollHeight;
                    var A=C.body.offsetWidth;
                    var L=this._oDiv.offsetWidth
                }
                else{
                    var H=(E==null)?0:E.scrollHeight;
                    var A=C.body.clientWidth;
                    var L=this._oDiv.clientWidth
                }
                if(H+G==0){
                    var F=D.scrollHeight
                }
                else{
                    var F=H+G
                }
                if(F<100){
                    F=100
                }
                if((F>this._iFrPrevHt)||((this._iFrPrevHt-F)>150)){
                    this._oFrame.height=F
                }
                this._iFrPrevHt=F;
                if(E!=null){
                    if(A>L){
                        this._oFrame.width=L
                    }
                    if(E.offsetWidth>5000||E.offsetWidth<225){
                        K.style.pixelWidth=window.document.body.clientWidth-30;
                        K.width="100%"
                    }
                    E.style.overflow="hidden";
                    if(typeof (E.parentElement)!="undefined"){
                        E.parentElement.style.overflow="hidden";
                        if(typeof (E.parentElement)!="undefined"){
                            E.parentElement.parentElement.style.overflow="hidden"
                        }
                        
                    }
                    
                }
                D.style.overflow="hidden";
                var I=this._getContainerGadget();
                if(I!=null){
                    I._resizeGadgetIframe()
                }
                
            }
            catch(N){}
        }
        ,_getContainerGadget:function(){
            try{
                var F=this._oFrame.contentWindow;
                if(F==null){
                    return null
                }
                var E=F.parent;
                var D=E.frameElement;
                if(D==null){
                    return null
                }
                if(typeof (D.PegaWebGadget)=="undefined"){
                    return null
                }
                var A=typeof (D.parentElement)!="undefined"?D.parentElement.attributes.PegaGadget.nodeValue:D.parentNode.attributes.PegaGadget.nodeValue;
                var B=pega.web.mgr._getGadgetByID(A);
                return B
            }
            catch(C){
                return null
            }
            
        }
        ,_windowResizeCallback:function(){
            this.resizeCallbackPooled=false;
            this._oFrame.style.height=this._oFrame.style.width="auto";
            this._oFrame.style.visibility="hidden";
            var A=this;
            setTimeout(function(){
                var B=A._id;
                pega.web.mgr._resizeCallback(B)
            }
            ,0)
        }
        ,_poolResizeCallback:function(){
            if(this.resizeCallbackPooled){
                clearTimeout(this.resizeCallbackPooled)
            }
            var A=this;
            this.resizeCallbackPooled=setTimeout(function(){
                A._windowResizeCallback()
            }
            ,100)
        }
        ,_doGdtAction:function(P,N){
            if(!this._validateGadgetAPI(P)){
                pega.web.mgr._logMsg("error",this._id,"Gadget API","error: IAC does not support Gadget API action: "+P);
                return 
            }
            pega.web.mgr._logMsg("action",this._id,"Gadget API","action '"+P+"'");
            var A="";
            switch(P){
                case"loaded":if((pega&&pega.u&&pega.u.d&&pega.u.d.isPortal())){
                    var J=this;
                    pega.util.Event.addListener(window,"resize",function(){
                        J._poolResizeCallback()
                    })
                }
                try{
                    if(pega.web.mgr._bUseHarnessResizeAPI&&this._bMaxIframeSize){
                        var B=this._oFrame.contentWindow.pega.ui.d.registerResize;
                        if(this._bFillSpace){
                            this._oFrame.contentWindow.pega.ui.d.stretchHarness=true
                        }
                        B(new Function("var sId = '"+this._id+"';pega.web.mgr._resizeCallback(sId);"));
                        if(pega.ui.d){
                            B=pega.ui.d.registerResize;
                            B(new Function("var sId = '"+this._id+"';pega.web.mgr._resizeCallback(sId);"))
                        }
                        
                    }
                    
                }
                catch(M){}var Q=this._oFrame.contentWindow.document;
                this._htInsElements=new pega.tools.Hashtable();
                if(Q){
                    var D=Q?Q.getElementsByTagName("INS"):null;
                    for(E=0;
                    E<D.length;
                    ++E){
                        var F=D[E];
                        if(typeof (F.dataBindName)!="undefined"){
                            this._htInsElements.put(F.dataBindName,F)
                        }
                        
                    }
                    var L=Q.getElementsByTagName("iframe");
                    for(var E=0;
                    E<L.length;
                    ++E){
                        var I=L[E];
                        if(L[E].name=="actionIFrame"){
                            Q=L[E].contentWindow.document;
                            if(Q){
                                D=Q?Q.getElementsByTagName("INS"):null;
                                for(j=0;
                                j<D.length;
                                ++j){
                                    var F=D[j];
                                    if(typeof (F.dataBindName)!="undefined"){
                                        this._htInsElements.put(F.dataBindName,F)
                                    }
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                }
                this._bLoaded=true;
                A="onLoad";
                this._doEvent(A);
                break;
                case"confirm":A="onConfirm";
                this._doEvent(A);
                break;
                case"closed":A="onClose";
                this._doEvent(A);
                break;
                case"custom":A="onCustom";
                this._doEvent(A,N[2]);
                break;
                case"error":this._sErrNum=(typeof (N[2])!="undefined")?N[2]:"";
                this._sErrDescr=(typeof (N[3])!="undefined")?N[3]:"";
                pega.web.mgr._logMsg("error",this._id,"Manager","event 'error': number='"+this._sErrNum+"', description='"+this._sErrDescr+"'");
                A="onError";
                this._doEvent(A);
                break;
                case"resize":this._resizeGadgetIframe();
                return ;
                case"blank":this._oFrame.src="about:blank";
                return 
            }
            var K=this._getActionDefs(P);
            if(K==null){
                if(A!=""){
                    return 
                }
                var O=pega.web.mgr._ut._clone(this._oActionModel);
                O.action=P;
                this._buildActionParams(O,N);
                this._objectRefBind(O);
                this._navigateGadgetFrame(O);
                return 
            }
            for(var E=0;
            E<K.length;
            ++E){
                var O=K[E];
                O=pega.web.mgr._ut._clone(O);
                if(typeof (O.actionMapping)!="undefined"&&O.actionMapping!=""){
                    if(!this._validateGadgetAPI(O.actionMapping)){
                        pega.web.mgr._logMsg("error",this._id,"Gadget API","error: IAC does not support actionDefinitions.actionMapping: "+O.actionMapping);
                        continue
                    }
                    pega.web.mgr._logMsg("info",this._id,"Manager","mapping action '"+O.action+"' into action '"+O.actionMapping+"'");
                    O.action=O.actionMapping
                }
                this._buildActionParams(O,N);
                this._objectRefBind(O);
                var H=null;
                if(typeof (O.target)=="undefined"){
                    O.target={}
                }
                if(typeof (O.target.type)=="undefined"){
                    O.target.type="_self"
                }
                if(O.target.type=="_self"||O.target.type==""){
                    O.target.type="_gadget";
                    H=this
                }
                switch(O.target.type){
                    case"_gadget":if(H==null){
                        H=pega.web.mgr._htGadgets.get(O.target.name)
                    }
                    if(typeof (H)=="undefined"||H==null){
                        continue
                    }
                    if(O.action=="print"&&H._oFrame!=null){
                        H._oFrame.contentWindow.focus();
                        H._oFrame.contentWindow.print();
                        continue
                    }
                    if(O.action=="load"){
                        if(H._oDivAttrs.action!=""){
                            H._doAttrAction();
                            continue
                        }
                        
                    }
                    var C=this._oConfigDyno;
                    var G=H._oConfigDyno;
                    if(C.systemID!=""){
                        G.systemID=C.systemID;
                        C.systemID=""
                    }
                    if(C.appName!=""){
                        G.appName=C.appName;
                        C.appName=""
                    }
                    if(C.thread!=""){
                        G.thread=C.thread;
                        C.thread=""
                    }
                    pega.web.mgr._logMsg("info",this._id,"Manager","target gadget '"+H._id+"'");
                    H._navigateGadgetFrame(O);
                    break;
                    case"_popup":case"_top":pega.web.mgr._logMsg("info",this._id,"Manager","target is '"+O.target.type+"'");
                    this._navigateTopPopup(O);
                    break;
                    case"_page":pega.web.mgr._logMsg("info",this._id,"Manager","target page '"+O.pageURL+"'");
                    this._navigatePortalPage(O);
                    break
                }
                
            }
            
        }
        ,_buildActionParams:function(oAct,args){
            var oArgPars={};
            var oParObj=null;
            var oConfObj=null;
            sAction=oAct.action;
            switch(sAction.toLowerCase()){
                case"openwizard":oArgPars.className=args[2].className;
                oArgPars.action=args[1];
                var tempQuery=args[2].sQuery,keyValueArray=null;
                var queryStringArray=tempQuery.split("&");
                for(num in queryStringArray){
                    keyValueArray=queryStringArray[num].split("=");
                    oArgPars[keyValueArray[0]]=keyValueArray[1]
                }
                break;
                case"getgadgetdata":oArgPars=args[2];
                break;
                case"display":if(typeof (args[2])!="undefined"){
                    oArgPars.harnessName=args[2]
                }
                if(typeof (args[3])!="undefined"){
                    oArgPars.className=args[3]
                }
                if(typeof (args[4])!="undefined"){
                    oArgPars.pzPrimaryPageName=args[4]
                }
                if(typeof (args[5])!="undefined"){
                    oArgPars.readOnly=args[5]
                }
                if(typeof (args[6])!="undefined"){
                    oArgPars.model=args[6]
                }
                oParObj=args[7];
                oConfObj=args[8];
                if(typeof (args[9])!="undefined"){
                    oArgPars.preActivity=args[9]
                }
                if(typeof (args[10])!="undefined"){
                    oArgPars.preActivityParams=args[10]
                }
                if(typeof (args[11])!="undefined"){
                    oArgPars.key=args[11]
                }
                if(typeof (args[12])!="undefined"){
                    oArgPars.readOnly=args[12]
                }
                if(typeof (args[14])!="undefined"){
                    oArgPars.pyActivity=args[14]
                }
                if(typeof (args[15])!="undefined"){
                    oArgPars.pyPreActivity=args[15]
                }
                if(typeof (args[16])!="undefined"){
                    oArgPars.pzPrimaryPage=args[16]
                }
                if(typeof (args[17])!="undefined"){
                    oArgPars.pzPrimaryPageName=args[17]
                }
                break;
                case"openlanding":if(typeof (args[2])!="undefined"){
                    oArgPars.harnessName=args[2]
                }
                if(typeof (args[3])!="undefined"){
                    oArgPars.className=args[3]
                }
                if(typeof (args[4])!="undefined"){
                    oArgPars.pzPrimaryPageName=args[4]
                }
                if(typeof (args[5])!="undefined"){
                    oArgPars.readOnly=args[5]
                }
                if(typeof (args[6])!="undefined"){
                    oArgPars.model=args[6]
                }
                if(typeof (args[7])!="undefined"){
                    oArgPars.action=args[7]
                }
                if(typeof (args[8])!="undefined"){
                    oArgPars.levelA=args[8]
                }
                if(typeof (args[9])!="undefined"){
                    oArgPars.levelB=args[9]
                }
                if(typeof (args[10])!="undefined"){
                    oArgPars.levelC=args[10]
                }
                oParObj=args[11];
                oConfObj=args[12];
                if(typeof (args[13])!="undefined"){
                    for(var i in args[13]){
                        oArgPars[i]=args[13][i]
                    }
                    
                }
                if(typeof (args[14])!="undefined"){
                    oArgPars.flowName=args[14]
                }
                break;
                case"openworkbyhandle":if(typeof (args[2])!="undefined"){
                    oArgPars.key=args[2]
                }
                oParObj=args[3];
                oConfObj=args[4];
                break;
                case"openassignment":if(typeof (args[2])!="undefined"){
                    oArgPars.key=args[2]
                }
                oParObj=args[3];
                oConfObj=args[4];
                break;
                case"createnewwork":if(typeof (args[2])!="undefined"){
                    oArgPars.className=args[2]
                }
                if(typeof (args[3])!="undefined"){
                    oArgPars.flowName=args[3]
                }
                oParObj=args[4];
                oConfObj=args[5];
                if(typeof (args[6])!="undefined"){
                    for(var i in args[6]){
                        oArgPars[i]=args[6][i]
                    }
                    
                }
                break;
                case"openworkitem":if(typeof (args[2])!="undefined"){
                    oArgPars.workID=args[2]
                }
                oParObj=args[3];
                oConfObj=args[4];
                break;
                case"logoff":if(typeof (args[2])!="undefined"){
                    oArgPars.harnessName=args[2]
                }
                if(typeof (args[3])!="undefined"){
                    oArgPars.className=args[3]
                }
                oParObj=args[4];
                oConfObj=args[5];
                break;
                case"openworkbyurl":if(typeof (args[2])!="undefined"){
                    p_w_eval_1=oArgPars;
                    var oURL=SafeURL_createFromURL(args[2]);
                    for(var i in oURL.hashtable){
                        var sV=oURL.get(i);
                        p_w_eval_2=sV;
                        eval("p_w_eval_1."+i+"=p_w_eval_2")
                    }
                    
                }
                oParObj=args[3];
                oConfObj=args[4];
                break;
                case"getnextworkitem":pega.web.mgr._logMsg("action",this._id,"Manager","Translating action '"+sAction+"' into action 'getNextWork'");
                sAction="getNextWork";
                oAct.action="getNextWork";
                case"getnextwork":oParObj=args[2];
                oConfObj=args[3];
                break;
                case"print":return 
            }
            if(typeof (oParObj)!="undefined"){
                try{
                    if(typeof (oParObj)=="string"){
                        eval("oParObj="+oParObj)
                    }
                    
                }
                catch(e){
                    pega.web.mgr._logMsg("error",this._id,"Manager","error: invalid Javascript object literal syntax in parameter 'paramObject' value "+oParObj)
                }
                p_w_eval_1=oArgPars;
                for(var i in oParObj){
                    p_w_eval_2=oParObj[i];
                    eval("p_w_eval_1."+i+"=p_w_eval_2")
                }
                
            }
            var oCfAct={};
            if(typeof (oAct.params)!="undefined"){
                try{
                    p_w_eval_1=oArgPars;
                    for(var i in oAct.params){
                        p_w_eval_2=oAct.params[i];
                        if(typeof (p_w_eval_2)=="object"){
                            if(typeof (p_w_eval_2.systemID)=="string"){
                                oCfAct.systemID=p_w_eval_2.systemID
                            }
                            if(typeof (p_w_eval_2.appName)=="string"){
                                oCfAct.appName=p_w_eval_2.appName
                            }
                            if(typeof (p_w_eval_2.thread)=="string"){
                                oCfAct.thread=p_w_eval_2.thread
                            }
                            
                        }
                        else{
                            eval("p_w_eval_1."+i+"=p_w_eval_2")
                        }
                        
                    }
                    
                }
                catch(e){
                    pega.web.mgr._logMsg("error",this._id,"Manager","error: invalid Javascript object literal syntax in parameter '"+i+"', value '"+p_w_eval_1)
                }
                
            }
            oAct.params=oArgPars;
            if(typeof (oConfObj)!="undefined"&&oConfObj!=null){
                try{
                    if(typeof (oConfObj)=="string"){
                        eval("oConfObj="+oConfObj)
                    }
                    
                }
                catch(e){
                    pega.web.mgr._logMsg("error",this._id,"Manager","error: invalid Javascript object literal syntax in parameter 'systemObject' value "+oConfObj)
                }
                var oCfDyno=this._oConfigDyno;
                if(typeof (oConfObj.systemID)!="undefined"){
                    oCfDyno.systemID=oConfObj.systemID
                }
                if(typeof (oConfObj.appName)!="undefined"){
                    oCfDyno.appName=oConfObj.appName
                }
                if(typeof (oConfObj.thread)!="undefined"){
                    oCfDyno.thread=oConfObj.thread
                }
                if(typeof (oCfAct.systemID)!="undefined"&&oCfAct.systemID!=""){
                    if(oCfAct.systemID.toLowerCase()=="$inherit"){
                        var sysID=this._oConfigDefs.systemID;
                        if(sysID!=""&&oCfDyno.systemID==""){
                            oCfDyno.systemID=sysID
                        }
                        
                    }
                    else{
                        oCfDyno.systemID=oCfAct.systemID
                    }
                    
                }
                if(typeof (oCfAct.appName)!="undefined"&&oCfAct.appName!=""){
                    if(oCfAct.appName.toLowerCase()=="$inherit"){
                        var sAppName=this._oConfigDefs.appName;
                        if(sAppName!=""&&oCfDyno.appName==""){
                            oCfDyno.appName=sAppName
                        }
                        
                    }
                    else{
                        oCfDyno.appName=oCfAct.appName
                    }
                    
                }
                if(typeof (oCfAct.thread)!="undefined"&&oCfAct.thread!=""){
                    if(oCfAct.thread.toLowerCase()=="$inherit"){
                        var sThread=this._oConfigDefs.thread;
                        if(sThread!=""&&oCfDyno.thread==""){
                            oCfDyno.thread=sThread
                        }
                        
                    }
                    else{
                        oCfDyno.thread=oCfAct.thread
                    }
                    
                }
                
            }
            
        }
        ,_doEvent:function(C,B){
            var A=this._oEvents;
            switch(C){
                case"onBeforeLoad":this._handleTimedEvent(A.onBeforeLoad);
                break;
                case"onLoad":this._handleTimedEvent(A.onLoad);
                break;
                case"onCustom":this._handleTimedEvent(A.onCustom,B);
                break;
                case"onConfirm":this._handleTimedEvent(A.onConfirm);
                break;
                case"onClose":this._handleTimedEvent(A.onClose);
                break;
                case"onDomReady":this._handleTimedEvent(A.onDomReady);
                break;
                case"onError":this._handleTimedError(A.onError);
                break
            }
            
        }
        ,_getActionDefs:function(A){
            if(A==""){
                return null
            }
            var E=null;
            var B=this._oGdtActions;
            for(var C in B){
                var D=B[C];
                if(!this._validateGadgetAPI(D.action)){
                    pega.web.mgr._logMsg("error",this._id,"Gadget API","error: IAC does not support actionDefinitions.action: "+D.action);
                    continue
                }
                if(D.action==A){
                    if(E==null){
                        E=new Array()
                    }
                    E[E.length]=D
                }
                
            }
            return E
        }
        ,_navigateGadgetFrame:function(J){
            if(this._oFrame==null){
                this._setIFrame()
            }
            var A=this._oEvents.onBeforeLoad;
            if(!this._invokeEvent(A)){
                return true
            }
            if(J.action=="refresh"){
                var P=this._oActRefresh;
                if(this._oFrame!=null&&this._oFrame.src!=""&&P.activityQuery!=""){
                    var C=this._queryDataBind(P.activityQuery);
                    var H=SafeURL_createFromURL(P.baseURI+C);
                    var E=H.toURL()
                }
                
            }
            else{
                if(J.action=="reload"){
                    var H="";
                    var N=this._oFrame.contentWindow.document;
                    var Q=N.getElementById("PEGA_HARNESS");
                    var M=false;
                    if(Q==null){
                        M=true;
                        Q=this._oFrame.contentWindow.frames[0].document.getElementById("PEGA_HARNESS")
                    }
                    var G=Q.getElementsByTagName("form");
                    if(!G||G.length==0){
                        return false
                    }
                    var B=G[0];
                    var I="";
                    if(M){
                        I=this._oFrame.contentWindow.frames[0].strHarnessPurpose
                    }
                    else{
                        I=this._oFrame.contentWindow.strHarnessPurpose
                    }
                    var D="";
                    if(I==""){
                        var P=this._oActRefresh;
                        if(this._oFrame!=null&&this._oFrame.src!=""&&P.activityQuery!=""){
                            var C=this._queryDataBind(P.activityQuery);
                            H=SafeURL_createFromURL(P.baseURI+C)
                        }
                        
                    }
                    else{
                        var T=B.action;
                        if(T.indexOf("pyactivitypzZZZ=")!=-1){
                            var K=T.substr(0,T.indexOf("pyactivitypzZZZ="));
                            var F=T.lastIndexOf("=");
                            if(F>-1){
                                T=URLObfuscation.decrypt(T.substr(F+1,T.length-(F+2)));
                                T=K+T
                            }
                            
                        }
                        D=T+"&Purpose="+I;
                        H=SafeURL_createFromURL(D)
                    }
                    if(H){
                        if(H.get("pyActivity")&&H.get("pyActivity")=="FinishAssignment"){
                            H.put("pyActivity","Show-Harness")
                        }
                        
                    }
                    var E=H.toURL()
                }
                else{
                    var E=this._finalizeNavURL(J);
                    if(E==""){
                        return 
                    }
                    
                }
                
            }
            if(!pega.util.Event.isIE&&!this._bAddedOnLoadListener){
                pega.util.Event.addListener(this._oFrame,"load",this._onDomReadyFunc,null,this);
                this._bAddedOnLoadListener=true
            }
            pega.web.mgr._logMsg("info",this._id,"Manager",E);
            try{
                this._bLoaded=false;
                if(J.action!="createNewWork"){
                    this._oFrame.src=E
                }
                else{
                    var R='<html><body><script type="text/javascript">var  form=document.createElement("form");form.setAttribute("method","post");form.setAttribute("action","'+this._oActRefresh.baseURI+'?pyActivity=%40baseclass.doUIAction");var input=document.createElement("input");input.setAttribute("name","action");input.setAttribute("type","hidden");input.setAttribute("value","createNewWork");form.appendChild(input);';
                    for(var L in J.params){
                        R+='var input=document.createElement("input");';
                        R+='input.setAttribute("name","'+L+'");';
                        str=J.params[L];
                        R+='input.setAttribute("value","'+str+'");';
                        R+='input.setAttribute("type","hidden");';
                        R+="form.appendChild(input);"
                    }
                    R+="document.body.appendChild(form);form.submit();<\/script></body></html>";
                    var S=this._oFrame.contentDocument;
                    if(S==undefined||S==null){
                        S=this._oFrame.contentWindow.document
                    }
                    S.open();
                    S.write(R);
                    S.close()
                }
                
            }
            catch(O){
                pega.web.mgr._logMsg("error",this._id,"Manager",O.description)
            }
            
        }
        ,_invokeEvent:function(sEvtFunc){
            if(sEvtFunc==""){
                return true
            }
            try{
                p_w_eval_1=sEvtFunc;
                return eval(p_w_eval_1+"('"+this._id+"')")
            }
            catch(e){
                return true
            }
            
        }
        ,_handleTimedEvent:function(sEvtFunc,sToken){
            if(sEvtFunc==""){
                return true
            }
            try{
                var oFuncRef=eval("this._oWin."+sEvtFunc);
                if(typeof (sToken)!="undefined"){
                    pega.web.mgr._logMsg("info",this._id,"Manager","invoking event handler function '"+sEvtFunc+"', with token '"+sToken+"'");
                    oFuncRef(this._id,sToken)
                }
                else{
                    pega.web.mgr._logMsg("info",this._id,"Manager","invoking event handler function '"+sEvtFunc+"'");
                    oFuncRef(this._id)
                }
                
            }
            catch(e){
                return true
            }
            
        }
        ,_handleTimedError:function(sEvtFunc){
            if(sEvtFunc==""){
                return true
            }
            try{
                pega.web.mgr._logMsg("info",this._id,"Manager","invoking event handler function '"+sEvtFunc+"'");
                var oFuncRef=eval("this._oWin."+sEvtFunc);
                oFuncRef(this._id,this._sErrNum,this._sErrDescr);
                this._sErrNum="";
                this._sErrDescr=""
            }
            catch(e){
                return true
            }
            
        }
        ,_navigateSelfPopup:function(C){
            var B=this._finalizeNavURL(C);
            if(B==""){
                return 
            }
            var A="";
            if(typeof (C.PegaPopupOptions)!="undefined"){
                A=C.PegaPopupOptions
            }
            this._launchPopup(this,B,A)
        }
        ,_navigateTopPopup:function(E){
            switch(E.target.type){
                case"_top":var B=this._finalizeNavURL(E);
                if(B==""){
                    return 
                }
                window.location.href=B;
                break;
                case"_popup":var D=null;
                if(typeof (E.popup.gadgetReference)!="undefined"&&E.popup.gadgetReference){
                    D=pega.web.mgr._getGadgetByID(E.popup.gadgetReference)
                }
                else{
                    if(typeof (E.target.name)!="undefined"&&E.target.name!=""){
                        D=pega.web.mgr._getGadgetByID(E.target.name)
                    }
                    
                }
                var F=null;
                var A="";
                if(D==null){
                    D=this;
                    if(typeof (E.popup)!="undefined"&&typeof (E.popup.options)!="undefined"&&E.popup.options!=""){
                        A=E.popup.options
                    }
                    
                }
                else{
                    F=D._getActionDefs(E.action);
                    if(F!=null){
                        var C=F[0];
                        if(typeof (C.popup)=="undefined"||typeof (C.popup.options)=="undefined"||C.popup.options==""){
                            A=C.popup.options
                        }
                        
                    }
                    
                }
                var B=D._finalizeNavURL(E);
                if(B==""){
                    return 
                }
                this._launchPopup(D,B,A);
                break
            }
            
        }
        ,_launchPopup:function(C,B,A){
            if(A=""){
                A="height=600,width=800,status=yes,toolbar=yes,menubar=yes,location=no"
            }
            var D=C._id;
            if(pega.web.mgr._htPopups.containsKey(D)){
                C._oPopWin.close();
                pega.web.mgr._htPopups.remove(D)
            }
            C._oPopWin=window.open(B,D,A);
            pega.web.mgr._htPopups.put(D,C._id);
            if(pega.web.mgr._iPopupTimerID==-1){
                pega.web.mgr._iPopupTimerID=window.setInterval("pega.web.mgr._iPopupTracker()",500)
            }
            
        }
        ,_evalDataFunc:function(sDataFunc,sToken){
            if(sDataFunc==""){
                return true
            }
            try{
                sDataFunc="this._oWin."+sDataFunc+"('"+sToken+"')";
                p_w_eval_1=sDataFunc;
                return eval(p_w_eval_1)
            }
            catch(e){
                return true
            }
            
        }
        ,_getGadgetInfo:function(){
            try{
                var G=this._oConfigDefs.systemID;
                var E=this._oConfigDefs.appName;
                var C=this._oConfigDefs.thread;
                var B=this._oConfigDyno;
                if(B.systemID!=""){
                    G=B.systemID
                }
                if(B.appName!=""){
                    E=B.appName
                }
                if(B.thread!=""){
                    C=B.thread
                }
                var F=this._doApiAction("getuidoc");
                if(F==null){
                    return null
                }
                var A=F.isFormDirty(false);
                return{
                    application:E,thread:C,system:G,UIDoc:F,isDirty:A.toString(),isLoaded:this._bLoaded.toString()
                }
                
            }
            catch(D){
                return true
            }
            
        }
        ,_detUIDoc:function(){
            var F=null;
            try{
                F=this._oFrame.contentWindow.pega.ui.d
            }
            catch(H){
                try{
                    var G=this._oFrame;
                    var I=null;
                    var A=G.contentWindow;
                    if(A==null){
                        return null
                    }
                    var B=A.document;
                    var C=B.body;
                    if(C==null){
                        return null
                    }
                    var D=B.getElementById("HARNESS_CONTENT");
                    if(D==null){
                        for(var E=0;
                        E<C.childNodes.length;
                        ++E){
                            I=C.childNodes[E];
                            if(I.tagName=="FRAME"){
                                if(I.contentWindow==null){
                                    continue
                                }
                                B=I.contentWindow.document;
                                C=B.body;
                                D=B.getElementById("HARNESS_CONTENT");
                                if(D!=null){
                                    break
                                }
                                
                            }
                            
                        }
                        
                    }
                    F=I.contentWindow.window.pega.ui.d
                }
                catch(H){}
            }
            return F
        }
        ,_setGadgetData:function(B,A){
            try{
                var D=this._detUIDoc();
                if(D==null){
                    return false
                }
                D.setProperty(B,A)
            }
            catch(C){
                return false
            }
            
        }
        ,_getGadgetData:function(D){
            var C=this._oFrame.contentWindow.document;
            if(typeof (C.parentWindow)!="undefined"){
                var A=C.parentWindow.strPrimaryPage
            }
            else{
                if(typeof (C.defaultView)!="undefined"){
                    var A=C.defaultView.strPrimaryPage
                }
                else{
                    return""
                }
                
            }
            if(typeof (A)=="undefined"){
                pega.web.mgr._logMsg("info",this._id,"Manager","cannot find workpage name defined by an element inside gadget");
                return 
            }
            var E=pega.web.mgr._prop.toHandle(D,A);
            pega.web.mgr._logMsg("info",this._id,"Manager","converted property reference '"+D+"' into property handle '"+E+"', Workpage '"+A+"'");
            if(this._htInsElements!=null&&this._htInsElements.containsKey(E)){
                var B=this._htInsElements.get(E).innerHTML;
                pega.web.mgr._logMsg("info",this._id,"Manager","resolved gadget data binding to value '"+B+"'");
                return B
            }
            else{
                try{
                    var G=this._detUIDoc();
                    if(G!=null){
                        var B=G.getProperty(D)
                    }
                    pega.web.mgr._logMsg("info",this._id,"Manager","resolved gadget data binding to value '"+B+"'");
                    return B
                }
                catch(F){}pega.web.mgr._logMsg("info",this._id,"Manager","cannot resolve gadget data binding for property '"+E+"'");
                return""
            }
            
        }
        ,_objectRefBind:function(A){
            for(var B in A){
                if(typeof (A[B])!="object"){
                    A[B]=this._dataRefBind(A[B])
                }
                else{
                    this._objectRefBind(A[B])
                }
                
            }
            
        }
        ,_dataRefBind:function(D){
            if(typeof (D)!="string"){
                return D
            }
            if(D.substr(0,1)!="["){
                return D
            }
            var B=D.substr(1,D.length-2).split("/");
            var H="page",A="id",I;
            if(B.length==1){
                H="gadget";
                A="";
                I=B[0]
            }
            else{
                if(B.length==3){
                    H=B[0];
                    A=B[1].toUpperCase();
                    I=B[2]
                }
                
            }
            var C="";
            switch(H){
                case"page":if(A=="ID"||A=="NAME"){
                    var F=this._oDoc.getElementsByName(I);
                    if(F.length==1){
                        C=F[0].value
                    }
                    
                }
                else{
                    if(A=="FUNCTION"){
                        var G=this._oEvents.onPageData;
                        C=(G!="")?this._evalDataFunc(G,I):""
                    }
                    
                }
                break;
                case"gadget":if(A==""){
                    C=this._getGadgetData(I)
                }
                else{
                    var E=pega.web.mgr._htGadgets.get(A);
                    if(E!=null){
                        C=E._getGadgetData(I)
                    }
                    
                }
                break
            }
            return C
        }
        ,_queryDataBind:function(E){
            var F=E.split("=[");
            var C=F[0];
            for(var B=1;
            B<F.length;
            ++B){
                var D=F[B].split("]");
                var A=this._dataRefBind("["+D[0]+"]");
                C+=("="+A+D[1])
            }
            return C
        }
        ,_finalizeQueryURL:function(B){
            var C=B.params;
            var E="",A;
            if(B.action=="openlanding"){
                E="?pyActivity=@baseclass.doUIAction&landingAction="+B.action
            }
            else{
                if(B.action.toLowerCase()!="openworkbyurl"){
                    E="?pyActivity=@baseclass.doUIAction&action="+B.action
                }
                
            }
            for(var D in C){
                A=C[D];
                if(A==""){
                    continue
                }
                E+=("&"+D+"="+A)
            }
            if(B.action.toLowerCase()=="openworkbyurl"&&E.charAt(0)=="&"){
                E="?"+E.substring(1)
            }
            return E
        }
        ,_finalizeNavURL:function(L){
            var J=this._oConfigDefs.gatewayURL;
            if(J==""){
                return""
            }
            if(J.indexOf("/!")!=-1){
                J=J.substring(0,J.indexOf("/!"))
            }
            if(J.indexOf("/",J.length-1)==-1){
                J=J+"/"
            }
            var A=this._oConfigDefs.systemID;
            var H=this._oConfigDefs.appName;
            var B=this._oConfigDefs.thread;
            var D=this._oConfigDyno;
            if(D.systemID!=""){
                A=D.systemID;
                D.systemID=""
            }
            if(D.appName!=""){
                H=D.appName;
                D.appName=""
            }
            if(D.thread!=""){
                B=D.thread;
                D.thread=""
            }
            var K=this._finalizeQueryURL(L);
            L.activityQuery=K;
            var E=K;
            K=this._queryDataBind(K);
            L.activityQuery=K;
            var I=A!=""?(A+"/"):"";
            var C=J+I;
            if(pega&&pega.u&&pega.u.d&&pega.u.d.isPortal()&&applicationName===H&&H!="IWM"){
                C+="!"+B
            }
            else{
                C+="!"+H+"/$"+B
            }
            var F=SafeURL_createFromURL(C+K);
            var G=this._oActRefresh;
            G.activityQuery=E;
            G.baseURI=C;
            if(typeof bRecordEvent!="undefined"&&bRecordEvent){
                F.put("bRecordEvent",true);
                F.put("userStart",uwtUserStart);
                uwtPreSubmit=new Date().getTime();
                F.put("preSubmit",uwtPreSubmit)
            }
            L.sNavURL=F.toURL();
            return L.sNavURL
        }
        ,_navigatePortalPage:function(B){
            var A=this._queryDataBind(B.pageURL);
            pega.web.mgr._logMsg("info",this._id,"Manager","final page URL '"+A+"'");
            window.setTimeout("window.location.href = '"+A+"'",100)
        }
        ,_ifrReadyStateChange:function(A){
            if(this._oFrame.readyState=="complete"){
                this._onDomReadyFunc()
            }
            
        }
        ,_onDomReadyFunc:function(){
            try{
                if(this._oEvents.onDomReady!=""){
                    this._doEvent("onDomReady")
                }
                
            }
            catch(A){}
        }
        ,_calculateViewPortHeight:function(){
            this.viewportheight=1000;
            try{
                if(typeof window.innerWidth!="undefined"){
                    this.viewportheight=window.innerHeight
                }
                else{
                    if(typeof document.documentElement!="undefined"&&typeof document.documentElement.clientWidth!="undefined"&&document.documentElement.clientWidth!=0){
                        this.viewportheight=document.documentElement.clientHeight
                    }
                    else{
                        this.viewportheight=document.getElementsByTagName("body")[0].clientHeight
                    }
                    
                }
                
            }
            catch(A){}
        }
        ,_offsetTop:function(B){
            var C=0;
            while(B){
                C+=B.offsetTop;
                try{
                    B=B.offsetParent
                }
                catch(A){
                    break
                }
                
            }
            return C
        }
        ,_setIFrame:function(){
            var C=this._id+"Ifr";
            var D=this._oDoc.getElementsByName(C);
            if(D.length==0){
                if(pega.util.Event.isIE){
                    var A=this._oDoc.createElement("iframe");
                    A.name=C
                }
                else{
                    var A=this._oDoc.createElement("iframe");
                    A.name=C
                }
                A.id=C;
                A.PegaWebGadget=true;
                A.width="100%";
                A.height="100%";
                if(this._bMaxIframeSize){
                    if((pega&&pega.u&&pega.u.d&&pega.u.d.isPortal())&&this._bFillSpace&&pega.env.ua.gecko){
                        A.style.overflow="auto"
                    }
                    else{
                        A.style.overflow="hidden"
                    }
                    
                }
                else{
                    A.style.overflow="auto"
                }
                A.setAttribute("border","0");
                A.setAttribute("frameBorder","0");
                A.src="about:blank";
                this._oDiv.appendChild(A);
                this._oFrame=A;
                if((pega&&pega.u&&pega.u.d&&pega.u.d.isPortal())||!this._bFillSpace){
                    this._oDiv.style.overflow="hidden"
                }
                if(pega.util.Event.isIE){
                    try{
                        pega.util.Event.addListener(A,"readystatechange",this._ifrReadyStateChange,null,this)
                    }
                    catch(B){}
                }
                
            }
            
        }
        ,_camelCaseMapBuild:function(){
            this._htCamelCaseMap=new pega.tools.Hashtable();
            this._htCamelCaseMap.put("harnessname","harnessName");
            this._htCamelCaseMap.put("readonly","readOnly");
            this._htCamelCaseMap.put("classname","className");
            this._htCamelCaseMap.put("performpreprocessing","performPreProcessing");
            this._htCamelCaseMap.put("pzprimarypagename","pzPrimaryPageName");
            this._htCamelCaseMap.put("workid","workID");
            this._htCamelCaseMap.put("flowname","flowName");
            this._htCamelCaseMap.put("appname","appName")
        }
        ,_fillInConfigDefaults:function(B){
            var A=pega.web.config;
            if(typeof (A.gatewayURL)!="undefined"&&A.gatewayURL!=""&&B.gatewayURL==""){
                B.gatewayURL=A.gatewayURL
            }
            if(typeof (A.appName)!="undefined"&&A.appName!=""&&B.appName==""){
                B.appName=A.appName
            }
            if(typeof (A.systemID)!="undefined"&&A.systemID!=""&&B.systemID==""){
                B.systemID=A.systemID
            }
            if(typeof (A.thread)!="undefined"&&A.thread!=""&&B.thread==""){
                B.thread=A.thread
            }
            
        }
        ,_validatePageAPI:function(A){
            switch(A.toLowerCase()){
                case"load":case"refresh":case"reload":case"openassignment":case"createnewwork":case"openworkitem":case"openworkbyhandle":case"getnextwork":case"getnextworkitem":case"openlanding":case"openworkbyurl":case"display":case"logoff":case"getgadgetdata":case"setgadgetdata":case"getgadgetinfo":case"print":case"restretch":case"getuidoc":case"openwizard":case"showharness":case"blank":return true;
                default:return false
            }
            
        }
        ,_validateGadgetAPI:function(A){
            switch(A.toLowerCase()){
                case"load":case"refresh":case"openassignment":case"createnewwork":case"openworkitem":case"openworkbyhandle":case"openlanding":case"getnextwork":case"getnextworkitem":case"openworkbyurl":case"display":case"getgadgetdata":case"setgadgetdata":case"print":case"resize":case"restretch":case"loaded":case"closed":case"confirm":case"custom":case"error":case"blank":return true;
                default:return false
            }
            
        }
        ,_validateAttrAction:function(A){
            switch(A.toLowerCase()){
                case"openassignment":case"createnewwork":case"openworkitem":case"openlanding":case"openworkbyhandle":case"getnextwork":case"getnextworkitem":case"openworkbyurl":case"display":return true;
                default:return false
            }
            
        }
        ,_getProps:function(){
            var oDA=this._oDiv.attributes;
            if(typeof (oDA.PegaA)!="undefined"){
                this._oDivAttrs.action=oDA.PegaA.nodeValue
            }
            else{
                if(typeof (oDA.PegaAction)!="undefined"){
                    this._oDivAttrs.action=oDA.PegaAction.nodeValue
                }
                else{
                    this._oDivAttrs.action="display"
                }
                
            }
            if(!this._validateAttrAction(this._oDivAttrs.action)){
                pega.web.mgr._logMsg("error",this._id,"Manager","error: IAC does not support PegaA or PegaAction attribute: "+this._oDivAttrs.action);
                this._oDivAttrs.action=""
            }
            if(typeof (oDA.PegaSystemID)!="undefined"){
                this._oConfigDefs.systemID=oDA.PegaSystemID.nodeValue
            }
            if(typeof (oDA.PegaThread)!="undefined"){
                this._oConfigDefs.thread=oDA.PegaThread.nodeValue
            }
            if(typeof (oDA.PegaAppName)!="undefined"){
                this._oConfigDefs.appName=oDA.PegaAppName.nodeValue
            }
            if(typeof (oDA.PegaDefer)!="undefined"){
                this._oDivAttrs.defer=oDA.PegaDefer.nodeValue
            }
            if(typeof (oDA.PegaTargetType)!="undefined"){
                this._oDivAttrs.targetType=oDA.PegaTargetType.nodeValue
            }
            if(typeof (oDA.PegaPopupOptions)!="undefined"){
                this._oDivAttrs.popupOptions=oDA.PegaPopupOptions.nodeValue
            }
            if(typeof (oDA.PegaResize)!="undefined"){
                this._bMaxIframeSize=((oDA.PegaResize.nodeValue)=="stretch"||(oDA.PegaResize.nodeValue)=="fill")?true:false;
                this._bFillSpace=(oDA.PegaResize.nodeValue)=="fill"?true:false;
                if(this._bFillSpace){
                    this._divOffsetWidth=this._oDiv.offsetWidth;
                    this._divOffsetHeight=this._oDiv.offsetHeight
                }
                
            }
            var oPar=this._oDivAttrs.params;
            p_w_eval_1=oPar;
            for(var i=0,oA,sN,sV;
            i<oDA.length;
            ++i){
                oA=oDA[i];
                sN=oA.name;
                if(sN.substr(0,6).toLowerCase()!="pegaa_"){
                    continue
                }
                sN=sN.substring(6);
                sV=oA.nodeValue;
                if(sN!="params"){
                    if(this._htCamelCaseMap.containsKey(sN)){
                        sN=this._htCamelCaseMap.get(sN)
                    }
                    p_w_eval_2=sN;
                    p_w_eval_3=sV;
                    eval("p_w_eval_1."+p_w_eval_2+" = p_w_eval_3")
                }
                else{
                    p_w_eval_3=sV;
                    try{
                        eval("p_w_eval_2 = "+p_w_eval_3);
                        for(p_w_eval_4 in p_w_eval_2){
                            p_w_eval_3=p_w_eval_2[p_w_eval_4];
                            if(p_w_eval_3==""){
                                continue
                            }
                            eval("p_w_eval_1."+p_w_eval_4+" = p_w_eval_3")
                        }
                        
                    }
                    catch(e){
                        pega.web.mgr._logMsg("error",this._id,"Manager","error: invalid Javascript object literal syntax in attribute 'PegaA_params' value "+p_w_eval_3)
                    }
                    
                }
                
            }
            if(typeof (oDA.PegaE_onLoad)!="undefined"){
                this._oEvents.onLoad=oDA.PegaE_onLoad.nodeValue
            }
            if(typeof (oDA.PegaE_onBeforeLoad)!="undefined"){
                this._oEvents.onBeforeLoad=oDA.PegaE_onBeforeLoad.nodeValue
            }
            if(typeof (oDA.PegaE_onConfirm)!="undefined"){
                this._oEvents.onConfirm=oDA.PegaE_onConfirm.nodeValue
            }
            if(typeof (oDA.PegaE_onCustom)!="undefined"){
                this._oEvents.onCustom=oDA.PegaE_onCustom.nodeValue
            }
            if(typeof (oDA.PegaE_onClose)!="undefined"){
                this._oEvents.onClose=oDA.PegaE_onClose.nodeValue
            }
            if(typeof (oDA.PegaE_onError)!="undefined"){
                this._oEvents.onError=oDA.PegaE_onError.nodeValue
            }
            if(typeof (oDA.PegaE_onDomReady)!="undefined"){
                this._oEvents.onDomReady=oDA.PegaE_onDomReady.nodeValue
            }
            if(typeof (oDA.PegaE_onPageData)!="undefined"){
                this._oEvents.onPageData=oDA.PegaE_onPageData.nodeValue
            }
            if(typeof (oDA.PegaE_onResize)!="undefined"){
                this._oEvents.onResize=oDA.PegaE_onResize.nodeValue
            }
            this._fillInConfigDefaults(this._oConfigDefs);
            try{
                this._oDivProps=eval("this._oWin."+this._id);
                if(this._oDivProps!=null&&typeof (this._oDivProps.actionDefinitions)!="undefined"){
                    this._oGdtActions=this._oDivProps.actionDefinitions
                }
                
            }
            catch(e){}
        }
        
    };
    pega.web.utils=function(){};
    pega.web.utils.prototype={
        _clone:function(B){
            if(B==null||typeof (B)!="object"){
                return B
            }
            var C={};
            for(var A in B){
                C[A]=pega.web.mgr._ut._clone(B[A])
            }
            return C
        }
        ,_isInteger:function(A){
            var C="0123456789";
            var B=true;
            var D;
            for(i=0;
            i<A.length&&B;
            ++i){
                D=A.charAt(i);
                if(C.indexOf(D)==-1){
                    B=false
                }
                
            }
            return B
        }
        ,_mergeTgtSrc:function(B,A){
            for(var C in A){
                if(typeof (A[C])!="object"){
                    B[C]=A[C]
                }
                else{
                    this._mergeTgtSrc(B[C],A[C])
                }
                
            }
            
        }
        ,_setCookie:function(E,D,C){
            var B=new Date();
            var A=new Date();
            if(C==null||C==0){
                C=1
            }
            A.setTime(B.getTime()+3600000*24*C);
            document.cookie=E+"="+escape(D)+";expires="+A.toGMTString()
        }
        ,_readCookie:function(D){
            var B=""+document.cookie;
            var C=B.indexOf(D);
            if(C==-1||D==""){
                return""
            }
            var A=B.indexOf(";",C);
            if(A==-1){
                A=B.length
            }
            return unescape(B.substring(C+D.length+1,A))
        }
        
    };
    pega.web.config={
        gatewayURL:"",appName:"",systemID:"",cookiesDisabled:"<div>Browser cookies must be enabled for PRPC Internet Application Composer to function.</div>",thread:"!STANDARD",encrypt:true
    };
    pega.web.mgr=new pega.web.manager();
    pega.web.api=new pega.web.apiSingleton()
};
pega.ui.property=function(){};
pega.ui.property.prototype={
    toHandle:function(G,M){
        try{
            var E=G.split(".");
            if(E.length==1){
                return G
            }
            var L=E[0]==""?"$P"+M:"$P"+E[0];
            for(var H=1;
            H<E.length;
            ++H){
                var I=E[H];
                var C=I.split("(");
                if(C.length==1){
                    L+=("$p"+I)
                }
                else{
                    L+=("$p"+C[0]);
                    var A=C[1].substring(0,C[1].length-1);
                    var K="0123456789";
                    var D=true;
                    var B;
                    for(var F=0;
                    F<A.length&&D;
                    ++F){
                        B=A.charAt(F);
                        if(K.indexOf(B)==-1){
                            D=false
                        }
                        
                    }
                    if(D){
                        L+=("$l"+A)
                    }
                    else{
                        L+=("$g"+A)
                    }
                    
                }
                
            }
            return L
        }
        catch(J){}
    }
    ,toReference:function(J){
        try{
            if(J==null||J==""){
                return""
            }
            var B="";
            var E="";
            var G=J.length;
            var D=J.indexOf("$p");
            if(D<0){
                return""
            }
            var I=" ";
            var A=".";
            var C=false;
            var F=false;
            E+=(J.substring(2,D)+A);
            D++;
            while(!C){
                D++;
                if(D<G){
                    I=J.charAt(D);
                    if(I=="$"){
                        D++;
                        I=J.charAt(D);
                        switch(I){
                            case"p":E+=(B+A);
                            F=(A==")");
                            B="";
                            A=".";
                            break;
                            case"g":case"l":E+=(B+"(");
                            B="";
                            A=")";
                            break;
                            default:if(F){
                                F=false;
                                E+="."
                            }
                            B+=I;
                            break
                        }
                        
                    }
                    else{
                        if(I=="["){
                            B+="<"
                        }
                        else{
                            if(I=="]"){
                                B+=">"
                            }
                            else{
                                if(F){
                                    F=false;
                                    E+="."
                                }
                                B+=I
                            }
                            
                        }
                        
                    }
                    
                }
                else{
                    if(B!=""){
                        E+=B;
                        if(A!="."){
                            E+=A
                        }
                        
                    }
                    C=true
                }
                
            }
            return E
        }
        catch(H){
            return""
        }
        
    }
    
};