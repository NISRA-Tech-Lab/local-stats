<script>

export let id;
export let place;

let i_button_info = {

	location: {
			title: "About the area",
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
			title: "Population",
			info: "Population is based on the number of usual residents. " +
				  "A usual resident is anyone who, on 21 March 2021 is in the UK, and staying in the UK for a period of 3 months or more; " +
			 	  "or has a permanent UK address and is outside the UK and is staying outside the UK for less than 12 months. " +
			      "<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"
		},

		generalhealth: {
			title: "General Health",
			info: "General health is a self-assessment of a person’s general state of health. It is not " +
					"based over any specified period of time. <a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"},

		wellbeing: {
			title: "Happiness",
			info: "words to be added"},

		lifeexpectancy: {
			title: "Life Expectancy",
			info: "words to be added"},

		births: {
			title: "Birth rate",
			info: "words to be added"},

		deaths: {
			title: "Death rate",
			info: "words to be added"},

		carers: {
			title: "Provision on unpaid care",
			info: "words to be added"},

		hospitalactivity: {
			title: "Activity in hospitals / waiting lists",
			info: "words to be added"},

		primarycare: {
			title: "Primary care providers",
			info: "words to be added"},

			employmentrates: {
			title: "Employment rates",
			info: "words to be added"},


			employed: {
			title: "Number of people employed",
			info: "words to be added"},


			wages: {
			title: "Average wages",
			info: "words to be added"},


			benefits: {
			title: "Number of people on work-related benefits",
			info: "words to be added"},



			enrollments: {
			title: "Number of enrolled in schools and colleges",
			info: "words to be added"},


			fsme: {
			title: "Entitlement to Free School Meals",
			info: "words to be added"},


			teachers: {
			title: "Teachers",
			info: "words to be added"},


			qualifications: {
			title: "Highest level of Qualifications",
			info: "words to be added"},


			attainment: {
			title: "Attainment of Qualifications",
			info: "words to be added"},



			popchange: {
			title: "Population change",
			info: "words to be added"},

		age: {
			title: "Broad age bands",
			info: "words to be added"},
			
		sex: {
			title: "Sex",
			info: "words to be added"},
			
		hhsize: {
			title: "Household size",
			info: "The number of usual residents in the household.      <a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"},
			
		religion: {
			title: "Religion, Religion brought up",
			info: "The religious group the person belongs to or for people with no current religion their religious group of upbringing." +
				"People with no current religion and no religion of upbringing are labelled 'None'." + 
				"<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"},
			
		language: {
			title: "Main language",
			info: "Person's main language as declared in the Census." + 
					"Statistics for all language questions are restricted" + 
					"to persons aged 3 and over. <a" + 
					"href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'" + 
					"><strong>Statistical bulletins</strong></a>"},
			
			households: {
			title: "Households - box with numbers",
			info: "A household is either one person living alone or a group of people living at the same address " +
				  "who share cooking facilities and share a living room, sitting room or dining area. " +
				  "<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"
		},

		farms: {
			title: "Farms GroupChart",
			info: "Publication : <a href='https://www.daera-ni.gov.uk/publications/agricultural-census-northern-ireland-2023'>" +
				  "<strong>Farm Census</strong></a> Data portal : " +
				  "<a href='https://data.nisra.gov.uk/table/FCDEA'><strong>Farm Census</strong></a>"
		},

		cob1: {
			title: "COB - ProfileChart",
			info: ""
		},

		cob: {
			title: "COB - BarChart",
			info: "Publication : <a href='https://www.daera-ni.gov.uk/publications/agricultural-census-northern-ireland-2023'>" +
				  "<strong>Farm Census</strong></a> Data portal : " +
				  "<a href='https://data.nisra.gov.uk/table/FCDEA'><strong>Farm Census</strong></a>"
		},

		broadagebands: {
			title: "Broad age bands (years) ColChart",
			info: "A grouping of ages where a person's age is their age at their last birthday on or prior to census day. "+
				  "<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"
		},

		mainlang: {
			title: "Main language - StackedBarChart",
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

<div class="row s-Vk7w7Sfe-0Fk"
	style="display: flex; cursor: pointer;"
	data-bs-toggle="collapse"
	data-bs-target="#{id}-info"
	aria-expanded="false"
	aria-controls="{id}-info"
>
	<div class="blocktitle s-Vk7w7Sfe-0Fk" style="margin: 0; width: 100%">
		{i_button_info[id].title}<span class = "i-button"></span>
	</div>
</div>
<div class="collapse s-Vk7w7Sfe-0Fk" id="{id}-info">
    <div class="card card-body s-Vk7w7Sfe-0Fk">
        {@html i_button_info[id].info} 
    </div>
</div>

<style>
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
</style>