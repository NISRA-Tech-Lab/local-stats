<script>

export let id;
export let place;

let i_button_info = {

		location: {
			title: "Location",
			info: "Information about the area including its geographical hierarchy."
		},

		area: {
			title: "Area",
			info: "Area is measured in hectares (ha), it is rounded to the nearest whole number."
		},

		popden: {
			title: "Population density",
			info: "Population density is the number of usual residents per hectare. It is rounded to 1 d.p."
		},

		pop: {
			title: "Population - box with numbers",
			info: "Population is based on the number of usual residents. " +
				  "A usual resident is anyone who, on 21 March 2021 is in the UK, and staying in the UK for a period of 3 months or more; " +
			 	  "or has a permanent UK address and is outside the UK and is staying outside the UK for less than 12 months. " +
			      "<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"
		},

		households: {
			title: "Households - box with numbers",
			info: "A household is either one person living alone or a group of people living at the same address " +
				  "who share cooking facilities and share a living room, sitting room or dining area. " +
				  "<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"
		},

		farms: {
			title: "Farms",
			info: "Publication : <a href='https://www.daera-ni.gov.uk/publications/agricultural-census-northern-ireland-2023'>" +
				  "<strong>Farm Census</strong></a> Data portal : " +
				  "<a href='https://data.nisra.gov.uk/table/FCDEA'><strong>Farm Census</strong></a>"
		},

		cob1: {
			title: "COB - Profile chart",
			info: ""
		},

		cob: {
			title: "COB - Bar chart",
			info: "Publication : <a href='https://www.daera-ni.gov.uk/publications/agricultural-census-northern-ireland-2023'>" +
				  "<strong>Farm Census</strong></a> Data portal : " +
				  "<a href='https://data.nisra.gov.uk/table/FCDEA'><strong>Farm Census</strong></a>"
		},

		broadagebands: {
			title: "Broad age bands (years) Col GroupChart",
			info: "A grouping of ages where a person's age is their age at their last birthday on or prior to census day. "+
				  "<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"
		},

		mainlang: {
			title: "Main language - Stacked bar",
			info: "Person's main language as declared in the Census. Statistics for all language questions are restricted to persons aged 3 and over. " +
				  "<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"
		},

		le_m: {
			title: "Male Life expectancy",
			info: "<a href='mailto:" + place.meta_data.LE.email + "'>Email for more information</a>" +
			  	  "Last updated: " + place.meta_data.LE.last_updated + " " +
			  	  "Access data at: <a href='" + place.meta_data.LE.dataset_url + "'>" + place.meta_data.LE.title + "</a>"
		},

		le_f: {
			title: "Female Life expectancy",
			info: "<a href='mailto:" + place.meta_data.LE.email + "'>Email for more information</a>" +
			  	  "Last updated: " + place.meta_data.LE.last_updated + " " +
			  	  "Access data at: <a href='" + place.meta_data.LE.dataset_url + "'>" + place.meta_data.LE.title + "</a>"
		},

		dentalreg: {
			title: "Number of dental registrations",
			info: "<a href='mailto:" + place.meta_data.FPSGDSDR.email + "'>Email for more information</a> " + 
				  "Last updated: " + place.meta_data.FPSGDSDR.last_updated + " Access data at: " +
				  "<a href='" + place.meta_data.FPSGDSDR.dataset_url + "'>" + place.meta_data.FPSGDSDR.title + "</a>"
		}

}

</script>

<div class="row s-OrSHbitiAkZX" style="display: flex; cursor: pointer;" data-bs-toggle="collapse" data-bs-target="#{id}-info" aria-expanded="false" aria-controls="{id}-info">
	<div class="blocktitle s-OrSHbitiAkZX" style="margin: 0; width: 100%">
		{i_button_info[id].title}<span class = "i-button"></span>
	</div>
</div>
<div class="collapse s-OrSHbitiAkZX" id="{id}-info">
    <div class="card card-body s-OrSHbitiAkZX">
        {@html i_button_info[id].info} 
    </div>
</div>