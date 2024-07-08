<!-- https://stackoverflow.com/questions/65998542/how-should-i-use-svelte-reactivity-with-dom-getelementbyid -->

<script>
    export let buttonVisibleOnPX = 100;
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


    a {
        color: #00205b;             
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