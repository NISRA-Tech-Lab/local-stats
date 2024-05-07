<script>
	import Section from "$lib/layout/Section.svelte";
	import { base } from "$app/paths";
	import { app_inputs} from "$lib/config";
</script>

<nav>
	<a href="{base}/">Home</a>
</nav>

<Section column="wide">
	<body>
		<div class="row">
			<div class="container">
				<h1>Enter your postcode to find its location</h1>
				<input
					type="text"
					id="searchInput"
					placeholder="Enter postcode..."
				/>
				<button onclick="search()">Search</button>
				<div id="resultTable"></div>
			</div>
		</div>
	</body>

	<script>
		function normalizePostcode(postcode) {
			// Remove all spaces from the postcode and convert to uppercase
			return postcode.replace(/\s/g, "").toUpperCase();
		}

		function search() {
			const searchTerm = normalizePostcode(
				document.getElementById("searchInput").value,
			);

			if (searchTerm === "") {
				alert("Please enter a postcode.");
				return;
			}

		    fetch("https://raw.githubusercontent.com/NISRA-Tech-Lab/nisra-geog-explorer/main/search_data/cpd_light_with_lat_long_2.csv")
				.then((response) => response.text())
				.then((data) => {
					const rows = data.split("\n");
					let found = false;

					// Prepare list HTML
					let pchtml = "<p>";
					let listHTML = "<ul>";
					let listHTML2 = "<ul>";

					rows.forEach((row) => {
						const columns = row.split(",");
						const postcode = normalizePostcode(columns[0]);

						if (postcode === searchTerm) {
							// Extract specific columns (lgd and ward)
							const lgd2014 = columns[4].trim();
							const LGD2014NAME = columns[5].trim();
							const WARD2014 = columns[6].trim();
							const WARD2014NAME = columns[7].trim();
							const DEA2014 = columns[8].trim();
							const DEA2014NAME = columns[9].trim();
							const AA2008 = columns[10].trim();
							const AA2008NAME = columns[11].trim();
							const HSCTNAME = columns[17].trim();
							const DZ2021 = columns[18].trim();
							const DZ2021_name = columns[19].trim();
							const SDZ2021 = columns[20].trim();
							const SDZ2021_name = columns[21].trim();
							const SETTLEMENT15 = columns[28].trim();
							const SETTLEMENT15_URBAN_RURAL = columns[29].trim();
							
							pchtml += `<strong>Postcode:</strong> ${postcode}`;

							listHTML += `<li>Local Government District: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/${lgd2014}" target="_blank"><strong>${LGD2014NAME}</strong></a></li>`;
							listHTML += `<li>District Electoral Area: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/${DEA2014}" target="_blank"><strong>${DEA2014NAME}</strong></a></li>`;
							listHTML += `<li>Super Data Zone: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/${SDZ2021}" target="_blank"><strong>${SDZ2021_name}</strong></a></li>`;
							listHTML += `<li>Data Zone: <a href="https://nisra-tech-lab.github.io/nisra-geog-explorer/${DZ2021}" target="_blank"><strong>${DZ2021_name}</strong></a></li>`;
							
							listHTML2 += `<li>Urban / Rural:<strong> ${SETTLEMENT15_URBAN_RURAL}</strong></li>`;
							listHTML2 += `<li>Settlement:<strong> ${SETTLEMENT15}</strong></li>`;
							listHTML2 += `<li>Health and Social Care Trust:<strong> ${HSCTNAME}</strong></li>`;
							listHTML2 += `<li>Assembly Area Name:<strong> ${AA2008NAME}</strong></li>`;
							listHTML2 += `<li>Ward Name:<strong> ${WARD2014NAME}</strong></li>`;

							found = true;
						}
					});

					pchtml += "</p>"
					listHTML += "</ul>";					
					listHTML2 += "</ul>";

					if (!found) {
						document.getElementById("resultTable").innerHTML =
							"Postcode not found.";
					} else {
						document.getElementById("resultTable").innerHTML =
							pchtml+ 
							"<p>Geographies in Area Explorer</p>" + 
							listHTML + 
							"<p>Geographies not in Area Explorer</p>" + 
							listHTML2;
					}
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
					alert("Error fetching data. Please try again.");
				});
		}
	</script>

	<style>

		.container {
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
			background-color: #fff;
			border-radius: 8px;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		}

		h1 {
			text-align: center;
			color: #333;
		}

		input[type="text"] {
			width: 100%;
			padding: 10px;
			margin-bottom: 10px;
			border: 1px solid #ddd;
			border-radius: 4px;
		}

		button {
			padding: 10px 20px;
			background-color: #007bff;
			color: #fff;
			border: none;
			border-radius: 4px;
			cursor: pointer;
		}

		button:hover {
			background-color: #0056b3;
		}

		#result {
			margin-top: 20px;
			padding: 10px;
			border: 1px solid #ddd;
			border-radius: 4px;
		}
	</style>
</Section>
