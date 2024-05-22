import{g as W,S as X,a as Y}from"../chunks/navigation.b93bfaa0.js";import{g as k,a as j}from"../chunks/config.3c1ea879.js";import{S as Z,i as ee,s as te,k as p,a as x,y as B,L as ae,l as m,h as c,c as A,z as F,n as s,C as o,b as G,A as H,g as U,d as J,B as K,q as O,m as y,r as R,p as $,F as re}from"../chunks/index.baf6a862.js";import{b as Q,a as ne}from"../chunks/paths.3806942e.js";import{S as oe}from"../chunks/Section.6106804d.js";async function se({fetch:g}){let t=await W(j.search_data,g),a={};return t.forEach(e=>a[e.code]=e.name),t.forEach(e=>{e.typepl=k[e.type].pl,e.typenm=k[e.type].name,e.typestr=a[e.parent]&&e.parent==e.code?`View:  ${a[e.parent]}
        ${k[e.parent_type].name}  `:a[e.parent]&&e.parent!=e.code?`${k[e.type].name} `:""}),{search_data:t.sort((e,i)=>e.name.localeCompare(i.name))}}const fe=Object.freeze(Object.defineProperty({__proto__:null,load:se},Symbol.toStringTag,{value:"Module"}));function le(g){let t,a,n,e,i,_,v,d,u,l,r,h,q,C,N,E,I,D,M;return u=new X({props:{search_data:g[0].search_data,group:"typestr",search:!0}}),u.$on("select",g[1]),{c(){t=p("div"),a=p("div"),n=p("div"),e=p("span"),i=O("Explore key statistics for any area in Northern Ireland"),_=x(),v=p("h4"),d=x(),B(u.$$.fragment),l=x(),r=p("div"),h=p("span"),q=O("Click on the map to view Northern Ireland as a whole"),C=x(),N=p("a"),E=p("picture"),I=p("img"),this.h()},l(f){t=m(f,"DIV",{class:!0});var S=y(t);a=m(S,"DIV",{class:!0});var b=y(a);n=m(b,"DIV",{class:!0});var w=y(n);e=m(w,"SPAN",{style:!0});var P=y(e);i=R(P,"Explore key statistics for any area in Northern Ireland"),P.forEach(c),_=A(w),v=m(w,"H4",{}),y(v).forEach(c),d=A(w),F(u.$$.fragment,w),w.forEach(c),l=A(b),r=m(b,"DIV",{class:!0});var T=y(r);h=m(T,"SPAN",{style:!0});var V=y(h);q=R(V,"Click on the map to view Northern Ireland as a whole"),V.forEach(c),C=A(T),N=m(T,"A",{href:!0});var z=y(N);E=m(z,"PICTURE",{id:!0,class:!0});var L=y(E);I=m(L,"IMG",{style:!0,src:!0,alt:!0}),L.forEach(c),z.forEach(c),T.forEach(c),b.forEach(c),S.forEach(c),this.h()},h(){$(e,"font-size","1.5em"),$(e,"font-weight","bold"),$(e,"color","#3878c5"),$(e,"line-height","1em"),s(n,"class","div-grey-box"),$(h,"font-size","1.5em"),$(h,"font-weight","bold"),$(h,"color","#3878c5"),$(h,"line-height","1em"),$(I,"width","400px"),re(I.src,D=ne+"/img/Northern_Ireland_Map.svg")||s(I,"src",D),s(I,"alt","Outline of Northern Ireland"),s(E,"id","ni-map"),s(E,"class","svelte-qp81b8"),s(N,"href",Q+"/N92000002/"),s(r,"class","div-grey-box"),s(a,"class","grid svelte-qp81b8"),s(t,"class","block svelte-qp81b8")},m(f,S){G(f,t,S),o(t,a),o(a,n),o(n,e),o(e,i),o(n,_),o(n,v),o(n,d),H(u,n,null),o(a,l),o(a,r),o(r,h),o(h,q),o(r,C),o(r,N),o(N,E),o(E,I),M=!0},p(f,S){const b={};S&1&&(b.search_data=f[0].search_data),u.$set(b)},i(f){M||(U(u.$$.fragment,f),M=!0)},o(f){J(u.$$.fragment,f),M=!1},d(f){f&&c(t),K(u)}}}function ce(g){let t,a,n,e,i,_,v,d,u;return d=new oe({props:{column:"wide",$$slots:{default:[le]},$$scope:{ctx:g}}}),{c(){t=p("meta"),a=p("meta"),n=p("meta"),e=p("meta"),i=p("meta"),_=p("meta"),v=x(),B(d.$$.fragment),this.h()},l(l){const r=ae("svelte-1ltr6sp",document.head);t=m(r,"META",{name:!0,content:!0}),a=m(r,"META",{property:!0,content:!0}),n=m(r,"META",{property:!0,content:!0}),e=m(r,"META",{property:!0,content:!0}),i=m(r,"META",{property:!0,content:!0}),_=m(r,"META",{name:!0,content:!0}),r.forEach(c),v=A(l),F(d.$$.fragment,l),this.h()},h(){document.title="Northern Ireland Local Statistics Explorer",s(t,"name","description"),s(t,"content",""),s(a,"property","og:title"),s(a,"content","Northern Ireland Local Statistics Explorer"),s(n,"property","og:type"),s(n,"content","website"),s(e,"property","og:url"),s(e,"content",j.base+"/"),s(i,"property","og:description"),s(i,"content","Explore NISRA data for places in Northern Ireland."),s(_,"name","description"),s(_,"content","Explore NISRA data for places in Northern Ireland.")},m(l,r){o(document.head,t),o(document.head,a),o(document.head,n),o(document.head,e),o(document.head,i),o(document.head,_),G(l,v,r),H(d,l,r),u=!0},p(l,[r]){const h={};r&5&&(h.$$scope={dirty:r,ctx:l}),d.$set(h)},i(l){u||(U(d.$$.fragment,l),u=!0)},o(l){J(d.$$.fragment,l),u=!1},d(l){c(t),c(a),c(n),c(e),c(i),c(_),l&&c(v),K(d,l)}}}function ie(g,t,a){let{data:n}=t;function e(i){Y(`${Q}/${i.detail.value}/`,{noscroll:!0})}return g.$$set=i=>{"data"in i&&a(0,n=i.data)},[n,e]}class _e extends Z{constructor(t){super(),ee(this,t,ie,ce,te,{data:0})}}export{_e as component,fe as universal};
