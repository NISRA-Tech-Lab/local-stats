import{S as ve,i as be,s as ke,k as w,a as P,l as E,m as C,c as R,h as m,n as b,Z as L,b as N,C as v,G as I,D as Y,I as B,U as we,p as Ee,a6 as W,w as H,q as S,r as q,u as M,e as K,Y as re}from"./index.baf6a862.js";import{j as Ce}from"./singletons.7dfe320e.js";var X={},G={},J=34,Z=10,Q=13;function ie(l){return new Function("d","return {"+l.map(function(e,t){return JSON.stringify(e)+": d["+t+'] || ""'}).join(",")+"}")}function Ne(l,e){var t=ie(l);return function(n,s){return e(t(n),s,l)}}function x(l){var e=Object.create(null),t=[];return l.forEach(function(n){for(var s in n)s in e||t.push(e[s]=s)}),t}function A(l,e){var t=l+"",n=t.length;return n<e?new Array(e-n+1).join(0)+t:t}function Te(l){return l<0?"-"+A(-l,6):l>9999?"+"+A(l,6):A(l,4)}function Ae(l){var e=l.getUTCHours(),t=l.getUTCMinutes(),n=l.getUTCSeconds(),s=l.getUTCMilliseconds();return isNaN(l)?"Invalid Date":Te(l.getUTCFullYear())+"-"+A(l.getUTCMonth()+1,2)+"-"+A(l.getUTCDate(),2)+(s?"T"+A(e,2)+":"+A(t,2)+":"+A(n,2)+"."+A(s,3)+"Z":n?"T"+A(e,2)+":"+A(t,2)+":"+A(n,2)+"Z":t||e?"T"+A(e,2)+":"+A(t,2)+"Z":"")}function Se(l){var e=new RegExp('["'+l+`
\r]`),t=l.charCodeAt(0);function n(i,_){var p,d,g=s(i,function(k,T){if(p)return p(k,T-1);d=k,p=_?Ne(k,_):ie(k)});return g.columns=d||[],g}function s(i,_){var p=[],d=i.length,g=0,k=0,T,j=d<=0,y=!1;i.charCodeAt(d-1)===Z&&--d,i.charCodeAt(d-1)===Q&&--d;function D(){if(j)return G;if(y)return y=!1,X;var U,O=g,V;if(i.charCodeAt(O)===J){for(;g++<d&&i.charCodeAt(g)!==J||i.charCodeAt(++g)===J;);return(U=g)>=d?j=!0:(V=i.charCodeAt(g++))===Z?y=!0:V===Q&&(y=!0,i.charCodeAt(g)===Z&&++g),i.slice(O+1,U-1).replace(/""/g,'"')}for(;g<d;){if((V=i.charCodeAt(U=g++))===Z)y=!0;else if(V===Q)y=!0,i.charCodeAt(g)===Z&&++g;else if(V!==t)continue;return i.slice(O,U)}return j=!0,i.slice(O,d)}for(;(T=D())!==G;){for(var F=[];T!==X&&T!==G;)F.push(T),T=D();_&&(F=_(F,k++))==null||p.push(F)}return p}function u(i,_){return i.map(function(p){return _.map(function(d){return f(p[d])}).join(l)})}function r(i,_){return _==null&&(_=x(i)),[_.map(f).join(l)].concat(u(i,_)).join(`
`)}function h(i,_){return _==null&&(_=x(i)),u(i,_).join(`
`)}function a(i){return i.map(o).join(`
`)}function o(i){return i.map(f).join(l)}function f(i){return i==null?"":i instanceof Date?Ae(i):e.test(i+="")?'"'+i.replace(/"/g,'""')+'"':i}return{parse:n,parseRows:s,format:r,formatBody:h,formatRows:a,formatRow:o,formatValue:f}}var qe=Se(","),ye=qe.parse;function Ie(l){for(var e in l){var t=l[e].trim(),n,s;if(!t)t=null;else if(t==="true")t=!0;else if(t==="false")t=!1;else if(t==="NaN")t=NaN;else if(!isNaN(n=+t))t=n;else if(s=t.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/))De&&s[4]&&!s[7]&&(t=t.replace(/-/g,"/").replace(/T/," ")),t=new Date(t);else continue;l[e]=t}return l}const De=new Date("2019-01-01T00:00").getHours()||new Date("2019-07-01T00:00").getHours();async function ze(l,e=window.fetch){let n=await(await e(l)).text();return await ye(n,Ie)}function Ge(l){let e=Math.round(l)%10;return l==11?"th":e==1?"st":e==2?"nd":e==3?"rd":"th"}function Je(l){return l>0?"increase":l<0?"decrease":"nochange"}function Qe(l,e="",t=0){return l!=0?Math.abs(l).toFixed(t)+e:e=="pp"?"n/c":"No change"}function We(l,e="",t=0){return l!=0?Math.abs(l).toFixed(t)+e:e=="pp"?"n/c":"<1%)"}function $(l,e,t){const n=l.slice();return n[33]=e[t],n[36]=e,n[35]=t,n}function ee(l,e,t){const n=l.slice();return n[33]=e[t],n[34]=e,n[35]=t,n}function Le(l){let e,t,n=(l[0]?l[0]:"Select one")+"",s,u,r,h,a,o;return{c(){e=w("a"),t=w("span"),s=S(n),u=P(),r=w("span"),h=S(" "),this.h()},l(f){e=E(f,"A",{id:!0,class:!0});var i=C(e);t=E(i,"SPAN",{class:!0});var _=C(t);s=q(_,n),_.forEach(m),u=R(i),r=E(i,"SPAN",{class:!0});var p=C(r);h=q(p," "),p.forEach(m),i.forEach(m),this.h()},h(){b(t,"class","svelte-3gv18q"),b(r,"class","button svelte-3gv18q"),L(r,"search",l[3]),L(r,"down",!l[3]),b(e,"id","toggle"),b(e,"class","svelte-3gv18q")},m(f,i){N(f,e,i),v(e,t),v(t,s),v(e,u),v(e,r),v(r,h),a||(o=I(e,"click",l[12]),a=!0)},p(f,i){i[0]&1&&n!==(n=(f[0]?f[0]:"Select one")+"")&&M(s,n),i[0]&8&&L(r,"search",f[3]),i[0]&8&&L(r,"down",!f[3])},d(f){f&&m(e),a=!1,o()}}}function Ue(l){let e,t,n=l[5][l[1]]+"",s,u,r,h,a,o,f,i=l[2]&&te(l);return{c(){e=w("a"),t=w("span"),s=S(n),u=P(),i&&i.c(),r=P(),h=w("span"),a=S(" "),this.h()},l(_){e=E(_,"A",{id:!0,class:!0});var p=C(e);t=E(p,"SPAN",{class:!0});var d=C(t);s=q(d,n),u=R(d),i&&i.l(d),d.forEach(m),r=R(p),h=E(p,"SPAN",{class:!0});var g=C(h);a=q(g," "),g.forEach(m),p.forEach(m),this.h()},h(){b(t,"class","selection svelte-3gv18q"),b(h,"class","button close svelte-3gv18q"),b(e,"id","toggle"),b(e,"class","selected svelte-3gv18q")},m(_,p){N(_,e,p),v(e,t),v(t,s),v(t,u),i&&i.m(t,null),v(e,r),v(e,h),v(h,a),o||(f=[I(h,"click",l[14]),I(e,"click",l[12])],o=!0)},p(_,p){p[0]&34&&n!==(n=_[5][_[1]]+"")&&M(s,n),_[2]?i?i.p(_,p):(i=te(_),i.c(),i.m(t,null)):i&&(i.d(1),i=null)},d(_){_&&m(e),i&&i.d(),o=!1,B(f)}}}function te(l){let e,t=l[5][l[2]]+"",n;return{c(){e=w("small"),n=S(t),this.h()},l(s){e=E(s,"SMALL",{class:!0});var u=C(e);n=q(u,t),u.forEach(m),this.h()},h(){b(e,"class","svelte-3gv18q")},m(s,u){N(s,e,u),v(e,n)},p(s,u){u[0]&36&&t!==(t=s[5][s[2]]+"")&&M(n,t)},d(s){s&&m(e)}}}function le(l){let e,t,n,s,u,r;function h(f,i){return f[4].length<3?Me:f[8][0]&&f[2]?je:f[8][0]?Re:Pe}let a=h(l),o=a(l);return{c(){e=w("div"),t=w("input"),n=P(),s=w("ul"),o.c(),this.h()},l(f){e=E(f,"DIV",{id:!0,style:!0,class:!0});var i=C(e);t=E(i,"INPUT",{type:!0,placeholder:!0,autocomplete:!0,onfocus:!0,class:!0}),n=R(i),s=E(i,"UL",{class:!0});var _=C(s);o.l(_),_.forEach(m),i.forEach(m),this.h()},h(){b(t,"type","text"),b(t,"placeholder",""),b(t,"autocomplete","false"),t.autofocus="autofocus",b(t,"onfocus","this.select()"),b(t,"class","svelte-3gv18q"),b(s,"class","svelte-3gv18q"),b(e,"id","dropdown"),Ee(e,"top","0"),b(e,"class","svelte-3gv18q")},m(f,i){N(f,e,i),v(e,t),W(t,l[4]),l[24](t),v(e,n),v(e,s),o.m(s,null),l[31](e),t.focus(),u||(r=[I(t,"input",l[23]),I(t,"keyup",l[16])],u=!0)},p(f,i){i[0]&16&&t.value!==f[4]&&W(t,f[4]),a===(a=h(f))&&o?o.p(f,i):(o.d(1),o=a(f),o&&(o.c(),o.m(s,null)))},d(f){f&&m(e),l[24](null),o.d(),l[31](null),u=!1,B(r)}}}function Pe(l){let e,t;return{c(){e=w("li"),t=S("No results"),this.h()},l(n){e=E(n,"LI",{class:!0});var s=C(e);t=q(s,"No results"),s.forEach(m),this.h()},h(){b(e,"class","svelte-3gv18q")},m(n,s){N(n,e,s),v(e,t)},p:Y,d(n){n&&m(e)}}}function Re(l){let e,t=l[8],n=[];for(let s=0;s<t.length;s+=1)n[s]=ne($(l,t,s));return{c(){for(let s=0;s<n.length;s+=1)n[s].c();e=K()},l(s){for(let u=0;u<n.length;u+=1)n[u].l(s);e=K()},m(s,u){for(let r=0;r<n.length;r+=1)n[r]&&n[r].m(s,u);N(s,e,u)},p(s,u){if(u[0]&10626){t=s[8];let r;for(r=0;r<t.length;r+=1){const h=$(s,t,r);n[r]?n[r].p(h,u):(n[r]=ne(h),n[r].c(),n[r].m(e.parentNode,e))}for(;r<n.length;r+=1)n[r].d(1);n.length=t.length}},d(s){re(n,s),s&&m(e)}}}function je(l){let e,t=l[8],n=[];for(let s=0;s<t.length;s+=1)n[s]=se(ee(l,t,s));return{c(){for(let s=0;s<n.length;s+=1)n[s].c();e=K()},l(s){for(let u=0;u<n.length;u+=1)n[u].l(s);e=K()},m(s,u){for(let r=0;r<n.length;r+=1)n[r]&&n[r].m(s,u);N(s,e,u)},p(s,u){if(u[0]&10630){t=s[8];let r;for(r=0;r<t.length;r+=1){const h=ee(s,t,r);n[r]?n[r].p(h,u):(n[r]=se(h),n[r].c(),n[r].m(e.parentNode,e))}for(;r<n.length;r+=1)n[r].d(1);n.length=t.length}},d(s){re(n,s),s&&m(e)}}}function Me(l){let e,t;return{c(){e=w("li"),t=S("Type a name..."),this.h()},l(n){e=E(n,"LI",{class:!0});var s=C(e);t=q(s,"Type a name..."),s.forEach(m),this.h()},h(){b(e,"class","svelte-3gv18q")},m(n,s){N(n,e,s),v(e,t)},p:Y,d(n){n&&m(e)}}}function ne(l){let e,t=l[33][l[1]]+"",n,s,u=l[35],r,h;function a(){return l[28](l[33])}function o(){return l[29](l[35])}const f=()=>l[30](e,u),i=()=>l[30](null,u);return{c(){e=w("li"),n=S(t),s=P(),this.h()},l(_){e=E(_,"LI",{class:!0});var p=C(e);n=q(p,t),s=R(p),p.forEach(m),this.h()},h(){b(e,"class","svelte-3gv18q"),L(e,"highlight",l[7]==l[35])},m(_,p){N(_,e,p),v(e,n),v(e,s),f(),r||(h=[I(e,"click",a),I(e,"mouseover",o)],r=!0)},p(_,p){l=_,p[0]&258&&t!==(t=l[33][l[1]]+"")&&M(n,t),u!==l[35]&&(i(),u=l[35],f()),p[0]&128&&L(e,"highlight",l[7]==l[35])},d(_){_&&m(e),i(),r=!1,B(h)}}}function Ve(l){let e,t,n=l[33][l[1]]+"",s,u,r=l[33][l[2]]+"",h;return{c(){e=w("span"),t=S("View: "),s=S(n),u=P(),h=S(r),this.h()},l(a){e=E(a,"SPAN",{class:!0});var o=C(e);t=q(o,"View: "),s=q(o,n),u=R(o),h=q(o,r),o.forEach(m),this.h()},h(){b(e,"class","view svelte-3gv18q")},m(a,o){N(a,e,o),v(e,t),v(e,s),v(e,u),v(e,h)},p(a,o){o[0]&258&&n!==(n=a[33][a[1]]+"")&&M(s,n),o[0]&260&&r!==(r=a[33][a[2]]+"")&&M(h,r)},d(a){a&&m(e)}}}function Fe(l){let e,t=l[33][l[1]]+"",n,s,u,r=l[33][l[2]]+"",h;return{c(){e=w("small"),n=S(t),s=P(),u=w("span"),h=S(r),this.h()},l(a){e=E(a,"SMALL",{class:!0});var o=C(e);n=q(o,t),o.forEach(m),s=R(a),u=E(a,"SPAN",{class:!0});var f=C(u);h=q(f,r),f.forEach(m),this.h()},h(){b(e,"class","svelte-3gv18q"),b(u,"class","view svelte-3gv18q")},m(a,o){N(a,e,o),v(e,n),N(a,s,o),N(a,u,o),v(u,h)},p(a,o){o[0]&258&&t!==(t=a[33][a[1]]+"")&&M(n,t),o[0]&260&&r!==(r=a[33][a[2]]+"")&&M(h,r)},d(a){a&&m(e),a&&m(s),a&&m(u)}}}function se(l){let e,t,n,s=l[35],u,r;function h(d,g){return g[0]&260&&(t=null),t==null&&(t=d[33][d[2]].slice(0,4)=="View"),t?Fe:Ve}let a=h(l,[-1,-1]),o=a(l);function f(){return l[25](l[33])}function i(){return l[26](l[35])}const _=()=>l[27](e,s),p=()=>l[27](null,s);return{c(){e=w("li"),o.c(),n=P(),this.h()},l(d){e=E(d,"LI",{class:!0});var g=C(e);o.l(g),n=R(g),g.forEach(m),this.h()},h(){b(e,"class","svelte-3gv18q"),L(e,"highlight",l[7]==l[35])},m(d,g){N(d,e,g),o.m(e,null),v(e,n),_(),u||(r=[I(e,"click",f),I(e,"mouseover",i)],u=!0)},p(d,g){l=d,a===(a=h(l,g))&&o?o.p(l,g):(o.d(1),o=a(l),o&&(o.c(),o.m(e,n))),s!==l[35]&&(p(),s=l[35],_()),g[0]&128&&L(e,"highlight",l[7]==l[35])},d(d){d&&m(e),o.d(),p(),u=!1,B(r)}}}function Oe(l){let e,t,n,s;function u(o,f){return o[5]&&!o[3]?Ue:Le}let r=u(l),h=r(l),a=l[6]&&le(l);return{c(){e=w("div"),h.c(),t=P(),a&&a.c(),this.h()},l(o){e=E(o,"DIV",{id:!0,class:!0});var f=C(e);h.l(f),t=R(f),a&&a.l(f),f.forEach(m),this.h()},h(){b(e,"id","select"),b(e,"class","svelte-3gv18q"),L(e,"active",l[6])},m(o,f){N(o,e,f),h.m(e,null),v(e,t),a&&a.m(e,null),n||(s=[I(window,"click",l[17]),I(e,"keydown",l[15])],n=!0)},p(o,f){r===(r=u(o))&&h?h.p(o,f):(h.d(1),h=r(o),h&&(h.c(),h.m(e,t))),o[6]?a?a.p(o,f):(a=le(o),a.c(),a.m(e,null)):a&&(a.d(1),a=null),f[0]&64&&L(e,"active",o[6])},i:Y,o:Y,d(o){o&&m(e),h.d(),a&&a.d(),n=!1,B(s)}}}function Ze(l){return new Promise(e=>setTimeout(e,l))}function Be(l){return l.length>5&&l.substr(0,2).toUpperCase()=="BT"&&l.indexOf(" ")==-1&&(l=l.slice(0,-3)+" "+l.substr(-3)),l}function He(l,e,t){let n;const s=we();let{search_data:u}=e,{selected:r=null}=e,{placeholder:h="Enter a town, postcode or area name"}=e,{value:a="code"}=e,{label:o="name"}=e,{group:f=null}=e,{search:i=!1}=e,_=r,p=r?u.find(c=>{c[a]==r[a]}):null,d=!1,g="",k=null,T,j,y,D=[];function F(c){c.stopPropagation(),t(4,g=""),t(6,d=!d),Ze(10).then(()=>{y&&d&&y.focus()})}function U(c){t(18,r=c),t(6,d=!1),s("select",{selected:c,value:c[a]})}function O(c){c.stopPropagation(),t(18,r=null),t(21,_=null),t(5,p=null),s("select",{selected:null,value:null})}function V(c){d&&T[0]&&Number.isInteger(k)&&(c.keyCode===38?(t(7,k-=k>0?1:0),D[k].scrollIntoView({block:"nearest",inline:"start"})):c.keyCode===40&&(t(7,k+=k<T.length-1?1:0),D[k].scrollIntoView({block:"nearest",inline:"end"})))}function oe(c){T[0]&&Number.isInteger(k)&&c.keyCode===13&&U(T[k])}function ae(c){c.target!==j&&(t(6,d=!1),t(7,k=0))}function ue(){g=this.value,t(4,g)}function fe(c){H[c?"unshift":"push"](()=>{y=c,t(10,y)})}const ce=c=>U(c),he=c=>t(7,k=c);function _e(c,z){H[c?"unshift":"push"](()=>{D[z]=c,t(11,D)})}const de=c=>U(c),pe=c=>t(7,k=c);function ge(c,z){H[c?"unshift":"push"](()=>{D[z]=c,t(11,D)})}function me(c){H[c?"unshift":"push"](()=>{j=c,t(9,j)})}return l.$$set=c=>{"search_data"in c&&t(19,u=c.search_data),"selected"in c&&t(18,r=c.selected),"placeholder"in c&&t(0,h=c.placeholder),"value"in c&&t(20,a=c.value),"label"in c&&t(1,o=c.label),"group"in c&&t(2,f=c.group),"search"in c&&t(3,i=c.search)},l.$$.update=()=>{l.$$.dirty[0]&16&&t(22,n=g?new RegExp(Be(g),"i"):null),l.$$.dirty[0]&4718594&&(t(8,T=n?u.filter(c=>n.test(c[o])):u),t(7,k=0)),l.$$.dirty[0]&3932160&&_!=r&&(t(5,p=u.find(c=>c[a]==r[a])),t(21,_=r))},[h,o,f,i,g,p,d,k,T,j,y,D,F,U,O,V,oe,ae,r,u,a,_,n,ue,fe,ce,he,_e,de,pe,ge,me]}class Xe extends ve{constructor(e){super(),be(this,e,He,Oe,ke,{search_data:19,selected:18,placeholder:0,value:20,label:1,group:2,search:3},null,[-1,-1])}}const xe=Ce("goto");export{Xe as S,xe as a,Je as b,We as c,Qe as d,ze as g,Ge as s};