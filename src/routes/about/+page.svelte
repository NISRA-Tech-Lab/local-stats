<script>
	import Section from "$lib/layout/Section.svelte";
	import { base } from "$app/paths";

  </script>


<nav>
	<a href='{base}/'>Home</a>
</nav>


<Section column="wide">

	<div class="row">


		<h1>About the Northern Ireland Local Statistics Explorer</h1>


		<h2>What is the app</h2>
		<p>Welcome to NISRA's Northern Ireland Local Statistics Explorer: Your overview of Northern Ireland's statistical information</p>

		<p>Explore the rich collection of statistical information published by the Northern Ireland Statistics and Research Agency (NISRA) with our interactive web page, the NISRA Area Explorer. 
		It is designed to provide users with easy access to key statistics for Northern Ireland and its local areas, and offers a dynamic platform for exploration.
		Whether you're a researcher, policymaker, educator, or citizen, NI Local Statistics Explorer is your gateway to understanding and interpreting the statistical landscape of Northern Ireland. Start exploring today and unearth the stories hidden within the data!</p>

		<h2>Features:</h2>
		<ul> 
			<li>Comprehensive Data Coverage: Dive into a vast array of statistical data covering various aspects of life in Northern Ireland, including demographics, economy, education, health, and more.</li>
			<li>User-Friendly Interface: Navigate through the intuitive interface, designed to make exploring statistical information a seamless experience for users of all levels.</li>
			<li>Local Area Profiles: Access detailed profiles for local areas within Northern Ireland, providing comprehensive statistics and insights into demographics, socio-economic factors, and more.</li>
			<li>Data Downloads and Sharing: - Download datasets for further analysis or share statistical insights with colleagues, stakeholders, and the broader community effortlessly.</li>
		</ul>

		<h2>How to Use:</h2>

		<p>Explore by Topic: Browse through various categories such as population, employment, housing, and more to discover relevant statistics and trends.
		Navigate by Geography: Drill down to specific geographical areas, including local councils, electoral wards, and neighborhoods, to explore statistics tailored to your area of interest.
		Compare and Contrast: Use interactive tools to compare statistical indicators across different regions or time periods, facilitating comparative analysis and trend identification.</p>

		
		<h2>Sources of data</h2>
		
		<p>All of the data is sourced from the  <a href="https://data.nisra.gov.uk">NISRA Data Portal</a> and the <a href="https://explore.nisra.gov.uk/area-explorer-2021/">Census Area Explorer</a>.</p>
		<p>At each statistic the &lsquo;i&rsquo; button provides definitions, source, contact details and date last updated.&nbsp; A more information section provides details of other statistics that are available.</p>
		
		<h3>The NISRA Data Portal</h3>
		<p>The <a href="https://data.nisra.gov.uk">NISRA Data Portal</a> is a repository for data on our population, society and economy.  </p>
		<p>The Data Portal is continually refreshed with new and updated datasets from across the NICS and Public Sector.  It gives  users the opportunity to view and filter data sets, plot interactive charts and visualise data on interactive maps, save queries, create favourite datasets and widgets, access data in mulitple formats - xlsx, csv, JSON-stat, px and share results and automate processes using API queries.</p>
		
		<p><a href = "https://www.nisra.gov.uk/nisra-data-portal-faqs-and-training-materials">Training Materials</a> (NISRA Data Portal user guide, instructional video and FAQ section) have been published to help you navigate and use the new system.  </p>
		<p>You sign-up to attend Online training sessions by emailing <a href="mailto:info@nisra.gov.uk">info@nisra.gov.uk</a> to register your interest.  Further help, if needed, will also be available on request.</p>


		<h3>The Census Area Explorer</h3>
		<p>The census happens only once every 10 years. It gives us the most accurate estimate of all the people and households in Northern Ireland.  The last census in Northern Ireland took place on 21 March 2021.</p>
		<p>You can explore the results of Census 2021 for Northern Ireland through the Census Area Explorer, the NISRA website or the Flexible Table Builder.</p>	
		
		<p>The <a href="https://explore.nisra.gov.uk/area-explorer-2021/">Census Area Explorer</a> is an easy to use interactive tool that the user can choose an area and compare the Census 2021 results with Northern Ireland or the Census 2011.</p>
		<p>The <a href="https://www.nisra.gov.uk/statistics/census">NISRA website</a> has news, results, outputs prospectus and information on previous censuses.</p>
		<p>	The <a href="https://build.nisra.gov.uk/en/">Flexible Table Builder</a> enaables you to build your own table or search through and customise ready-made tables.</p>

		<h3>Disclosure</h3>
		<p>Different disclosure rules apply for each of the datasets.  Please refer to the link to the data in the &lsquo;i&rsquo; button.  Detailed metadata and notes are available on the Data Portal and the Census webpages</p>

		<h3>Rounding</h3>
		<p>Rounding has not been applied to data in this explorer except for the Population Density figures which are rounded to 0 decimal places.</p>
		<p>Different rounding  rules apply for each of the datasets.  Please refer to the link to the data in the &lsquo;i&rsquo; button.  Detailed metadata and notes are available on the Data Portal and the Census webpages</p>


		<h3>Geographical Levels</h3>
		<h4>Statistical geographies</h4>
		<p>Data Zones and Super Data Zones are new statistical output geographies that have been created to support the release of local-level Census 2021 statistics.</p>
		<p>There are 850 Super Data Zones (SDZ2021) across Northern Ireland and the 3,780 Data Zones (DZ2021) nest within this geography. These two geographies nest within the 80 District Electoral Areas (DEA2014) and 11 Local Government Districts (LGD2014).</p>
		<p>There is more information in <a href="https://www.nisra.gov.uk/publications/census-2021-output-geography-information-papers">Census 2021 output geography information papers</a></p>	
		
		<p>A Summary of other NISRA Statistical Geographies are available in the <a href="https://www.nisra.gov.uk/sites/nisra.gov.uk/files/publications/NISRA%20Geography%20Fact%20Sheet%20-%20March%202019.pdf" >NISRA Geography FactSheet</a></p>
			
			
		<h4>Postcodes</h4>
			<p>Postcodes are sourced from the <a href="https://www.nisra.gov.uk/support/geography/central-postcode-directory">Central Postcode Directory (CPD)</a>.  The CPD is a list of postcodes in Northern Ireland, with the average location of the addresses in each postcode. It is used to provide a direct lookup between postcodes and a range of administrative and statistical geographies including Local Government Districts, District Electioral Areas, Data Zones, Super Data Zones and Settlements.   The version of the CPD used is xxxx.</p>
			
		<h4>Boundary Files</h4>
			<p>The Boundary files used in the application are available to download on the OpenDataNI portal at :</p>
			<ul>
				<li><a href="https://www.opendatani.gov.uk/@northern-ireland-statistics-and-research-agency/settlement-development-limits-2015">Settlement Development Limits 2015</a></li>
				<li><a href="https://www.nisra.gov.uk/support/geography/super-data-zones-census-2021">Super Data Zones</a></li>
				<li><a href="https://www.nisra.gov.uk/support/geography/data-zones-census-2021">Data Zones </a></li>
				<li><a href="https://www.opendatani.gov.uk/@land-property/osni-open-data-largescale-boundaries-local-government-districts-1993">Local Government Districts (1993)</a></li>
				<li>DEA??</li>
		</ul>
		<h4>Background Mapping</h4>
			<p>OpenStreet Map has been used to provide background mapping</p>




		<h2>Video guides</h2>
		<ul>
			<li>Northern Ireland Local Statistics Explorer</li>
			<li><a href="https://www.youtube.com/watch?v=HwGsqgdsiHM">Data Portal</a></li>
			<li><a href="https://www.youtube.com/watch?v=a6cn2yyITHU">Flexible Table Builder</a></li>
		</ul>
	
		
		

	
		<h2>Timeliness</h2>
		<p>This was most recently updated on XXXX to update the data and content.</p>

		<h2>Versions</h2>
		<p>This app was originally released on xx</p>
		<p>In XXXX 2024, further data was added on XXXX</p>
		
		<h2>About this app</h2>
		<p>This web application is based on and inspired by the&nbsp;<a href="https://github.com/ONSvisual">ONS Digital Content team prototypes</a>. It has been modified by NISRA and released as a prototype to explore Census data for Northern Ireland.</p>

		<h2>Feedback and contact details</h2>
		<p>This is a prototype application and we are very keen to get feedback on how it can be improved.</p>
		<p>We welcome feedback from users through our short <a href="https://dttselfserve.nidirect.gov.uk/NISRA/RateIt#/Northern_Ireland_Local_Statistics_Explorer">survey</a>.</p>
		<p>or email <a href="mailto:info@nisra.gov.uk">xxx@nisra.gov.uk</a> with any suggestions.</p>
		<p>Contact details for each of the datasets are available at </p><p>Contact <a href="mailto:info@nisra.gov.uk">xxx@nisra.gov.uk</a> for further infrmationThis is a prototype application and we are very keen to get feedback on how it can be improved.  Please email with any suggestions.</p>

	</div>


</Section>