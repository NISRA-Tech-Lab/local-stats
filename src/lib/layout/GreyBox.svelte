<script>

import IButton from "$lib/layout/IButton.svelte";
import StackedBarChart from "$lib/chart/StackedBarChart.svelte";
import GroupChart from "$lib/chart/GroupChart.svelte";
import ProfileChart from "$lib/chart/ProfileChart.svelte";
import BarChart from "$lib/chart/BarChart.svelte";
import ColChart from "$lib/chart/ColChart.svelte";

export let id;
export let style;
export let place;
export let content;
export let chart_data;
export let zKey;
export let label;
export let topic_prev_available;
export let topic_boolean;

if (topic_prev_available == "false") {
    topic_boolean = false
} else {
    topic_boolean = true
}

</script>

<div class = "div-grey-box s-Vk7w7Sfe-0Fk" style = {style}>

    <IButton id = {id} place = {place}/>
    <br/>
    {#if (content == "StackedBarChart")}
        <StackedBarChart data = {chart_data} zKey = {zKey} label = {label} topic_prev_available = {topic_boolean}/>
    {:else if (content == "GroupChart")}
        <GroupChart data = {chart_data} zKey = {zKey} label = {label}/>
    {:else if (content == "ProfileChart")}
        <ProfileChart data = {chart_data} zKey = {zKey} label = {label}/>
    {:else if (content == "BarChart")}
        <BarChart data = {chart_data} zKey = {zKey} label = {label}/>
    {:else if (content == "ColChart")}
        <ColChart data = {chart_data} zKey = {zKey}/>
    {:else}
        {@html content}
    {/if}


</div>
