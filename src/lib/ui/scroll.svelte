<!-- https://stackoverflow.com/questions/65998542/how-should-i-use-svelte-reactivity-with-dom-getelementbyid -->

<script>
    export let buttonVisibleOnPX = 200;
    let hidden = true;

    const goStart = () => {
        document.body.scrollIntoView();
    };

    const scrollElement = () => {
        return document.documentElement || document.body;
    };

    const handleOnScroll = () => {
        if (scrollElement().scrollTop > buttonVisibleOnPX) {
            hidden = false;
        } else {
            hidden = true;
        }
    };
</script>

<svelte:window on:scroll={handleOnScroll} />

<div class="back_to_start" on:click={goStart} class:hidden>Back to top</div>

<div class="nav sticky" class:hidden>
    <ul>
      <li>This</li>
      <li>is</li>
      <li>a</li>
      <li>sticky</li>
      <li>banner</li>
    </ul>
  </div>

<style>
    .back_to_start {
        opacity: 1;
        transition: opacity 0.5s, visibility 0.5s;
        position: fixed;
        z-index: 99;
        right: 0px;
        user-select: none;
        bottom: 0px;
        color: #00205b;
        background-color: rgba(170, 170, 170, 0.5);
        width: 100%;
        text-align: center;
        padding-top: 5px;
        padding-bottom: 5px;
        font-weight: 700;
        cursor: pointer;
    }

    .back_to_start.hidden {
        opacity: 0;
        visibility: hidden;
    }

    .nav.hidden {
        opacity: 0;
        visibility: hidden;
    }
    
    .nav {
	background: #111;
	border-radius: 1rem;
	margin: 0 auto;
	width: 45rem;
	border-bottom: 1px solid #000;
	
	/* soft transition for border radius + width */
	transition: all 0.4s ease;
  }

  .nav ul {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	list-style-type: none;
	padding: 1rem 0;
	margin: 0;
  }
  
  .nav ul li i {
	font-size: 2.5rem;
	padding: 0 1.5rem;
	display: block;
	color: #eee;
  
	transition: 0.4s ease-out;
  }
  
  .nav ul li i:hover {
	transform: scale(1.1);
	color: #fbfb6a;
	cursor: pointer;
  }
  
  /* 
	styles for the navigation bar
	after the sticky class got attached via JS
  */
  .nav.sticky {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	width: 50rem;
	max-width: 100%;
	margin: 0 auto;
	border-radius: 0;
	border-bottom: 3px solid #fbfb6a;
  }

</style>