<script context="module">
</script>
<script>
  import { base } from "$app/paths";
  import { assets } from "$app/paths";
  import { app_inputs } from "$lib/config";
  import Section from "$lib/layout/Section.svelte";
  import Select from "$lib/ui/Select.svelte";
  import { goto } from "$app/navigation";

  export let data;

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
   

    <!-- <div>This application contains key statistics for Northern Ireland, the 11 Local Government Districts and the areas within.  
      It will be updated with new data, more topics and lower geographies as they become available.  
    </div>
   -->


		<div class="row">

    <div class="column left">

      <span style="font-size: 1.5em; font-weight: bold;color: #3878c5;   " >Explore key statistics for any area in Northern Ireland</span>

      
      <h3> </h3><br>
      <Select
    search_data = {data.search_data}
    group="typestr"
    search={true}
    on:select={menuSelect}
    />
    
    <!-- <h3>Select an Area</h3><br>
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
      </ul> -->
    </div> 

  

Click on the map to view Northern Ireland as a whole

<a href="{base}/N92000002/">
  <picture>
    <img style="width:400px;" src="{assets}/img/NI-map.png" alt="Northern Ireland Statistics and Research Agency">
  </picture>
</a>

  </div>

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


  .column {
  		float: left;
  		padding-left: 40px;
  		padding-right: 40px;
		padding-top: 10px;
  		padding-bottom: 10px;
  		
	}
	.left {
		max-width: 40%;
		padding-top: 0px;
  		padding-bottom: 10px;
	}
	.right {
		max-width: 60%;
		padding-top: 0px;
  		padding-bottom: 10px;	}
	.row:after {
		content: "";
		display: table;
		clear: both;
		
	}
</style>