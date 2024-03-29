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
          if (data.place.parents[0]) {
            map.setLayoutProperty(
              key + "-self",
              "visibility",
              visibility,
            );
          }
          isChild[key] = key == childType ? true : false;
        });

        // Set new paint properties
        if (data.place.parents[0]) {
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
    $: chartLabel = comp_2011 ? "Same area 2011" : data.place && data.place.parents[0] ? "NI 2021" : null;

    $: chart_compare_type = comp_none
      ? null
      : comp_2011
        ? "prev"
        : !comp_2011 && data.place.type != "ni"
          ? "ni"
          : null;

    $: data.place && update(data.place);
    $: comp_ni = false;
    $: comp_none = true;
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
					<a href="{base}/" sveltekit:noscroll>Home</a
					>{@html " &gt; "}
					{#if data.place.parents[0]}
						{#each [...data.place.parents].reverse() as parent, i}
							<a href="{base}/{parent.code}/" sveltekit:noscroll
								>{parent.name}</a
							>{@html " &gt; "}
						{/each}

						{data.place.name}
					{:else}
						{data.place.name}
					{/if}
				</span><br />
				<span class="text-big title">{data.place.name}</span>
				<div class="text-bold" style="font-size: 0.85em;">
					Click for:

					{#if data.place.type == "ni"}
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
					{#if data.place.type != "ni"}
						<button
							class="btn"
							class:btn-active={comp_ni & !comp_none & !comp_2011}
							on:click={() => (comp_ni = true)}
							on:click={() => (comp_none = false)}
							on:click={() => (comp_2011 = false)}>NI compare</button
						>
					{/if}

						<button
							class="btn"
							class:btn-active={comp_2011 & !comp_none & !comp_ni}
							on:click={() => (comp_2011 = true)}
							on:click={() => (comp_none = false)}
							on:click={() => (comp_ni = false)}
							>Same area - previous</button
						>
				</div>
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

					<!-- Code credit: https://css-tricks.com/on-the-web-share-api/ -->
					<!-- Code credit: https://css-tricks.com/on-the-web-share-api/ -->
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

					<!-- 			<button style="cursor: pointer; background-image: url('https://icons.getbootstrap.com/assets/icons/share.svg'); float: right; margin-top: 5px; margin-left: 8px; background-color: transparent !important; background-size: cover; width: 30px; height: 30px; border: 0" type="share"></button>
 -->
					<div width="100%">
						<button
							class="btn"
							style="width: 33%"
							title="Click to print this page to pdf or printer"
							onclick="window.print();return false;"
							>Print / PDF
						</button>
						<button
							class="btn"
							style="width: 33%"
							alt="Return to the landing page"
							onclick="window.location.href='{base}';"
							>Menu
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
				heading = "Overview - box with words"
				place = {data.place}
				style = "line-height: 1.3;"
				content = {{
					ni: "The population of " + data.place.name + " was " + data.place.data.population.value["2021"].all.toLocaleString() + " at the time of the 2021 Census.",
					lgd: "The population of " + data.place.name + " was " + data.place.data.population.value["2021"].all.toLocaleString() + " at the time of the 2021 Census.",
					dea: "The population of " + data.place.name + " was " + data.place.data.population.value["2021"].all.toLocaleString() + " at the time of the 2021 Census."
				}}
			/>

			<!-- <div class="div-grey-box" style="line-height: 1.3;">
				<h3 style="margin: 0 0 10px 0; line-height: 1.78;">
					Overview - box with words
				</h3>

				{#if data.place.type == "ni" || data.place.type == "ctry"}
					The population of {data.place.name} was {data.place.data.population.value[
						"2021"
					].all.toLocaleString()} at the time of the 2021 Census.
				{:else}
					The population of {data.place.name} was {data.place.data.population.value[
						"2021"
					].all.toLocaleString()} at the time of the 2021 Census, which
					made it the
					{#if data.place.data.population.value_rank["2021"].all == 1}
						largest {geog_types[data.place.type].name}.
					{:else if data.place.data.population.value_rank["2021"].all == data.place.count}
						smallest {geog_types[data.place.type].name}.
					{:else if data.place.data.population.value_rank["2021"].all <= (data.place.count + 1) / 2 && data.place.data.population.value_rank["2021"].all != 1}
						{data.place.data.population.value_rank[
							"2021"
						].all.toLocaleString()}{suffixer(
							data.place.data.population.value_rank["2021"].all,
						)} largest {geog_types[data.place.type].name}.
					{:else}
						{(
							data.place.count +
							1 -
							data.place.data.population.value_rank["2021"].all
						).toLocaleString()}{suffixer(
							data.place.count +
								1 -
								data.place.data.population.value_rank["2021"].all,
						)} smallest {geog_types[data.place.type].name}.
					{/if}
				{/if}
				{#if data.place.type != "dea"}
					{#if data.place.data.population.value.change.all == 0}
						No change in population since the 2011 Census.
					{:else if data.place.data.population.value.change.all > 0}
						An increase of {changeStr(
							data.place.data.population.value.change.all,
							"%",
							1,
						)} since the 2011 Census.
					{:else}
						A decrease of {changeStr(
							data.place.data.population.value.change.all,
							"%",
							1,
						)} since the 2011 Census.
					{/if}
				{/if}
			</div> -->

			<GreyBox
				id = "pop"
				place = {data.place}
				content = {'<span class="text-big" style="font-size: 2.8em;">' + data.place.data.population.value["2021"].all.toLocaleString() + '</span>'}
			/>

			<!-- <div class="div-grey-box">
				<IButton id = "pop" place = {data.place}/>
				<span class="text-big" style="font-size: 2.8em;"
					>{data.place.data.population.value[
						"2021"
					].all.toLocaleString()}</span
				><br />
				{#if data.place.type != "ni"}
					{#if (data.place.type != "ctry") & comp_ni & !comp_2011}
						<span class="text-small"
							><Em
								>{data.place.data.population.value["2021"].all /
									data.ni.data.population.value["2021"].all >=
								0.001
									? (
											(data.place.data.population.value["2021"]
												.all /
												data.ni.data.population.value["2021"]
													.all) *
											100
										).toFixed(1)
									: "<0.1"}%</Em
							> of Northern Ireland population</span
						>
						<div class="text-small">
							{#if data.place.type == "lgd"}
								{#if data.place.data.population.value_rank["2021"].all == 1}
									The largest
								{:else if data.place.data.population.value_rank["2021"].all == data.place.count}
									The smallest
								{:else if data.place.data.population.value_rank["2021"].all <= (data.place.count + 1) / 2 && data.place.data.population.value_rank["2021"].all != 1}
									{data.place.data.population.value_rank[
										"2021"
									].all.toLocaleString()}{suffixer(
										data.place.data.population.value_rank["2021"]
											.all,
									)} largest
								{:else}
									{(
										data.place.count +
										1 -
										data.place.data.population.value_rank["2021"]
											.all
									).toLocaleString()}{suffixer(
										data.place.count +
											1 -
											data.place.data.population.value_rank[
												"2021"
											].all,
									)} smallest
								{/if}
								population of {data.place.count.toLocaleString()}
								{geog_types[data.place.type].pl}
							{/if}
						</div>
					{/if}
				{/if}
				{#if data.place.type !="dea" && comp_2011}
					<span class="text-small"
						><Em
							><span
								class={changeClass(
									data.place.data.population.value.change.all,
								)}
								>{changeStr(
									data.place.data.population.value.change.all,
									"%",
									1,
								)}</span
							></Em
						> since 2011 Census</span
					>
				{/if}
			</div> -->

			<GreyBox
				id = "households"
				place = {data.place}
				content = {'<span class="text-big" style="font-size: 2.8em;">' + data.place.data.households.value["2021"].all_households.toLocaleString() + '</span>'}
			/>

			<!-- <div class="div-grey-box">
				<IButton id = "households" place = {data.place}/>
				<span class="text-big" style="font-size: 2.8em;"
					>{data.place.data.households.value[
						"2021"
					].all_households.toLocaleString()}</span
				><br />
				{#if (data.place.type != "ni") & comp_ni}
					<span class="text-small"
						><Em
							>{data.place.data.households.value["2021"]
								.all_households /
								data.ni.data.households.value["2021"]
									.all_households >=
							0.001
								? (
										(data.place.data.households.value["2021"]
											.all_households /
											data.ni.data.households.value["2021"]
												.all_households) *
										100
									).toFixed(1)
								: "<0.1"}%</Em
						> of Northern Ireland households</span
					>
				{/if}
				{#if data.place.type != "dea" && comp_2011}
					<span class="text-small"
						><Em
							><span
								class={changeClass(
									data.place.data.households.value.change
										.all_households,
								)}
								>{changeStr(
									data.place.data.households.value.change
										.all_households,
									"%",
									1,
								)}</span
							></Em
						> since 2011 Census</span
					>
				{/if}
			</div> -->
		</div>
		<!-- a19e9e -->
		<div class="grid mt" bind:clientWidth={w}>
			<div style="grid-column: span {cols};">
				<h3>
					<!-- Explore <span style="color: #93328E">{data.place.name}</span> -->
					{#if data.place.type != "ni"}
						Explore <span style="color: #93328E">{data.place.name}</span>
						<span style="color: #a19e9e"
							>- {geog_types[data.place.type].name}</span
						>
					{:else}
						Explore <span style="color: #93328E">{data.place.name}</span>
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
					{#if data.place.parents[0]}
						{#each [...data.place.parents].reverse() as parent, i}
							<span>{data.place.name} is located in </span><span
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
						{#if data.ni.children[0]}
							<span class="text-bold"
								>Districts within Northern Ireland</span
							><br />
							{#each data.ni.children as child, i}
								<li
									style="margin: 3px; display: block; line-height: 20px; padding-bottom: 5px"
								>
									<a
										href="{base}/{child.code}/"
										sveltekit:noscroll>{child.name}</a
									>{i < data.ni.children.length - 1 ? "" : ""}
								</li>
							{/each}
						{:else}
							<span class="muted"
								>No areas within {data.place.name}</span
							>
						{/if}
					</ul></span
				>
			</div> -->
			<!-- OPTION 2 like original app navigation to RHS of map -->
			<div>
				{#if data.place.parents[0]}
					<span class="text-bold">Parents of {data.place.name} </span><br
					/>
					<span class="text-small">
						{#each [...data.place.parents].reverse() as parent, i}
							<span
								style="display: block; margin-left: {i > 0
									? (i - 1) * 15
									: 0}px"
								>{@html i > 0 ? "↳ " : ""}<a
									href="{base}/{parent.code}"
									sveltekit:noscroll>{parent.name}</a
								></span
							>
						{/each}
					</span>
				{:else}
					<!-- 			<span class="muted">No parents for {data.place.name}</span>
 -->
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
							<a href="{base}/{child.code}" sveltekit:noscroll
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
			<!-- ZERO ACCORDION -->

			<Accordion
				id = "Area"
				img = "map.png"
				heading = "Area Information"
				place = {data.place}
				sub_heading = "Area"
				description = "Location, Area and Population density"
				boxes = {{
					box_1: {
						id: "location",
						style: "line-height: 1.3;",
						content: {
							ni: data.place.name + " contains 11 Local Goverment Districts, 80 District Electoral Areas, 850 Super Data Zones and 3,780 Data Zones.",
							lgd: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types.lgd.pl + ". It is located within " + data.place.parents[0].name + ".",
							dea: data.place.name + " is one of " + data.place.count.toLocaleString() + " " + geog_types[data.place.type].pl + ". It is located within " + data.place.parents[0].name + "."
						}
					},
					box_2: {
						id: "area",
						content: "<span class='text-big' style='font-size: 2.8em'>" + data.place.hectares.toLocaleString() + " ha</span>"
					},
					box_3: {
						id: "popden",
						content: "<span class='text-big' style='font-size: 2.8em'>" + (data.place.data.population.value["2021"].all / data.place.hectares).toFixed(1) + "</span>"
					}
				}}
				more = ""
			/>
			
			<!-- ACCORDION census -->
			<Accordion
				id = "census"
				img = "nisra-taxonomy-icon-census.png"
				heading = "Census 2021"
				place = {data.place}
				sub_heading = "Census 2021"
				description = "Broad age bands (years), Country of Birth and Main language"
				boxes = {{
					box_1: {
						id: "location",
						content: '<span class="text-big" style="font-size: 2.8em;">25,000</span>'
					},
					box_2: {
						id: "farms",
						content: "GroupChart",
						chart_data: makeDataGroupSort(data.place.grouped_data_nocompare.cob, "cob"),
						zKey: "group",
						label: chartLabel
					},
					box_3: {
						id: "cob1",
						content: "ProfileChart",
						chart_data: makeDataGroupSort(data.place.grouped_data_nocompare.cob, "cob"),
						zKey: "group",
						label: chartLabel
					},
					box_4: {
						id: "cob",
						content: "BarChart",
						chart_data: makeDataGroupSort(data.place.grouped_data_nocompare.cob, "cob"),
						zKey: "group",
						label: chartLabel
					},
					box_5: {
						id: "broadagebands",
						content: "ColChart",
						chart_data: data.place && makeData_year(["age"], ["2011"], ["2021"]),
						zKey: chart_compare_type
					},
					box_6: {
						id: "mainlang",
						content: "StackedBarChart",
						chart_data: data.place && makeData_year(["mainlang"], ["2011"], ["2021"]),
						zkey: chart_compare_type,
						label: chartLabel,
						topic_prev_available: "false"
					}
				}}
				more = "More information on the size of the population is available in the latest <a href = 'https://www.nisra.gov.uk/publications/2022-mid-year-population-estimates-northern-ireland'>mid-year estimates release</a>, 
						which includes an <a href = 'https://www.nisra.gov.uk/system/files/statistics/MYE22-summary.pdf'>infographic</a>, <a href = 'https://www.nisra.gov.uk/system/files/statistics/MYE22-Factsheets.pdf'>Fact Sheets</a>, a <a href = 'https://www.nisra.gov.uk/system/files/statistics/Statistical%20Bulletin%20-%202022%20Mid-year%20Population%20Estimates%20for%20Northern%20Ireland.pdf'>publication</a> and statistical tables.  
						Population characteristics are from the census data which can be explored further in the <a href = 'https://explore.nisra.gov.uk/area-explorer-2021/N92000002/'>Census Area Explorer</a>, 
						bespoke tables can be created using the <a href = 'https://build.nisra.gov.uk/en/'>Flexible Table Builder</a> and the NISRA website has <a href = 'https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'>statistical bulletins</a>
						providing commentary on a range of census population characteristics."
			/>
			<!-- <div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-headingcensus">
					<button
						class="accordion-button collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#panelsStayOpen-collapsecensus"
						aria-expanded="false"
						aria-controls="panelsStayOpen-collapsecensus"
					>
						<img
							src="{base}/img/nisra-taxonomy-icon-census.png"
							alt="logo"
							height="40"
							class="accordion-dept-logo"
						/>
						<span
							class="accordion-button-title"
							style="margin-left:10px"
							>Census 2021
						</span>
					</button>
				</h2>
				<div
					id="panelsStayOpen-collapsecensus"
					class="accordion-collapse collapse"
					aria-labelledby="panelsStayOpen-headingcensus"
				>
					<div class="accordion-body">
						Census 2021 - {data.place.name} -
						<span class="accordion-button-title-sub"
							>Broad age bands (years), Country of Birth and Main language</span
						>
						<div class="grid mt" bind:clientWidth={w}>
							<div
								class="div-grey-box"
								style="line-height: 1.3;"
							>
								<h3
									style="margin: 0 0 10px 0; line-height: 1.78;"
								>
									Overview - box with words
								</h3>

								Census 2021 data available in <a href="http://explore.nisra.gov.uk">Census Area Explorer</a>.
							</div>
							<div
								class="div-grey-box"
								style="line-height: 1.3;"
							>
								<IButton id = "location" place = {data.place}/>
								<div>
									<span
										class="text-big"
										style="font-size: 2.8em;"
										>25,000
									</span>
								</div>
							</div>
							<div class="div-grey-box">
								<IButton id ="farms" place = {data.place}/>

							{#if comp_none || (comp_ni && data.place.type == "ni")}
								<GroupChart data={makeDataGroupSort(data.place.grouped_data_nocompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011 && data.place.type != "dea"}
								<GroupChart data={makeDataGroupSort(data.place.grouped_data_timecompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011 && data.place.type == "dea"}
								<GroupChart data={makeDataGroupSort(data.place.grouped_data_nocompare.cob,"cob")} zKey="group"	label={chartLabel}/>
								2011 comparison not available
							{:else if comp_ni && data.place.type != "ni"}
								<GroupChart data={makeDataGroupSort(data.place.grouped_data_areacompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{/if}
							</div>

							<div class="div-grey-box">

								<IButton id = "cob1" place = {data.place}/>

							{#if comp_none || (comp_ni && data.place.type == "ni")}
								<ProfileChart data={makeDataGroupSort(data.place.grouped_data_nocompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011 && data.place.type != "dea"}
								<ProfileChart data={makeDataGroupSort(data.place.grouped_data_timecompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011 && data.place.type == "dea"}
								<ProfileChart data={makeDataGroupSort(data.place.grouped_data_nocompare.cob,"cob")} zKey="group"	label={chartLabel}/>
								2011 comparison not available
							{:else if comp_ni && data.place.type != "ni"}
								<ProfileChart data={makeDataGroupSort(data.place.grouped_data_areacompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{/if}
							</div>

							<div class="div-grey-box">

								<IButton id = "cob" place = {data.place}/>

								{#if comp_none || (comp_ni && data.place.type == "ni")}
								<BarChart data={makeDataGroupSort(data.place.grouped_data_nocompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011 && data.place.type != "dea"}
								<BarChart data={makeDataGroupSort(data.place.grouped_data_timecompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011 && data.place.type == "dea"}
								<BarChart data={makeDataGroupSort(data.place.grouped_data_nocompare.cob,"cob")} zKey="group"	label={chartLabel}/>
								2011 comparison not available
							{:else if comp_ni && data.place.type != "ni"}
								<BarChart data={makeDataGroupSort(data.place.grouped_data_areacompare.cob,"cob")} zKey="group"	label={chartLabel}/>
							{/if}
							
							</div>

							<div class="div-grey-box">

								<IButton id = "broadagebands" place = {data.place}/>

								<div
									class="chart"
									style="height: 100px; padding-bottom: 5px"
								>
									<ColChart
										data={data.place && makeData_year(["age"],["2011"],["2021"])}
										zKey={chart_compare_type}
									/>
								</div>
								{#if comp_2011 && chartLabel && data.place.type == "dea"}
									2011 comparison not available
								{:else if !comp_none && chartLabel}
									<div class="text-small muted;">
										<svg width="25" height="4" style="display: inline-block;margin-bottom: 3px;">
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
									data = {data.place && makeData_year(["age"],["2011"],["2021"])} 
									zkey = {chart_compare_type} /></div>
								
								{chart_compare_type}
							</div>

							<div class="div-grey-box">

								<IButton id = "mainlang" place = {data.place}/>
							{#if data.place.type != "dea"}
								<StackedBarChart
								data={data.place && makeData_year(["mainlang"],["2011"],["2021"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
							{:else}
								<StackedBarChart
								data={data.place && makeData_year(["mainlang"],["2011"],["2021"])}
								zKey={chart_compare_type}
								label={chartLabel},
								topic_prev_available = {false}
							/>
							{/if}			
							</div>
						</div>
					</div>
					
				</div>
			</div> -->
		
			<!-- ACCORDION ONE -->
			<Accordion
				id = "population"
				img = "nisra-taxonomy-icon-population.png"
				heading = "Demography"
				place = {data.place}
				sub_heading = "Births"
				description = "Number of births, age of mother and xxxx"
				boxes = {{
					
				}}
				more = ""
			/>

			<!-- <div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-headingOne">
					<button
						class="accordion-button collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#panelsStayOpen-collapseOne"
						aria-expanded="false"
						aria-controls="panelsStayOpen-collapseOne"
					>
						<img
							src="{base}/img/nisra-taxonomy-icon-population.png"
							alt="logo"
							height="40"
							class="accordion-dept-logo"
						/>
						<span
							class="accordion-button-title"
							style="margin-left:10px">Demography</span
						>
					</button>
				</h2>
				<div
					id="panelsStayOpen-collapseOne"
					class="accordion-collapse collapse"
					aria-labelledby="panelsStayOpen-headingOne"
				>
					<div class="accordion-body">
						Births - {data.place.name} -
						<span class="accordion-button-title-sub"
							>Number of births, age of mother and xxxx

							<div class="grid mt" bind:clientWidth={w}>

							{#if data.place.type != "dea"}
							<div class="div-grey-box">
								<StackedBarChart
								data={data.place && makeData_year(["mainlang"],["2011"],["2021"])}
								zKey={chart_compare_type}
								label={chartLabel}
							/>
							</div>
							{:else}
							<div class="div-grey-box">
								<StackedBarChart
								data={data.place && makeData_year(["mainlang"],["2011"],["2021"])}
								zKey={chart_compare_type}
								label={chartLabel},
								topic_prev_available = {false}
							/>
							</div>
							{/if}								

							<div class="div-grey-box">

							{#if comp_none || (comp_ni && data.place.type == "ni")}
								<GroupChart data={makeDataGroupSort(data.place.grouped_data_nocompare.mainlang,"mainlang")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011 && data.place.type != "dea"}
								<GroupChart data={makeDataGroupSort(data.place.grouped_data_timecompare.mainlang,"mainlang")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011 && data.place.type == "dea"}
								<GroupChart data={makeDataGroupSort(data.place.grouped_data_nocompare.mainlang,"mainlang")} zKey="group"	label={chartLabel}/>
								2011 comparison not available
							{:else if comp_ni && data.place.type != "ni"}
								<GroupChart data={makeDataGroupSort(data.place.grouped_data_areacompare.mainlang,"mainlang")} zKey="group"	label={chartLabel}/>
							{/if}


							</div>
							<div class="div-grey-box"></div>
							</div>

							Deaths - {data.place.name} -
							<span class="accordion-button-title-sub"
								>Number of deaths, age at death and cause of
								death

								<div class="grid mt" bind:clientWidth={w}>
									<div class="div-grey-box"></div>
									<div class="div-grey-box"></div>
									<div class="div-grey-box"></div>
								</div>
								Marriages - {data.place.name} -
								<span class="accordion-button-title-sub"
									>Number of marriages, average age at
									marriage and place

									<div class="grid mt" bind:clientWidth={w}>
										<div class="div-grey-box"></div>
										<div class="div-grey-box"></div>
										<div class="div-grey-box"></div>
									</div>
								</span></span
							></span
						>
					</div>
				</div>
			</div> -->

			<!-- ACCORDION TWO -->
			<Accordion
				id = "deprivation"
				img = "nisra-taxonomy-icon-deprivation.png"
				heading = "Deprivation"
				place = {data.place}
				sub_heading = "Deprivation"
				description = "XXXXX , xxxx"
				boxes = {{
					
				}}
				more = ""
			/>

			<!-- ACCORDION THREE -->
			<Accordion
				id = "health"
				img = "nisra-taxonomy-icon-health.png"
				heading = "Health and Social Care"
				place = {data.place}
				sub_heading = "Public Health"
				description = "Life expectancy, cause of death"
				boxes = {{
					
				}}
				more = ""
			/>
			<!-- <div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-headingThree">
					<button
						class="accordion-button collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#panelsStayOpen-collapseThree"
						aria-expanded="false"
						aria-controls="panelsStayOpen-collapseThree"
					>
						<img
							src="{base}/img/nisra-taxonomy-icon-health.png"
							alt="logo"
							height="40"
							class="accordion-dept-logo"
						/>
						<span
							class="accordion-button-title"
							style="margin-left:10px"
							>Health and Social Care</span
						>
					</button>
				</h2>
				<div
					id="panelsStayOpen-collapseThree"
					class="accordion-collapse collapse"
					aria-labelledby="panelsStayOpen-headingThree"
				>
					<div class="accordion-body">
						Public Health - {data.place.name} -
						<span class="accordion-button-title-sub"
							>Life expectancy, cause of death

							<div class="grid mt" bind:clientWidth={w}>
								<div class="div-grey-box">

									<IButton id = "le_m" place = {data.place}/>
									
									<span class="text-big" style="font-size: 2.8em; color: black">
										{data.place.data["LE"].value["2019-21"].LEbirth_gender2.toLocaleString()}</span>
										years
										<br />
										{#if (data.place.type != "ctry") & comp_ni & !comp_2011}
											<span class="text-small"
												>Northern Ireland: <Em
													>{data.ni.data["LE"].value["2019-21"].LEbirth_gender2.toLocaleString()}</Em
												></span
											> years
										{/if}


								</div>
								<div class="div-grey-box">

									<IButton id = "le_f" place = {data.place}/>
									
								</div>

								<span class="text-big" style="font-size: 2.8em; color: black">
									{data.place.data["LE"].value["2019-21"].LEbirth_gender1.toLocaleString()}</span>
									years
									<br />
									{#if (data.place.type != "ctry") & comp_ni & !comp_2011}
										<span class="text-small"
											>Northern Ireland: <Em
												>{data.ni.data["LE"].value["2019-21"].LEbirth_gender1.toLocaleString()}</Em
											></span
										> years
									{/if}
							</div>
							<div class="div-grey-box"></div>
						</span>

						Primary Care - {data.place.name} -
						<span class="accordion-button-title-sub"
							>Number of patients, GPs, Dentists

							<div class="grid mt" bind:clientWidth={w}>
								<div class="div-grey-box">
									<IButton id = "dentalreg" place = {data.place}/>
									<span
										class="text-big"
										style="font-size: 2.8em; color: black">
										{data.place.data["FPSGDSDR"].value["2022/23"].Dental_Registrations_ageAll.toLocaleString()}
									</span>
																		patients
																		
																		<br />
									{#if (data.place.type != "ctry") & comp_ni & !comp_2011}
										<span class="text-small"
											>Northern Ireland: <Em
												>
												{(data.place.data["FPSGDSDR"].value["2022/23"].Dental_Registrations_ageAll/data.ni.data["FPSGDSDR"].value["2022/23"].Dental_Registrations_ageAll*100).toLocaleString()}
												</Em
											></span
										> %
									{/if}
								</div>
								<div class="div-grey-box"></div>

								<div class="div-grey-box">
										<StackedBarChart
										data={data.place && makeData_year(["FPSGDSDT"],["2017/18"],["2022/23"])}
										zKey={chart_compare_type}
										label={comp_2011 ? "Same area 2017/18" : data.place && data.place.parents[0] ? "NI 2022/23" : null}
									/>
		
								</div>

								<div class="div-grey-box">
									<StackedBarChart
									data={data.place && makeData_year(["FPSGDSDR"],["2017/18"],["2022/23"])}
									zKey={chart_compare_type}
									label={comp_2011 ? "Same area 2017/18" : data.place && data.place.parents[0] ? "NI 2022/23" : null}
								/>
	
							</div>

								
							<div class="div-grey-box">
								<GroupChart data={makeDataGroupSort(data.place.grouped_data_nocompare.FPSGDSDR["2022/23"],"FPSGDSDR")} zKey="group"	label={chartLabel}/>
							</div>
							<div class="div-grey-box">


								

								{#if comp_none || (comp_ni && data.place.type == "ni")}
									<GroupChart data={makeDataGroupSort(data.place.grouped_data_nocompare.FPSGDSDR["2022/23"],"FPSGDSDR")} zKey="group"	label={chartLabel}/>
								{:else if comp_2011 }
									<GroupChart data={makeDataGroupSort(data.place.grouped_data_timecompare.FPSGDSDR,"FPSGDSDR")} zKey="group"	label={chartLabel}/>
								{:else if comp_ni && data.place.type != "ni"}
									<GroupChart data={makeDataGroupSort(data.place.grouped_data_areacompare.FPSGDSDR["2022/23"],"FPSGDSDR")} zKey="group"	label={chartLabel}/>
								{/if}

								</div>

								<div class="div-grey-box">


								{#if comp_none || (comp_ni && data.place.type == "ni")}
								<BarChart data={makeDataGroupSort(data.place.grouped_data_nocompare.FPSGDSDR["2022/23"],"FPSGDSDR")} zKey="group"	label={chartLabel}/>
							{:else if comp_2011}
								<BarChart data={makeDataGroupSort(data.place.grouped_data_timecompare.FPSGDSDR,"FPSGDSDR")} zKey="group"	label={chartLabel}/>
													{:else if comp_ni && data.place.type != "ni"}
								<BarChart data={makeDataGroupSort(data.place.grouped_data_areacompare.FPSGDSDR["2022/23"],"FPSGDSDR")} zKey="group"	label={chartLabel}/>
							{/if}

						</div>

							</div>

						Secondary Care - {data.place.name} -
						<span class="accordion-button-title-sub"
							>Number of hospital visits, waiting lists

							<div class="grid mt" bind:clientWidth={w}>
								<div class="div-grey-box">	{#if data.place.type == "ni"}
									<div
										class="div-grey-box"
										style="line-height: 1.3;"
									>
										box at ni level only
									</div>
								{/if}
								{#if data.place.type == "dea"}
									<div
										class="div-grey-box"
										style="line-height: 1.3;"
									>
										box at dea level only
									</div>
								{/if}
								{#if data.place.type == "lgd"}
									<div
										class="div-grey-box"
										style="line-height: 1.3;"
									>
										box at lgd level only
									</div>
								{/if}</div>
								<div class="div-grey-box"></div>
								<div class="div-grey-box"></div>
							</div>
						</span>
					</div>
				</div>
			</div> -->

			<!-- ACCORDION FOUR -->
			<Accordion
				id = "labour-market"
				img = "nisra-taxonomy-icon-labour-market.png"
				heading = "Labour Market and Social Welfare"
				place = {data.place}
				sub_heading = "Labour Market"
				description = "Employment rate, economic activity"
				boxes = {{
					
				}}
				more = ""
			/>
			<!-- <div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-headingFour">
					<button
						class="accordion-button collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#panelsStayOpen-collapseFour"
						aria-expanded="false"
						aria-controls="panelsStayOpen-collapseFour"
					>
						<img
							src="{base}/img/nisra-taxonomy-icon-labour-market.png"
							alt="logo"
							height="40"
							class="accordion-dept-logo"
						/>
						<span
							class="accordion-button-title"
							style="margin-left:10px"
							>Labour Market and Social Welfare
						</span>
					</button>
				</h2>
				<div
					id="panelsStayOpen-collapseFour"
					class="accordion-collapse collapse"
					aria-labelledby="panelsStayOpen-headingFour"
				>
					<div class="accordion-body">
						Labour Market - {data.place.name} -
						<span class="accordion-button-title-sub"
							>Employment rate, economic activity

							<div class="grid mt" bind:clientWidth={w}>
								<div class="div-grey-box"></div>
								<div class="div-grey-box"></div>
								<div class="div-grey-box"></div>
							</div>
						</span>

						Welfare / Benefits - {data.place.name} -
						<span class="accordion-button-title-sub"
							>Number of benefits by type

							<div class="grid mt" bind:clientWidth={w}>
								<div class="div-grey-box">
									<IButton id = "dentalreg" place = {data.place}/>
									<br>
									Universal Credit  <span class="text-big" style="font-size: 1.4em; color: black">
										{data.place.data["BS"].value["2022"].UC.toLocaleString()}</span>
										<br>
										Disability Living Allowance <span class="text-big" style="font-size: 1.4em; color: black">
											{data.place.data["BS"].value["2022"].DLA.toLocaleString()}</span>
																			<br />
									{#if (data.place.type != "ctry") & comp_ni & !comp_2011}
										<span class="text-small"
											>Percentage of NI: <Em
												>
												Universal Credit {(data.place.data["BS"].value["2022"].UC/data.ni.data["BS"].value["2022"].UC*100).toLocaleString()}%
												<br>
												Disability Living Allowance {(data.place.data["BS"].value["2022"].DLA/data.ni.data["BS"].value["2022"].DLA*100).toLocaleString()}%
												</Em
											></span
										> 		 -->
										<!-- could use adjectify here if we had the ranks - or make new function to compare to the average???? -->
										
										<!-- {/if}
								</div>
								<div class="div-grey-box">

									<StackedBarChart
									data={data.place && makeData_year(["BS"],["2017"],["2022"])}
									zKey={chart_compare_type}
									label={comp_2011 ? "Same area 2017" : data.place && data.place.parents[0] ? "NI 2022" : null}
								/>

							</div>
								<div class="div-grey-box">


									<div
									class="chart"
									style="height: 100px; padding-bottom: 5px"
								>
								
								
								School classes - reception - year 7

									<ColChart
										data={data.place && makeData_year(["DESCP"],["2017/18"],["2022/23"])}
										zKey={chart_compare_type}
									/>
								</div>
								{#if comp_2011 && chartLabel && data.place.type == "dea"}
									2011 comparison not available
								{:else if !comp_none && chartLabel}
									<div class="text-small muted;">
										<svg width="25" height="4" style="display: inline-block;margin-bottom: 3px;">
											<rect
												width="25"
												height="4"
												style="fill:#CEDC20;"
											/>
										</svg>
										{chartLabel}
									</div>
								{/if}
								
								<br>								<br>
								Not ideal - labels need sorted and legend


								</div>
								<div class="div-grey-box"></div>
							</div>
						</span>
					</div>
				</div>
			</div> -->

			<!-- ACCORDION five -->
			<Accordion
				id = "economy"
				img = "nisra-taxonomy-icon-economy.png"
				heading = "Economy"
				place = {data.place}
				sub_heading = "Business"
				description = "Number of business, xxxx"
				boxes = {{
					
				}}
				more = ""
			/>

			<!-- ACCORDION six -->
			<Accordion
				id = "crime-justice"
				img = "nisra-taxonomy-icon-crime-justice.png"
				heading = "Crime and Justice"
				place = {data.place}
				sub_heading = "Crime"
				description = "Number of crimes"
				boxes = {{
					
				}}
				more = ""
			/>

			<!-- ACCORDION Seven -->
			<Accordion
				id = "travel-transport"
				img = "nisra-taxonomy-icon-travel-transport.png"
				heading = "Travel and Transport"
				place = {data.place}
				sub_heading = "Travel"
				description = "Cars, miles"
				boxes = {{
					
				}}
				more = ""
			/>

			<!-- ACCORDION Eight -->
			<Accordion
				id = "housing-stats"
				img = "nisra-taxonomy-icon-housing-stats.png"
				heading = "Housing, Community and Regeneration"
				place = {data.place}
				sub_heading = "Housing"
				description = "Number of houses, social sector"
				boxes = {{
					
				}}
				more = ""
			/>

			<!-- ACCORDION Nine -->
			<Accordion
				id = "people-places"
				img = "nisra-taxonomy-icon-people-places.png"
				heading = "People, Places and Culture"
				place = {data.place}
				sub_heading = "Culture"
				description = "Number of arts...."
				boxes = {{
					
				}}
				more = ""
			/>
			
			<!-- ACCORDION ten -->
			<Accordion
				id = "agriculture"
				img = "nisra-taxonomy-icon-agriculture.png"
				heading = "Agriculture and Environment"
				place = {data.place}
				sub_heading = "Agriculture"
				description = "Number of farms"
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