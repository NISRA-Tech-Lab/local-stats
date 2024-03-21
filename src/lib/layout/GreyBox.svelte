<script>

import IButton from "$lib/layout/IButton.svelte";
import { parse } from 'svelte-parse';

export let id;
export let style = "";
export let place;
export let content;

if (content.includes("StackedBarChart")) {

    let svelte_item = parse({value: content, generatePositions: true});
    console.log(svelte_item)

}


</script>

<div class = "div-grey-box s-OrSHbitiAkZX" style = {style}>

    <IButton id = {id} place = {place}/>
    <br/>
    {@html content}


</div>
