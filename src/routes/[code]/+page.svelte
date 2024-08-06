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
    import SearchResult from "$lib/ui/SearchResult.svelte";
    
    
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

	function makeDataNICompare(value) {

		let newdata = [];

		if (data.place.data.hasOwnProperty(value)) {

			let check_value = data.place.data[value].perc;
			let place_data;
			let ni_data;

			if (check_value.hasOwnProperty("2021")) {
				place_data = check_value["2021"];
				ni_data = data.ni.data[value].perc["2021"];
			} else {
				place_data = check_value;
				ni_data = data.ni.data[value].perc;
			}

			let category_lookup;
			let label_lookup;
			let v_topics = Object.keys(topics[value]);

			for (let i = 0; i < v_topics.length; i ++) {											
				for (let j = 0; j < Object.keys(place_data).length; j ++) {
					if (topics[value][v_topics[i]].category == Object.keys(place_data)[j]) {
						category_lookup = topics[value][v_topics[i]].category;
						label_lookup = topics[value][v_topics[i]].label;
						break;
					}
				}
				if (place_data[category_lookup] <= 100) {
					newdata.push({group: "Northern Ireland",
								  category: label_lookup,
								  perc: ni_data[category_lookup],
								  width: 0});
					if (data.place.name != "Northern Ireland") {
						newdata.push({group: data.place.name,
									  category: label_lookup,
									  perc: place_data[category_lookup],
									  width: 0});
					}
				}
			}
		}

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
      goto(`${base}/${ev.detail.code}/`, { noScroll: true, keepFocus: true });
    }

    function menuSelect(ev) {
      goto(`${base}/${ev.detail.value}/`, { noScroll: true, keepFocus: true });
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

	function popChange (place) {

		let output = "";

		if (place.data.hasOwnProperty("PopChange")) {

			let p_data = place.data.PopChange.value;
			let latest_year = Object.keys(p_data).slice(-1);
			let comparison_year = latest_year - 10;
			let change = (p_data[latest_year] - p_data[comparison_year]) / p_data[comparison_year] * 100;
			let change_word;

			if (change < 0) {
				change_word = "Down"
			} else if (change > 0) {
				change_word  = "Up"
			}

			output = '<p>The population of ' + place.name + ' in ' + comparison_year + ' was <span class="text-big">' +
					p_data[comparison_year].toLocaleString() + '</span> and in ' + latest_year + ' was <span class="text-big">' +
					p_data[latest_year].toLocaleString() + '</span><p><span class="em ' +
					changeClass(change) + '">' + change_word + " " + changeStr(change, "%", 1,) + '</span> since ' + comparison_year + ' Mid-Year Population Estimate</p>';

		}

		return output;

	}

	function check (value) {

		let value_dotted = value.replaceAll("[", ".").replaceAll("]", "");
		let props = value_dotted.split(".");

		let rtn_value = data.place.data;	

		for (let i = 0; i < props.length; i ++) {

			if (rtn_value.hasOwnProperty(props[i])) {
				rtn_value = rtn_value[props[i]]

			} else {

				rtn_value = [];

			}

		}

		return rtn_value;

	}

	function compareNIavg (value) {

		let value_dotted = value.replaceAll("[", ".").replaceAll("]", "");
		let props = value_dotted.split(".");

		let rtn_value = data.ni.data;
		let rtn_value_place = check(value);
		let no_areas = data.place.count;

		if (props[0] == "grouped_data_nocompare" | props[0] == "grouped_data_areacompare") {
			rtn_value = data.ni;
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

		let average_ni =  (rtn_value / no_areas).toFixed(0);

		if ( rtn_value_place > (average_ni * 1.1) ) 
				{
				rtn_value = "<p>This is higher than the NI average</p>";
			}
		else if (rtn_value_place < (average_ni * 0.9)) {
				rtn_value = "<p>This is lower than the NI average</p>";} 
		else {
				rtn_value = "<p>This is similar to the NI average.</p>";;
				} 
		
		return rtn_value;

	}

function compareNIrate (value) {

		let value_dotted = value.replaceAll("[", ".").replaceAll("]", "");
		let props = value_dotted.split(".");

		let rtn_value = data.ni.data;
		let rtn_value_place = check(value);

		if (props[0] == "grouped_data_nocompare" | props[0] == "grouped_data_areacompare") {
			rtn_value = data.ni;
		}		

		for (let i = 0; i < props.length; i ++) {

			if (rtn_value.hasOwnProperty(props[i])) {
				rtn_value = rtn_value[props[i]]

				// if (props[i] == "perc") {
				// 	rtn_value = rtn_value.toFixed(0) + "%";
				// }
			} else {

				rtn_value = [];

			}

		}

		if ( rtn_value_place > (rtn_value + 2) ) 
				{
					rtn_value = "<p>This is higher than the NI value</p>";
			}
		else if (rtn_value_place < (rtn_value - 2)) {
			rtn_value = "<p>This is lower than the NI value</p>";} 
		else {
			rtn_value = "<p>This is similar to the NI value</p>";;
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
			return "Census " +  Object.keys(data.place.data[value].perc).slice(-1);
		} else {
			return null;
		}

	}

	function popDen (place) {

		let pop_den = place.data.MYETotal.value / (place.hectares / 100);

		if (pop_den < 10) {
			pop_den = "<10"
		} else {
			pop_den = (Math.round(pop_den * 10) / 10).toLocaleString(undefined, {minimumFractionDigits: 1});
		}

		return pop_den;

	}

	function moreData (subject, place) {

		if (place.type != "ni") {
			return "You can also explore " + subject + " data for <a href = '" + base + "/" + place.parents[0].code + "/' data-sveltekit-noscroll data-sveltekit-keepfocus>" + place.parents[0].name + " </a>";
		} else {
			return "";
		}

	}

	function compareDensity (place) {
		
		let pop_den = place.data.MYETotal.value / (place.hectares / 100);

		let ni_pop_den = data.ni.data.MYETotal.value / (data.ni.hectares / 100);

		let comparison = pop_den / ni_pop_den;

		if (Math.round(comparison) == 1) {
			comparison = 'Approximately <span class = "em" style = "background-color: lightgrey">the same density level</span> as the Northern Ireland average';
		} else if (comparison > 1) {
			comparison = 'Approximately <span class = "em" style = "background-color: lightgrey">' + comparison.toFixed(0) + " times </span> the Northern Ireland average";
		} else {
			comparison = 'Approximately <span class = "em" style = "background-color: lightgrey">1/' + (1 / comparison).toFixed(0) + " </span> of the Northern Ireland average";
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
					<a href="{base}/" data-sveltekit-noscroll data-sveltekit-keepfocus>Home</a
					>{@html " &gt; "}
					{#if data.place.type != "ni"}
						{#each [...data.place.parents].reverse() as parent, i}
							<a href="{base}/{parent.code}/" data-sveltekit-noscroll data-sveltekit-keepfocus
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

		<SearchResult
			place = {data.place}
		/>

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
							dea: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl + " in Northern Ireland.  It is within " + "<a href = '/" + data.place.parents[0].code + "/' data-sveltekit-noscroll data-sveltekit-keepfocus>" + data.place.parents[0].name + " </a>" + " and covers " + data.place.dea_location_description + ".",
							sdz: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl + ". Super Data Zones are new statistical areas developed for census. They are broadly similar in population size and housing type.",
							dz: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl + ".  Data Zones are smaller divisions of Super Data Zones. There are on average 4 in each Super Data Zone."							
						  }}
				chart_compare_type = {chart_compare_type}
			/>

			<GreyBox
				id = "pop"
				place = {data.place}
				year =  {"Population estimates " + pullYear("MYETotal", data.place)}
				content = {'<span class="text-big" style="font-size: 2.8em;">' + data.place.data.MYETotal.value.toLocaleString() + '</span>'}
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
				year = {"Population estimates " + pullYear("MYETotal", data.place)}
				content = {'<div class = "row" style = "display: flex; align-items: center">' +
					       '<div style="font-weight: bold; font-size: 2.8em;">' + popDen(data.place) + '</div>' +
						   '<div style = "margin-left: 10px; line-height: 1.25em;"> people per square kilometer</div></div>'}
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
					
					You are currently viewing <span style="color: #3878c5">{data.place.name} </span> {geog_types[data.place.type].name}
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
									data-sveltekit-noscroll data-sveltekit-keepfocus>{parent.name}</a
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
							<a href="{base}/{child.code}" data-sveltekit-noscroll data-sveltekit-keepfocus
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
			heading = "People and communities"
			place = {data.place} 
			sub_heading =   {moreData("People and communities", data.place)}
			description = ""
			chart_compare_type = {chart_compare_type}
			boxes = {{
					box_1: {
						id: "popchange",
						year:  "Population Estimates " + pullYear("BroadAge", data.place),
						content: popChange(data.place),
						show: ["ni", "lgd"]
					},
					box_2: {
						id: "broadage",
						year:  "Population Estimates " + pullYear("BroadAge", data.place),
						content:  "GroupChart",
						chart_data: makeDataNICompare("BroadAge"),
						show: ["ni", "lgd", "dea", "sdz"]
					},
					box_2a: {
						id: "age",
						year:  pullCensusYear("age"),
						content:  "GroupChart",
						chart_data: makeDataNICompare("age"),
						show: ["dz"]
					},
					// box_3: {
					// 	id: "sex",
					// 	content: "<span >"  + " sex split to be added</span>"
					// },
					box_4: {
						id: "hhsize",
						year: pullCensusYear("hh_size"),
						content: "GroupChart",
						chart_data: makeDataNICompare("hh_size")
					},
					box_5: {
						id: "religion",
						year: pullCensusYear("religion_or_religion_brought_up_in"),
						content: "GroupChart",
						chart_data: makeDataNICompare("religion_or_religion_brought_up_in")
					},
					// box_6: {
					// 	id: "language",
					// 	year: pullCensusYear("mainlang"),
					// 	content: "GroupChart",
					// 	chart_data: makeDataNICompare("mainlang")
					// },
					box_7 :{
						id: "language",
						year: pullCensusYear("mainlang"),
						content: "StackedBarChart",				
							chart_data: data.place && makeData_year(["mainlang"], ["2011"], ["2021"]),
							zKey: chart_compare_type,
							label: chartLabel,
							topic_prev_available: true}


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
		heading = "Health and social care"
		place = {data.place}
		sub_heading =   {moreData("Health and social care", data.place)}
		description = " "
		chart_compare_type = {chart_compare_type}
		boxes = {{
			box_0: {
				id: "generalhealth",
				year: pullCensusYear("general_health"),
				content: "GroupChart",
				chart_data: makeDataNICompare("general_health")
						
			},
			
			// box_1: {
			// 	id: "generalhealth",
			// 	year: pullCensusYear("general_health"),
			// 	content: "StackedBarChart",				
			// 	chart_data: data.place && makeData_year(["general_health"], ["2011"], ["2021"]),
			// 	zKey: chart_compare_type,
			// 	label: chartLabel,
			// 	topic_prev_available: true
			// },
			box_2a: {
				id: "wellbeing",
				year: pullYear("Happy", data.place),
				content: "<p>Happiness</p><span class='text-big'>" + (check("Happy.value")).toLocaleString() + "</span>/ 10 "	+
						"<p>Life Satisfaction</p><span class='text-big'>" + (check("Satisfy.value")).toLocaleString() + "</span>/ 10 " +
						"<p>Loneliness</p><span class='text-big'>" + (check("Lonely.value")).toLocaleString(undefined, {minimumFractionDigits: 1}) + "</span>%",

				show: ["ni"]
			},
			box_2b: {
				id: "wellbeing",
				year: pullYear("Happy", data.place),
				content: "<p>Happiness</p><span class='text-big'>" + (check("Happy.value")).toLocaleString() + "</span>/ 10 "	+
						"<span style='color: #1460aa'> (NI " + data.ni.data.Happy.value + "/10) </span></p>"+
						"<p>Life Satisfaction</p><span class='text-big'>" + (check("Satisfy.value")).toLocaleString() + "</span>/ 10 "+
						"<span style='color: #1460aa'> (NI " + data.ni.data.Satisfy.value +"/10) </span></p>"+ 
						"<p>Loneliness</p><span class='text-big'>" + (check("Lonely.value")).toLocaleString(undefined, {minimumFractionDigits: 1}) + "%</span>"+
						"<span style='color: #1460aa'> (NI " + data.ni.data.Lonely.value +"%) </span></p>" ,

				show: [ "lgd"]
			},

			box_3a: {
				id: "lifeexpectancy",
				year: pullYear("LE", data.place),
				content: "<p>Male</p> <span class='text-big'>" + 
					(check("LE.value.Males")).toLocaleString() +
					"</span> years"+
					"<p>Female</p> <span class='text-big'>" +
					(check("LE.value.Females")).toLocaleString() + "</span> years",
				show: ["ni"]
			},

			box_3b: {
				id: "lifeexpectancy",
				year: pullYear("LE", data.place),
				content: "<p>Male</p> <span class='text-big'>" + 
					(check("LE.value.Males")).toLocaleString() +
					"</span> years"+
					"<span style='color: #1460aa'> (NI " + data.ni.data.LE.value.Males +") </span></p>"+
						
					"<p>Female</p> <span class='text-big'>" +
					(check("LE.value.Females")).toLocaleString() + "</span> years"+
					"<span style='color: #1460aa'> (NI " + data.ni.data.LE.value.Females +") </span></p>",
				show: [ "lgd", "dea"]
			},

			box_4: {
				id: "carers",
				content: "GroupChart",
				year: pullCensusYear("provision_care"),
				chart_data: makeDataNICompare("provision_care")
			},
			box_5: {
				id: "hospitalactivity",
				year: pullYear("Admiss", data.place),
				content: "<p><span class='text-big'>" + 
					(check("Admiss.value")).toLocaleString() +
						"</span> hospital admissions</p>"+
						"<p>The most frequent primary reason was for </p><span class='text-bold' >" + (check("Admiss.text"))+ "</span>",

					show: ["ni", "dea"]
			},

			
			box_6: {
				id: "primarycare",
				year: pullYear("GP", data.place)   ,
				content: "<p><span class='text-big'>" + 
						(check("GP.value.PRACS")).toLocaleString() +
						"</span> GP practices with an average of <span class='text-big'>" + 
						(check("GP.value.PRACLIST")).toLocaleString() +
						"</span> patients per practice</p>" +
						"<p><span class='text-big'>" + 
						 (check("DEN.value.GDSDSSurgeries")).toLocaleString() +
						"</span> dental surgeries.  </span> <span class='text-big'>" + 
						(check("DEN_REG.value.Dental_Registrations") / check("MYETotal.value")*100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +
						"%</span> of the population are registered with a dentist</p>",
				show: ["ni"]
			},
			
			box_6a: {
				id: "primarycare",
				year: pullYear("GP", data.place)   ,
				content: "<p><span class='text-big'>" + 
							(check("GP.value.PRACS")).toLocaleString() +
						"</span> GP practices with an average of <span class='text-big'>" + 
						(check("GP.value.PRACLIST")).toLocaleString() +
						"</span> patients per practice</p>" +
						"<p>"+(compareNIrate("GP.value.PRACLIST")).toLocaleString() +
						 "<span style='color: #1460aa'> (NI " +  data.ni.data.GP.value.PRACLIST.toLocaleString() +" patients per practice) </span></p>"+
						"<p><span class='text-big'>" + 
						 (check("DEN.value.GDSDSSurgeries")).toLocaleString() +
						"</span> dental surgeries." +
						"</span>  <span class='text-big'>" + 
						(check("DEN_REG.value.Dental_Registrations") / check("MYETotal.value")*100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +
						"%</span> of the population are registered with a dentist</p>",
				show: [ "lgd"]
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
				and the <a href='https://bso.hscni.net/directorates/operations/family-practitioner-services/directorates-operations-family-practitioner-services-information-unit/'>
				Business Services Organisation</a>, including statistics on <a href='https://www.health-ni.gov.uk/topics/dhssps-statistics-and-research/health-inequalities-statistics'>Health inequalities</a>, 
				Primary care (including <a href='https://bso.hscni.net/directorates/operations/family-practitioner-services/directorates-operations-family-practitioner-services-information-unit/1776-2/'>Medical</a>, 
				<a href='https://bso.hscni.net/directorates/operations/family-practitioner-services/directorates-operations-family-practitioner-services-information-unit/general-dental-services-statistics/'>Dental</a>, 
				<a href='https://bso.hscni.net/directorates/operations/family-practitioner-services/directorates-operations-family-practitioner-services-information-unit/general-pharmaceutical-services-and-prescribing-statistics/'>
				Pharmaceutical</a> and <a href='https://bso.hscni.net/directorates/operations/family-practitioner-services/directorates-operations-family-practitioner-services-information-unit/general-ophthalmic-services-statistics/'>
				Ophthalmic</a>), <a href='https://www.health-ni.gov.uk/topics/dhssps-statistics-and-research/family-health-services-statistics'>
				Family health services</a>, <a href='https://www.health-ni.gov.uk/topics/doh-statistics-and-research/hospital-waiting-times-statistics'>
				Hospital waiting times statistics</a>, <a href='https://www.health-ni.gov.uk/topics/doh-statistics-and-research-mental-health-and-learning-disabilities/mental-health-learning-disability-and-autism-statistics'>
				Mental health, learning disability and autism</a>, <a href='https://www.health-ni.gov.uk/topics/dhssps-statistics-and-research-social-services/social-care-statistics'>
				Social care</a>, <a href='https://www.health-ni.gov.uk/topics/dhssps-statistics-and-research/workforce-statistics'>Workforce</a>, and COVID-19.
				DoH also have information on 				<a href = 'https://www.health-ni.gov.uk/topics/dhssps-statistics-and-research/health-inequalities-statistics'>Health Inequalities</a>
				and <a href='https://www.health-ni.gov.uk/topics/doh-statistics-and-research/doh-commissioned-surveys'> Commissioned Surveys</a> which includes the Health Survey Northern Ireland.

				A number of <a href='https://visual.nisra.gov.uk/?body=entity/health'>interactive dashboards</a> are available and a compendium dashboard for <a href='https://visual.nisra.gov.uk/?body=entity/las'>
				Making Life Better</a>.
				
				The <a href='https://www.nisra.gov.uk/statistics/census'>2021 census</a> collected data on general health, long-term conditions and carers which can 
				be explored in the <a href='https://explore.nisra.gov.uk/area-explorer-2021/N92000002/'>Census Area Explorer</a> and the <a href='https://build.nisra.gov.uk/en/'>Flexible Table Builder</a>.</p><p></p>"
	/>
	
	<Accordion
		id = "work"
		img = "nisra-taxonomy-icon-labour-market.png"
		heading = "Work, pay and benefits"
		place = {data.place}
		sub_heading = {moreData("Work, pay and benefits", data.place)}
		description = " "
		chart_compare_type = {chart_compare_type}
		boxes = {{
			box_1: {
				id: "employmentrates",
				year: pullYear("LMS", data.place),
				content: "GroupChart",
				chart_data: makeDataNICompare("LMS"),
				show: ["ni", "lgd"]
			},
				
			box_2a: {
				id: "employed",
				year: pullYear("LMS", data.place),
				content: "<p>People employed</p> <span class='text-big'>" +
					     (check("LMS.value.EMPN")).toLocaleString() +
						 "</span> </p>"+
						'<p>Median weekly salary</p> <span class="text-big">£' +
					     (check("ASHE_weekly.value")).toLocaleString(undefined, {maximumFractionDigits: 0}) + '</span> ',
						 
				show: ["ni"]
			},

			box_2b: {
				id: "employed",
				year: pullYear("LMS", data.place),
				content: "<p>People employed</p> <span class='text-big'>" +
					     (check("LMS.value.EMPN")).toLocaleString() +
						 "</span> </p>"+
						'<p>Median weekly salary</p> <span class="text-big">£' +
					     (check("ASHE_weekly.value")).toLocaleString(undefined, {maximumFractionDigits: 0}) + '</span> '+
						 "<span style='color: #1460aa'> (NI £" + data.ni.data.ASHE_weekly.value.toLocaleString(undefined, {maximumFractionDigits: 0}) +") </span></p>",
				show: [ "lgd"]
			},
			
			box_3b: {
				id: "bres",
				year: pullYear("BRES", data.place),
				content:  "GroupChart",
				chart_data: makeDataNICompare("BRES"),
				show: ["ni", "lgd"]
			},	
				
			// box_3: {
			// 	id: "wages",
			// 	year: pullYear("ASHE", data.place),
			// 	content: '<p><span class="text-big">£' +
			// 		     (check("ASHE.value")).toLocaleString() +
			// 			 '</span> median salary</p>',
			// 	show: ["ni", "lgd"]
			// },

			box_4: {
				id: "ucbenefits",
				year: pullYear("BS", data.place),
				content: '<span class="text-big">' + data.place.data.BS.value.UC.toLocaleString() + '</span> claimants<br><span class="text-big">' + (data.place.data.BS.value.UC / data.place.data.MYETotal.value * 100).toFixed(1) + '%</span> of population',
				compare_content: {
					ni: "",
					lgd: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.UC.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.UC / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>",
					dea: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.UC.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.UC / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>",
					sdz: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.UC.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.UC / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>",
					dz: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.UC.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.UC / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>"
				}
				
			},

			box_5: {
				id: "pipbenefits",
				year: pullYear("BS", data.place),
				content: '<span class="text-big">' + data.place.data.BS.value.PIP.toLocaleString() + '</span> claimants<br><span class="text-big">' + (data.place.data.BS.value.PIP / data.place.data.MYETotal.value * 100).toFixed(1) + '%</span> of population',
				compare_content: {
					ni: "",
					lgd: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.PIP.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.PIP / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>",
					dea: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.PIP.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.PIP / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>",
					sdz: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.PIP.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.PIP / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>",
					dz: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.PIP.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.PIP / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>"
				}
			
			},
			
			box_6: {
				id: "pensionagebenefits",
				year: pullYear("BS", data.place),
				content: '<span class="text-big">' + data.place.data.BS.value.RP.toLocaleString() + '</span> claimants<br><span class="text-big">' + (data.place.data.BS.value.RP / data.place.data.MYETotal.value * 100).toFixed(1) + '%</span> of population',
				compare_content: {
					ni: "",
					lgd: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.RP.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.RP / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>",
					dea: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.RP.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.RP / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>",
					sdz: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.RP.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.RP / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>",
					dz: "<span style='color: #1460aa; font-size: 12pt;'>(NI: <b>" + data.ni.data.BS.value.RP.toLocaleString() + "</b> claimants, <b>" + (data.ni.data.BS.value.RP / data.ni.data.MYETotal.value * 100).toFixed(1) + "%</b> of population)</span>"
				}
			}	
							
		}}
		more = "<p>The monthly <a href='https://www.nisra.gov.uk/statistics/labour-market-and-social-welfare/labour-market-overview'>Labour Market Report</a>
				contains the most up to date labour market statistics. The <a href='https://www.nisra.gov.uk/statistics/labour-market-and-social-welfare/annual-survey-hours-and-earnings'>
				Annual Survey of Hours and Earnings</a> provides data on hourly, weekly and annual earnings. The <a href='https://www.nisra.gov.uk/statistics/labour-market-and-social-welfare/quarterly-employment-survey'>
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
		heading = "Education and skills"
		place = {data.place}
		sub_heading =   {moreData("Schools, colleges and universities", data.place)}
		description = ""
		chart_compare_type = {chart_compare_type}
		boxes = {{

			box_1: {
				id: "enrollments",
				content: "<p style='margin:0'>Primary school <span class='text-big'>" + 
						 (check("Primary.value.All")).toLocaleString() + "</span> "+
						
						 "<p style='margin:0'>Post primary school <span class='text-big'>" + 
						 (check("PostPrimary.value.All")).toLocaleString() + " </span>"+

						 "<p style='margin:0'>NI Further education colleges <span class='text-big'>" +
						 (check("FE.value")).toLocaleString() + "</span>"+

						 "<p style='margin:0'>UK Higher education institutions <span class='text-big'>" +
						 (check("HE.value")).toLocaleString() +" </span>",
				year: pullYear("Primary", data.place) ,
				show: ["ni", "lgd", "dea"]
			},
				
			box_2a: {
				id: "fsme",
				content: "<p style='margin:0'>Primary school <span class='text-big'> " + Number(check("Primary.perc.FSME")).toFixed(1) + "% </span>"+
					 	 "<p style='margin:0'>Post primary school <span class='text-big'>" + Number(check("PostPrimary.perc.FSME")).toFixed(1) + "% </span>",
				year: pullYear("Primary", data.place),
				show: ["ni"]
			},
			
			box_2b: {
				id: "fsme",
				content: "<p style='margin:0'>Primary school <span class='text-big'> "+ Number(check("Primary.perc.FSME")).toFixed(1) + "% </span>"+
				"<span style='color: #1460aa'> (NI " + data.ni.data.Primary.perc.FSME.toFixed(1) +"%) </span></p>"+
					 "<p style='margin:0'>Post primary school <span class='text-big'>"+ Number(check("PostPrimary.perc.FSME")).toFixed(1) + "% </span>"+
					 "<span style='color: #1460aa'> (NI " + data.ni.data.PostPrimary.perc.FSME.toFixed(1) + "%) </span></p>",
				year: pullYear("Primary", data.place),
				show: [ "lgd", "dea"]
			},

			// box_3a: {
			// 	id: "teachers",
			// 	year: pullYear("ClassSize", data.place),
			// 	content: "<p><span class='text-big'>"  + 
			// 	         (check("ClassSize.value")).toLocaleString() +"</span> pupils per teacher" ,
			// 	show: ["ni"]
			// },
		
			// box_3n: {
			// 	id: "teachers",
			// 	year: pullYear("ClassSize", data.place),
			// 	content: "<p><span class='text-big'>"  + 
			// 	         (check("ClassSize.value")).toLocaleString() +"</span> pupils per teacher" +
			// 			 "<span style='color: #1460aa'> (NI " + data.ni.data.ClassSize.value.toLocaleString(undefined, {minimumFractionDigits: 1}) +") </span></p>",
			// 	show: [ "lgd"]
			// },

			// box_3: {
			// 	id: "SEN",
			// 	year: pullYear("SEN", data.place),
			// 	content: "<p>Non statemented</p>"+
			// 			"<p> <span class='text-big'>" +
			// 				(check("SEN.value.SENNonStatemented") + 
			// 				check("Primary.value.SENNonStatemented") + 
			// 				check("PostPrimary.value.SENNonStatemented")).toLocaleString() + 
			// 			"</span> pupils (" +
			// 			"<span>" + 
			// 				((check("SEN.value.SENNonStatemented") + 
			// 				check("Primary.value.SENNonStatemented") + 
			// 				check("PostPrimary.value.SENNonStatemented"))
			// 				/( check("Primary.value.All")+
			// 				check("PostPrimary.value.All"))*100).toLocaleString(undefined, {maximumFractionDigits: 1}) + 
			// 			"</span>% of all pupils)"+
			// 			"</p>" +
			// 			"<p>Statemented</p><p><span class='text-big'>" + (check("SEN.value.SENStatement") + check("Primary.value.SENStatement") + check("PostPrimary.value.SENStatement")).toLocaleString() + "</span> pupils ("+
			// 			"<span>" + ((check("SEN.value.SENStatement") + check("Primary.value.SENStatement") + check("PostPrimary.value.SENStatement"))/( check("Primary.value.All")+check("PostPrimary.value.All"))*100).toLocaleString(undefined, {maximumFractionDigits: 1}) + "</span>% of all pupils)</p>",
			// 	show: ["ni", "lgd", "dea"]
			// },



			box_3a: {
				id: "SEN",
				year: pullYear("SEN", data.place),
				content: 
						"<p> <span class='text-big'>" +
							(check("SEN.value.SENNonStatemented") + 
							check("Primary.value.SENNonStatemented") + 
							check("PostPrimary.value.SENNonStatemented")+
							check("SEN.value.SENStatement") + 
							check("Primary.value.SENStatement") + 
							check("PostPrimary.value.SENStatement")).toLocaleString() + 
						"</span> pupils with some form of special educational need</p>" +
						"<p><span class='text-big'>" + 
							Number(((check("SEN.value.SENNonStatemented") + 
							check("Primary.value.SENNonStatemented") + 
							check("PostPrimary.value.SENNonStatemented")+
							check("SEN.value.SENStatement") + 
							check("Primary.value.SENStatement") + 
							check("PostPrimary.value.SENStatement"))
							/( check("Primary.value.All")+
							check("PostPrimary.value.All"))*100)).toFixed(1) + 
						"%</span> of all pupils"+
						"</p>", 
						show: ["ni", "lgd", "dea"]
			},

			box_4: {
				id: "qualifications",
				content:  "GroupChart",
				year: pullCensusYear("highest_level_of_qualifications"),
				chart_data: makeDataNICompare("highest_level_of_qualifications")
			},


			box_5a: {
				id: "attainment",
				year: pullYear("Attainment", data.place),
				content: "<p>Pupils who left school with 5 or more GCSEs (including equivalents) grades A*-C</p><p> <span class='text-big'>"  + 
				    	 (check("Attainment.value")).toLocaleString() +"%</span> " + 
						 "<p>including GCSE English and maths</p>",
				show: ["ni"]
			},
			
			box_5b: {
				id: "attainment",
				year: pullYear("Attainment", data.place),
				content: "Pupils who left school with 5 or more GCSEs (or equivalents) grades A*-C:<br><span class='text-big'>"  + 
				    	 (check("Attainment.value")).toLocaleString() +"%</span> "+ 
						 "<span style='color: #1460aa'>(NI " + data.ni.data.Attainment.value.toLocaleString(undefined, {minimumFractionDigits: 1}) + "%) </span>" + 
						 "<br>including GCSE English and maths" +
						  (compareNIrate("Attainment.value")).toLocaleString() ,
				show: ["lgd"]
			},
							

			box_6: {
				id: "destination",
				year: pullYear("Destination", data.place),
				content:  "GroupChart",
				chart_data: makeDataNICompare("Destination"),
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
	id = "environment"
	img = "nisra-taxonomy-icon-summary-stats.png"
	heading = "Environment"
	place = {data.place}
	sub_heading = {moreData("Environment", data.place)}
	description = " "
	chart_compare_type = {chart_compare_type}
	boxes = {{
			

		box_1 :{
			id: "concern",
			year: pullYear("Env_concern", data.place),
			content:  "GroupChart",
			chart_data: makeDataNICompare("Env_concern"),
			show: ["ni", "lgd"],
		},	

					

						
		box_2: {
			id: "waste",
			year: pullYear("Env_waste", data.place),
			content:  "GroupChart",
			chart_data: makeDataNICompare("Env_waste"),
			show: ["ni", "lgd"]
		},

		box_3: {
			id: "ghg",
			year: pullYear("Env_ghg", data.place),
			content:  "<span class='text-big'>"  + 
					 (check("Env_ghg.value.GHGALL")).toLocaleString(undefined, {maximumFractionDigits: 0}) +"</span> kilotonnes of carbon dioxide equivalent (KtCO2e)",
					
			show: ["ni", "lgd"]
		},

		box_4: {
			id: "cars",
			year: pullCensusYear("car_or_van"),
			content: "GroupChart",
			chart_data: makeDataNICompare("car_or_van")
					
		},
		
		box_5: {
			id: "active",
			year: pullYear("Env_active", data.place),
			content:  "<span class='text-big'>"  + 
					 (check("Env_active.value.JWCPT")).toLocaleString(undefined, {maximumFractionDigits: 0}) +"%</span>  journeys made by walking, cycling and public transport" ,
			show: ["ni"]
					
		},

		box_5a: {
			id: "active",
			year: pullYear("Env_active", data.place),
			content:  "<span class='text-big'>"  + 
					 (check("Env_active.value.JWCPT")).toLocaleString(undefined, {maximumFractionDigits: 0}) +"%</span> " + 
					 "<span style='color: #1460aa'> (NI " + data.ni.data.Env_active.value.JWCPT + "%) </span> journeys made</p>"+
					 " by walking, cycling and public transport" ,						
			show: ["lgd"]
					
		},

		box_6: {
			id: "renewable",
			year: pullCensusYear("renewable_energy"),
			// content: "GroupChart",
			// chart_data: makeDataNICompare("renewable_energy")

			
			content: "StackedBarChart",				
						chart_data: data.place && makeData_year(["renewable_energy"], ["2011"], ["2021"]),
						zKey: chart_compare_type,
						label: chartLabel,
						topic_prev_available: true

		},

		box_7a: {
			id: "empty",
			i_button: false,
			content: "",
			show: ["dea","sdz","dz"]
		},
				
		box_7b: {
			id: "empty",
			i_button: false,
			content: "",
			show: ["dea","sdz","dz"]
		}

	}}
	more = "<p>The <a href='https://www.daera-ni.gov.uk/landing-pages/statistics'>Department of Agriculture, Environment and Rural Affairs</a>
				publishes statistics on the Environment from a range of sources, including 
				<a href='https://www.daera-ni.gov.uk/articles/northern-ireland-greenhouse-gas-inventory'>greenhouse gas inventory</a>,
				<a href='https://www.daera-ni.gov.uk/articles/northern-ireland-local-authority-collected-municipal-waste-management-statistics'>
				local authority collected municipal waste management statistics</a>, 
				<a href='https://www.daera-ni.gov.uk/articles/northern-ireland-environmental-statistics'>environmental statistics report</a>, 
				<a href=' https://www.daera-ni.gov.uk/topics/water/bathing-water-quality'>bathing water quality</a>  and air pollution.  
				The <a href='https://www.nisra.gov.uk/statistics/census'>2021 census</a> 
				collected data on availability of cars and household renewable energy systems which can be
				explored in the <a href='https://explore.nisra.gov.uk/area-explorer-2021/N92000002/'>Census Area Explorer</a> 
				and the <a href='https://build.nisra.gov.uk/en/'>Flexible Table Builder</a>.</p>"
        
/> 


	<Accordion
		id = "crime"
		img = "nisra-taxonomy-icon-crime-justice.png"
		heading = "Crime and justice"
		place = {data.place}
		sub_heading = {moreData("Crime and Court Activity", data.place)}
		description = " "
		chart_compare_type = {chart_compare_type}
		boxes = {{

			box_1: {
				id: "crime",
				year: pullYear("crime", data.place),
				content:  "<span class='text-big'>"  + 
				    	 (check("crime.value.allcrime")).toLocaleString(undefined, {maximumFractionDigits: 0}) +" </span>crimes recorded" ,
						//  +
						//  "<p>"+(compareNIavg("crime.value.allcrime")).toLocaleString() ,
				show: ["ni", "lgd", "dea"]
						
			},

			box_7a: {
				id: "empty",
				i_button: false,
				content: ""
			},

			box_7b: {
				id: "empty",
				i_button: false,
				content: ""
			}


				
		}}
		more = ""
	/>


	<Accordion
		id = "business"
		img = "nisra-taxonomy-icon-business-energy.png"
		heading = "Business sectors"
		place = {data.place}
		sub_heading = {moreData("Business sectors", data.place)}
		description = " "
		chart_compare_type = {chart_compare_type}
		boxes = {{
				
		}}
		more = ""
	/> 

	<Accordion
		id = "economy"
		img = "nisra-taxonomy-icon-economy.png"
		heading = "Economy and trade"
		place = {data.place}
		sub_heading = {moreData("Economy and trade", data.place)}
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