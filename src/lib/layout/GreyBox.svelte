<script>

import IButton from "$lib/layout/IButton.svelte";

export let id;
export let style = "";
export let place;
export let content;

</script>

<div class = "div-grey-box s-Vk7w7Sfe-0Fk" style = {style}>

    <IButton id = {id} place = {place}/>
    <br/>
    {@html content}


</div>
