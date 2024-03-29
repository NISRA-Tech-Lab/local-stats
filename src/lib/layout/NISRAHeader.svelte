<script>
	import { assets } from "$app/paths";
	  import { getContext } from 'svelte';
	  export let theme = getContext('theme');
	  export let filled = true;
	  export let center = false;
</script>
  
		<!-- <nav  style="border-bottom-color: {theme['muted']}; {filled ? 'background-color: ' +  theme['background'] + ';' : ''}">
		<div class="col-wide " style="flex-direction: row; -ms-flex-direction: row;     background-color: #00205b;" class:center>
			<a href="https://www.nisra.gov.uk/">
				<picture>
					{#if theme.name == 'dark'}
					<img style="width:180px;" src="{assets}/img/white bilingual.png" alt="Northern Ireland Statistics and Research Agency">
					{:else if filled == true}
					<img style="width:180px;" src="{assets}/img/white bilingual.png" alt="Northern Ireland Statistics and Research Agency">
					{:else}
					<img style="width:180px;" src="{assets}/img/white bilingual.png" alt="Northern Ireland Statistics and Research Agency">
					{/if}
				</picture>
			</a>
			<span class="text-big title;" style="color: #ffffff; padding-left: 100px" >Northern Ireland Area Explorer</span>

		</div>
	</nav> -->
  

		  
		<header style="color: #ffffff; background-color: #00205b;">
			<div class="col-wide" data-analytics="header">
				<div class="row">
					<a href="https://www.nisra.gov.uk/">
						<picture>
							{#if theme.name == 'dark'}
							<img style="width:180px;" src="{assets}/img/white bilingual.png" alt="Northern Ireland Statistics and Research Agency">
							{:else if filled == true}
							<img style="width:180px;" src="{assets}/img/white bilingual.png" alt="Northern Ireland Statistics and Research Agency">
							{:else}
							<img style="width:180px;" src="{assets}/img/white bilingual.png" alt="Northern Ireland Statistics and Research Agency">
							{/if}
						</picture>
					</a>
					<span style="font-size: 1.5em; font-weight: bold;color: #ffffff;   padding-left: 100px" >Northern Ireland Area Explorer</span>
		
				</div>
		
				
			</div>
		</header>


  <style>

header {
		padding-bottom: 5px;
		height: 120px;
		 
	}
	

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

	  
  </style>