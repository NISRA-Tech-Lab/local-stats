<script>
	import { assets } from "$app/paths";
	  import { getContext } from 'svelte';
	  export let theme = getContext('theme');
	  export let filled = true;
	//   export let center = false;
</script>
  
		<!-- <nav  style="border-bottom-color: {theme['muted']}; {filled ? 'background-color: ' +  theme['background'] + ';' : ''}">
		<div class="col-wide " style="flex-direction: row; -ms-flex-direction: row;     background-color: #00205b;" class:center>
			<a href="https://www.nisra.gov.uk/">
				<picture>
					{#if theme.name == 'dark'}
					<img style="width:180px;" src="{assets}/img/logo/nisra-only-white.svg" alt="Northern Ireland Statistics and Research Agency">
					{:else if filled == true}
					<img style="width:180px;" src="{assets}/img/logo/nisra-only-white.svg" alt="Northern Ireland Statistics and Research Agency">
					{:else}
					<img style="width:180px;" src="{assets}/img/logo/nisra-only-white.svg" alt="Northern Ireland Statistics and Research Agency">
					{/if}
				</picture>
			</a>
			<span class="text-big title;" style="color: #ffffff; padding-left: 100px" >Northern Ireland Area Explorer</span>

		</div>
	</nav> -->
  
	<nav  style="color: #ffffff; background-color: #00205b;">
		<!-- <header style="color: #ffffff; background-color: #00205b;"> -->
			<div  data-analytics="header">
				<div class="grid mtb">
					<div style = "display: flex; justify-content: left; align-items: center">
						<a href="https://www.nisra.gov.uk/">
							<picture>
								{#if theme.name == 'dark'}
									<img style="width: 200px;" src="{assets}/img/logo/nisra-only-white.svg" alt="Northern Ireland Statistics and Research Agency">
								{:else if filled == true}
									<img style="width: 200px;" src="{assets}/img/logo/nisra-only-white.svg" alt="Northern Ireland Statistics and Research Agency">
								{:else}
									<img style="width: 200px;" src="{assets}/img/logo/nisra-only-white.svg" alt="Northern Ireland Statistics and Research Agency">
								{/if}
							</picture>
						</a>
					</div>
					<div style = "display: flex; flex-direction:column; justify-content: right; align-items: center">
						<h1 style="font-size: 28px; font-weight: 700;color: #ffffff; line-height: 1em; margin-bottom: 10px;">Northern Ireland Local Statistics Explorer</h1>
						<span style = "font-size: 24px; line-height: 1.333">Find out how your local area compares to NI</span>
					</div>
				</div>
		
			</div>
		<!-- </header> -->
	</nav>



  <style>

/* header {
		padding-bottom: 5px;
		height: 120px;
		 
	}
	 */

	  picture {
		  position: relative;
		  top: 12px;
		  padding: 10px 12px;
	  }
	  img {
		  width: 110px;
		  	  }
	  a img:hover {
		  cursor: pointer;
	  }

	  .grid {
		display: flex;
		width: 100%;
		grid-gap: 750px;
		page-break-inside: avoid;
	}

	.mtb {
		margin-top: 10px;
		margin-bottom: 20px;
	}

	  
  </style>