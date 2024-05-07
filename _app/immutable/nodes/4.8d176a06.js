import{S as U,i as B,s as C,k as p,q as L,a as x,y as G,l as d,m as u,r as D,h as n,c as M,z as W,n as E,b as T,C as s,A as z,g as V,d as q,B as O,D as Y}from"../chunks/index.baf6a862.js";import{S as j}from"../chunks/Section.6106804d.js";import{b as F}from"../chunks/paths.ce422f1c.js";function J(N){let o,a,e,m,i,g,t,l,c,S,v,_,H,b,y,$,A,R;return{c(){o=p("body"),a=p("div"),e=p("div"),m=p("h1"),i=L("Enter your postcode to find its location"),g=x(),t=p("input"),l=x(),c=p("button"),S=L("Search"),v=x(),_=p("div"),H=x(),b=p("script"),y=L(`function normalizePostcode(postcode) {\r
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
					let pchtml = "<p>";\r
					let listHTML = "<ul>";\r
					let listHTML2 = "<ul>";\r
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
							pchtml += \`<strong>Postcode:</strong> \${postcode}\`;\r
\r
							listHTML += \`<li>Local Government District: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/\${lgd2014}" target="_blank"><strong>\${LGD2014NAME}</strong></a></li>\`;\r
							listHTML += \`<li>District Electoral Area: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/\${DEA2014}" target="_blank"><strong>\${DEA2014NAME}</strong></a></li>\`;\r
							listHTML += \`<li>Super Data Zone: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/\${SDZ2021}" target="_blank"><strong>\${SDZ2021_name}</strong></a></li>\`;\r
							listHTML += \`<li>Data Zone: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/\${DZ2021}" target="_blank"><strong>\${DZ2021_name}</strong></a></li>\`;\r
							\r
							listHTML2 += \`<li>Urban / Rural:<strong> \${SETTLEMENT15_URBAN_RURAL}</strong></li>\`;\r
							listHTML2 += \`<li>Settlement:<strong> \${SETTLEMENT15}</strong></li>\`;\r
							listHTML2 += \`<li>Health and Social Care Trust:<strong> \${HSCTNAME}</strong></li>\`;\r
							listHTML2 += \`<li>Assembly Area Name:<strong> \${AA2008NAME}</strong></li>\`;\r
							listHTML2 += \`<li>Ward Name:<strong> \${WARD2014NAME}</strong></li>\`;\r
\r
							found = true;\r
						}\r
					});\r
\r
					pchtml += "</p>"\r
					listHTML += "</ul>";					\r
					listHTML2 += "</ul>";\r
\r
					if (!found) {\r
						document.getElementById("resultTable").innerHTML =\r
							"Postcode not found.";\r
					} else {\r
						document.getElementById("resultTable").innerHTML =\r
							pchtml+ \r
							"<p>Geographies in Area Explorer</p>" + \r
							listHTML + \r
							"<p>Geographies not in Area Explorer</p>" + \r
							listHTML2;\r
					}\r
				})\r
				.catch((error) => {\r
					console.error("Error fetching data:", error);\r
					alert("Error fetching data. Please try again.");\r
				});\r
		}`),$=x(),A=p("style"),R=L(`.container {\r
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
		}`),this.h()},l(r){o=d(r,"BODY",{});var h=u(o);a=d(h,"DIV",{class:!0});var w=u(a);e=d(w,"DIV",{class:!0});var f=u(e);m=d(f,"H1",{});var Z=u(m);i=D(Z,"Enter your postcode to find its location"),Z.forEach(n),g=M(f),t=d(f,"INPUT",{type:!0,id:!0,placeholder:!0}),l=M(f),c=d(f,"BUTTON",{onclick:!0});var P=u(c);S=D(P,"Search"),P.forEach(n),v=M(f),_=d(f,"DIV",{id:!0}),u(_).forEach(n),f.forEach(n),w.forEach(n),h.forEach(n),H=M(r),b=d(r,"SCRIPT",{});var k=u(b);y=D(k,`function normalizePostcode(postcode) {\r
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
					let pchtml = "<p>";\r
					let listHTML = "<ul>";\r
					let listHTML2 = "<ul>";\r
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
							pchtml += \`<strong>Postcode:</strong> \${postcode}\`;\r
\r
							listHTML += \`<li>Local Government District: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/\${lgd2014}" target="_blank"><strong>\${LGD2014NAME}</strong></a></li>\`;\r
							listHTML += \`<li>District Electoral Area: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/\${DEA2014}" target="_blank"><strong>\${DEA2014NAME}</strong></a></li>\`;\r
							listHTML += \`<li>Super Data Zone: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/\${SDZ2021}" target="_blank"><strong>\${SDZ2021_name}</strong></a></li>\`;\r
							listHTML += \`<li>Data Zone: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/\${DZ2021}" target="_blank"><strong>\${DZ2021_name}</strong></a></li>\`;\r
							\r
							listHTML2 += \`<li>Urban / Rural:<strong> \${SETTLEMENT15_URBAN_RURAL}</strong></li>\`;\r
							listHTML2 += \`<li>Settlement:<strong> \${SETTLEMENT15}</strong></li>\`;\r
							listHTML2 += \`<li>Health and Social Care Trust:<strong> \${HSCTNAME}</strong></li>\`;\r
							listHTML2 += \`<li>Assembly Area Name:<strong> \${AA2008NAME}</strong></li>\`;\r
							listHTML2 += \`<li>Ward Name:<strong> \${WARD2014NAME}</strong></li>\`;\r
\r
							found = true;\r
						}\r
					});\r
\r
					pchtml += "</p>"\r
					listHTML += "</ul>";					\r
					listHTML2 += "</ul>";\r
\r
					if (!found) {\r
						document.getElementById("resultTable").innerHTML =\r
							"Postcode not found.";\r
					} else {\r
						document.getElementById("resultTable").innerHTML =\r
							pchtml+ \r
							"<p>Geographies in Area Explorer</p>" + \r
							listHTML + \r
							"<p>Geographies not in Area Explorer</p>" + \r
							listHTML2;\r
					}\r
				})\r
				.catch((error) => {\r
					console.error("Error fetching data:", error);\r
					alert("Error fetching data. Please try again.");\r
				});\r
		}`),k.forEach(n),$=M(r),A=d(r,"STYLE",{});var I=u(A);R=D(I,`.container {\r
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
		}`),I.forEach(n),this.h()},h(){E(t,"type","text"),E(t,"id","searchInput"),E(t,"placeholder","Enter postcode..."),E(c,"onclick","search()"),E(_,"id","resultTable"),E(e,"class","container"),E(a,"class","row")},m(r,h){T(r,o,h),s(o,a),s(a,e),s(e,m),s(m,i),s(e,g),s(e,t),s(e,l),s(e,c),s(c,S),s(e,v),s(e,_),T(r,H,h),T(r,b,h),s(b,y),T(r,$,h),T(r,A,h),s(A,R)},p:Y,d(r){r&&n(o),r&&n(H),r&&n(b),r&&n($),r&&n(A)}}}function K(N){let o,a,e,m,i,g;return i=new j({props:{column:"wide",$$slots:{default:[J]},$$scope:{ctx:N}}}),{c(){o=p("nav"),a=p("a"),e=L("Home"),m=x(),G(i.$$.fragment),this.h()},l(t){o=d(t,"NAV",{});var l=u(o);a=d(l,"A",{href:!0});var c=u(a);e=D(c,"Home"),c.forEach(n),l.forEach(n),m=M(t),W(i.$$.fragment,t),this.h()},h(){E(a,"href",F+"/")},m(t,l){T(t,o,l),s(o,a),s(a,e),T(t,m,l),z(i,t,l),g=!0},p(t,[l]){const c={};l&1&&(c.$$scope={dirty:l,ctx:t}),i.$set(c)},i(t){g||(V(i.$$.fragment,t),g=!0)},o(t){q(i.$$.fragment,t),g=!1},d(t){t&&n(o),t&&n(m),O(i,t)}}}class rt extends U{constructor(o){super(),B(this,o,null,K,C,{})}}export{rt as component};
