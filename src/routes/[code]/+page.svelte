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

		let props = value.split(".");

		let rtn_value = data.place.data;

		for (let i = 0; i < props.length; i ++) {

			if (rtn_value.hasOwnProperty(props[i])) {
				rtn_value = rtn_value[props[i]]
			}

		}

		return rtn_value;

	}

	function pullYear (value) {
		
		if (data.place.meta_data.hasOwnProperty(value)) {
			return data.place.meta_data[value][0].year;
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

		let pop = place.data.population.value[Object.keys(place.data.population.value).filter(function (x) {if (x == "change") {return false} else {return true}}).splice(-1)].all;

		let hectares = place.hectares;

		let pop_den = pop / hectares;

		if (pop_den < 0.1) {
			pop_den = "< 0.1"
		} else {
			pop_den = pop_den.toFixed(1);
		}

		return pop_den;

	}

	

</script>

<svelte:head>
	<title>{data.place.name} NISRA Key Statistics</title>
	<meta name="description" content="" />
	<meta property="og:title" content="{data.place.name} Census Data" />
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

						{data.place.name}
					{:else}
						{data.place.name}
					{/if}
				</span><br />
				<span class="text-big title">{data.place.name}</span>
				
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
							alt="Return to the landing page"
							onclick="window.location.href='/about';"
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
				heading = "Overview"
				place = {data.place}
				style = "line-height: 1.3;"
				content = {{
							ni: "The population of " + data.place.name + " was " + data.place.data.population.value["2021"].all.toLocaleString() + " at the time of the 2021 Census.",
							lgd: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl +  ".",
							dea: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl + "in Northern Ireland.  It is within " + "<a href = '/" + data.place.parents[0].code + "/' data-sveltekit-noscroll>" + data.place.parents[0].name + " </a>" + " and covers " + data.place.dea_location_description + ".",
							sdz: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl ,
							dz: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl							
							}}
				
				chart_compare_type = {chart_compare_type}
			/>

			<GreyBox
				id = "pop"
				place = {data.place}
				year = {pullCensusYear("population")}
				content = {'<span class="text-big" style="font-size: 2.8em;">' + data.place.data.population.value["2021"].all.toLocaleString() + '</span>'}
				chart_compare_type = {chart_compare_type}
				compare_content = {{
					ni: {
						prev: '<span class="em ' + changeClass(data.place.data.population.value.change.all) + '">' + changeStr(data.place.data.population.value.change.all, "%", 1,) + '</span> since 2011 Census'
					},
					lgd: {
						prev: '<span class="em ' + changeClass(data.place.data.population.value.change.all) + '">' + changeStr(data.place.data.population.value.change.all, "%", 1,) + '</span> since 2011 Census',
						ni: '<span class = "em" style = "background-color: lightgrey">' + returnPct(data.place.data.population.value["2021"].all / data.ni.data.population.value["2021"].all) + '</span> of Northern Ireland population<br>' +
							'The ' + returnRank(data.place.data.population.value_rank["2021"].all) + " population of 11 Local Government Districts"
					},
					dea: {
						ni: '<span class = "em" style = "background-color: lightgrey">' + returnPct(data.place.data.population.value["2021"].all / data.ni.data.population.value["2021"].all) + '</span> of Northern Ireland population'
					},
		
					sdz: {
						prev:" nothing further",
						ni:" nothing further"},
					dz: {
						prev:" no comparisons",
						ni:" nothing further"}
				}}
			/>

			<GreyBox
				id = "popden"
				place = {data.place}
				year = {pullCensusYear("population")}
				content = {'<span class="text-big" style="font-size: 2.8em;">' + popDen(data.place) + '</span> people per hectare'}
				chart_compare_type = {chart_compare_type}
				compare_content = {{
					ni: {
						prev: '<span class="em ' + changeClass(data.place.data.households.value.change.all_households) + '">' + changeStr(data.place.data.households.value.change.all_households, "%", 1,) + '</span> since 2011 Census'
					},
					lgd: {
						prev: '<span class="em ' + changeClass(data.place.data.households.value.change.all_households) + '">' + changeStr(data.place.data.households.value.change.all_households, "%", 1,) + '</span> since 2011 Census',
						ni: '<span class = "em" style = "background-color: lightgrey">' + returnPct(data.place.data.households.value["2021"].all_households / data.ni.data.households.value["2021"].all_households) + '</span> of Northern Ireland households'
					},
					dea: {
						ni: '<span class = "em" style = "background-color: lightgrey">' + returnPct(data.place.data.households.value["2021"].all_households / data.ni.data.households.value["2021"].all_households) + '</span> of Northern Ireland households'
					},
					sdz: {
						prev:" nothing further", ni:" nothing further"},
					dz: {
						prev:" no comparisons", ni: "no ni comparisons"}
				}}
			/>

		</div>
		<!-- a19e9e -->
		<div class="grid mt" bind:clientWidth={w}>
			<div style="grid-column: span {cols};">
				<h3>
					<!-- Explore <span style="color: #93328E">{data.place.name}</span> -->
					{#if data.place.type != "ni"}
					Explore 
					<span style="color: #3878c5">{data.place.name}</span>
						<span style="color: #00205b"
							> {geog_types[data.place.type].name}</span
						>
					{:else}
						Explore <span style="color: #3878c5">{data.place.name}</span>
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
					<span class="text-bold">Parents of {data.place.name} </span>
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
						>{data.place.children[0]
							? geog_types[data.place.children[0].type].pl
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
			sub_heading =   {"There is more People and Households data available for <a href = '/" + data.place.parents[0].code + "/' data-sveltekit-noscroll>" + data.place.parents[0].name + " </a>"}
			description = ""
			chart_compare_type = {chart_compare_type}
			boxes = {{
					box_1: {
						id: "popchange",
						content: "<span >"  + " population growth/shrink to be added</span> "},
					box_2: {
						id: "age",
						year: pullCensusYear("age"),
						content:  "GroupChart",
						chart_data: {
							none: makeDataGroupSort(data.place.grouped_data_nocompare.age, "age"),
							prev: makeDataGroupSort(data.place.grouped_data_timecompare.age, "age"),
							ni: makeDataGroupSort(data.place.grouped_data_areacompare.age, "age"),
						},
						topic_prev_available: "true"
					},
					box_3: {
						id: "sex",
						content: "<span >"  + " sex split to be added</span>"
					},
					box_4: {
						id: "hhsize",
						year: pullCensusYear("hh_size"),
						content: "GroupChart"		,
						chart_data: {
							none: makeDataGroupSort(data.place.grouped_data_nocompare.hh_size, "hh_size"),
							prev: makeDataGroupSort(data.place.grouped_data_timecompare.hh_size, "hh_size"),
							ni: makeDataGroupSort(data.place.grouped_data_areacompare.hh_size, "hh_size"),
						},
						topic_prev_available: "true"},
					box_5: {
						id: "religion",
						year: pullCensusYear("religion_or_religion_brought_up_in"),
						content: "GroupChart",
						chart_data: {
							none: makeDataGroupSort(data.place.grouped_data_nocompare.religion_or_religion_brought_up_in, "religion_or_religion_brought_up_in"),
							prev: makeDataGroupSort(data.place.grouped_data_timecompare.religion_or_religion_brought_up_in, "religion_or_religion_brought_up_in"),
							ni: makeDataGroupSort(data.place.grouped_data_areacompare.religion_or_religion_brought_up_in, "religion_or_religion_brought_up_in"),
						},
						topic_prev_available: "true"
					},
					box_6: {
						id: "language",
						year: pullCensusYear("mainlang"),
						content: "GroupChart",
						chart_data: {
							none: makeDataGroupSort(data.place.grouped_data_nocompare.mainlang, "mainlang"),
							prev: makeDataGroupSort(data.place.grouped_data_timecompare.mainlang, "mainlang"),
							ni: makeDataGroupSort(data.place.grouped_data_areacompare.mainlang, "mainlang"),
						},
						topic_prev_available: "true"
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
		sub_heading =   {"There is more Health and Social Care data available for <a href = '/" + data.place.parents[0].code + "/' data-sveltekit-noscroll>" + data.place.parents[0].name + " </a>"}
		description = "xxxx"
		chart_compare_type = {chart_compare_type}
		boxes = {{
				box_1: {
						id: "generalhealth",
						year: pullCensusYear("general_health"),
						content: {
							ni: "StackedBarChart",
							lgd: "StackedBarChart",
							dea: "StackedBarChart",
							sdz: "not available - needs missing 2011",
							dz: "not available - needs missing 2011"
						},				
						chart_data: data.place && makeData_year(["general_health"], ["2011"], ["2021"]),
						zKey: chart_compare_type,
						label: chartLabel,
						topic_prev_available: "true"
					},
				box_2: {
						id: "wellbeing",
						year: pullYear("Happy"),
						content: {
							ni: "<p><span class='text-big' style='font-size: 2.8em'>7.5"+ "</span> / 10 </p>",
							lgd: "<p><span class='text-big' style='font-size: 2.8em'>" + (check("Happy.value")).toLocaleString() + "</span> / 10 </p>"
						},	
						show: ["ni", "lgd"]
					},
				box_3: {
						id: "lifeexpectancy",
						content: "<p>Males <span class='text-big' style='font-size: 1.8em'>" + 
							(check("LE.value.Males")).toLocaleString() +
							"</span> years</p>"+"<p>Female <span class='text-big' style='font-size: 1.8em'>"+(check("LE.value.Females")).toLocaleString()+ "</span> years</p>",
						show: ["ni", "lgd"]
					},
				box_4: {
						id: "carers",
						content: "GroupChart",
						year: pullCensusYear("provision_care"),
						chart_data: {
							none: makeDataGroupSort(data.place.grouped_data_nocompare.provision_care, "provision_care"),
							prev: makeDataGroupSort(data.place.grouped_data_timecompare.provision_care, "provision_care"),
							ni: makeDataGroupSort(data.place.grouped_data_areacompare.provision_care, "provision_care"),
						},
						label: chartLabel,
						topic_prev_available: "true"
					},
				box_5: {
						id: "hospitalactivity",
						year: pullYear("Admiss"),
						content:  
						// needs checked - sticks
						"<p><span class='text-big' style='font-size: 1.8em'>" + 
							(check("Admiss.value")).toLocaleString() + 
							"</span> hospital admissions.  The most frequent reason was xxx</p>",
						 show: ["ni", "dea"]
					},
				box_6a: {
						id: "primarycare",
						year: pullYear("GP"),
						content: "<p><span class='text-big' style='font-size: 1.2em'>" + 
								 (check("GP.value.PRACS")).toLocaleString() +
								"</span> practices, <span class='text-big' style='font-size: 1.2em'>" + 
								(check("GP.value.GPS")).toLocaleString() + 
								"</span> GPs, and <span class='text-big' style='font-size: 1.2em'>" + 
								(check("GP.value.PRACLIST")).toLocaleString() +
								"</span> patients per practice<span class='text-big' style='font-size: 1.2em'></p><p>" + 
								(check("DEN.value.GDSDSSurgeries")).toLocaleString() +
								"</span> dental surgeries, <span class='text-big' style='font-size: 1.2em'>" + 
								(check("DEN.value.GDSDSDentists")).toLocaleString() +
								"</span> dentists and <span class='text-big' style='font-size: 1.2em'>" + 
								(check("DEN_REG.value.Dental_Registrations")).toLocaleString() +
								"</span> patients registered in total</p>",
						show: ["ni", "lgd"]
					},
					box_6b: {
						id: "primarycare",
						year: pullYear("DEN"),
						content: "<p><span class='text-big' style='font-size: 1.2em'>" + 
								 (check("DEN.value.GDSDSSurgeries")).toLocaleString() +
								 "</span> dental surgeries, <span class='text-big' style='font-size: 1.2em'>" + 
								 (check("DEN.value.GDSDSDentists")).toLocaleString() +
								 "</span> dentists and <span class='text-big' style='font-size: 1.2em'>" + 
								 (check("DEN_REG.value.Dental_Registrations")).toLocaleString() +
								 "</span> patients registered in total</p>",
						show: ["dea"]
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
		sub_heading =   {"There is more Work and Welfare data available for <a href = '/" + data.place.parents[0].code + "/' data-sveltekit-noscroll>" + data.place.parents[0].name + " </a>"}
		description = "xxxx"
		chart_compare_type = {chart_compare_type}
		boxes = {{
				
				box_1: {
						id: "employmentrates",
						year: pullYear("LMS"),
						content: "<p><span class='text-big' style='font-size: 1.8em'>" + (check("LMS.value.EMPR")).toLocaleString() + "</span> employment rate</p>" +
								 "<p><span class='text-big' style='font-size: 1.8em'>" + (check("LMS.value.UNEMPR")).toLocaleString() + "</span> unemployment rate</p>" +
								 "<p><span class='text-big' style='font-size: 1.8em'>" + (check("LMS.value.INACTR")).toLocaleString() + "</span> inactivity rate</p>",
						show: ["ni", "lgd"]
					},
				
				box_2: {
						id: "employed",
						year: pullYear("LMS"),
						content: 
						"<p><span class='text-big' style='font-size: 1.8em'>"  + (check("LMS.value.EMPN")).toLocaleString() + "</span> employed</p>",
						show: ["ni", "lgd"]
					},

				box_3: {
						id: "wages",
						year: pullYear("ASHE"),
						content: '<p><span class="text-big" style="font-size: 1.8em">£' + (check("ASHE.value")).toLocaleString() + '</span> annual median salary</p>',
						show: ["ni", "lgd"]
					},
						
				box_4: {
					id: "disabilitybenefits",
					year: pullYear("BS"),
					content: '<span class="text-big">' +
						(data.place.data.BS.value.PIP + data.place.data.BS.value.DLA + data.place.data.BS.value.CA + data.place.data.BS.value.AA).toLocaleString() + '</span> claimants',
				
				},

				box_5: {
					id: "workingagebenefits",
					year: pullYear("BS"),
					content: '<span class="text-big">' +
						(data.place.data.BS.value.UC + data.place.data.BS.value.JSA + data.place.data.BS.value.IS + data.place.data.BS.value.ESA).toLocaleString() + '</span> claimants',
					
				},
				
				box_6: {
					id: "pensionagebenefits",
					year: pullYear("BS"),
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
		sub_heading =   {"There is more Schools, colleges and universities data available for <a href = '/" + data.place.parents[0].code + "/' data-sveltekit-noscroll>" + data.place.parents[0].name + " </a>"}
		description = ""
		chart_compare_type = {chart_compare_type}
		boxes = {{

			box_1: {
						id: "enrollments",
						content: "<p>Primary school <span class='text-big' style='font-size: 1.2em'>500 </span></p>"+
						"<p>Secondary school <span class='text-big' style='font-size: 1.2em'>320 </span></p>" +
						"<p>Further education colleges <span class='text-big' style='font-size: 1.2em'>45 </span></p>" +
						"<p>University <span class='text-big' style='font-size: 1.2em'>200 </span></p>",
					
						show: ["ni", "lgd", "dea"]},
				
			box_2: {
						id: "fsme",
						content: "<p>Primary school <span class='text-big' style='font-size: 1.8em'>33.2%</span></p>"+
						"<p>Secondary school <span class='text-big' style='font-size: 1.8em'>25.2%</span></p>",
					
					show: ["ni", "lgd", "dea"]},
			
			box_3: {
						id: "teachers",
						year: pullYear("ClassSize"),
						content: "<p><span class='text-big' style='font-size: 1.8em'>"  + 
							(check("ClassSize.value")).toLocaleString() +"</span> pupils per teacher</p>"
,
					
					show: ["ni", "lgd"]},
		
			box_4: {
						id: "qualifications",
						content:  "GroupChart",
						year: pullCensusYear("highest_level_of_qualifications"),
						chart_data: {
							none: makeDataGroupSort(data.place.grouped_data_nocompare.highest_level_of_qualifications, "highest_level_of_qualifications"),
							prev: makeDataGroupSort(data.place.grouped_data_timecompare.highest_level_of_qualifications, "highest_level_of_qualifications"),
							ni: makeDataGroupSort(data.place.grouped_data_areacompare.highest_level_of_qualifications, "highest_level_of_qualifications"),
						},
						topic_prev_available: "true"},

			box_5: {
						id: "attainment",
						content: "<span >"  + " attainment to be added</span>"
						,
					
					show: ["ni", "lgd"]},
							}}
		more = "<p>The <a href='https://www.nisra.gov.uk/statistics/children-education-and-skills/school-education-statistics'>Department of Education</a> publishes statistics on <a href='https://www.education-ni.gov.uk/articles/school-enrolments-overview'>school enrolments</a>, <a href='https://www.education-ni.gov.uk/articles/school-performance'>school performance</a>, <a href='https://www.education-ni.gov.uk/articles/school-leavers'>school leavers</a>, qualifications and destinations, <a href='https://www.education-ni.gov.uk/articles/pupil-attendance'>pupil attendance</a>, suspensions and expulsions, school meals and <a href='https://www.education-ni.gov.uk/articles/education-workforce'>education workforce</a>. The <a href='https://www.nisra.gov.uk/statistics/children-education-and-skills/higher-and-further-education-and-training-statistics'>Department for the Economy</a> publishes <a href='https://www.economy-ni.gov.uk/topics/statistics-and-economic-research/higher-education-statistics-and-research'>Higher</a> and <a href='https://www.economy-ni.gov.uk/topics/statistics-and-economic-research/further-education-statistics-and-research'>Further</a> education and <a href='https://www.economy-ni.gov.uk/articles/training-success-statistics'>training</a> statistics. The <a href='https://www.nisra.gov.uk/statistics/census'>2021 census</a> collected data on qualifications which can be explored in the <a href='https://explore.nisra.gov.uk/area-explorer-2021/N92000002/'>Census Area Explorer</a> and the <a href='https://build.nisra.gov.uk/en/'>Flexible Table Builder</a>.</p>"
	/>


	<Accordion
		id = "crime"
		img = "nisra-taxonomy-icon-crime-justice.png"
		heading = "Crime and Justice"
		place = {data.place}
		sub_heading = "Crime and court activity"
		description = "xxxx"
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
		sub_heading = "Travel and transport .... "
		description = "xxxx"
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