<script context="module">
	export const prerender = true;
	// getData is a function in utils.js that goes to a url input and looks for a return of csv data
	import { getData, adjectify } from "$lib/utils";
	// a constant with 3 string app_inputs, search_data - the places.csv, app_json_data - json files for each area code (accessed via app_inputs.app_json_data),
	// quantiles - not sure but not used in index currently
	import { app_inputs } from "$lib/config";

	// create a reference to the json for the current area to be loaded - called in the load() func below
	async function loadArea(code, fetch) {
		let res = await fetch(app_inputs.app_json_data + code + ".json");
		let json = await res.json();
		
		return json;
	}

	export async function load({ params, fetch }) {
		let code = params.code;

		let res = await getData(app_inputs.search_data, fetch);

		let lookup = {};
		res.forEach((d) => (lookup[d.code] = d.name));
		res.forEach((d) => {
			d.typepl = geog_types[d.type].pl;
			d.typenm = geog_types[d.type].name;
			//		  d.typestr = lookup[d.parent] ? `${lookup[d.parent]} includes ${types[d.type].name} within ${lookup[d.parent]}` : '';
			d.typestr = lookup[d.parent]
				? `${geog_types[d.type].name} within ${lookup[d.parent]}`
				: "";
		});

		let search_data = res.sort((a, b) => a.name.localeCompare(b.name));
		let ni = await loadArea("N92000002", fetch);
		let place = await loadArea(code, fetch);

		return {
			props: { search_data, place, ni },
		};
	}
</script>

<script>
	import { base } from "$app/paths";
	import { goto } from "$app/navigation";
	import { suffixer, changeClass, changeStr } from "$lib/utils";
	import { geog_types, topics, mapStyle, mapSources, mapLayers, mapPaint} from "$lib/config";
	import Section from "$lib/layout/Section.svelte";
	import Em from "$lib/ui/Em.svelte";
	import Select from "$lib/ui/Select.svelte";
	import Map from "$lib/map/Map.svelte";
	import MapSource from "$lib/map/MapSource.svelte";
	import MapLayer from "$lib/map/MapLayer.svelte";
	import ColChart from "$lib/chart/ColChart.svelte";
	import Legend_ColChart from "$lib/chart/Legend_ColChart.svelte";
	import StackedBarChart from "$lib/chart/StackedBarChart.svelte";
	import GroupChart from "$lib/chart/GroupChart.svelte";
	import BarChart from "$lib/chart/BarChart.svelte";
	import ProfileChart from "$lib/chart/ProfileChart.svelte";
	import AnalyticsBanner from "$lib/layout/AnalyticsBanner.svelte";
	import ScrollToTop from '$lib/ui/scroll.svelte';

	export let search_data, place, ni;

	let w, cols;
	let map = null;
	let comp_2011 = false;

	let active = {
		selected: null,
		type: null,
		childType: null,
		highlighted: [],
		hovered: null,
	};

	let isChild = {};
	Object.keys(mapLayers).forEach((key) => (isChild[key] = false));

	function makeData(props) {
		const sum = (a, b) => a + b;
		let category = props[0];
		let val = "perc";

		let source = place.data[category][val]["2021"];
		let sourcePrev = place.data[category][val]["2011"];
		let sourceNI = ni.data[category][val]["2021"];

		let keys = topics[category].map((d) => d.category);
		let labels = topics[category].map((d) => (d.label ? d.label : d.category));
		let data = keys.map((key, i) => {
			if (Array.isArray(key)) {
				return {
					x: labels[i],
					y: key.map((k) => source[k]).reduce(sum, 0),
					ni: key.map((k) => sourceNI[k]).reduce(sum, 0),
					prev: key.map((k) => sourcePrev[k]).reduce(sum, 0),
				};
			} else {
				return {
					x: labels[i],
					y: source[key],
					ni: sourceNI[key],
					prev: sourcePrev[key],
				};
			}
		});

		return data;
	}

	function makeDataGroupSort(data, key) {
	const categ = topics[key];
	let newdata = [];
	categ.forEach(c => {
		let rows = data.filter(d => d.category === c.category);
		let newrows = rows.map(d => ({
			group: d.group,
			category: c.label,
			perc: d.perc
		}));
		newdata = [...newdata, ...newrows];
	});
	return newdata;
	}

	function fitMap(bounds) {
		if (map) {
			map.fitBounds(bounds, { padding: 20 });
		}
	}

	function updateActive(place) {
		let prev = JSON.parse(JSON.stringify(active));
		let code = place.code;
		let type = place.type;
		let children = place.children[0]
			? place.children.map((d) => d.code)
			: [];
		let childType =
			place.type == "rgn"
				? "cty"
				: children[0]
				? place.children[0].type
				: null;

		active.selected = code;
		active.type = type;
		active.childType = childType;
		active.highlighted = children;

		let keys = Object.keys(mapLayers);
		let fillProps = ["fill-color", "fill-opacity"];
		let lineProps = ["line-color", "line-width", "line-opacity"];

		// Change layer visibility and paint properties if geography level changes
		if (
			map &&
			(active.type != prev.type || active.childType != prev.childType)
		) {
			// Set map layer visibility properties
			keys.forEach((key) => {
				let visibility =
					key == type || (childType && key == childType)
						? "visible"
						: "none";
				map.setLayoutProperty(key + "-fill", "visibility", visibility);
				map.setLayoutProperty(
					key + "-bounds",
					"visibility",
					visibility
				);
				if (place.parents[0]) {
					map.setLayoutProperty(
						key + "-self",
						"visibility",
						visibility
					);
				}
				isChild[key] = key == childType ? true : false;
			});

			// Set new paint properties
			if (place.parents[0]) {
				fillProps.forEach((prop) =>
					map.setPaintProperty(
						type + "-fill",
						prop,
						mapPaint[children[0] ? "fill-active" : "fill-self"][
							prop
						]
					)
				);
				lineProps.forEach((prop) => {
					map.setPaintProperty(
						type + "-bounds",
						prop,
						mapPaint["line-active"][prop]
					);
					map.setPaintProperty(
						type + "-self",
						prop,
						mapPaint["line-self"][prop]
					);
				});
			}
			if (childType) {
				fillProps.forEach((prop) =>
					map.setPaintProperty(
						childType + "-fill",
						prop,
						mapPaint["fill-child"][prop]
					)
				);
				lineProps.forEach((prop) =>
					map.setPaintProperty(
						childType + "-bounds",
						prop,
						mapPaint["line-child"][prop]
					)
				);
			}
		}
	}

	function update(place) {
		updateActive(place);
		fitMap(place.bounds);
	}

	function mapSelect(ev) {
		goto(`${base}/${ev.detail.code}/`, { noscroll: true });
	}

	function menuSelect(ev) {
		goto(`${base}/${ev.detail.value}/`, { noscroll: true });
	}

	function onResize() {
		cols =
			w < 575
				? 1
				: window
						.getComputedStyle(grid)
						.getPropertyValue("grid-template-columns")
						.split(" ").length;
	}

	$: w && onResize();
	$: chartLabel = comp_2011
		? "Same area 2011"
		: place && place.parents[0]
		? "NI 2021"
		: null;
	
	$: chart_compare_type = comp_none
				? null
				: comp_2011
				? "prev"
				: !comp_2011 && place.type != "ni"
				? "ni"
				: null;


	$: place && update(place);
	$: comp_ni = false;
	$: comp_none = true;

	$: topics_available = place.type != "ni" && place.type != "lgd"
		? false
		: true;



</script>

<svelte:head>
	<title>{place.name} NISRA Key Statistics</title>
	<meta name="description" content="" />
	<meta property="og:title" content="{place.name} Census Data" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{app_inputs.base}/{place.code}/" />
	<meta
		property="og:description"
		content="Explore NISRA Statistics for {place.name}."
	/>
	<meta name="description" content="Explore NISRA Statistics for {place.name}." />
</svelte:head>
<ScrollToTop />
<Section column="wide">

	{#if place && ni}

		<div class="grid mtl">
			<div>
				<span class="text-small">
					<a href="{base}/" sveltekit:noscroll>Home</a
					>{@html " &gt; "}
					{#if place.parents[0]}
						{#each [...place.parents].reverse() as parent, i}
							<a href="{base}/{parent.code}/" sveltekit:noscroll
								>{parent.name}</a
							>{@html " &gt; "}
						{/each}

						{place.name}
					{:else}
						{place.name}
					{/if}
				</span><br />
				<span class="text-big title">{place.name}</span>
				<div class="text-bold" style="font-size: 0.85em;">
					Click for: 
		
					{#if place.type == "ni"}
					<button
						class="btn"
						class:btn-active={!comp_2011}
						on:click={() => (comp_none = true)}
						on:click={() => (comp_2011 = false)}
						on:click={() => (comp_ni = false)}
						>No comparison</button
					>
					{:else}
					<button
						class="btn"
						class:btn-active={comp_none}
						on:click={() => (comp_none = true)}
						on:click={() => (comp_2011 = false)}
						on:click={() => (comp_ni = false)}
						>No comparison</button
					>
					{/if}
					{#if place.type != "ni"}
						<button
							class="btn"
							class:btn-active={comp_ni &
								!comp_none &
								!comp_2011}
							on:click={() => (comp_ni = true)}
							on:click={() => (comp_none = false)}
							on:click={() => (comp_2011 = false)}
							>NI comparison</button>
					{/if}
					
						{#if topics_available}
						<button
						class="btn"
						class:btn-active={comp_2011 & !comp_none & !comp_ni}
						on:click={() => (comp_2011 = true)}
						on:click={() => (comp_none = false)}
						on:click={() => (comp_ni = false)}
						>Same area 2011</button>
						{:else}
						<button
						class="btn"
						class:btn-active={comp_2011 & !comp_none & !comp_ni}
						on:click={() => (comp_2011 = false)}
						on:click={() => (comp_none = true)}
						on:click={() => (comp_ni = false)}
						>2011 data not available</button>
												{/if}
						
					
				</div>
			</div>
			
			<div>
				<div
					style="width: 350px; padding-top: 5px;"
					class:float-right={cols > 1}
				>
					<b>Search for your area:</b>
					<Select
						{search_data}
						group="typestr"
						search={true}
						on:select={menuSelect}
					/>

					<!-- Code credit: https://css-tricks.com/on-the-web-share-api/ -->

					<script>
						// Share button
						// Possible tooltip: https://stackoverflow.com/questions/37798967/tooltip-on-click-of-a-button

						function copyToClipboard(text) {
							var inputc = document.body.appendChild(
								document.createElement("input")
							);
							inputc.value = window.location.href;
							inputc.select();
							document.execCommand("copy");
							inputc.parentNode.removeChild(inputc);
							alert("URL Copied.");
						}

						(function (win, doc) {
							const testButton = doc.createElement("button");
							testButton.setAttribute("type", "share");
							if (testButton.type != "share") {
								win.addEventListener("click", function (ev) {
									ev = ev || win.event;
									let target = ev.target;
									let button = target.closest(
										'button[type="share"]'
									);
									if (button) {
										const title = "Share URL";
										const url = win.location.href;
										if (navigator.share) {
											navigator.share({
												title: title,
												url: url,
											});
										} else {
											copyToClipboard();
										}
									}
								});
							}
						})(this, this.document);
					</script>
							

					<!-- 			<button style="cursor: pointer; background-image: url('https://icons.getbootstrap.com/assets/icons/share.svg'); float: right; margin-top: 5px; margin-left: 8px; background-color: transparent !important; background-size: cover; width: 30px; height: 30px; border: 0" type="share"></button>
 -->
					<div width="100%">
						<button
							class="btn"
							style="width: 33%"
							title="Click to print this page to pdf or printer"
							onclick="window.print();return false;"
							>Print / PDF </button>
						<button
							class="btn"
							style="width: 33%"
							alt="Return to the landing page"
							onclick="window.location.href='{base}';"
							>Menu </button>
						<button
							class="btn"
							style="width: 30%"
							type="share"
							alt="Share this page">Share </button>
					</div>
				</div>
			</div>
		</div>

		<div id="grid" class="grid mt">
			<div class="div-grey-box" style="line-height: 1.3;">
				<h3 style="margin: 0 0 10px 0; line-height: 1.78;">Overview</h3>

				{#if place.type == "ni" || place.type == "ctry"}

					The population of {place.name} was {place.data.population.value[
						"2021"
					].all.toLocaleString()} at the time of the 2021 Census.
				{:else}
					The population of {place.name} was {place.data.population.value[
						"2021"
					].all.toLocaleString()} at the time of the 2021 Census, which
					made it the
					{#if place.data.population.value_rank["2021"].all == 1}
						largest {geog_types[place.type].name}.
					{:else if place.data.population.value_rank["2021"].all == place.count}
						smallest {geog_types[place.type].name}.
					{:else if place.data.population.value_rank["2021"].all <= (place.count + 1) / 2 && place.data.population.value_rank["2021"].all != 1}
						{place.data.population.value_rank[
							"2021"
						].all.toLocaleString()}{suffixer(
							place.data.population.value_rank["2021"].all
						)} largest {geog_types[place.type].name}.
					{:else}
					{(place.count + 1 - place.data.population.value_rank["2021"].all).toLocaleString()}{suffixer(
						place.count + 1 - place.data.population.value_rank["2021"].all
						)} smallest {geog_types[place.type].name}.
					{/if}
				{/if}
				{#if topics_available}
				{#if place.data.population.value.change.all == 0}
					No change in population since the 2011 Census.
				{:else if place.data.population.value.change.all > 0}
					An increase of {changeStr(
						place.data.population.value.change.all,
						"%",
						1
					)} since the 2011 Census.
				{:else}
					A decrease of {changeStr(
						place.data.population.value.change.all,
						"%",
						1
					)} since the 2011 Census.
				{/if}
				{/if}
			</div>
			<div class="div-grey-box">
				<div
					class="row"
					style="display: flex; cursor: pointer;"
					data-bs-toggle="collapse"
					data-bs-target="#pop-info"
					aria-expanded="false"
					aria-controls="pop-info"
				>
					<div class="blocktitle" style="margin: 0; width: 100%">
						Population <span style="color: gray; font-size: 14pt;"
							>{@html " &#x24D8; "}
						</span>
					</div>
				</div>
				<div class="collapse" id="pop-info">
					<div class="card card-body">
						Population is based on the number of usual residents. A
						usual resident is anyone who, on 21 March 2021 is in the
						UK, and staying in the UK for a period of 3 months or
						more; or has a permanent UK address and is outside the
						UK and is staying outside the UK for less than 12
						months. <a
							href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
							><strong>Statistical bulletins</strong></a
						>
					</div>
				</div>
				<span class="text-big" style="font-size: 2.8em;"
					>{place.data.population.value[
						"2021"
					].all.toLocaleString()}</span
				><br />
				{#if place.type != "ni"}
					{#if (place.type != "ctry") & comp_ni & !comp_2011}
						<span class="text-small "
							><Em
								>{place.data.population.value["2021"].all /
									ni.data.population.value["2021"].all >=
								0.001
									? (
											(place.data.population.value["2021"] .all / ni.data.population.value["2021"] 	.all) *
											100
									  ).toFixed(1)
									: "<0.1"}%</Em
							> of Northern Ireland population</span
						>
						<div class="text-small ">
							{#if place.type == "lgd"}
							{#if place.data.population.value_rank["2021"].all == 1}
								The largest
							{:else if place.data.population.value_rank["2021"].all == place.count}
								The smallest
							{:else if place.data.population.value_rank["2021"].all <= (place.count + 1) / 2 && place.data.population.value_rank["2021"].all != 1}
								{place.data.population.value_rank["2021"].all.toLocaleString()}{suffixer(place.data.population.value_rank["2021"].all)} largest
							{:else}
								{(place.count + 1 - place.data.population.value_rank["2021"].all).toLocaleString()}{suffixer(place.count + 1 - place.data.population.value_rank["2021"].all)} smallest
							{/if}
							population of {place.count.toLocaleString()}
							{geog_types[place.type].pl} 	
							{/if} 							

						</div>
					{/if}
				{/if}
				{#if topics_available && comp_2011}
					<span class="text-small "
						><Em
							><span
								class={changeClass(place.data.population.value.change.all)}
								>{changeStr(place.data.population.value.change.all,"%",1)}</span
							></Em
						> since 2011 Census</span
					>
				{/if}
			</div>
			<div class="div-grey-box">
				<div
					class="row"
					style="display: flex; cursor: pointer;"
					data-bs-toggle="collapse"
					data-bs-target="#households-info"
					aria-expanded="false"
					aria-controls="households-info"
				>
					<div class="blocktitle" style="margin: 0; width: 100%">
						Households<span style="color: gray; font-size: 14pt;"
							>{@html " &#x24D8; "}</span
						>
					</div>
				</div>
				<div class="collapse" id="households-info">
					<div class="card card-body">
						A household is either one person living alone or a group
						of people living at the same address who share cooking
						facilities and share a living room, sitting room or
						dining area. <a
							href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
							><strong>Statistical bulletins</strong></a
						>
					</div>
				</div>
				<span class="text-big" style="font-size: 2.8em;"
					>{place.data.households.value[
						"2021"
					].all_households.toLocaleString()}</span
				><br />
				{#if (place.type != "ni") & comp_ni}
					<span class="text-small"
						><Em
							>{place.data.households.value["2021"]
								.all_households /
								ni.data.households.value["2021"]
									.all_households >=
							0.001
								? (
										(place.data.households.value["2021"]
											.all_households /
											ni.data.households.value["2021"] .all_households) *
										100
								  ).toFixed(1)
								: "<0.1"}%</Em
						> of Northern Ireland households</span
					>
				{/if}
				{#if topics_available && comp_2011}
					<span class="text-small"
						><Em
							><span
								class={changeClass(
									place.data.households.value.change
										.all_households
								)}
								>{changeStr(
									place.data.households.value.change
										.all_households,
									"%",
									1
								)}</span
							></Em
						> since 2011 Census</span
					>
				{/if}
			</div>


		
				</div>
				<!-- a19e9e -->
		<div class="grid mt" bind:clientWidth={w}>
			<div style="grid-column: span {cols};">
				<h3>
					<!-- Explore <span style="color: #93328E">{place.name}</span> -->
					{#if place.type != "ni"}
					Explore <span style="color: #93328E">{place.name}</span> 
					<span style="color: #a19e9e">- {geog_types[place.type].name}</span>
					{:else} 
					Explore <span style="color: #93328E">{place.name}</span>
					{/if}

				</h3>
			</div>
			<div
				id="map"
				style="padding-right: 45px; grid-column: span {cols == 2
					? 2
					: cols && cols > 2
					? cols - 1
					: 1};  ">
				<Map
					bind:map
					location={{ bounds: place.bounds }}
					options={{ fitBoundsOptions: { padding: 20 } }}
					style={mapStyle}
				>
					{#each ["dz", "sdz", "ward", "dea", "lgd"] as key}
						<MapSource {...mapSources[key]}>
							<MapLayer
								{...mapLayers[key]}
								id="{key}-fill"
								type="fill"
								isChild={isChild[key]}
								click={true}
								selected={active.selected}
								on:select={mapSelect}
								highlight={true}
								highlighted={active.highlighted}
								hover={true}
								hovered={active.hovered}
								layout={{
									visibility:
										active.type == key ||
										active.childType == key
											? "visible"
											: "none",
								}}
								paint={active.type == key
									? mapPaint["fill-self"]
									: active.childType == key
									? mapPaint["fill-child"]
									: mapPaint.fill}
							/>
							<MapLayer
								{...mapLayers[key]}
								id="{key}-bounds"
								type="line"
								selected={active.selected}
								highlight={true}
								highlighted={active.highlighted}
								layout={{
									visibility:
										active.type == key ||
										active.childType == key
											? "visible"
											: "none",
								}}
								paint={active.type == key
									? mapPaint["line-active"]
									: active.childType == key
									? mapPaint["line-child"]
									: mapPaint.line}
							/>
							<MapLayer
								{...mapLayers[key]}
								id="{key}-self"
								type="line"
								selected={active.selected}
								layout={{
									visibility:
										active.type == key ? "visible" : "none",
								}}
								paint={active.type == key
									? mapPaint["line-self"]
									: mapPaint.line}
							/>
						</MapSource>
					{/each}
				</Map>
			</div>
<!-- OPTION 1 a list of LGDs - probably only suitable for LGD data only -->
<!-- 			<div>
				<span>
					{#if place.parents[0]}
						{#each [...place.parents].reverse() as parent, i}
							<span>{place.name} is located in </span><span
								class="text-bold"
								><a
									href="{base}/{parent.code}/"
									sveltekit:noscroll>{parent.name}</a
								></span
							>
						{/each}
					{/if}
				</span>
			</div>
			<div>
				<span
					><ul style="padding-left:0;">
						{#if ni.children[0]}
							<span class="text-bold"
								>Districts within Northern Ireland</span
							><br />
							{#each ni.children as child, i}
								<li
									style="margin: 3px; display: block; line-height: 20px; padding-bottom: 5px"
								>
									<a
										href="{base}/{child.code}/"
										sveltekit:noscroll>{child.name}</a
									>{i < ni.children.length - 1 ? "" : ""}
								</li>
							{/each}
						{:else}
							<span class="muted"
								>No areas within {place.name}</span
							>
						{/if}
					</ul></span
				>
			</div> -->
<!-- OPTION 2 like original app navigation to RHS of map -->
 			<div>
				{#if place.parents[0]}
				<span class="text-bold">Parents of {place.name} </span><br/>
				<span class="text-small">
				{#each [...place.parents].reverse() as parent, i}
				<span style="display: block; margin-left: {i > 0 ? (i - 1) * 15 : 0}px">{@html i > 0 ? '↳ ' : ''}<a href="{base}/{parent.code}" sveltekit:noscroll>{parent.name}</a></span>
				{/each}
			</span>
			{:else}
	<!-- 			<span class="muted">No parents for {place.name}</span>
 -->				{/if}
			</div>
			<div>
				{#if place.children[0]}
				<span class="text-bold">{place.children[0] ? geog_types[place.children[0].type].pl : 'Areas'} within {place.name}</span><br/>
				<span class="text-small">
				{#each place.children as child, i}
				<a href="{base}/{child.code}" sveltekit:noscroll>{child.name}</a>{ i < place.children.length - 1 ? ', ' : ''}
				{/each}
			</span>
			{:else}
				<span class="muted">No areas below {place.name} {geog_types[place.type].name}</span>
				{/if}
			</div>
			
		</div>



	
		<div class="accordion" id="accordionPanelsStayOpenExample">

			<div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-headingZero">
				  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseZero" aria-expanded="false" aria-controls="panelsStayOpen-collapseZero">
					  <span class="accordion-button-title">Area Information</span> 
					  
				  </button>
				</h2>
				<div id="panelsStayOpen-collapseZero" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingZero">
				  <div class="accordion-body">
					  Census 2021 - {place.name} - <span class="accordion-button-title-sub">Location, Area and Population density</span>
	
					  <div class="grid mt" bind:clientWidth={w}>
						  
						 
						<div class="div-grey-box" style="line-height: 1.3;">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#location-info"
								aria-expanded="false"
								aria-controls="location-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Location<span style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="location-info">
								<div class="card card-body">
									Information about the area including its geographical hierarchy.
								</div>
							</div>
							<br>{#if place.type != "ni" & place.type !="lgd"}
									{place.name} is one of {place.count.toLocaleString()} {geog_types[place.type].pl}.  
									It is located within {place.parents[0].name} {geog_types[place.parents[0].type].name}.
										
								{:else if place.type != "ni" & place.type =="lgd"}
								{place.name} is one of {place.count.toLocaleString()} {geog_types[place.type].pl}.
								 It is located within {place.parents[0].name}.  
								
							 <!--and is {(place.hectares.toLocaleString())} hectares in size--> <!--
							{#if place.type != "lgd"}
							It has {place.data.population.value_rank["2021"].all > place.count * 0.333 && place.data.population.value_rank["2021"].all < place.count * 0.667 ? "an average size "
							 : place.data.population.value_rank["2021"].all < place.count * 0.333 ? "a large "
								: "a small "}  {geog_types[place.type].name} population.
							{/if}-->
							{:else}
							{place.name} contains 11 Local Goverment Districts, 80 District Electoral Areas, 850 Super Data Zones and 3780 Data Zones.
			
							{/if}
						</div>
						<div class="div-grey-box" >
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#Area-info"
								aria-expanded="false"
								aria-controls="Area-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Area <span style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="Area-info">
								<div class="card card-body">
									 Area is measured in hectares (ha), it is rounded to the nearest whole number.
								</div>
							</div>
							<span class="text-big" style="font-size: 2.8em;"
							>{ place.hectares >= 0.1? ( place.hectares).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
								: "<0.1"} ha

						</div>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#popden-info"
								aria-expanded="false"
								aria-controls="popden-info">
								<div class="blocktitle" style="margin: 0; width: 100%">
									Population density<span style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="popden-info">
								<div class="card card-body">
									Population density is the number of usual residents per hectare. It is rounded to 1 d.p.
								</div>
							</div>
							<span class="text-big" style="font-size: 2.8em;"
							>{place.data.population.value["2021"].all / place.hectares >= 0.1
								? ((place.data.population.value["2021"].all / place.hectares)).toFixed(1) 
								: "<0.1"}
							</span>
							{#if place.type != "ni" && comp_ni}
							<br>
							<span class="text-small">{place.data.population.value["2021"].all / place.hectares > ni.data.population.value["2021"].all / ni.hectares * 1.1
								? "Higher than Northern Ireland value of "
								: place.data.population.value["2021"].all / place.hectares < ni.data.population.value["2021"].all / ni.hectares * 0.9 
								? "Lower than Northern Ireland value of "
								: "Similar to the Northern Ireland value of "}
							{((ni.data.population.value["2021"].all / ni.hectares)).toFixed(1)} persons per hectare</span>
							{/if}
							</div>
					  </div>
	
	
				  </div>
				</div>
			  </div>
	



			  {#if topics_available} 



			<div class="accordion-item">
			  <h2 class="accordion-header" id="panelsStayOpen-headingOne">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
					<span class="accordion-button-title">Demography</span> 

				</button>
			  </h2>
			  <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
				<div class="accordion-body">
					Census 2021 - {place.name} - <span class="accordion-button-title-sub">Broad age bands (years), Sex, Household size</span>

				
					<div class="grid mt" bind:clientWidth={w}>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#broadagebands-info"
								aria-expanded="false"
								aria-controls="broadagebands-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Broad age bands (years) <span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="broadagebands-info">
								<div class="card card-body">
									A grouping of ages where a person’s age is their age
									at their last birthday on or prior to census day. <a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
		
							<div
								class="chart"
								style="height: 100px; padding-bottom: 5px"
							>
								<ColChart
									data={place && makeData(["age"])}
									zKey={chart_compare_type}
								/>
							</div>
							{#if !comp_none && chartLabel}
								<div class="text-small muted; ">
									<svg
										width="25"
										height="4"
										style="display: inline-block;margin-bottom: 3px;"
									>
										<rect
											width="25"
											height="4"
											style="fill:#CEDC20;"
										/>
									</svg>
									{chartLabel}
								</div>
							{/if}
							<div><Legend_ColChart 
							data = {place && makeData(["age"])} 
							zkey = {chart_compare_type} /></div>
				</div>
						<div class = "div-grey-box">
				<div class="blocktitle" style="margin: 0; width: 100%">Sex</div>

				<StackedBarChart data="{place && makeData_year(['sex'],['2011'],['2021'])}" zKey="{chart_compare_type}" label={chartLabel}/>
<!-- 				<br>
				{#if comp_none || (comp_ni && place.type == "ni")}
					<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.sex,"sex")} zKey="group"	label={chartLabel}/>
				{:else if comp_2011}
					<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.sex,"sex")} zKey="group"	label={chartLabel}/>
				{:else if comp_ni && place.type != "ni"}
					<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.sex,"sex")} zKey="group"	label={chartLabel}/>
				{/if}
 -->
			</div>
			 <div class = "div-grey-box">
				<div class="row" style="display: flex; cursor: pointer;" data-bs-toggle="collapse" data-bs-target="#hhsize-info" aria-expanded="false" aria-controls="hhsize-info">
					<div class="blocktitle" style="margin: 0; width: 100%">Household size<span style="color: gray; font-size: 14pt;">{@html ' &#x24D8; '}</span></div>
				</div>
				<div class="collapse" id="hhsize-info">
					<div class="card card-body">
						The number of usual residents in the household.      <a href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"><strong>Statistical bulletins</strong></a>
					</div>
				</div>

				<StackedBarChart data="{place && makeData(['hh_size'])}" zKey="{chart_compare_type}" label={chartLabel}/>
<!-- 				<br>
				{#if comp_none || (comp_ni && place.type == "ni")}
					<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.hh_size,"hh_size")} zKey="group"	label={chartLabel}/>
				{:else if comp_2011}
					<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.hh_size,"hh_size")} zKey="group"	label={chartLabel}/>
				{:else if comp_ni && place.type != "ni"}
					<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.hh_size,"hh_size")} zKey="group"	label={chartLabel}/>
				{/if}
 -->
			</div> 


				</div>
			  </div>
			</div>
			<div class="accordion-item">
			  <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
					<img src="/img/nisra-taxonomy-icon-agriculture.png" alt="logo" height="40" class="accordion-dept-logo">
					<span class="accordion-button-title">   Agriculture and Environment</span> 
				</button>
			  </h2>
			  <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
				<div class="accordion-body">
					Agriculture - {place.name} - <span class="accordion-button-title-sub">Number of farms, Farm size, xxxx

					<div class="grid mt" bind:clientWidth={w}>
						<div class="div-grey-box" style="line-height: 1.3;">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#location-info"
								aria-expanded="false"
								aria-controls="location-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Number of farms<span style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
						</div>
						<div class="collapse" id="location-info">
								<div class="card card-body">
									Information about the area including its geographical hierarchy.
								</div>
							</div>
							<div>
								<span class="text-big" style="font-size: 2.8em;"
							>25,000
							</div>
						</div>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#cob-info"
								aria-expanded="false"
								aria-controls="cob-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Farms by size<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="cob-info">
								<div class="card card-body">
									Publication :  <a
										href="https://www.daera-ni.gov.uk/publications/agricultural-census-northern-ireland-2023"
										><strong>Farm Census</strong></a
									>
									Data portal :  <a
										href="https://data.nisra.gov.uk/table/FCDEA"
										><strong>Farm Census</strong></a
									>

									
								</div>
							</div>
							<!-- <StackedBarChart
								data={place && makeData(["cob"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
							<br> -->
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{/if}
							</div>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#passport-info"
								aria-expanded="false"
								aria-controls="passport-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Passport(s) held<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="passport-info">
								<div class="card card-body">
									Passport or passports that an individual holds. <a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart
								data={place && makeData(["passport"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/><!-- 
							<br>
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.passport,"passport")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.passport,"passport")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.passport,"passport")} zKey="group"	label={chartLabel}/>
							{/if} -->
									</div>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#natid-info"
								aria-expanded="false"
								aria-controls="natid-info"
							>
								<div
									class="blocktitle"
									style="font-size: 1.02em; margin: 0; width: 100%"
								>
									National identity (person based)<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="natid-info">
								<div class="card card-body">
									The nationality or nationalities that the person
									identifies with. <a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart
								data={place && makeData(["natid"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
<!-- 							<br>
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.natid,"natid")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.natid,"natid")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.natid,"natid")} zKey="group"	label={chartLabel}/>
							{/if} -->
									</div>
					</div>


				</div>
			  </div>
			</div>
			<div class="accordion-item">
			  <h2 class="accordion-header" id="panelsStayOpen-headingThree">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
					<span class="accordion-button-title">Language</span>
				</button>
			  </h2>
			  <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
				<div class="accordion-body">
					Census 2021 - {place.name} - <span class="accordion-button-title-sub">Main language, Knowledge of Irish, Knowledge of Ulster-Scots</span>


					<div class="grid mt" bind:clientWidth={w}>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#mainlang-info"
								aria-expanded="false"
								aria-controls="mainlang-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Main language<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="mainlang-info">
								<div class="card card-body">
									Person's main language as declared in the Census.
									Statistics for all language questions are restricted
									to persons aged 3 and over. <a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart
								data={place && makeData(["mainlang"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
<!-- 							<br>
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.mainlang,"mainlang")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.mainlang,"mainlang")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.mainlang,"mainlang")} zKey="group"	label={chartLabel}/>
							{/if} -->
									</div>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#irish-info"
								aria-expanded="false"
								aria-controls="irish-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Knowledge of Irish<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="irish-info">
								<div class="card card-body">
									A person has some ability in Irish if they can
									understand, speak, read or write Irish. Statistics
									for all language questions are restricted to persons
									aged 3 and over. <a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart 
								data={place && makeData(["irish"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
<!-- 							<br>
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.irish,"irish")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.irish,"irish")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.irish,"irish")} zKey="group"	label={chartLabel}/>
							{/if} -->
									</div>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#ulster-info"
								aria-expanded="false"
								aria-controls="ulster-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Knowledge of Ulster-Scots<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="ulster-info">
								<div class="card card-body">
									A person has some ability in Ulster-Scots if they
									can understand, speak, read or write Ulster-Scots.
									Statistics for all language questions are restricted
									to persons aged 3 and over. <a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart
								data={place && makeData(["ulster"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
<!-- 							<br>
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.ulster,"ulster")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.ulster,"ulster")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.ulster,"ulster")} zKey="group"	label={chartLabel}/>
							{/if} -->
									</div>
					</div>

				</div>
			  </div>
			</div>


			<div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-headingFour">
				  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseFour">
					<span class="accordion-button-title">Religion & Ethnicity</span>
					
				  </button>
				</h2>
				<div id="panelsStayOpen-collapseFour" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingFour">
				  <div class="accordion-body">
					Census 2021 - {place.name} - <span class="accordion-button-title-sub">Religion, Religion or religion brought up in, Ethnic group</span>
  

					<div class="grid mt" bind:clientWidth={w}>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#rel-info"
								aria-expanded="false"
								aria-controls="rel-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Religion<span style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="rel-info">
								<div class="card card-body">
									Religion, religious denomination or body the person
									indicated they belong to. <a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart
								data={place && makeData(["religion"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
<!-- 							<br>
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.religion,"religion")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.religion,"religion")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.religion,"religion")} zKey="group"	label={chartLabel}/>
							{/if} -->
									</div>
						 <div class = "div-grey-box">
				<div class="row" style="display: flex; cursor: pointer;" data-bs-toggle="collapse" data-bs-target="#relbup-info" aria-expanded="false" aria-controls="relbup-info">
					<div class="blocktitle" style="margin: 0; width: 100%">Religion, Religion brought up<span style="color: gray; font-size: 14pt;">{@html ' &#x24D8; '}</span></div>
				</div>
				<div class="collapse" id="relbup-info">
					<div class="card card-body">
						The religious group the person belongs to or for people with no current religion their religious group of upbringing. People with no current religion and no religion of upbringing are labelled 'None'.    <a href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"><strong>Statistical bulletins</strong></a>
					</div>
				</div>
				<StackedBarChart data="{place && makeData(['religion_or_religion_brought_up_in'])}" zKey="{chart_compare_type}" label={chartLabel}/>
<!-- 				<br>
				{#if comp_none || (comp_ni && place.type == "ni")}
					<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.religion_or_religion_brought_up_in,"religion_or_religion_brought_up_in")} zKey="group"	label={chartLabel}/>
				{:else if comp_2011}
					<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.religion_or_religion_brought_up_in,"religion_or_religion_brought_up_in")} zKey="group"	label={chartLabel}/>
				{:else if comp_ni && place.type != "ni"}
					<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.religion_or_religion_brought_up_in,"religion_or_religion_brought_up_in")} zKey="group"	label={chartLabel}/>
				{/if} -->
					</div>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#ethnic-info"
								aria-expanded="false"
								aria-controls="ethnic-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Ethnic group<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="ethnic-info">
								<div class="card card-body">
									Person’s ethnic group as declared in the Census. <a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart
								data={place && makeData(["ethnic"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
<!-- 							<br>
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.ethnic,"ethnic")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.ethnic,"ethnic")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.ethnic,"ethnic")} zKey="group"	label={chartLabel}/>
							{/if} -->
									</div>
					</div>
  
				  </div>
				</div>
			  </div>

			  <div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-headingFive">
				  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFive" aria-expanded="false" aria-controls="panelsStayOpen-collapseFive">
					<span class="accordion-button-title">Health & Care</span>
				  </button>
				</h2>
				<div id="panelsStayOpen-collapseFive" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingFive">
				  <div class="accordion-body">
					Census 2021 - {place.name} - <span class="accordion-button-title-sub">General health, Long-term health problem or disability, Long-term health conditions, Unpaid care</span>
  
					<div class="grid mt" bind:clientWidth={w}>
								<div class="div-grey-box">
									<div
										class="row"
										style="display: flex; cursor: pointer;"
										data-bs-toggle="collapse"
										data-bs-target="#gen-health-info"
										aria-expanded="false"
										aria-controls="gen-health"
									>
										<div
											class="blocktitle"
											style="margin: 0; width: 100%"
										>
											General health<span
												style="color: gray; font-size: 14pt;"
												>{@html " &#x24D8; "}</span
											><br>
										</div>
									</div>
									<div class="collapse" id="gen-health-info">
										<div class="card card-body">
											General health is a self-assessment of a
											person’s general state of health. It is not
											based over any specified period of time.
											<a
												href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
												><strong>Statistical bulletins</strong></a
											>
										</div>
									</div>
									<StackedBarChart
										data={place &&
											makeData(["general_health"])}
										zKey={chart_compare_type}
										label={chartLabel}
									/>
<!-- 									<br>
									{#if comp_none || (comp_ni && place.type == "ni")}
										<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.general_health,"general_health")} zKey="group"	label={chartLabel}/>
									{:else if comp_2011}
										<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.general_health,"general_health")} zKey="group"	label={chartLabel}/>
									{:else if comp_ni && place.type != "ni"}
										<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.general_health,"general_health")} zKey="group"	label={chartLabel}/>
									{/if} -->
													</div>
								<div class="div-grey-box">
									<div
										class="row"
										style="display: flex; cursor: pointer;"
										data-bs-toggle="collapse"
										data-bs-target="#lti-info"
										aria-expanded="false"
										aria-controls="lti-info"
									>
										<div
											class="blocktitle"
											style="font-size: 0.85em; margin: 0; width: 100%"
										>
											Long-term health problem or disability<span
												style="color: gray; font-size: 14pt;"
												>{@html " &#x24D8; "}</span
											>
										</div>
									</div>
									<div class="collapse" id="lti-info">
										<div class="card card-body">
											A self-assessment of whether a person has a long-term health problem or disability that limits daily activities and which has lasted, or is expected to last, at least 12 months. It includes problems that are due to old age. <a
												href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
												><strong>Statistical bulletins</strong></a
											>
										</div>
									</div>
 									<StackedBarChart
										data={place &&
											makeData([
												"long_term_disability"
											])}
										zKey={chart_compare_type}
										label={chartLabel}
									/>
									<!-- <br> 
									{#if comp_none || (comp_ni && place.type == "ni")}
										<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.long_term_disability,"long_term_disability")} zKey="group"	label={chartLabel}/>
									{:else if comp_2011}
										<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.long_term_disability,"long_term_disability")} zKey="group"	label={chartLabel}/>
									{:else if comp_ni && place.type != "ni"}
										<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.long_term_disability,"long_term_disability")} zKey="group"	label={chartLabel}/>
									{/if} -->
													</div>
								<div class="div-grey-box">
									<div
										class="row"
										style="display: flex; cursor: pointer;"
										data-bs-toggle="collapse"
										data-bs-target="#lt-cond-info"
										aria-expanded="false"
										aria-controls="lt-cond-info"
									>
										<div
											class="blocktitle"
											style="font-size: 1.02em; margin: 0; width: 100%"
										>
											Long-term health conditions<span
												style="color: gray; font-size: 14pt;"
												>{@html " &#x24D8; "}</span
											><br>
										</div>
									</div>
									<div class="collapse" id="lt-cond-info">
										<div class="card card-body">
											A self-assessment of whether a person has a long-term health condition that has lasted, or is expected to last, at least 12 months. Examples include, but are not limited to, deafness or partial hearing loss, mobility or dexterity difficulty that requires the use of a wheelchair, and intellectual or learning disability.
									<a
												href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
												><strong>Statistical bulletins</strong></a
											>
										</div>
									</div>
									<StackedBarChart
										data={place &&
											makeData([
												"number_of_long_term_health"
											])}
										zKey={chart_compare_type}
										label={chartLabel}
									/>
<!-- 	 								<br>
									{#if comp_none || (comp_ni && place.type == "ni")}
										<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.number_of_long_term_health,"number_of_long_term_health")} zKey="group"	label={chartLabel}/>
									{:else if comp_2011}
										<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.number_of_long_term_health,"number_of_long_term_health")} zKey="group"	label={chartLabel}/>
									{:else if comp_ni && place.type != "ni"}
										<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.number_of_long_term_health,"number_of_long_term_health")} zKey="group"	label={chartLabel}/>
									{/if} -->
													</div>
								<div class="div-grey-box">
									<div
										class="row"
										style="display: flex; cursor: pointer;"
										data-bs-toggle="collapse"
										data-bs-target="#unpaid-info"
										aria-expanded="false"
										aria-controls="unpaid-info"
									>
										<div
											class="blocktitle"
											style="font-size: 1.02em; margin: 0; width: 100%"
										>
											Unpaid care<span
												style="color: gray; font-size: 14pt;"
												>{@html " &#x24D8; "}</span
											>
										</div>
									</div>
									<div class="collapse" id="unpaid-info">
										<div class="card card-body">
											'Unpaid care' covers looking after, giving help
											or support to anyone because they have long-term
											physical or mental health conditions or
											illnesses, or problems related to old age. It
											does not include any activities as part of paid
											employment. All unpaid care statistics are restricted 
											to persons aged 5 and over.
											<a
												href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
												><strong>Statistical bulletins</strong></a
											>
										</div>
									</div>
									<StackedBarChart
										data={place &&
											makeData(["provision_care"])}
										zKey={chart_compare_type}
										label={chartLabel}
									/>
<!-- 									<br>
									{#if comp_none || (comp_ni && place.type == "ni")}
										<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.provision_care,"provision_care")} zKey="group"	label={chartLabel}/>
									{:else if comp_2011}
										<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.provision_care,"provision_care")} zKey="group"	label={chartLabel}/>
									{:else if comp_ni && place.type != "ni"}
										<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.provision_care,"provision_care")} zKey="group"	label={chartLabel}/>
									{/if} -->
													</div>
							</div>

  
				  </div>
				</div>
			  </div>




			  <div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-headingSix">
				  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseSix" aria-expanded="false" aria-controls="panelsStayOpen-collapseSix">
					<span class="accordion-button-title">Housing & Accommodation</span>
				  </button>
				</h2>
				<div id="panelsStayOpen-collapseSix" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingSix">
				  <div class="accordion-body">
					Census 2021 - {place.name} - <span class="accordion-button-title-sub">Accommodation type, Household adaptations, Central heating, Renewable energy systems, Household tenure, Car or van availability</span>
  
		
					<div class="grid mt" bind:clientWidth={w}>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#acc-type-info"
								aria-expanded="false"
								aria-controls="acc-type-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Accommodation type<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="acc-type-info">
								<div class="card card-body">
									The type of accommodation occupied by a household. <a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart data={place && makeData(["accommodation_type"])}
								zKey={chart_compare_type}
								label={chartLabel}/>
<!-- 							<br>
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.accommodation_type,"accommodation_type")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.accommodation_type,"accommodation_type")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.accommodation_type,"accommodation_type")} zKey="group"	label={chartLabel}/>
							{/if} -->
									</div>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#adapt-info"
								aria-expanded="false"
								aria-controls="adapt-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Household adaptations<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="adapt-info">
								<div class="card card-body">
									Household accommodation that has been adapted or designed for one or more of the following: internal wheelchair usage; external wheelchair access; other physical or mobility difficulties; visual difficulties; hearing difficulties; or other.
									<a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart
								data={place &&
									makeData(["number_of_adaptations"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
<!-- 							<br>
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.number_of_adaptations,"number_of_adaptations")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.number_of_adaptations,"number_of_adaptations")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.number_of_adaptations,"number_of_adaptations")} zKey="group"	label={chartLabel}/>
							{/if} -->
									</div>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#heat-info"
								aria-expanded="false"
								aria-controls="heat-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Central heating<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="heat-info">
								<div class="card card-body">
									Central heating is a central system that generates heat for multiple rooms. It is classified by fuel type.
									<a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart
								data={place &&
									makeData(["central_heating"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
<!-- 							<br>
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.central_heating,"central_heating")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.central_heating,"central_heating")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.central_heating,"central_heating")} zKey="group"	label={chartLabel}/>
							{/if} -->
									</div>
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#renew-info"
								aria-expanded="false"
								aria-controls="renew-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Renewable energy systems<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="renew-info">
								<div class="card card-body">
									Renewable energy systems used to generate heat or energy for a household. Examples include: solar panels for electricity; solar panels for heating water; biomass and wind turbines.
									<a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart
								data={place &&
									makeData(["renewable_energy"])}
								zKey={chart_compare_type}
								label={chartLabel}
								topic_prev_available = {false}
							/>

							<br>
<!-- 							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.renewable_energy,"renewable_energy")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
							<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.renewable_energy,"renewable_energy")} zKey="group"	label={chartLabel}/>
							2011 comparison not available
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.renewable_energy,"renewable_energy")} zKey="group"	label={chartLabel}/>
							{/if} -->


									</div>
		
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#tenure-info"
								aria-expanded="false"
								aria-controls="tenure-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Household tenure<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="tenure-info">
								<div class="card card-body">
									Whether a household owns or rents its accommodation and, if rented, who the landlord is. 
									<a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart
								data={place && makeData(["hh_tenure"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
<!-- 							<br>
							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.hh_tenure,"hh_tenure")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.hh_tenure,"hh_tenure")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.hh_tenure,"hh_tenure")} zKey="group"	label={chartLabel}/>
							{/if} -->
									</div>
		
						<div class="div-grey-box">
							<div
								class="row"
								style="display: flex; cursor: pointer;"
								data-bs-toggle="collapse"
								data-bs-target="#car-info"
								aria-expanded="false"
								aria-controls="car-info"
							>
								<div class="blocktitle" style="margin: 0; width: 100%">
									Car or van availability<span
										style="color: gray; font-size: 14pt;"
										>{@html " &#x24D8; "}</span
									>
								</div>
							</div>
							<div class="collapse" id="car-info">
								<div class="card card-body">
									The number of cars or vans that are owned, or
									available for use, by members of a household. It
									includes company cars and vans that are available
									for private use.
									<a
										href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins"
										><strong>Statistical bulletins</strong></a
									>
								</div>
							</div>
							<StackedBarChart
								data={place && makeData(["car_or_van"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
							<br>
<!-- 							{#if comp_none || (comp_ni && place.type == "ni")}
								<GroupChart data={makeDataGroupSort(place.grouped_data_nocompare.car_or_van,"car_or_van")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<GroupChart data={makeDataGroupSort(place.grouped_data_timecompare.car_or_van,"car_or_van")} zKey="group"	label={chartLabel}/>
							{:else if comp_ni && place.type != "ni"}
								<GroupChart data={makeDataGroupSort(place.grouped_data_areacompare.car_or_van,"car_or_van")} zKey="group"	label={chartLabel}/>
							{/if}
 -->									</div>
					</div>
 
				  </div>
				</div>
			  </div>





		  </div>
		  
		{:else}
			<br>
			<div class="div-grey-box">
				<h3 style="margin: 0 0 10px 0; line-height: 1.78;">No other topics are available.</h3>
				 Further data will be added to this app as it is released.
			</div>
		{/if}
		
	</div>
	{/if}
</Section>

<style>
	a {
		color: rgb(0, 60, 87);
	}
	h3 {
		margin-top: 12px;
	}
	h2 {
		margin-top: 20px;
		page-break-before: always;
	}

	.div-grey-box {
		line-height: 1.78;
		overflow: hidden;
		box-shadow: 0 2px #4140424d;
		background-color: #f5f5f6;
		padding: 16px 16px;
	}
	.btn {
		padding: 2px 4px;
		margin: 0.2;
		border: 2px solid #00205b;
		cursor: pointer;
		color: #00205b;
		background-color: lightgrey;
	}
	.btn-active {
		color: white;
		background-color: #00205b;
	}
 	.increase {
		color: darkgreen;
	}
	.increase::before {
		content: "▲";
		color: darkgreen;
	}
	.decrease {
		color: darkred;
	}
	.decrease::before {
		content: "▼";
		color: darkred;
	}
	.nochange {
		font-size: 0.85em;
		color: grey;
	}
	.line {
		background-color: #cedc20;
		width: 25px;
		height: 4px;
		display: inline-block;
		margin-bottom: 3px;
	}
	.title {
		display: inline-block;
		margin-top: -3px;
	}
	.text-right {
		text-align: right;
	}
	.float-right {
		float: right;
	}
	.inline {
		display: inline-block;
	}
	.condensed {
		line-height: 1.1em;
	}
	.mt {
		margin-top: 20px;
	}
	.mts {
		margin-top: 10px;
	}
	.mtl {
		margin-top: 55px;
	}
	.mbs {
		margin-bottom: 10px;
	}
	.grid {
		display: grid;
		width: 100%;
		grid-gap: 10px;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		justify-content: stretch;
		page-break-inside: avoid;
	}
	.title-inset {
		font-weight: normal;
		font-size: 13.6px;
	}
	#grid {
		grid-gap: 20px !important;
	}
	.chart {
		position: relative;
		width: 100%;
	}
	#map {
		grid-row: span 2;
		min-height: 400px;
	}

	.tooltip {
		position: relative;
		display: inline-block;
	}

/* 	.tooltip .tooltiptext {
		visibility: hidden;
		width: 120px;
		background-color: #666666;
		color: #fff;
		text-align: center;
		border-radius: 6px;
		padding: 5px 0;
		bottom: 100%;
		right: 100%;
		font-size: 12pt;

		position: absolute;
		z-index: 1;
	}
 */
/* 	.tooltip:hover .tooltiptext {
		visibility: visible;
	} */

	.collapse:not(.show) {
		display: none;
	}
	.collapsing {
		height: 0;
		overflow: hidden;
		transition: height 0.35s ease;
	}

	.show {
		display: block !important;
	}

	.card {
		--bs-card-spacer-y: 0.1rem;
		--bs-card-spacer-x: 0.5rem;
		--bs-card-title-spacer-y: 0.5rem;
		--bs-card-border-width: 1px;
		--bs-card-border-color: var(--bs-border-color-translucent);
		--bs-card-border-radius: 0.375rem;
		--bs-card-box-shadow: ;
		--bs-card-inner-border-radius: calc(0.375rem - 1px);
		--bs-card-cap-padding-y: 0.5rem;
		--bs-card-cap-padding-x: 1rem;
		--bs-card-cap-bg: rgba(0, 0, 0, 0.03);
		--bs-card-cap-color: ;
		--bs-card-height: ;
		--bs-card-color: ;
		--bs-card-bg: #fff;
		--bs-card-img-overlay-padding: 1rem;
		--bs-card-group-margin: 0.75rem;
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		height: var(--bs-card-height);
		word-wrap: break-word;
		background-color: var(--bs-card-bg);
		background-clip: border-box;
		border: var(--bs-card-border-width) solid var(--bs-card-border-color);
		border-radius: var(--bs-card-border-radius);
	}

	.card-body {
		flex: 1 1 auto;
		padding: var(--bs-card-spacer-y) var(--bs-card-spacer-x);
		color: var(--bs-card-color);
		font-size: 10pt;
		margin-bottom: 5px;
	}



	.blockinfoicon {
		font-size: 14pt;
	}

	@media print {
		.highlited {
			color: red !important;
			-webkit-print-color-adjust: exact;
		}
	}

	/* manual override for black svg icons that filters them to a specified colour */
	.filter-navy {
		filter: invert(12%) sepia(78%) saturate(1934%) hue-rotate(204deg)
			brightness(91%) contrast(110%);
	}
</style>