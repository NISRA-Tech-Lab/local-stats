<script>
    import { base } from "$app/paths";
    import { goto } from "$app/navigation";
    import { 
      adjectify,
      suffixer, 
      changeClass, 
      changeStr 
    } from "$lib/utils";
    import {
      geog_types,
      topics,
      mapStyle,
      mapSources,
      mapLayers,
      mapPaint,
      app_inputs,
    } from "$lib/config";
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
    import ScrollToTop from "$lib/ui/scroll.svelte";
    import { LayerCake } from "layercake";
    import { text } from "svelte/internal";
	import IButton from "$lib/layout/IButton.svelte";
	import Accordion from "$lib/layout/Accordion.svelte";
	import GreyBox from "$lib/layout/GreyBox.svelte";  
    
    
    export let data;

    let w, cols;
    let map = null;
    let comp_2011 = false;
	let comp_ni = true;
	

    let active = {
      selected: null,
      type: null,
      childType: null,
      highlighted: [],
      hovered: null,
    };

    let isChild = {};
    Object.keys(mapLayers).forEach((key) => (isChild[key] = false));

    

    function makeData_year(props, y1, y2) {
      const sum = (a, b) => a + b;
      let category = props[0];
      let curr_year = y2[0];
      let past_year = y1[0];
      let val = "perc";

      let source = data.place.data[category][val][curr_year];
      let sourcePrev = data.place.data[category][val][past_year];
      let sourceNI = data.ni.data[category][val][curr_year];

      let keys = topics[category].map((d) => d.category);
      let labels = topics[category].map((d) =>
        d.label ? d.label : d.category,
      );
      let y_data = keys.map((key, i) => {
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

      return y_data;
    }


    

    function makeDataGroupSort(g_data, key) {
      const categ = topics[key];
      let newdata = [];

	  let groups = Object.keys(g_data);
	  for (let i = 0; i < groups.length; i ++) {
		if (!g_data[groups[i]].hasOwnProperty("perc")) {
			g_data[groups[i]].perc = null;
		}
	  }

      categ.forEach((c) => {
        let rows = g_data.filter((d) => d.category === c.category);
        let newrows = rows.map((d) => ({
          group: d.group,
          category: c.label,
          perc: d.perc,
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
      let code = data.place.code;
      let type = data.place.type;
      let children = data.place.children[0]
        ? data.place.children.map((d) => d.code)
        : [];
      let childType =
        data.place.type == "rgn"
          ? "cty"
          : children[0]
            ? data.place.children[0].type
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
            visibility,
          );
          if (data.place.type != "ni") {
            map.setLayoutProperty(
              key + "-self",
              "visibility",
              visibility,
            );
          }
          isChild[key] = key == childType ? true : false;
        });

        // Set new paint properties
        if (data.place.type != "ni") {
          fillProps.forEach((prop) =>
            map.setPaintProperty(
              type + "-fill",
              prop,
              mapPaint[children[0] ? "fill-active" : "fill-self"][
                prop
              ],
            ),
          );
          lineProps.forEach((prop) => {
            map.setPaintProperty(
              type + "-bounds",
              prop,
              mapPaint["line-active"][prop],
            );
            map.setPaintProperty(
              type + "-self",
              prop,
              mapPaint["line-self"][prop],
            );
          });
        }
        if (childType) {
          fillProps.forEach((prop) =>
            map.setPaintProperty(
              childType + "-fill",
              prop,
              mapPaint["fill-child"][prop],
            ),
          );
          lineProps.forEach((prop) =>
            map.setPaintProperty(
              childType + "-bounds",
              prop,
              mapPaint["line-child"][prop],
            ),
          );
        }
      }
    }

    function update(place) {
      updateActive(place);
      fitMap(data.place.bounds);
    }

    function mapSelect(ev) {
      goto(`${base}/${ev.detail.code}/`, { noScroll: true });
    }

    function menuSelect(ev) {
      goto(`${base}/${ev.detail.value}/`, { noScroll: true });
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
    $: chartLabel = comp_2011 ? "Same area 2011" : data.place && data.place.type != "ni" ? "NI 2021" : null;

    $: chart_compare_type = comp_none
      ? null
      : comp_2011
        ? "prev"
        : !comp_2011 && data.place.type != "ni"
          ? "ni"
          : null;

    $: data.place && update(data.place);
    $: comp_ni = true;
    $: comp_none = false;

	function returnPct (expr) {

		let pct = (expr * 100).toFixed(1);

		if (pct < 0.1) {
			return "<0.1%";
		} else {
			return pct + "%";
		}

	}

	function returnRank (expr) {

		if (expr == 1) {
			return "largest";
		} else if (expr == data.place.count) {
			return "smallest";
		} else {
			return expr + suffixer(expr) + " largest";
		}

	}

	function popChange (expr) {

		if (data.place.type != "dea") {

			let pct = expr.toFixed(1);

			if (pct > 0) {
				return "An increase of " + pct + "%" + " since the 2011 Census.";
			} else if (pct < 0) {
				return "A decrease of " + pct + "%" + " since the 2011 Census.";
			} else {
				return "No change since the 2011 Census.";
			}

		}

	}

	function check (value) {

		let value_dotted = value.replaceAll("[", ".").replaceAll("]", "");
		let props = value_dotted.split(".");

		let rtn_value = data.place.data;

		if (props[0] == "grouped_data_nocompare" | props[0] == "grouped_data_areacompare") {
			rtn_value = data.place;
		}		

		for (let i = 0; i < props.length; i ++) {

			if (rtn_value.hasOwnProperty(props[i])) {
				rtn_value = rtn_value[props[i]]

				if (props[i] == "perc") {
					rtn_value = rtn_value.toFixed(0) + "%";
				}
			} else {

				rtn_value = [];

			}

		}

		return rtn_value;

	}

	function pullYear (value, place) {
		
		if (place.meta_data.hasOwnProperty(value)) {
			return place.meta_data[value][0].year;
		} else {
			return null;
		}

	}

	function pullCensusYear (value) {

		if (data.place.data.hasOwnProperty(value)) {
			return Object.keys(data.place.data[value].perc).slice(-1);
		} else {
			return null;
		}

	}

	function popDen (place) {

		let pop_den = place.data.MYETotal.value / place.hectares;

		if (pop_den < 0.1) {
			pop_den = "< 0.1"
		} else {
			pop_den = pop_den.toFixed(1);
		}

		return pop_den;

	}

	function moreData (subject, place) {

		if (place.type != "ni") {
			return "You can also explore " + subject + " data for <a href = '" + base + "/" + place.parents[0].code + "/' data-sveltekit-noscroll>" + place.parents[0].name + " </a>";
		} else {
			return "";
		}

	}

	function compareDensity (place) {
		
		let pop_den = place.data.MYETotal.value / place.hectares;

		let ni_pop_den = data.ni.data.MYETotal.value / data.ni.hectares;

		let comparison = pop_den / ni_pop_den;

		if (Math.round(comparison) == 1) {
			comparison = 'Approximately <span class = "em" style = "background-color: lightgrey">the same density level</span> as the Northern Ireland average';
		} else if (comparison > 1) {
			comparison = 'Approximately <span class = "em" style = "background-color: lightgrey">' + comparison.toFixed(0) + " times more dense</span> than the Northern Ireland average";
		} else {
			comparison = 'Approximately <span class = "em" style = "background-color: lightgrey">1/' + (1 / comparison).toFixed(0) + " as dense</span> as the Northern Ireland average";
		}

		return comparison;
	}

</script>

<svelte:head>
	<title>{data.place.name} Local Statistics Explorer</title>
	<meta name="description" content="" />
	<meta property="og:title" content="{data.place.name} Local Statistics" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{app_inputs.base}/{data.place.code}/" />
	<meta
		property="og:description"
		content="Explore NISRA Statistics for {data.place.name}."
	/>
	<meta
		name="description"
		content="Explore NISRA Statistics for {data.place.name}."
	/>
</svelte:head>
<ScrollToTop />
<Section column="wide">
	{#if data.place && data.ni}
		<div class="grid mtl">
			<div>
				<span class="text-small">
					<a href="{base}/" data-sveltekit-noscroll>Home</a
					>{@html " &gt; "}
					{#if data.place.type != "ni"}
						{#each [...data.place.parents].reverse() as parent, i}
							<a href="{base}/{parent.code}/" data-sveltekit-noscroll
								>{parent.name}</a
							>{@html " &gt; "}
						{/each}

					{/if}
				</span>
				<br><span class="text-big title" style = "font-size: 2.5em; line-height: 1em;">{data.place.name}</span>
				
				
				<!-- <div class="text-bold" style="font-size: 0.85em;"> -->
			

					<!-- {#if data.place.type == "ni"}
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
					{/if} -->
					<!-- {#if data.place.type != "ni"}
					Click for: <button
							class="btn"
							class:btn-active={comp_ni & !comp_none & !comp_2011}
							on:click={() => (comp_ni = true)}
							on:click={() => (comp_none = false)}
							on:click={() => (comp_2011 = false)}>NI compare</button
						>
					{/if} -->

						<!-- <button
							class="btn"
							class:btn-active={comp_2011 & !comp_none & !comp_ni}
							on:click={() => (comp_2011 = true)}
							on:click={() => (comp_none = false)}
							on:click={() => (comp_ni = false)}
							>Same area - previous</button
						> -->
				<!-- </div>  -->
			</div>

			<div>
				<div
					style="width: 350px; padding-top: 5px;"
					class:float-right={cols > 1}
				>
					<b>Search for your area:</b>
					<Select
						search_data = {data.search_data}
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
								document.createElement("input"),
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
										'button[type="share"]',
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

					<div width="100%">
						<button
							class="btn"
							style="width: 33%"
							alt="Opens the About page"
							onclick="window.location.href='{base}/about';"
							>About
						</button>
						<button
							class="btn"
							style="width: 33%"
							title="Click to print this page to pdf or printer"
							onclick="window.print();return false;"
							>Print / PDF
						</button>
						<button
							class="btn"
							style="width: 30%"
							type="share"
							alt="Share this page"
							>Share
						</button>
					</div>
				</div>
			</div>
		</div>


		<div id="grid" class="grid mt">
			
			
			<GreyBox
				id = "overview" 
				i_button = {false}
				heading = "About {data.place.name}" 
				place = {data.place}
				style = "line-height: 1.3;"
				content = {{
							ni: "Northern Ireland has 11 Local Government Districts (LGDs),  which can be subdivided into District Electoral Areas (DEAs), then further into Super Data Zones and Data Zones. Statistics can be viewed for these smaller areas." ,
							lgd: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl +  ".  It includes the larger settlements of " + data.place.lgd_location_description,
							dea: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl + " in Northern Ireland.  It is within " + "<a href = '/" + data.place.parents[0].code + "/' data-sveltekit-noscroll>" + data.place.parents[0].name + " </a>" + " and covers " + data.place.dea_location_description + ".",
							sdz: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl + ". Super Data Zones are new statistical areas for local-level statistics.",
							dz: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl + ".  Data Zones are new statistical areas for local-level statistics."							
						  }}
				chart_compare_type = {chart_compare_type}
			/>

			<GreyBox
				id = "pop"
				place = {data.place}
				year = {pullYear("MYETotal", data.place)}
				content = {'<span class="text-big" style="font-size: 2.8em;">' + (Math.round(data.place.data.MYETotal.value / 1000) * 1000).toLocaleString() + '</span>'}
				chart_compare_type = {chart_compare_type}
				compare_content = {{
					ni: "",
					lgd: '<span class = "em" style = "background-color: lightgrey">' + returnPct(data.place.data.population.value["2021"].all / data.ni.data.population.value["2021"].all) + '</span> of Northern Ireland population<br>' +
						 'The ' + returnRank(data.place.data.population.value_rank["2021"].all) + " population of 11 Local Government Districts",
					dea: '<span class = "em" style = "background-color: lightgrey">' + returnPct(data.place.data.population.value["2021"].all / data.ni.data.population.value["2021"].all) + '</span> of Northern Ireland population',
					sdz: "Data not available for area comparison",
					dz: " Data not available for area comparison"
				}}
			/>

			<GreyBox
				id = "popden"
				place = {data.place}
				year = {pullCensusYear("population")}
				content = {'<span class="text-big" style="font-size: 2.8em;">' + popDen(data.place) + '</span> people per hectare'}
				chart_compare_type = {chart_compare_type}
				compare_content = {{
					ni: "",
					lgd: compareDensity(data.place),
					dea: compareDensity(data.place),
					sdz: compareDensity(data.place),
					dz: compareDensity(data.place)
				}}
			/>

		</div>
		<!-- a19e9e -->
		<div class="grid mt" bind:clientWidth={w}>
			<div style="grid-column: span {cols};">
				<h3>
					<!-- Explore <span style="color: #93328E">{data.place.name}</span> -->
					{#if data.place.type != "ni"}
					
					You are currently viewing <span style="color: #3878c5">{data.place.name}</span>
						<span style="color: #00205b"
							> 
							<!-- {geog_types[data.place.type].name} -->
							</span
						>  
						<p><span class="text-bold">Zoom and click on map to explore other areas </span></p>
						{:else}
					<p class="text-bold">Zoom and click on map to explore other areas </p>
					<!-- <span style="color: #3878c5">{data.place.name}</span> -->
					{/if}
				</h3>
			</div>
			<div
				id="map"
				style="padding-right: 45px; grid-column: span {cols == 2
					? 2
					: cols && cols > 2
						? cols - 1
						: 1};  "
			>
				<Map
					bind:map
					location={{ bounds: data.place.bounds }}
					options={{ fitBoundsOptions: { padding: 20 } }}
					style={mapStyle}
				>
					{#each ["dz", "sdz", "dea", "lgd"] as key}
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
			
			<div>
				{#if data.place.type != "ni"}
					<span class="text-bold">Select a larger area containing {data.place.name} </span>
					<span class="text-small">
						{#each [...data.place.parents].reverse() as parent, i}
							<span
								style="display: block; margin-left: {i > 0
									? (i - 1) * 15
									: 0}px"
								>{@html i > 0 ? "↳ " : ""}<a
									href="{base}/{parent.code}"
									data-sveltekit-noscroll>{parent.name}</a
								></span
							>
						{/each}
					</span>
				{/if}
			</div>
			<div>
				{#if data.place.children[0]}
					<span class="text-bold"
						>Select a {data.place.children[0]
							? geog_types[data.place.children[0].type].name
							: "Areas"} within {data.place.name}</span
					><br />
					<span class="text-small">
						{#each data.place.children as child, i}
							<a href="{base}/{child.code}" data-sveltekit-noscroll
								>{child.name}</a
							>{i < data.place.children.length - 1 ? ", " : ""}
						{/each}
					</span>
				{:else}
					<span class="muted"
						>No areas below {data.place.name}
						{geog_types[data.place.type].name}</span
					>
				{/if}
			</div>
		</div>

		 <div class="accordion" id="accordionPanelsStayOpenExample">
			
			<Accordion
			id = "people"
			img = "nisra-taxonomy-icon-census.png"
			heading = "People and Households"
			place = {data.place} 
			sub_heading =   {moreData("People and Households", data.place)}
			description = ""
			chart_compare_type = {chart_compare_type}
			boxes = {{
					box_1: {
						id: "popchange",
						content: {
							ni: '<p>The population of '+ data.place.name +'in 2011 was <span class="text-big">' + data.place.data.population.value["2011"].all.toLocaleString() + '</span> and in 2021 was <span class="text-big">' + data.place.data.population.value["2021"].all.toLocaleString() + '</span><p><span class="em ' + changeClass(data.place.data.population.value.change.all) + '">' + changeStr(data.place.data.population.value.change.all, "%", 1,) + '</span> since 2011 Census</p>',
							lgd: '<p>The population of '+ data.place.name +' in 2011 was <span class="text-big">' + data.place.data.population.value["2011"].all.toLocaleString() + '</span> and in 2021 was <span class="text-big">' + data.place.data.population.value["2021"].all.toLocaleString() + '</span><p><span class="em ' + changeClass(data.place.data.population.value.change.all) + '">' + changeStr(data.place.data.population.value.change.all, "%", 1,) + '</span> since 2011 Census</p>',
							dea: '<p>The population of </p>',
							sdz: '<p>The population of </p>',
							dz: '<p>The population of </p>'
						}
					},

					box_2: {
						id: "age",
						year: pullCensusYear("age"),
						content:  "GroupChart",
						chart_data: {
							none: makeDataGroupSort(data.place.grouped_data_nocompare.age, "age"),
							ni: makeDataGroupSort(data.place.grouped_data_areacompare.age, "age"),
						}
					},
					// box_3: {
					// 	id: "sex",
					// 	content: "<span >"  + " sex split to be added</span>"
					// },
					box_4: {
						id: "hhsize",
						year: pullCensusYear("hh_size"),
						content: "GroupChart"		,
						chart_data: {
							none: makeDataGroupSort(data.place.grouped_data_nocompare.hh_size, "hh_size"),
							ni: makeDataGroupSort(data.place.grouped_data_areacompare.hh_size, "hh_size"),
						}
					},
					box_5: {
						id: "religion",
						year: pullCensusYear("religion_or_religion_brought_up_in"),
						content: "GroupChart",
						chart_data: {
							none: makeDataGroupSort(data.place.grouped_data_nocompare.religion_or_religion_brought_up_in, "religion_or_religion_brought_up_in"),
							ni: makeDataGroupSort(data.place.grouped_data_areacompare.religion_or_religion_brought_up_in, "religion_or_religion_brought_up_in"),
						},
					},
					box_6: {
						id: "language",
						year: pullCensusYear("mainlang"),
						content: "GroupChart",
						chart_data: {
							none: makeDataGroupSort(data.place.grouped_data_nocompare.mainlang, "mainlang"),
							ni: makeDataGroupSort(data.place.grouped_data_areacompare.mainlang, "mainlang"),
						},
					}
			}}
			more = "More information on the size of the population is available in the latest <a href='https://www.nisra.gov.uk/publications/2022-mid-year-population-estimates-northern-ireland'>mid-year estimates release</a>, 
					which includes an <a href='https://www.nisra.gov.uk/system/files/statistics/MYE22-summary.pdf'>infographic</a>, 
					<a href='https://www.nisra.gov.uk/system/files/statistics/MYE22-Factsheets.pdf'>Fact Sheets</a>, 
					a <a href='https://www.nisra.gov.uk/system/files/statistics/Statistical%20Bulletin%20-%202022%20Mid-year%20Population%20Estimates%20for%20Northern%20Ireland.pdf'>publication</a> 
					and statistical tables. Population characteristics are from the census data which can be explored further in the <a href='https://explore.nisra.gov.uk/area-explorer-2021/N92000002/'>Census Area Explorer</a>, 
					bespoke tables can be created using the <a href='https://build.nisra.gov.uk/en/'>Flexible Table Builder</a> and the NISRA website has 
					<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'>statistical bulletins</a> providing commentary on a range of census population characteristics."
		/>

		<Accordion
		id = "health"
		img = "nisra-taxonomy-icon-health.png"
		heading = "Health and Social Care"
		place = {data.place}
		sub_heading =   {moreData("Health and Social Care", data.place)}
		description = " "
		chart_compare_type = {chart_compare_type}
		boxes = {{
			box_1: {
				id: "generalhealth",
				year: pullCensusYear("general_health"),
				content: "StackedBarChart",				
				chart_data: data.place && makeData_year(["general_health"], ["2011"], ["2021"]),
				zKey: chart_compare_type,
				label: chartLabel,
				topic_prev_available: true
			},
			box_2: {
				id: "wellbeing",
				year: pullYear("Happy", data.place),
				content: "<p><span class='text-big'>" + (check("Happy.value")).toLocaleString() + "</span>/ 10 happiness</p>"	+
						 "<p><span class='text-big'>" + (check("Satisfy.value")).toLocaleString() + "</span>/ 10 life satisfaction</p>",	
				show: ["ni", "lgd"]
			},
			box_3: {
				id: "lifeexpectancy",
				year: pullYear("LE", data.place),
				content: "<p>Male <span class='text-big'>" + 
					(check("LE.value.Males")).toLocaleString() +
					"</span> years</p>"+"<p>Female <span class='text-big'>" +
					(check("LE.value.Females")).toLocaleString() + "</span> years</p>",
				show: ["ni", "lgd"]
			},
			box_4: {
				id: "carers",
				content: "GroupChart",
				year: pullCensusYear("provision_care"),
				chart_data: {
					none: makeDataGroupSort(data.place.grouped_data_nocompare.provision_care, "provision_care"),
					ni: makeDataGroupSort(data.place.grouped_data_areacompare.provision_care, "provision_care")
				}
			},
			box_5: {
				id: "hospitalactivity",
				year: pullYear("Admiss", data.place),
				content: "<p><span class='text-big'>" + 
					(check("Admiss.value")).toLocaleString() + 
					"</span> hospital patients</p><p>  The most frequent reason was for </p><span class='text-bold' >" + (check("Admiss.text"))+ "</span>",
					show: ["ni", "dea"]
			},
			box_6a: {
				id: "primarycare",
				year: pullYear("GP", data.place)   ,
				content: "<p><span class='text-big'>" + 
							(check("GP.value.PRACS")).toLocaleString() +
						"</span> GP practices with an average of <span class='text-big'>" + 
						(check("GP.value.PRACLIST")).toLocaleString() +
						"</span> patients per practice</p><p><span class='text-big'>" + 
							+ (check("DEN.value.GDSDSSurgeries")).toLocaleString() +
							"</span> dental surgeries" +
							"</span> with an average of <span class='text-big'>" + 
						(check("DEN_REG.value.Dental_Registrations") / check("DEN.value.GDSDSSurgeries")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +
						"</span> patients per surgery</p>",
				show: ["ni", "lgd"]
			},
			box_6b: {
				id: "primarycare",
				year: pullYear("DEN", data.place),
				content: "<p><span class='text-big'>" +
					(check("DEN.value.GDSDSSurgeries")).toLocaleString() +
					"</span> dental surgeries" +
					"</span> with an average of <span class='text-big'>" + 
					(check("DEN_REG.value.Dental_Registrations")/check("DEN.value.GDSDSSurgeries")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +
					"</span> patients per surgery</p>",
				show: ["dea"]
			},
			box_6c: {
				id: "empty",
				i_button: false,
				content: "",
				show: ["sdz","dz"]
			}

		}}
		more = "<p>Significant volumes of information are prepared by the <a href='https://www.health-ni.gov.uk/topics/doh-statistics-and-research'>Department of Health</a> 
				and the <a href='https://bso.hscni.net/directorates/operations/family-practitioner-services/directorates-operations-family-practitioner-services-information-unit/general-ophthalmic-services-statistics/'>
				Business Services Organisation</a>, including statistics on <a href='https://www.health-ni.gov.uk/topics/dhssps-statistics-and-research/health-inequalities-statistics'>Health inequalities</a>, 
				Primary care (including <a href='https://bso.hscni.net/directorates/operations/family-practitioner-services/directorates-operations-family-practitioner-services-information-unit/1776-2/'>Medical</a>, 
				<a href='https://bso.hscni.net/directorates/operations/family-practitioner-services/directorates-operations-family-practitioner-services-information-unit/general-dental-services-statistics/'>Dental</a>, 
				<a href='https://bso.hscni.net/directorates/operations/family-practitioner-services/directorates-operations-family-practitioner-services-information-unit/general-pharmaceutical-services-and-prescribing-statistics/'>
				Pharmaceutical</a> and <a href='https://bso.hscni.net/directorates/operations/family-practitioner-services/directorates-operations-family-practitioner-services-information-unit/general-ophthalmic-services-statistics/'>
				Ophthalmic</a>), <a href='https://www.health-ni.gov.uk/topics/dhssps-statistics-and-research/family-health-services-statistics'>
				Family health services</a>, <a href='https://www.health-ni.gov.uk/topics/doh-statistics-and-research-mental-health-and-learning-disabilities/mental-health-learning-disability-and-autism-statistics'>
				Mental health, learning disability and autism</a>, <a href='https://www.health-ni.gov.uk/topics/dhssps-statistics-and-research-social-services/social-care-statistics'>
				Social care</a>, <a href='https://www.health-ni.gov.uk/topics/dhssps-statistics-and-research/workforce-statistics'>Workforce</a>, and <u>COVID-19</u>.
				A number of <a href='https://visual.nisra.gov.uk/?body=entity/health'>interactive dashboards</a> are available and a compendium dashboard for <a href='https://visual.nisra.gov.uk/?body=entity/las'>
				Making Life Better</a>.
				The <a href='https://www.nisra.gov.uk/statistics/census'>2021 census</a> collected data on general health, long-term conditions and carers which can 
				be explored in the <a href='https://explore.nisra.gov.uk/area-explorer-2021/N92000002/'>Census Area Explorer</a> and the <a href='https://build.nisra.gov.uk/en/'>Flexible Table Builder</a>.</p><p></p>"
	/>
	
	<Accordion
		id = "work"
		img = "nisra-taxonomy-icon-labour-market.png"
		heading = "Work and Welfare"
		place = {data.place}
		sub_heading = {moreData("Work and Welfare", data.place)}
		description = " "
		chart_compare_type = {chart_compare_type}
		boxes = {{
			box_1: {
				id: "employmentrates",
				year: pullYear("LMS", data.place),
				content: "GroupChart",
				chart_data: {
					none: makeDataGroupSort(check("grouped_data_nocompare.LMS"), "LMS"),
					ni: makeDataGroupSort(check("grouped_data_areacompare.LMS"), "LMS"),
				},
				show: ["ni", "lgd"]
			},
				
			box_2: {
				id: "employed",
				year: pullYear("LMS", data.place),
				content: "<p><span class='text-big'>" +
					     (check("LMS.value.EMPN")).toLocaleString() +
						 "</span> employed</p>",
				show: ["ni", "lgd"]
			},

			box_3b: {
				id: "bres",
				year: pullYear("BRES", data.place),
				content:  "GroupChart",
					chart_data: {
						none: makeDataGroupSort(data.place.grouped_data_nocompare.BRES, "BRES"),
						ni: makeDataGroupSort(data.place.grouped_data_areacompare.BRES, "BRES"),
					},
				show: ["ni", "lgd"]
			},	
				
			box_3: {
				id: "wages",
				year: pullYear("ASHE", data.place),
				content: '<p><span class="text-big">£' +
					     (check("ASHE.value")).toLocaleString() +
						 '</span> median salary</p>',
				show: ["ni", "lgd"]
			},
						
			box_4: {
				id: "disabilitybenefits",
				year: pullYear("BS", data.place),
				content: '<span class="text-big">' +
					(data.place.data.BS.value.PIP + data.place.data.BS.value.DLA + data.place.data.BS.value.CA + data.place.data.BS.value.AA).toLocaleString() + '</span> claimants',
			
			},

			box_5: {
				id: "workingagebenefits",
				year: pullYear("BS", data.place),
				content: '<span class="text-big">' +
					(data.place.data.BS.value.UC + data.place.data.BS.value.JSA + data.place.data.BS.value.IS + data.place.data.BS.value.ESA).toLocaleString() + '</span> claimants',
				
			},
			
			box_6: {
				id: "pensionagebenefits",
				year: pullYear("BS", data.place),
				content: '<span class="text-big">' +
					(data.place.data.BS.value.RP + data.place.data.BS.value.PC).toLocaleString() + '</span> claimants',
			}	
							
		}}
		more = "<p>The monthly <a href='https://www.nisra.gov.uk/statistics/labour-market-and-social-welfare/labour-market-overview'>Labour Market Report</a>
				contains the most up to date labour market statistics. The <a href='https://www.nisra.gov.uk/statistics/labour-market-and-social-welfare/annual-survey-hours-and-earnings'>
				Annual Survey of Hours and Earnings</a> providesdata on hourly, weekly and annual earnings. The <a href='https://www.nisra.gov.uk/statistics/labour-market-and-social-welfare/quarterly-employment-survey'>
				Quarterly Employment Survey</a> provides short-term employee jobs estimates for NI. Further information is available for the 
				unemployed <a href='https://www.nisra.gov.uk/statistics/labour-market-and-social-welfare/claimant-count'>Claimant Count</a>, 
				claimant numbers for <a href='https://www.nisra.gov.uk/statistics/labour-market-and-social-welfare/disability-benefits'>Disability Benefits</a>, 
				and <a href='https://www.nisra.gov.uk/statistics/labour-market-and-social-welfare/work-related-benefits'>Work Related Benefits</a>. 
				Statistics on <a href='https://www.nisra.gov.uk/statistics/labour-market-and-social-welfare/redundancies'>Redundancies</a> 
				and <a href='https://www.nisra.gov.uk/statistics/labour-market-and-social-welfare/job-vacancies'>Job Vacancies</a> are also available. 
				A number of <a href='https://visual.nisra.gov.uk/?body=entity/lm'>interactive dashboards</a> are available. 
				The <a href='https://www.nisra.gov.uk/statistics/census'>2021 census</a> collected data on occupations, industry and number of hours worked which can be 
				explored in the <a href='https://explore.nisra.gov.uk/area-explorer-2021/N92000002/'>Census Area Explorer</a> and the <a href='https://build.nisra.gov.uk/en/'>Flexible Table Builder</a>.</p>"
	/>

		<Accordion
		id = "education"
		img = "nisra-taxonomy-icon-child-education-skills.png"
		heading = "Education"
		place = {data.place}
		sub_heading =   {moreData("Schools, colleges and universities", data.place)}
		description = ""
		chart_compare_type = {chart_compare_type}
		boxes = {{

			box_1: {
				id: "enrollments",
				content: "<p style='margin:0'>Primary school <span class='text-big'>" + 
						 (check("Primary.value")).toLocaleString() + "</span></p>" +
						 "<p style='margin:0'>Secondary school <span class='text-big'>" + 
						 (check("PostPrimary.value")).toLocaleString() + " </span></p>" +
						 "<p style='margin:0'>Further education <span class='text-big'>" +
						 (check("FE.value")).toLocaleString() + "</span></p>" +
						 "<p style='margin:0'>Higher education <span class='text-big'>" +
						 (check("HE.value")).toLocaleString() +" </span></p>",
				year: pullYear("Primary", data.place) ,
				show: ["ni", "lgd", "dea"]
			},
				
			box_2: {
				id: "fsme",
				content: "<p style='margin:0'>Primary school <span class='text-big'> "+ check("grouped_data_nocompare.Primary[0].perc") + " </span></p>"+
				         "<p style='margin:0'>Secondary school <span class='text-big'>"+ check("grouped_data_nocompare.PostPrimary[0].perc") + " </span></p>",
				year: pullYear("Primary", data.place),
				show: ["ni", "lgd", "dea"]
			},
			
			box_3: {
				id: "teachers",
				year: pullYear("ClassSize", data.place),
				content: "<p><span class='text-big'>"  + 
				         (check("ClassSize.value")).toLocaleString() +"</span> pupils per teacher</p>",
				show: ["ni", "lgd"]
			},
		
			box_4: {
				id: "qualifications",
				content:  "GroupChart",
				year: pullCensusYear("highest_level_of_qualifications"),
				chart_data: {
					none: makeDataGroupSort(data.place.grouped_data_nocompare.highest_level_of_qualifications, "highest_level_of_qualifications"),
					ni: makeDataGroupSort(data.place.grouped_data_areacompare.highest_level_of_qualifications, "highest_level_of_qualifications")
				}
			},

			box_5: {
				id: "attainment",
				year: pullYear("Attainment", data.place),
				content: "<p><span class='text-big'>"  + 
				    	 (check("Attainment.value")).toLocaleString() +"%</span> of pupils left school with 5 or more GCSEs grades A*-C (including Maths and English)</p>",
				show: ["ni", "lgd"]
			},
							

			box_6: {
				id: "destination",
				year: pullYear("Destination", data.place),
				content:  "GroupChart",
				chart_data: {
					none: makeDataGroupSort(check("grouped_data_nocompare.Destination"), "Destination"),
					ni: makeDataGroupSort(check("grouped_data_areacompare.Destination"), "Destination")
				},
				show: ["ni", "lgd", "dea"]
			},

			box_6a: {
				id: "empty",
				i_button: false,
				content: "",
				show: ["sdz","dz"]
			},
					
			box_6b: {
				id: "empty",
				i_button: false,
				content: "",
				show: ["sdz","dz"]
			}

		}}
		more = "<p>The <a href='https://www.nisra.gov.uk/statistics/children-education-and-skills/school-education-statistics'>Department of Education</a> publishes statistics on <a href='https://www.education-ni.gov.uk/articles/school-enrolments-overview'>school enrolments</a>, <a href='https://www.education-ni.gov.uk/articles/school-performance'>school performance</a>, <a href='https://www.education-ni.gov.uk/articles/school-leavers'>school leavers</a>, qualifications and destinations, <a href='https://www.education-ni.gov.uk/articles/pupil-attendance'>pupil attendance</a>, suspensions and expulsions, school meals and <a href='https://www.education-ni.gov.uk/articles/education-workforce'>education workforce</a>. The <a href='https://www.nisra.gov.uk/statistics/children-education-and-skills/higher-and-further-education-and-training-statistics'>Department for the Economy</a> publishes <a href='https://www.economy-ni.gov.uk/topics/statistics-and-economic-research/higher-education-statistics-and-research'>Higher</a> and <a href='https://www.economy-ni.gov.uk/topics/statistics-and-economic-research/further-education-statistics-and-research'>Further</a> education and <a href='https://www.economy-ni.gov.uk/articles/training-success-statistics'>training</a> statistics. The <a href='https://www.nisra.gov.uk/statistics/census'>2021 census</a> collected data on qualifications which can be explored in the <a href='https://explore.nisra.gov.uk/area-explorer-2021/N92000002/'>Census Area Explorer</a> and the <a href='https://build.nisra.gov.uk/en/'>Flexible Table Builder</a>.</p>"
		
		/>


	<Accordion
		id = "crime"
		img = "nisra-taxonomy-icon-crime-justice.png"
		heading = "Crime and Justice"
		place = {data.place}
		sub_heading = {moreData("Crime and Court Activity", data.place)}
		description = " "
		chart_compare_type = {chart_compare_type}
		boxes = {{
				
		}}
		more = ""
	/>


	<Accordion
		id = "travel"
		img = "nisra-taxonomy-icon-travel-transport.png"
		heading = "Travel and Transport"
		place = {data.place}
		sub_heading = {moreData("Travel and transport", data.place)}
		description = " "
		chart_compare_type = {chart_compare_type}
		boxes = {{
				
		}}
		more = ""
	/> 

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