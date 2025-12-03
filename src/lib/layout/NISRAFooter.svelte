<script>
 // import { assets } from "$app/paths";
	import { getContext } from 'svelte';
	import Section from "$lib/layout/Section.svelte";


//	export let theme = getContext('theme');
</script>

<!-- svelte-ignore missing-declaration -->
<Section column="wide">
<div class="block" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); justify-content: stretch;">
<!-- <div style="margin-left:16px; padding-right:16px;">
	<h3 style="margin-bottom:10px; line-height: 1.78;">Download</h3>
	<li style="margin: 0px; display: block; line-height: 20px; padding-bottom: 5px">
		 <a href="https://www.nisra.gov.uk/publications/census-area-explorer-2021-and-2011-data" class="link"><strong>Download</strong> Census 2011 and 2021 data from this app</a>
	</li>
  </div>
  
  <div style="margin-left:16px; padding-right:16px;">
	<h3 style="margin-bottom:10px; line-height: 1.78;">Contact and further resources</h3>
	<li style="margin: 0px; display: block; line-height: 20px; padding-bottom: 5px">
		<a href="https://www.nisra.gov.uk/contacts/census-customer-services">Contact Census</a>
  	</li>
	<li style="margin: 0px; display: block; line-height: 20px; padding-bottom: 5px">
		<a href="https://www.nisra.gov.uk/statistics/census/2021-census">Census 2021</a>
  	</li>
	<li style="margin: 0px; display: block; line-height: 20px; padding-bottom: 5px">
		<a href="https://www.nisra.gov.uk/statistics/2021-census/results">Census 2021 results</a>
  	</li>
	<li style="margin: 0px; display: block; line-height: 20px; padding-bottom: 5px">
		<a href="https://www.nisra.gov.uk/publications/census-2021-statistical-bulletins">Statistical Bulletins</a>
  	</li>
	  <li style="margin: 0px; display: block; line-height: 20px; padding-bottom: 5px">
		<a href="https://www.nisra.gov.uk/publications/census-2021-infographics">Infographics</a>
  	</li>
	
  </div>

  <div style="margin-left:16px;">
	<h3 style="margin-bottom:10px; line-height: 1.78;">About this app</h3>
	This web application is based on and inspired by the <a href="https://github.com/ONSvisual">ONS Digital Content team prototypes</a>. 
	It has been modified by NISRA and released as a prototype to explore Census data for Northern Ireland. We welcome feedback from users through our short <a href="https://consultations2.nidirect.gov.uk/dof/area-explorer-feedback/">survey</a>.
		
  </div>

  </div> -->
</Section>
  
<footer class="footer mt-auto py-4 bg-nisra text-white">

      <div class="container">
        <!-- 3 column section -->
        <div class="row mb-3">
          <div class="col-md-4">
            <h5>Data Tools</h5>
            <ul class="list-unstyled">
              <li><a href="https://explore.nisra.gov.uk/local-stats/">Local Statistics Explorer</a></li>
              <li><a href="https://data.nisra.gov.uk">Data Portal</a></li>
              <li><a href="https://build.nisra.gov.uk/en/">Census Flexible Table Builder</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Corporate</h5>
            <ul class="list-unstyled">
              <li><a href="https://www.nisra.gov.uk/">NISRA Website</a></li>
              <li><a href="https://www.nisra.gov.uk/statistics/about-nisra/careers">Careers</a></li>
              <li><a href="https://www.nisra.gov.uk/contact">Contact</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Follow</h5>
            <ul class="list-inline">
              <li class="list-inline-item">
                <a href="https://www.facebook.com/nisra.gov.uk">
                  <img src="/img/logo/facebook-brands-solid-full.svg" title="Facebook" role="img" class="img-50"/>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="https://x.com/NISRA/">
                  <img src="/img/logo/x-twitter-brands-solid-full.svg" title="Twitter/X" role="img" class="img-50"/>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="https://www.youtube.com/user/nisrastats">
                  <img src="/img/logo/youtube-brands-solid-full.svg" title="YouTube" role="img" class="img-50"/>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="https://www.linkedin.com/company/northern-ireland-statistics-and-research-agency/">
                  <img src="/img/logo/linkedin-in-brands-solid-full.svg" title="LinkedIn" role="img" class="img-50"/>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Horizontal list with separators -->
        <ul class="list-inline footer-links text-center mb-0">
          <li class="list-inline-item"><a href="https://www.nisra.gov.uk/crown-copyright">© Crown Copyright</a></li>
          <li class="list-inline-item">|</li>
          <li class="list-inline-item"><a href="https://www.nisra.gov.uk/terms-and-conditions">Terms and conditions</a></li>
          <li class="list-inline-item">|</li>
          <li class="list-inline-item"><a href="https://www.nisra.gov.uk/cookies">Cookies</a></li>
          <li class="list-inline-item">|</li>
          <li class="list-inline-item"><a href="https://www.nisra.gov.uk/nisra-privacy-notice">Privacy</a></li>
          <li class="list-inline-item">|</li>
          <li class="list-inline-item"><a href="https://datavis.nisra.gov.uk/dissemination/accessibility-statement-visualisations.html">Accessibility Statement</a></li>
        </ul>
      </div>
      
</footer>

<style>
/* ===========================
   Brand & misc.
   =========================== */
.app-title { font-weight: 700; letter-spacing: 0.2px; }
.img-50 { width: 50px; height: 50px; }

/* ===========================
   Footer
   =========================== */
.footer {
  background-color: #00205b;
  color: #fff;
  border-top: 4px solid #3878c5;
  margin-top: 20px !important;
  padding-bottom: 40px !important;
  
}
.footer a {
  color: #fff;
  text-underline-offset: 3px;
}
.footer a:hover,
.footer a:focus {
  color: #fff;
  text-decoration-thickness: 2px;
}
.footer-links { list-style: none; padding-left: 0; }
.footer-links .list-inline-item { margin: 0 .5rem; }

/* More vertical spacing in vertical lists */
.footer ul.list-unstyled li { margin-bottom: 0.5rem; }

/* Social icon hover */
.footer .list-inline-item img {
  transition: box-shadow 0.2s ease, border 0.2s ease;
}
.footer .list-inline-item img:hover {
  border: 2px solid #fff;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
  border-radius: 4px;
}
</style>