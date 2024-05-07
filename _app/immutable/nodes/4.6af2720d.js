import{S as U,i as B,s as C,k as d,q as x,a as A,y as O,l as m,m as p,r as D,h as n,c as _,z as W,n as T,b as E,C as s,A as z,g as G,d as V,B as q,D as Y}from"../chunks/index.baf6a862.js";import{S as j}from"../chunks/Section.6106804d.js";import{b as F}from"../chunks/paths.ee8b4ea9.js";function J(N){let o,a,e,u,i,g,t,l,c,S,v,L,H,b,w,$,M,y;return{c(){o=d("body"),a=d("div"),e=d("div"),u=d("h1"),i=x("Enter your postcode to find its location"),g=A(),t=d("input"),l=A(),c=d("button"),S=x("Search"),v=A(),L=d("div"),H=A(),b=d("script"),w=x(`function normalizePostcode(postcode) {\r
			// Remove all spaces from the postcode and convert to uppercase\r
			return postcode.replace(/\\s/g, "").toUpperCase();\r
		}\r
\r
		function search() {\r
			const searchTerm = normalizePostcode(\r
				document.getElementById("searchInput").value,\r
			);\r
\r
			if (searchTerm === "") {\r
				alert("Please enter a postcode.");\r
				return;\r
			}\r
\r
		    fetch("https://raw.githubusercontent.com/NISRA-Tech-Lab/nisra-geog-explorer/main/search_data/cpd_light_with_lat_long_2.csv")\r
				.then((response) => response.text())\r
				.then((data) => {\r
					const rows = data.split("\\n");\r
					let found = false;\r
\r
					// Prepare list HTML\r
					let listHTML = "<ul>";\r
\r
					rows.forEach((row) => {\r
						const columns = row.split(",");\r
						const postcode = normalizePostcode(columns[0]);\r
\r
						if (postcode === searchTerm) {\r
							// Extract specific columns (lgd and ward)\r
							const lgd2014 = columns[4].trim();\r
							const LGD2014NAME = columns[5].trim();\r
							const WARD2014 = columns[6].trim();\r
							const WARD2014NAME = columns[7].trim();\r
							const DEA2014 = columns[8].trim();\r
							const DEA2014NAME = columns[9].trim();\r
							const AA2008 = columns[10].trim();\r
							const AA2008NAME = columns[11].trim();\r
							const HSCTNAME = columns[17].trim();\r
							const DZ2021 = columns[18].trim();\r
							const DZ2021_name = columns[19].trim();\r
							const SDZ2021 = columns[20].trim();\r
							const SDZ2021_name = columns[21].trim();\r
							const SETTLEMENT15 = columns[28].trim();\r
							const SETTLEMENT15_URBAN_RURAL = columns[29].trim();\r
							\r
\r
							listHTML += \`<li><strong>Postcode:</strong> \${postcode}</li>\`;\r
							listHTML += \`<hr>\`; // Optional separator between entries\r
							listHTML += \`<li><strong>Local Government District:</strong> <a href="\${lgd2014}" target="_blank">\${LGD2014NAME}</a></li>\`;\r
							listHTML += \`<li><strong>District Electoral Area:</strong> <a href="\${DEA2014}" target="_blank">\${DEA2014NAME}</a></li>\`;\r
							listHTML += \`<li><strong>Super Data Zone:</strong> <a href="\${SDZ2021}" target="_blank">\${SDZ2021_name}</a></li>\`;\r
							listHTML += \`<li><strong>Data Zone:</strong> <a href="\${DZ2021}" target="_blank">\${DZ2021_name}</a></li>\`;\r
							\r
							listHTML += \`<hr>\`; // Optional separator between entries\r
							listHTML += \`<li><strong>Urban / Rural:</strong> \${SETTLEMENT15_URBAN_RURAL}</li>\`;\r
							listHTML += \`<li><strong>Settlement:</strong> \${SETTLEMENT15}</li>\`;\r
							listHTML += \`<li><strong>Health and Social Care Trust:</strong> \${HSCTNAME}</li>\`;\r
							listHTML += \`<li><strong>Assembly Area Name:</strong> \${AA2008NAME}</li>\`;\r
							listHTML += \`<li><strong>Ward Name:</strong> \${WARD2014NAME}</li>\`;\r
							listHTML += \`<hr>\`; // Optional separator between entries\r
\r
							found = true;\r
						}\r
					});\r
\r
					listHTML += "</ul>";\r
\r
					if (!found) {\r
						document.getElementById("resultTable").innerHTML =\r
							"Postcode not found.";\r
					} else {\r
						document.getElementById("resultTable").innerHTML =\r
							listHTML;\r
					}\r
				})\r
				.catch((error) => {\r
					console.error("Error fetching data:", error);\r
					alert("Error fetching data. Please try again.");\r
				});\r
		}`),$=A(),M=d("style"),y=x(`.container {\r
			max-width: 600px;\r
			margin: 0 auto;\r
			padding: 20px;\r
			background-color: #fff;\r
			border-radius: 8px;\r
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\r
		}\r
\r
		h1 {\r
			text-align: center;\r
			color: #333;\r
		}\r
\r
		input[type="text"] {\r
			width: 100%;\r
			padding: 10px;\r
			margin-bottom: 10px;\r
			border: 1px solid #ddd;\r
			border-radius: 4px;\r
		}\r
\r
		button {\r
			padding: 10px 20px;\r
			background-color: #007bff;\r
			color: #fff;\r
			border: none;\r
			border-radius: 4px;\r
			cursor: pointer;\r
		}\r
\r
		button:hover {\r
			background-color: #0056b3;\r
		}\r
\r
		#result {\r
			margin-top: 20px;\r
			padding: 10px;\r
			border: 1px solid #ddd;\r
			border-radius: 4px;\r
		}`),this.h()},l(r){o=m(r,"BODY",{});var f=p(o);a=m(f,"DIV",{class:!0});var R=p(a);e=m(R,"DIV",{class:!0});var h=p(e);u=m(h,"H1",{});var Z=p(u);i=D(Z,"Enter your postcode to find its location"),Z.forEach(n),g=_(h),t=m(h,"INPUT",{type:!0,id:!0,placeholder:!0}),l=_(h),c=m(h,"BUTTON",{onclick:!0});var P=p(c);S=D(P,"Search"),P.forEach(n),v=_(h),L=m(h,"DIV",{id:!0}),p(L).forEach(n),h.forEach(n),R.forEach(n),f.forEach(n),H=_(r),b=m(r,"SCRIPT",{});var k=p(b);w=D(k,`function normalizePostcode(postcode) {\r
			// Remove all spaces from the postcode and convert to uppercase\r
			return postcode.replace(/\\s/g, "").toUpperCase();\r
		}\r
\r
		function search() {\r
			const searchTerm = normalizePostcode(\r
				document.getElementById("searchInput").value,\r
			);\r
\r
			if (searchTerm === "") {\r
				alert("Please enter a postcode.");\r
				return;\r
			}\r
\r
		    fetch("https://raw.githubusercontent.com/NISRA-Tech-Lab/nisra-geog-explorer/main/search_data/cpd_light_with_lat_long_2.csv")\r
				.then((response) => response.text())\r
				.then((data) => {\r
					const rows = data.split("\\n");\r
					let found = false;\r
\r
					// Prepare list HTML\r
					let listHTML = "<ul>";\r
\r
					rows.forEach((row) => {\r
						const columns = row.split(",");\r
						const postcode = normalizePostcode(columns[0]);\r
\r
						if (postcode === searchTerm) {\r
							// Extract specific columns (lgd and ward)\r
							const lgd2014 = columns[4].trim();\r
							const LGD2014NAME = columns[5].trim();\r
							const WARD2014 = columns[6].trim();\r
							const WARD2014NAME = columns[7].trim();\r
							const DEA2014 = columns[8].trim();\r
							const DEA2014NAME = columns[9].trim();\r
							const AA2008 = columns[10].trim();\r
							const AA2008NAME = columns[11].trim();\r
							const HSCTNAME = columns[17].trim();\r
							const DZ2021 = columns[18].trim();\r
							const DZ2021_name = columns[19].trim();\r
							const SDZ2021 = columns[20].trim();\r
							const SDZ2021_name = columns[21].trim();\r
							const SETTLEMENT15 = columns[28].trim();\r
							const SETTLEMENT15_URBAN_RURAL = columns[29].trim();\r
							\r
\r
							listHTML += \`<li><strong>Postcode:</strong> \${postcode}</li>\`;\r
							listHTML += \`<hr>\`; // Optional separator between entries\r
							listHTML += \`<li><strong>Local Government District:</strong> <a href="\${lgd2014}" target="_blank">\${LGD2014NAME}</a></li>\`;\r
							listHTML += \`<li><strong>District Electoral Area:</strong> <a href="\${DEA2014}" target="_blank">\${DEA2014NAME}</a></li>\`;\r
							listHTML += \`<li><strong>Super Data Zone:</strong> <a href="\${SDZ2021}" target="_blank">\${SDZ2021_name}</a></li>\`;\r
							listHTML += \`<li><strong>Data Zone:</strong> <a href="\${DZ2021}" target="_blank">\${DZ2021_name}</a></li>\`;\r
							\r
							listHTML += \`<hr>\`; // Optional separator between entries\r
							listHTML += \`<li><strong>Urban / Rural:</strong> \${SETTLEMENT15_URBAN_RURAL}</li>\`;\r
							listHTML += \`<li><strong>Settlement:</strong> \${SETTLEMENT15}</li>\`;\r
							listHTML += \`<li><strong>Health and Social Care Trust:</strong> \${HSCTNAME}</li>\`;\r
							listHTML += \`<li><strong>Assembly Area Name:</strong> \${AA2008NAME}</li>\`;\r
							listHTML += \`<li><strong>Ward Name:</strong> \${WARD2014NAME}</li>\`;\r
							listHTML += \`<hr>\`; // Optional separator between entries\r
\r
							found = true;\r
						}\r
					});\r
\r
					listHTML += "</ul>";\r
\r
					if (!found) {\r
						document.getElementById("resultTable").innerHTML =\r
							"Postcode not found.";\r
					} else {\r
						document.getElementById("resultTable").innerHTML =\r
							listHTML;\r
					}\r
				})\r
				.catch((error) => {\r
					console.error("Error fetching data:", error);\r
					alert("Error fetching data. Please try again.");\r
				});\r
		}`),k.forEach(n),$=_(r),M=m(r,"STYLE",{});var I=p(M);y=D(I,`.container {\r
			max-width: 600px;\r
			margin: 0 auto;\r
			padding: 20px;\r
			background-color: #fff;\r
			border-radius: 8px;\r
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\r
		}\r
\r
		h1 {\r
			text-align: center;\r
			color: #333;\r
		}\r
\r
		input[type="text"] {\r
			width: 100%;\r
			padding: 10px;\r
			margin-bottom: 10px;\r
			border: 1px solid #ddd;\r
			border-radius: 4px;\r
		}\r
\r
		button {\r
			padding: 10px 20px;\r
			background-color: #007bff;\r
			color: #fff;\r
			border: none;\r
			border-radius: 4px;\r
			cursor: pointer;\r
		}\r
\r
		button:hover {\r
			background-color: #0056b3;\r
		}\r
\r
		#result {\r
			margin-top: 20px;\r
			padding: 10px;\r
			border: 1px solid #ddd;\r
			border-radius: 4px;\r
		}`),I.forEach(n),this.h()},h(){T(t,"type","text"),T(t,"id","searchInput"),T(t,"placeholder","Enter postcode..."),T(c,"onclick","search()"),T(L,"id","resultTable"),T(e,"class","container"),T(a,"class","row")},m(r,f){E(r,o,f),s(o,a),s(a,e),s(e,u),s(u,i),s(e,g),s(e,t),s(e,l),s(e,c),s(c,S),s(e,v),s(e,L),E(r,H,f),E(r,b,f),s(b,w),E(r,$,f),E(r,M,f),s(M,y)},p:Y,d(r){r&&n(o),r&&n(H),r&&n(b),r&&n($),r&&n(M)}}}function K(N){let o,a,e,u,i,g;return i=new j({props:{column:"wide",$$slots:{default:[J]},$$scope:{ctx:N}}}),{c(){o=d("nav"),a=d("a"),e=x("Home"),u=A(),O(i.$$.fragment),this.h()},l(t){o=m(t,"NAV",{});var l=p(o);a=m(l,"A",{href:!0});var c=p(a);e=D(c,"Home"),c.forEach(n),l.forEach(n),u=_(t),W(i.$$.fragment,t),this.h()},h(){T(a,"href",F+"/")},m(t,l){E(t,o,l),s(o,a),s(a,e),E(t,u,l),z(i,t,l),g=!0},p(t,[l]){const c={};l&1&&(c.$$scope={dirty:l,ctx:t}),i.$set(c)},i(t){g||(G(i.$$.fragment,t),g=!0)},o(t){V(i.$$.fragment,t),g=!1},d(t){t&&n(o),t&&n(u),q(i,t)}}}class rt extends U{constructor(o){super(),B(this,o,null,K,C,{})}}export{rt as component};
