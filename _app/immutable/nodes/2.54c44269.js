import{g as W,S as X,a as Y}from"../chunks/navigation.57fece34.js";import{g as k,a as B}from"../chunks/config.1c5d421e.js";import{S as Z,i as ee,s as te,k as p,a as S,y as F,L as ae,l as m,h as c,c as A,z as G,n as o,C as s,b as H,A as R,g as U,d as J,B as K,q as j,m as v,r as L,p as $,F as re}from"../chunks/index.baf6a862.js";import{b as Q,a as ne}from"../chunks/paths.e76046e7.js";import{S as se}from"../chunks/Section.6106804d.js";async function oe({fetch:g}){let t=await W(B.search_data,g),a={};return t.forEach(e=>a[e.code]=e.name),t.forEach(e=>{e.typepl=k[e.type].pl,e.typenm=k[e.type].name,e.typestr=a[e.parent]&&e.parent==e.code?`View:  ${a[e.parent]}
        ${k[e.parent_type].name}  `:a[e.parent]&&e.parent!=e.code?`${k[e.type].name} `:""}),{search_data:t.sort((e,i)=>e.name.localeCompare(i.name))}}const fe=Object.freeze(Object.defineProperty({__proto__:null,load:oe},Symbol.toStringTag,{value:"Module"}));function le(g){let t,a,n,e,i,_,y,d,u,l,r,h,C,q,w,E,b,D,M;return u=new X({props:{search_data:g[0].search_data,group:"typestr",search:!0}}),u.$on("select",g[1]),{c(){t=p("div"),a=p("div"),n=p("div"),e=p("span"),i=j("Explore key statistics for any area in Northern Ireland"),_=S(),y=p("h4"),d=S(),F(u.$$.fragment),l=S(),r=p("div"),h=p("span"),C=j("Click on the map to view Northern Ireland as a whole"),q=S(),w=p("a"),E=p("picture"),b=p("img"),this.h()},l(f){t=m(f,"DIV",{class:!0,style:!0});var x=v(t);a=m(x,"DIV",{class:!0});var I=v(a);n=m(I,"DIV",{class:!0});var N=v(n);e=m(N,"SPAN",{style:!0});var P=v(e);i=L(P,"Explore key statistics for any area in Northern Ireland"),P.forEach(c),_=A(N),y=m(N,"H4",{}),v(y).forEach(c),d=A(N),G(u.$$.fragment,N),N.forEach(c),l=A(I),r=m(I,"DIV",{class:!0});var T=v(r);h=m(T,"SPAN",{style:!0});var V=v(h);C=L(V,"Click on the map to view Northern Ireland as a whole"),V.forEach(c),q=A(T),w=m(T,"A",{href:!0});var z=v(w);E=m(z,"PICTURE",{id:!0,class:!0});var O=v(E);b=m(O,"IMG",{style:!0,src:!0,alt:!0}),O.forEach(c),z.forEach(c),T.forEach(c),I.forEach(c),x.forEach(c),this.h()},h(){$(e,"font-size","1.5em"),$(e,"font-weight","bold"),$(e,"color","#3878c5"),o(n,"class","div-grey-box"),$(h,"font-size","1.5em"),$(h,"font-weight","bold"),$(h,"color","#3878c5"),$(b,"width","400px"),re(b.src,D=ne+"/img/Northern_Ireland_Map.svg")||o(b,"src",D),o(b,"alt","Outline of Northern Ireland"),o(E,"id","ni-map"),o(E,"class","svelte-qp81b8"),o(w,"href",Q+"/N92000002/"),o(r,"class","div-grey-box"),o(a,"class","grid svelte-qp81b8"),o(t,"class","block svelte-qp81b8"),$(t,"margin-bottom","300px")},m(f,x){H(f,t,x),s(t,a),s(a,n),s(n,e),s(e,i),s(n,_),s(n,y),s(n,d),R(u,n,null),s(a,l),s(a,r),s(r,h),s(h,C),s(r,q),s(r,w),s(w,E),s(E,b),M=!0},p(f,x){const I={};x&1&&(I.search_data=f[0].search_data),u.$set(I)},i(f){M||(U(u.$$.fragment,f),M=!0)},o(f){J(u.$$.fragment,f),M=!1},d(f){f&&c(t),K(u)}}}function ce(g){let t,a,n,e,i,_,y,d,u;return d=new se({props:{column:"wide",$$slots:{default:[le]},$$scope:{ctx:g}}}),{c(){t=p("meta"),a=p("meta"),n=p("meta"),e=p("meta"),i=p("meta"),_=p("meta"),y=S(),F(d.$$.fragment),this.h()},l(l){const r=ae("svelte-13it47m",document.head);t=m(r,"META",{name:!0,content:!0}),a=m(r,"META",{property:!0,content:!0}),n=m(r,"META",{property:!0,content:!0}),e=m(r,"META",{property:!0,content:!0}),i=m(r,"META",{property:!0,content:!0}),_=m(r,"META",{name:!0,content:!0}),r.forEach(c),y=A(l),G(d.$$.fragment,l),this.h()},h(){document.title="Northern Ireland Local Statistics Explorer",o(t,"name","description"),o(t,"content",""),o(a,"property","og:title"),o(a,"content","Census Area Explorer"),o(n,"property","og:type"),o(n,"content","website"),o(e,"property","og:url"),o(e,"content",B.base+"/"),o(i,"property","og:description"),o(i,"content","Explore census data for places in Northern Ireland."),o(_,"name","description"),o(_,"content","Explore census data for places in Northern Ireland.")},m(l,r){s(document.head,t),s(document.head,a),s(document.head,n),s(document.head,e),s(document.head,i),s(document.head,_),H(l,y,r),R(d,l,r),u=!0},p(l,[r]){const h={};r&5&&(h.$$scope={dirty:r,ctx:l}),d.$set(h)},i(l){u||(U(d.$$.fragment,l),u=!0)},o(l){J(d.$$.fragment,l),u=!1},d(l){c(t),c(a),c(n),c(e),c(i),c(_),l&&c(y),K(d,l)}}}function ie(g,t,a){let{data:n}=t;function e(i){Y(`${Q}/${i.detail.value}/`,{noscroll:!0})}return g.$$set=i=>{"data"in i&&a(0,n=i.data)},[n,e]}class _e extends Z{constructor(t){super(),ee(this,t,ie,ce,te,{data:0})}}export{_e as component,fe as universal};
