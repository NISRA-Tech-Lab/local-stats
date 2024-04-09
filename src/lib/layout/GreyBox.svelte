<script>

import IButton from "$lib/layout/IButton.svelte";
import StackedBarChart from "$lib/chart/StackedBarChart.svelte";
import GroupChart from "$lib/chart/GroupChart.svelte";
import ProfileChart from "$lib/chart/ProfileChart.svelte";
import BarChart from "$lib/chart/BarChart.svelte";
import ColChart from "$lib/chart/ColChart.svelte";

export let id;
export let style = null;
export let place;
export let content;
export let chart_data = null;
export let zKey = null;
export let label = null;
export let topic_prev_available = null;
export let topic_boolean = null;
export let i_button = true;
export let heading = null;
export let comp_none;
export let comp_time;
export let comp_ni;

if (topic_prev_available == "false") {
    topic_boolean = false
} else {
    topic_boolean = true
}

</script>

<div class = "div-grey-box s-Vk7w7Sfe-0Fk" style = {style}>

    {#if (i_button)}
        <IButton id = {id} place = {place}/>
    {:else}
        <h3 style="margin: 0 0 10px 0; line-height: 1.78;">{heading}</h3>
    {/if}
    <br/>
    {#if (content == "StackedBarChart")}
        <StackedBarChart data = {chart_data} zKey = {zKey} label = {label} topic_prev_available = {topic_boolean}/>
    {:else if (content == "GroupChart")}
        {#if (chart_data.hasOwnProperty("none") & comp_none)}
            <GroupChart data = {chart_data.none} zKey = {zKey} label = {label}/>
        {:else if (chart_data.hasOwnProperty("time") & comp_time)}
            <GroupChart data = {chart_data.time} zKey = {zKey} label = {label}/>
        {:else if (chart_data.hasOwnProperty("ni") & comp_ni)}
            <GroupChart data = {chart_data.ni} zKey = {zKey} label = {label}/>
        {:else}
            <GroupChart data = {chart_data} zKey = {zKey} label = {label}/>
        {/if}
    {:else if (content == "ProfileChart")}
        {#if (chart_data.hasOwnProperty("none") & comp_none)}
            <ProfileChart data = {chart_data.none} zKey = {zKey} label = {label}/>
        {:else if (chart_data.hasOwnProperty("time") & comp_time)}
            <ProfileChart data = {chart_data.time} zKey = {zKey} label = {label}/>
        {:else if (chart_data.hasOwnProperty("ni") & comp_ni)}
            <ProfileChart data = {chart_data.ni} zKey = {zKey} label = {label}/>
        {:else}
            <ProfileChart data = {chart_data} zKey = {zKey} label = {label}/>
        {/if}
    {:else if (content == "BarChart")}
        <BarChart data = {chart_data} zKey = {zKey} label = {label}/>
    {:else if (content == "ColChart")}
        <ColChart data = {chart_data} zKey = {zKey}/>
    {:else if (content.hasOwnProperty(place.type))}
        {@html content[place.type]}
    {:else}
        {@html content}
    {/if}


</div>

<style>
    .div-grey-box {
		line-height: 1.78;
		overflow: hidden;
		box-shadow: 0 2px #4140424d;
		background-color: #f5f5f6;
		padding: 16px 16px;
	}
</style>