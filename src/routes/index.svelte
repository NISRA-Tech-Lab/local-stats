<script context="module">
	export const prerender = true;
  import { getData } from "$lib/utils";
  import { app_inputs } from "$lib/config";

  // async function loadArea(code, fetch) {
	// 	let res = await fetch(app_inputs.app_json_data + code + ".json");
	// 	let json = await res.json();

	// 	return json;
	// }

	export async function load({ fetch }) {
		// let code = params.code;

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
		// let ni = await loadArea("N92000002", fetch);
		// let place = await loadArea(code, fetch);

		return {
			props: { search_data },
		};
	}
</script>
<script>
  import { base } from "$app/paths";
  import { assets } from "$app/paths";
  // import { app_inputs } from "$lib/config";
  import Select from "$lib/ui/Select.svelte";
  import Section from "$lib/layout/Section.svelte";

  export let search_data;

  function menuSelect(ev) {
		goto(`${base}/${ev.detail.value}/`, { noscroll: true });
	}


</script>

<svelte:head>
  <title>NISRA Area Explorer</title>
  <meta name="description" content="">
  <meta property="og:title" content="Census Area Explorer" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{app_inputs.base}/" />
	<meta property="og:description" content="Explore census data for places in Northern Ireland." />
	<meta name="description" content="Explore census data for places in Northern Ireland." />
</svelte:head>

<Section column="wide">
  <div class="block">

    <div>
      <b>Search for your area:</b>
      <Select
        {search_data}
        group="typestr"
        search={true}
        on:select={menuSelect}
      />

    </div>




    <span class="text-big title">NISRA Area Explorer</span>
    <p>Select an area below to start exploring NISRA Key Statistics.</p>
    <ul>
      <li><a href="{base}/N92000002"><strong>Northern Ireland</strong></a></li>
      <ul>
          <li><a href="{base}/N09000001">Antrim and Newtownabbey</a></li>
          <li><a href="{base}/N09000011">Ards and North Down</a></li>
          <li><a href="{base}/N09000002">Armagh City, Banbridge and Craigavon</a></li>
          <li><a href="{base}/N09000003">Belfast</a></li>
          <li><a href="{base}/N09000004">Causeway Coast and Glens</a></li>
          <li><a href="{base}/N09000005">Derry City and Strabane</a></li>
          <li><a href="{base}/N09000006">Fermanagh and Omagh</a></li>
          <li><a href="{base}/N09000007">Lisburn and Castlereagh</a></li>
          <li><a href="{base}/N09000008">Mid and East Antrim</a></li>
          <li><a href="{base}/N09000009">Mid Ulster</a></li>
          <li><a href="{base}/N09000010">Newry, Mourne and Down</a></li>
       </ul>
    </ul>



  </div>
  <div>This application contains key statistics for Northern Ireland, the 11 Local Government Districts and the areas within.  
    It will be updated with new data, more topics and lower geographies as they become available.  
  </div>
</Section>

<style>
	.block {
    margin-top: 55px;
    display: block;
	}
	.title {
		display: inline-block;
		margin-top: -3px;
	}
</style>