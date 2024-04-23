<script>

export let id;
export let place;

function checkMeta (value) {

	let value_dotted = value.replaceAll("[", ".").replaceAll("]", "");
	let props = value_dotted.split(".");

	let rtn_value = place.meta_data;

	for (let i = 0; i < props.length; i ++) {

		if (rtn_value.hasOwnProperty(props[i])) {
			rtn_value = rtn_value[props[i]]
			if (props[i] == "last_updated") {
				let numbers = rtn_value.split("-");
				rtn_value =  numbers[2] + "/" + numbers[1] + "/" + numbers[0];
			}
		}

	}

	return rtn_value;

}


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
			"<p>Sourced from Census 2021 data - "+ "<a href='https://explore.nisra.gov.uk/area-explorer-2021/'><strong>Census Area Explorer</strong></a></p>"+
			"A usual resident is anyone who, on 21 March 2021 is in the UK, and staying in the UK for a period of 3 months or more; " +
			 	  "or has a permanent UK address and is outside the UK and is staying outside the UK for less than 12 months. " +
			      "<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"
		},

		generalhealth: {
			title: "General Health",
			info: "<p>Sourced from Census 2021 data - "+ "<a href='https://explore.nisra.gov.uk/area-explorer-2021/'><strong>Census Area Explorer</strong></a></p>"+
			"General health is a self-assessment of a person's general state of health. It is not " +
					"based over any specified period of time. <a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"},

		wellbeing: {
			title: "Happiness",
			info: "Average Happiness score out of 10 for people aged 16+</p>" +
				  "<p class = 'pibutton'><a href='mailto:" + checkMeta("Happy[0].email") + "'>Email for more information</a> </p>" +  
		 		  "<p class = 'pibutton'>Last updated: " + checkMeta("Happy[0].last_updated") + "</p> <p class = 'pibutton'>Access data at: " +
		 		  "<a href='" + checkMeta("Happy[0].dataset_url") + "'>" + checkMeta("Happy[0].title") + "</a></p>"
				},

		lifeexpectancy: {
			title: "Life Expectancy at birth",
			info: "<p class = 'pibutton'><a href='mailto:" + checkMeta("LE[0].email") + "'>Email for more information</a> </p>"  +
		 		  "<p class = 'pibutton'>Last updated: " + checkMeta("LE[0].last_updated") + "</p> <p class = 'pibutton'>Access data at: " +
		 		  "<a href='" + checkMeta("LE[0].dataset_url") + "'>" + checkMeta("LE[0].title") + "</a></p>"
			},

		
		carers: {
			title: "Provision of unpaid care",
			info: "<p>Sourced from Census 2021 data - "+ "<a href='https://explore.nisra.gov.uk/area-explorer-2021/'><strong>Census Area Explorer</strong></a></p>"+
			"Unpaid care covers looking after giving help or support to anyone because they have long-term physical or "+
			"mental health conditions or illnesses, or problems related to old age. It does not include any activities as part of paid employment. All unpaid care statistics are restricted to persons aged 5 and over. "+
			"<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"},

		hospitalactivity: {
			title: "Admissions to hospital",
			info: "<p class = 'pibutton'><a href='mailto:" + checkMeta("Admiss[0].email") + "'>Email for more information</a> </p>"  +
		 		  "<p class = 'pibutton'>Last updated: " + checkMeta("Admiss[0].last_updated") + "</p> <p class = 'pibutton'>Access data at: " +
		 		  "<a href='" + checkMeta("Admiss[0].dataset_url") + "'>" + checkMeta("Admiss[0].title") + "</a></p>"
				},

		primarycare: {
			title: "Primary care providers",
			info: "<p class = 'pibutton'>Access data at: " +
				  "<a href='" + checkMeta("GP[0].dataset_url") + "'>" + checkMeta("GP[0].title") + "</a>, " +
				  "<a href='" + checkMeta("DEN[0].dataset_url") + "'>" + checkMeta("DEN[0].title") + "</a> and " +
				  "<a href='" + checkMeta("DEN_REG[0].dataset_url") + "'>" + checkMeta("DEN_REG[0].title") + "</a></p>"
				},

			employmentrates: {
			title: "Employment rates",
			info: "<p class = 'pibutton'><a href='mailto:" + checkMeta("LMS[0].email") + "'>Email for more information</a> </p>"  +
		 		  "<p class = 'pibutton'>Last updated: " + checkMeta("LMS[0].last_updated") + "</p> <p class = 'pibutton'>Access data at: " +
		 		  "<a href='" + checkMeta("LMS[0].dataset_url") + "'>" + checkMeta("LMS[0].title") + "</a></p>"
				},


			employed: {
			title: "Number of people employed",
			info: "<p class = 'pibutton'><a href='mailto:" + checkMeta("LMS[0].email") + "'>Email for more information</a> </p>"  +
		 		  "<p class = 'pibutton'>Last updated: " + checkMeta("LMS[0].last_updated") + "</p> <p class = 'pibutton'>Access data at: " +
		 		  "<a href='" + checkMeta("LMS[0].dataset_url") + "'>" + checkMeta("LMS[0].title") + "</a></p>"
		},


			wages: {
			title: "Average wages",
			info: "<p class = 'pibutton'><a href='mailto:" + checkMeta("ASHE[0].email") + "'>Email for more information</a> </p>"  +
		 		  "<p class = 'pibutton'>Last updated: " + checkMeta("ASHE[0].last_updated") + "</p> <p class = 'pibutton'>Access data at: " +
		 		  "<a href='" + checkMeta("ASHE[0].dataset_url") + "'>" + checkMeta("ASHE[0].title") + "</a></p>"
		},


			pensionagebenefits: {
			title: "Pension Age benefits",
			info: "Benefits included are: SP and PC" + "<p class = 'pibutton'><a href='mailto:" + checkMeta("BS[0].email") + "'>Email for more information</a> </p>"  +
		 		  "<p class = 'pibutton'>Last updated: " + checkMeta("BS[0].last_updated") + "</p> <p class = 'pibutton'>Access data at: " +
		 		  "<a href='" + checkMeta("BS[0].dataset_url") + "'>" + checkMeta("BS[0].title") + "</a></p>"

				},


			workingagebenefits: {
			title: "Working Age benefits",
			info:  "Benefits included are: UC, JSA, IS and ESA" + "<p class = 'pibutton'><a href='mailto:" + checkMeta("BS[0].email") + "'>Email for more information</a> </p>"  +
		 		  "<p class = 'pibutton'>Last updated: " + checkMeta("BS[0].last_updated") + "</p> <p class = 'pibutton'>Access data at: " +
		 		  "<a href='" + checkMeta("BS[0].dataset_url") + "'>" + checkMeta("BS[0].title") + "</a></p>"},

			disabilitybenefits: {
			title: "Disability & Carer’s benefits",
			info:   "Benefits included are: PIP, CA, AA and DLA" + "<p class = 'pibutton'><a href='mailto:" + checkMeta("BS[0].email") + "'>Email for more information</a> </p>"  +
		 		  "<p class = 'pibutton'>Last updated: " + checkMeta("BS[0].last_updated") + "</p> <p class = 'pibutton'>Access data at: " +
		 		  "<a href='" + checkMeta("BS[0].dataset_url") + "'>" + checkMeta("BS[0].title") + "</a></p>"
					},

			enrollments: {
			title: "Number of enrolled in schools and colleges",
			info: "words to be added"},


			fsme: {
			title: "Entitlement to Free School Meals",
			info:  "    "},


			teachers: {
			title: "Class Sizes",
			info: "<p class = 'pibutton'><a href='mailto:" + checkMeta("ClassSize[0].email") + "'>Email for more information</a> </p>"  +
		 		  "<p class = 'pibutton'>Last updated: " + checkMeta("ClassSize[0].last_updated") + "</p> <p class = 'pibutton'>Access data at: " +
		 		  "<a href='" + checkMeta("ClassSize[0].dataset_url") + "'>" + checkMeta("ClassSize[0].title") + "</a></p>"
				},


			qualifications: {
			title: "Highest level of Qualifications",
			info: "<p>Sourced from Census 2021 data - "+ "<a href='https://explore.nisra.gov.uk/area-explorer-2021/'><strong>Census Area Explorer</strong></a></p>"+
						"Needs tidied up with proper CSS.   The highest level of qualification categories are as follows:" +
 					"No qualifications;" +
					 "Level 1: 1 to 4 GCSEs, O levels, CSEs (any grades); 1 AS Level; NVQ level 1; or equivalent;" +
					 "Level 2: 5 or more GCSEs (A*-C or 9-4), O levels (passes) CSEs (grade 1); 1 A level, 2-3 AS Levels; NVQ level 2, BTEC General, City and Guilds Craft; or equivalent;" +
					 "Apprenticeship;" +
 					" Level 3: 2 or more A Levels, 4 or more AS Levels; NVQ Level 3, BTEC National, OND, ONC, City and Guilds Advanced Craft; or equivalent;" +
 					" Level 4 and above: Degree (BA, BSc), foundation degree, NVQ Level 4 and above, HND, HNC, professional qualifications (teaching or nursing, for example), or equivalent; and" +
 					" Other: Other qualifications, equivalent unknown." +
 					"Highest level of qualification is derived from the question asking people aged 16 years and over to indicate all qualifications held. For qualifications gained outside Northern Ireland, respondents were directed to select the nearest equivalent."
				},


			attainment: {
			title: "Attainment of Qualifications",
			info: "<p>Sourced from Census 2021 data - "+ "<a href='https://explore.nisra.gov.uk/area-explorer-2021/'><strong>Census Area Explorer</strong></a></p>"+
					"MORE WORDS"},



			popchange: {
			title: "Population change",
			info: "words to be added"},

		age: {
			title: "Broad age bands",
			info: "<p>Sourced from Census 2021 data - "+ "<a href='https://explore.nisra.gov.uk/area-explorer-2021/'><strong>Census Area Explorer</strong></a></p>"+
			"A grouping of ages where a person's age is their age at their last birthday on or prior to census day. <a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"},
			
		sex: {
			title: "Sex",
			info: "words to be added"},
			
		hhsize: {
			title: "Household size",
			info: "<p>Sourced from Census 2021 data - "+ "<a href='https://explore.nisra.gov.uk/area-explorer-2021/'><strong>Census Area Explorer</strong></a></p>"+
			"The number of usual residents in the household.      <a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"},
			
		religion: {
			title: "Religion, Religion brought up",
			info: "<p>Sourced from Census 2021 data - "+ "<a href='https://explore.nisra.gov.uk/area-explorer-2021/'><strong>Census Area Explorer</strong></a></p>"+
			"The religious group the person belongs to or for people with no current religion their religious group of upbringing." +
				"People with no current religion and no religion of upbringing are labelled 'None'." + 
				"<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"},
			
		language: {
			title: "Main language",
			info: "<p>Sourced from Census 2021 data - "+ "<a href='https://explore.nisra.gov.uk/area-explorer-2021/'><strong>Census Area Explorer</strong></a></p>"+
			"Person's main language as declared in the Census." + 
					"Statistics for all language questions are restricted" + 
					"to persons aged 3 and over. <a" + 
					"href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'" + 
					"><strong>Statistical bulletins</strong></a>"},
			
			households: {
			title: "Households - box with numbers",
			info: "<p>Sourced from Census 2021 data - "+ "<a href='https://explore.nisra.gov.uk/area-explorer-2021/'><strong>Census Area Explorer</strong></a></p>"+
			"A household is either one person living alone or a group of people living at the same address " +
				  "who share cooking facilities and share a living room, sitting room or dining area. " +
				  "<a href='https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins'><strong>Statistical bulletins</strong></a>"
		}//,


		// dentalreg: {
		// 	title: "Number of dental registrations",
		// 	info: "<a href='mailto:" + checkMeta("FPSGDSDR.email") + "'>Email for more information</a> " + 
		// 		  "Last updated: " + checkMeta("FPSGDSDR.last_updated") + " Access data at: " +
		// 		  "<a href='" + checkMeta("FPSGDSDR.dataset_url") + "'>" + checkMeta("FPSGDSDR.title") + "</a>"
		// }

}

</script>

<div class="row"
	style="display: flex; cursor: pointer;"
	data-bs-toggle="collapse"
	data-bs-target="#{id}-info"
	aria-expanded="false"
	aria-controls="{id}-info"
>
	<div class="blocktitle" style="margin: 0; width: 100%">
		{i_button_info[id].title}<span class = "i-button"></span>
	</div>
</div>
<div class="collapse" id="{id}-info">
    <div class="card card-body">
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