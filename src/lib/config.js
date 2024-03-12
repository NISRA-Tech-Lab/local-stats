// CORE CONFIG
export const themes = {
	'light': {
		'name': 'light',
		'text': '#222',
		'muted': '#777',
		'pale': '#f0f0f0',
		'background': '#fff'
	},
	'dark': {
		'name': 'dark',
		'text': '#fff',
		'muted': '#bbb',
		'pale': '#333',
		'background': '#222'
	}
};

export const app_inputs = {
	//search_data: 'https://datavis.nisra.gov.uk/techlab/nnxcjn/places_dz.csv',
	//search_data: 'https://datavis.nisra.gov.uk/census/aex-hj77sh/places_dz.csv',
	search_data: '/data_jsons_dea_2302/places_dz.csv',
	//app_json_data: 'https://datavis.nisra.gov.uk/techlab/nnxcjn/',
	app_json_data: '/data_jsons_dea_2302/',
	base: 'https://mairebrolly.github.io/nisra-explorer/'
};

export const geog_types = {
	dz: {name: 'Data Zone', pl: 'Data Zones'},
	sdz: {name: 'Super Data Zone', pl: 'Super Data Zones'},
	ward: { name: 'Electoral Ward', pl: 'Ward' },

	dea: {name: 'District Electoral Area', pl: 'District Electoral Areas'},
	town: {name: 'settlement', pl: 'settlements'},
	lgd: {name: 'Local Government District', pl: 'Local Government Districts'},
	postcode: {name: 'postcode', pl: 'postcodes'},
	ctry: { name: 'Country', pl: 'Countries' }
};

export const topics = {
	age: [
		{ category: 'a0to14', label: '0-14' },
		{ category: 'a15to39', label: '15-39' },
		{ category: 'a40to64', label: '40-64' },
		{ category: 'a65plus', label: '65+' }
	],
	cob: [
		{ category: 'northern_ireland', label: 'Northern Ireland' },
		{ category: 'england', label: 'England' },
		{ category: 'scotland', label: 'Scotland' },
/* 		{ category: 'wales', label: 'Wales' },
		{ category: 'republic_of_ireland', label: 'Republic of Ireland' },
 */		{ category: 'other_cob', label: 'Other country of birth' }
	],
	mainlang: [
		{ category: 'english', label: 'English' },
		{ category: 'other_languages', label: 'Other languages' }
	],
	FPSGDSDT: [
		{ category: 'GDSDTF', label: 'Fillings' },
		{ category: 'GDSDTX', label: 'X-rays' },
		{ category: 'GDSDTC', label: 'Crowns' },
		{ category: 'GDSDTE', label: 'Extractions' }

	],

	BS: [

		{ category: ['CA','DLA','PIP','AA'], label: 'Disability and carers benefits' },
		{ category: ['PC','RP'], label: 'Pension Age benefits' },
		{ category: ['ESA','UC','IS', 'JSA'], label: 'Working Age benefits' }		
	],

	FPSGDSDR: [

		{ category: 'Dental_Registrations_ageGDSDR0_2', label: 'Age 0 to 2' },
		{ category: 'Dental_Registrations_ageGDSDR3_5', label: 'Age 3 to 5' },
		{ category: 'Dental_Registrations_ageGDSDR18plus', label: 'Adults' }		
	],


	DESCP: [
		{ category: 'Reception', label: 'Rec'},
		{ category: 'Nursery', label: 'Nurs'},
		{ category: 'Year1', label: '1' },		
		{ category: 'Year2', label: '2' },		
		{ category: 'Year3', label: '3' },		
		{ category: 'Year4', label: '4' },		
		{ category: 'Year5', label: '5' },		
		{ category: 'Year6', label: '6' },		
		{ category: 'Year7', label: '7' }		
	]

};



export const mapStyle = 'https://raw.githubusercontent.com/nisra-explore/map_tiles/main/basemap_styles/style-omt.json';


export const mapSources = {
	lgd: {
		id: 'lgd',
		promoteId: 'lgd_code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/NISRA-Tech-Lab/map_tiles/main/lgd2014/{z}/{x}/{y}.pbf',
		maxzoom: 12
	},
	dea: {
		id: 'dea',
		promoteId: 'dea_code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/NISRA-Tech-Lab/map_tiles/main/dea_2014/{z}/{x}/{y}.pbf',
		minzoom: 6,
		maxzoom: 12
	},
	sdz: {
		id: 'sdz',
		promoteId: 'sdz_code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/NISRA-Tech-Lab/map_tiles/main/sdz_2021/{z}/{x}/{y}.pbf',
//		url: '/data/map_tiles/soa21/{z}/{x}/{y}.pbf',
		minzoom: 6,
		maxzoom: 12
	},
	dz: {
		id: 'dz',
		promoteId: 'dz_code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/NISRA-Tech-Lab/map_tiles/main/dz_2021/{z}/{x}/{y}.pbf',
//		url: '/data/map_tiles/sa/{z}/{x}/{y}.pbf',
 		minzoom: 6,
		maxzoom: 12, 
	},
	ward: {
		id: 'ward',
		promoteId: 'ward_Code',
		type: 'vector',
		url: 'https://raw.githubusercontent.com/NISRA-Tech-Lab/map_tiles/main/ward2014/{z}/{x}/{y}.pbf',
		minzoom: 6,
		maxzoom: 12
	} 
};

export const mapLayers = {

	lgd: {
		source: 'lgd',
		sourceLayer: 'LGD2014_clipped',
		code: 'lgd_code',
		name: 'lgd_name'	},
	dea: {
		source: 'dea',
		sourceLayer: 'DEA2014_clipped',
		code: 'dea_code',
		name: 'dea_name'},
	sdz: {
		source: 'sdz',
		sourceLayer: 'SDZ2021_clipped',
		code: 'sdz_code',
		name: 'sdz_name'
	},
	dz: {
		source: 'dz',
		sourceLayer: 'DZ2021_clipped',
		code: 'dz_code',
		name: 'dz_name', 
		
	}, 

	ward: {
		source: 'ward',
		sourceLayer: 'WARD2014_clipped',
		code: 'ward_code',
		name: 'ward_name'
	} 

};


export const mapPaint = {
	fill: {
		'fill-color': 'rgba(255,255,255,0)',
		'fill-opacity': 0
	},
	line: {
		'line-color': 'rgba(255,255,255,0)',
		'line-width': 1,
		'line-opacity': 0
	},
	'fill-active': {
		'fill-color': [
			'case',
			['==', ['feature-state', 'selected'], true], 'rgba(255,255,255,0)',
			'grey'
		],
		'fill-opacity': [
			'case',
			['==', ['feature-state', 'hovered'], true], 0.3,
			['!=', ['feature-state', 'selected'], true], 0.1,
			0
		]
	},
	'fill-self': {
		'fill-color': [
			'case',
			['==', ['feature-state', 'selected'], true], 'rgb(143,31,129)',
			'grey'
		],
		'fill-opacity': [
			'case',
			['==', ['feature-state', 'hovered'], true], 0.3,
			0.1
		]
	},
	'fill-child': {
		'fill-color': [
			'case',
			['==', ['feature-state', 'highlighted'], true], 'rgb(143,31,129)',
			'rgba(255,255,255,0)'
		],
		'fill-opacity': [
			'case',
			['==', ['feature-state', 'hovered'], true], 0.3,
			['==', ['feature-state', 'highlighted'], true], 0.1,
			0
		]
	},
	'line-active': {
		'line-color': [
			'case',
			['==', ['feature-state', 'selected'], true], 'rgb(143,31,129)',
			'grey'
		],
		'line-width': 2,
		'line-opacity': 1
	},
	'line-self': {
		'line-color': 'rgb(143,31,129)',
		'line-width': 2,
		'line-opacity': [
			'case',
			['==', ['feature-state', 'selected'], true], 1,
			0
		]
	},
	'line-child': {
		'line-color': 'rgb(143,31,129)',
		'line-width': 1,
		'line-opacity': [
			'case',
			['==', ['feature-state', 'highlighted'], true], 1,
			0
		]
	}
};