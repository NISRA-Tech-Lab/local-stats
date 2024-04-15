import{S as ve,i as ke,s as be,k as w,a as P,l as C,m as N,c as M,h as k,n as E,Z as L,b as I,C as b,G as S,D as q,I as H,U as Ee,p as we,a6 as W,w as Y,q as U,r as R,u as Z,e as K,Y as re}from"./index.baf6a862.js";import{j as Ce}from"./singletons.17e85dbd.js";var X={},G={},J=34,B=10,Q=13;function ie(l){return new Function("d","return {"+l.map(function(e,t){return JSON.stringify(e)+": d["+t+'] || ""'}).join(",")+"}")}function Ne(l,e){var t=ie(l);return function(n,s){return e(t(n),s,l)}}function x(l){var e=Object.create(null),t=[];return l.forEach(function(n){for(var s in n)s in e||t.push(e[s]=s)}),t}function T(l,e){var t=l+"",n=t.length;return n<e?new Array(e-n+1).join(0)+t:t}function Te(l){return l<0?"-"+T(-l,6):l>9999?"+"+T(l,6):T(l,4)}function ye(l){var e=l.getUTCHours(),t=l.getUTCMinutes(),n=l.getUTCSeconds(),s=l.getUTCMilliseconds();return isNaN(l)?"Invalid Date":Te(l.getUTCFullYear())+"-"+T(l.getUTCMonth()+1,2)+"-"+T(l.getUTCDate(),2)+(s?"T"+T(e,2)+":"+T(t,2)+":"+T(n,2)+"."+T(s,3)+"Z":n?"T"+T(e,2)+":"+T(t,2)+":"+T(n,2)+"Z":t||e?"T"+T(e,2)+":"+T(t,2)+"Z":"")}function Ae(l){var e=new RegExp('["'+l+`
\r]`),t=l.charCodeAt(0);function n(r,f){var d,p,g=s(r,function(m,v){if(d)return d(m,v-1);p=m,d=f?Ne(m,f):ie(m)});return g.columns=p||[],g}function s(r,f){var d=[],p=r.length,g=0,m=0,v,A=p<=0,y=!1;r.charCodeAt(p-1)===B&&--p,r.charCodeAt(p-1)===Q&&--p;function D(){if(A)return G;if(y)return y=!1,X;var j,O=g,F;if(r.charCodeAt(O)===J){for(;g++<p&&r.charCodeAt(g)!==J||r.charCodeAt(++g)===J;);return(j=g)>=p?A=!0:(F=r.charCodeAt(g++))===B?y=!0:F===Q&&(y=!0,r.charCodeAt(g)===B&&++g),r.slice(O+1,j-1).replace(/""/g,'"')}for(;g<p;){if((F=r.charCodeAt(j=g++))===B)y=!0;else if(F===Q)y=!0,r.charCodeAt(g)===B&&++g;else if(F!==t)continue;return r.slice(O,j)}return A=!0,r.slice(O,p)}for(;(v=D())!==G;){for(var V=[];v!==X&&v!==G;)V.push(v),v=D();f&&(V=f(V,m++))==null||d.push(V)}return d}function o(r,f){return r.map(function(d){return f.map(function(p){return a(d[p])}).join(l)})}function i(r,f){return f==null&&(f=x(r)),[f.map(a).join(l)].concat(o(r,f)).join(`
`)}function h(r,f){return f==null&&(f=x(r)),o(r,f).join(`
`)}function _(r){return r.map(c).join(`
`)}function c(r){return r.map(a).join(l)}function a(r){return r==null?"":r instanceof Date?ye(r):e.test(r+="")?'"'+r.replace(/"/g,'""')+'"':r}return{parse:n,parseRows:s,format:i,formatBody:h,formatRows:_,formatRow:c,formatValue:a}}var Se=Ae(","),Ie=Se.parse;function De(l){for(var e in l){var t=l[e].trim(),n,s;if(!t)t=null;else if(t==="true")t=!0;else if(t==="false")t=!1;else if(t==="NaN")t=NaN;else if(!isNaN(n=+t))t=n;else if(s=t.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/))Le&&s[4]&&!s[7]&&(t=t.replace(/-/g,"/").replace(/T/," ")),t=new Date(t);else continue;l[e]=t}return l}const Le=new Date("2019-01-01T00:00").getHours()||new Date("2019-07-01T00:00").getHours();async function Ye(l,e=window.fetch){let n=await(await e(l)).text();return await Ie(n,De)}function qe(l){let e=Math.round(l)%10;return l==11?"th":e==1?"st":e==2?"nd":e==3?"rd":"th"}function Ke(l){return l>0?"increase":l<0?"decrease":"nochange"}function ze(l,e="",t=0){return l!=0?Math.abs(l).toFixed(t)+e:e=="pp"?"n/c":"No change"}function Ge(l,e="",t=0){return l!=0?Math.abs(l).toFixed(t)+e:e=="pp"?"n/c":"<1%)"}function $(l,e,t){const n=l.slice();return n[33]=e[t],n[36]=e,n[35]=t,n}function ee(l,e,t){const n=l.slice();return n[33]=e[t],n[34]=e,n[35]=t,n}function Ue(l){let e,t,n=(l[0]?l[0]:"Select one")+"",s,o,i,h,_,c;return{c(){e=w("a"),t=w("span"),s=U(n),o=P(),i=w("span"),h=U(" "),this.h()},l(a){e=C(a,"A",{id:!0,class:!0});var r=N(e);t=C(r,"SPAN",{class:!0});var f=N(t);s=R(f,n),f.forEach(k),o=M(r),i=C(r,"SPAN",{class:!0});var d=N(i);h=R(d," "),d.forEach(k),r.forEach(k),this.h()},h(){E(t,"class","svelte-1vtlxa0"),E(i,"class","button svelte-1vtlxa0"),L(i,"search",l[3]),L(i,"down",!l[3]),E(e,"id","toggle"),E(e,"class","svelte-1vtlxa0")},m(a,r){I(a,e,r),b(e,t),b(t,s),b(e,o),b(e,i),b(i,h),_||(c=S(e,"click",l[12]),_=!0)},p(a,r){r[0]&1&&n!==(n=(a[0]?a[0]:"Select one")+"")&&Z(s,n),r[0]&8&&L(i,"search",a[3]),r[0]&8&&L(i,"down",!a[3])},d(a){a&&k(e),_=!1,c()}}}function Re(l){let e,t,n=l[5][l[1]]+"",s,o,i,h,_,c,a,r=l[2]&&te(l);return{c(){e=w("a"),t=w("span"),s=U(n),o=P(),r&&r.c(),i=P(),h=w("span"),_=U(" "),this.h()},l(f){e=C(f,"A",{id:!0,class:!0});var d=N(e);t=C(d,"SPAN",{class:!0});var p=N(t);s=R(p,n),o=M(p),r&&r.l(p),p.forEach(k),i=M(d),h=C(d,"SPAN",{class:!0});var g=N(h);_=R(g," "),g.forEach(k),d.forEach(k),this.h()},h(){E(t,"class","selection svelte-1vtlxa0"),E(h,"class","button close svelte-1vtlxa0"),E(e,"id","toggle"),E(e,"class","selected svelte-1vtlxa0")},m(f,d){I(f,e,d),b(e,t),b(t,s),b(t,o),r&&r.m(t,null),b(e,i),b(e,h),b(h,_),c||(a=[S(h,"click",l[14]),S(e,"click",l[12])],c=!0)},p(f,d){d[0]&34&&n!==(n=f[5][f[1]]+"")&&Z(s,n),f[2]?r?r.p(f,d):(r=te(f),r.c(),r.m(t,null)):r&&(r.d(1),r=null)},d(f){f&&k(e),r&&r.d(),c=!1,H(a)}}}function te(l){let e,t=l[5][l[2]]+"",n;return{c(){e=w("small"),n=U(t),this.h()},l(s){e=C(s,"SMALL",{class:!0});var o=N(e);n=R(o,t),o.forEach(k),this.h()},h(){E(e,"class","svelte-1vtlxa0")},m(s,o){I(s,e,o),b(e,n)},p(s,o){o[0]&36&&t!==(t=s[5][s[2]]+"")&&Z(n,t)},d(s){s&&k(e)}}}function le(l){let e,t,n,s,o,i;function h(a,r){return a[4].length<3?Fe:a[8][0]&&a[2]?Me:a[8][0]?Pe:je}let _=h(l),c=_(l);return{c(){e=w("div"),t=w("input"),n=P(),s=w("ul"),c.c(),this.h()},l(a){e=C(a,"DIV",{id:!0,style:!0,class:!0});var r=N(e);t=C(r,"INPUT",{type:!0,placeholder:!0,autocomplete:!0,onfocus:!0,class:!0}),n=M(r),s=C(r,"UL",{class:!0});var f=N(s);c.l(f),f.forEach(k),r.forEach(k),this.h()},h(){E(t,"type","text"),E(t,"placeholder",""),E(t,"autocomplete","false"),t.autofocus="autofocus",E(t,"onfocus","this.select()"),E(t,"class","svelte-1vtlxa0"),E(s,"class","svelte-1vtlxa0"),E(e,"id","dropdown"),we(e,"top","0"),E(e,"class","svelte-1vtlxa0")},m(a,r){I(a,e,r),b(e,t),W(t,l[4]),l[24](t),b(e,n),b(e,s),c.m(s,null),l[31](e),t.focus(),o||(i=[S(t,"input",l[23]),S(t,"keyup",l[16])],o=!0)},p(a,r){r[0]&16&&t.value!==a[4]&&W(t,a[4]),_===(_=h(a))&&c?c.p(a,r):(c.d(1),c=_(a),c&&(c.c(),c.m(s,null)))},d(a){a&&k(e),l[24](null),c.d(),l[31](null),o=!1,H(i)}}}function je(l){let e,t;return{c(){e=w("li"),t=U("No results"),this.h()},l(n){e=C(n,"LI",{class:!0});var s=N(e);t=R(s,"No results"),s.forEach(k),this.h()},h(){E(e,"class","svelte-1vtlxa0")},m(n,s){I(n,e,s),b(e,t)},p:q,d(n){n&&k(e)}}}function Pe(l){let e,t=l[8],n=[];for(let s=0;s<t.length;s+=1)n[s]=ne($(l,t,s));return{c(){for(let s=0;s<n.length;s+=1)n[s].c();e=K()},l(s){for(let o=0;o<n.length;o+=1)n[o].l(s);e=K()},m(s,o){for(let i=0;i<n.length;i+=1)n[i]&&n[i].m(s,o);I(s,e,o)},p(s,o){if(o[0]&10626){t=s[8];let i;for(i=0;i<t.length;i+=1){const h=$(s,t,i);n[i]?n[i].p(h,o):(n[i]=ne(h),n[i].c(),n[i].m(e.parentNode,e))}for(;i<n.length;i+=1)n[i].d(1);n.length=t.length}},d(s){re(n,s),s&&k(e)}}}function Me(l){let e,t=l[8],n=[];for(let s=0;s<t.length;s+=1)n[s]=se(ee(l,t,s));return{c(){for(let s=0;s<n.length;s+=1)n[s].c();e=K()},l(s){for(let o=0;o<n.length;o+=1)n[o].l(s);e=K()},m(s,o){for(let i=0;i<n.length;i+=1)n[i]&&n[i].m(s,o);I(s,e,o)},p(s,o){if(o[0]&10630){t=s[8];let i;for(i=0;i<t.length;i+=1){const h=ee(s,t,i);n[i]?n[i].p(h,o):(n[i]=se(h),n[i].c(),n[i].m(e.parentNode,e))}for(;i<n.length;i+=1)n[i].d(1);n.length=t.length}},d(s){re(n,s),s&&k(e)}}}function Fe(l){let e,t;return{c(){e=w("li"),t=U("Type a name..."),this.h()},l(n){e=C(n,"LI",{class:!0});var s=N(e);t=R(s,"Type a name..."),s.forEach(k),this.h()},h(){E(e,"class","svelte-1vtlxa0")},m(n,s){I(n,e,s),b(e,t)},p:q,d(n){n&&k(e)}}}function ne(l){let e,t=l[33][l[1]]+"",n,s,o=l[35],i,h;function _(){return l[28](l[33])}function c(){return l[29](l[35])}const a=()=>l[30](e,o),r=()=>l[30](null,o);return{c(){e=w("li"),n=U(t),s=P(),this.h()},l(f){e=C(f,"LI",{class:!0});var d=N(e);n=R(d,t),s=M(d),d.forEach(k),this.h()},h(){E(e,"class","svelte-1vtlxa0"),L(e,"highlight",l[7]==l[35])},m(f,d){I(f,e,d),b(e,n),b(e,s),a(),i||(h=[S(e,"click",_),S(e,"mouseover",c)],i=!0)},p(f,d){l=f,d[0]&258&&t!==(t=l[33][l[1]]+"")&&Z(n,t),o!==l[35]&&(r(),o=l[35],a()),d[0]&128&&L(e,"highlight",l[7]==l[35])},d(f){f&&k(e),r(),i=!1,H(h)}}}function se(l){let e,t=l[33][l[1]]+"",n,s,o,i=l[33][l[2]]+"",h,_,c=l[35],a,r;function f(){return l[25](l[33])}function d(){return l[26](l[35])}const p=()=>l[27](e,c),g=()=>l[27](null,c);return{c(){e=w("li"),n=U(t),s=P(),o=w("small"),h=U(i),_=P(),this.h()},l(m){e=C(m,"LI",{class:!0});var v=N(e);n=R(v,t),s=M(v),o=C(v,"SMALL",{class:!0});var A=N(o);h=R(A,i),A.forEach(k),_=M(v),v.forEach(k),this.h()},h(){E(o,"class","svelte-1vtlxa0"),E(e,"class","svelte-1vtlxa0"),L(e,"highlight",l[7]==l[35])},m(m,v){I(m,e,v),b(e,n),b(e,s),b(e,o),b(o,h),b(e,_),p(),a||(r=[S(e,"click",f),S(e,"mouseover",d)],a=!0)},p(m,v){l=m,v[0]&258&&t!==(t=l[33][l[1]]+"")&&Z(n,t),v[0]&260&&i!==(i=l[33][l[2]]+"")&&Z(h,i),c!==l[35]&&(g(),c=l[35],p()),v[0]&128&&L(e,"highlight",l[7]==l[35])},d(m){m&&k(e),g(),a=!1,H(r)}}}function Ve(l){let e,t,n,s;function o(c,a){return c[5]&&!c[3]?Re:Ue}let i=o(l),h=i(l),_=l[6]&&le(l);return{c(){e=w("div"),h.c(),t=P(),_&&_.c(),this.h()},l(c){e=C(c,"DIV",{id:!0,class:!0});var a=N(e);h.l(a),t=M(a),_&&_.l(a),a.forEach(k),this.h()},h(){E(e,"id","select"),E(e,"class","svelte-1vtlxa0"),L(e,"active",l[6])},m(c,a){I(c,e,a),h.m(e,null),b(e,t),_&&_.m(e,null),n||(s=[S(window,"click",l[17]),S(e,"keydown",l[15])],n=!0)},p(c,a){i===(i=o(c))&&h?h.p(c,a):(h.d(1),h=i(c),h&&(h.c(),h.m(e,t))),c[6]?_?_.p(c,a):(_=le(c),_.c(),_.m(e,null)):_&&(_.d(1),_=null),a[0]&64&&L(e,"active",c[6])},i:q,o:q,d(c){c&&k(e),h.d(),_&&_.d(),n=!1,H(s)}}}function Oe(l){return new Promise(e=>setTimeout(e,l))}function Ze(l,e,t){let n;const s=Ee();let{search_data:o}=e,{selected:i=null}=e,{placeholder:h="Enter a town, postcode or area name"}=e,{value:_="code"}=e,{label:c="name"}=e,{group:a=null}=e,{search:r=!1}=e,f=i,d=i?o.find(u=>{u[_]==i[_]}):null,p=!1,g="",m=null,v,A,y,D=[];function V(u){u.stopPropagation(),t(4,g=""),t(6,p=!p),Oe(10).then(()=>{y&&p&&y.focus()})}function j(u){t(18,i=u),t(6,p=!1),s("select",{selected:u,value:u[_]})}function O(u){u.stopPropagation(),t(18,i=null),t(21,f=null),t(5,d=null),s("select",{selected:null,value:null})}function F(u){p&&v[0]&&Number.isInteger(m)&&(u.keyCode===38?(t(7,m-=m>0?1:0),D[m].scrollIntoView({block:"nearest",inline:"start"})):u.keyCode===40&&(t(7,m+=m<v.length-1?1:0),D[m].scrollIntoView({block:"nearest",inline:"end"})))}function oe(u){v[0]&&Number.isInteger(m)&&u.keyCode===13&&j(v[m])}function ae(u){u.target!==A&&(t(6,p=!1),t(7,m=0))}function ue(){g=this.value,t(4,g)}function ce(u){Y[u?"unshift":"push"](()=>{y=u,t(10,y)})}const fe=u=>j(u),he=u=>t(7,m=u);function _e(u,z){Y[u?"unshift":"push"](()=>{D[z]=u,t(11,D)})}const de=u=>j(u),pe=u=>t(7,m=u);function me(u,z){Y[u?"unshift":"push"](()=>{D[z]=u,t(11,D)})}function ge(u){Y[u?"unshift":"push"](()=>{A=u,t(9,A)})}return l.$$set=u=>{"search_data"in u&&t(19,o=u.search_data),"selected"in u&&t(18,i=u.selected),"placeholder"in u&&t(0,h=u.placeholder),"value"in u&&t(20,_=u.value),"label"in u&&t(1,c=u.label),"group"in u&&t(2,a=u.group),"search"in u&&t(3,r=u.search)},l.$$.update=()=>{l.$$.dirty[0]&16&&t(22,n=g?new RegExp(g,"i"):null),l.$$.dirty[0]&4718594&&(t(8,v=n?o.filter(u=>n.test(u[c])):o),t(7,m=0)),l.$$.dirty[0]&3932160&&f!=i&&(t(5,d=o.find(u=>u[_]==i[_])),t(21,f=i))},[h,c,a,r,g,d,p,m,v,A,y,D,V,j,O,F,oe,ae,i,o,_,f,n,ue,ce,fe,he,_e,de,pe,me,ge]}class Je extends ve{constructor(e){super(),ke(this,e,Ze,Ve,be,{search_data:19,selected:18,placeholder:0,value:20,label:1,group:2,search:3},null,[-1,-1])}}const Qe=Ce("goto");export{Je as S,Qe as a,Ke as b,Ge as c,ze as d,Ye as g,qe as s};
