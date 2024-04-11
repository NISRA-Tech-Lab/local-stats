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
export let chart_compare_type;

if (topic_prev_available == "false") {
    topic_boolean = false
} else {
    topic_boolean = true
}

</script>

<div class = "div-grey-box" style = {style}>

    {#if (i_button)}
        <IButton id = {id} place = {place}/>
    {:else}
        <h3 style="margin: 0 0 10px 0; line-height: 1.78;">{heading}</h3>
    {/if}
    <br/>
    {#if (content == "StackedBarChart")}
        {#if (chart_data.hasOwnProperty("none") & chart_compare_type == null)}
            <StackedBarChart data = {chart_data.none} zKey = {zKey} label = {label} topic_prev_available = {topic_boolean}/>
        {:else if (chart_data.hasOwnProperty("prev") & chart_compare_type == "prev")}
            <StackedBarChart data = {chart_data.prev} zKey = {zKey} label = {label} topic_prev_available = {topic_boolean}/>
        {:else if (chart_data.hasOwnProperty("ni") & chart_compare_type == "ni")}
            <StackedBarChart data = {chart_data.ni} zKey = {zKey} label = {label} topic_prev_available = {topic_boolean}/>
        {:else}
            <StackedBarChart data = {chart_data} zKey = {zKey} label = {label} topic_prev_available = {topic_boolean}/>
        {/if}
    {:else if (content == "GroupChart")}
        {#if (chart_data.hasOwnProperty("none") & chart_compare_type == null)}
            <GroupChart data = {chart_data.none} zKey = {zKey} label = {label}/>
        {:else if (chart_data.hasOwnProperty("prev") & chart_compare_type == "prev")}
            <GroupChart data = {chart_data.prev} zKey = {zKey} label = {label}/>
        {:else if (chart_data.hasOwnProperty("ni") & chart_compare_type == "ni")}
            <GroupChart data = {chart_data.ni} zKey = {zKey} label = {label}/>
        {:else}
            <GroupChart data = {chart_data} zKey = {zKey} label = {label}/>
        {/if}
    {:else if (content == "ProfileChart")}
        {#if (chart_data.hasOwnProperty("none") & chart_compare_type == null)}
            <ProfileChart data = {chart_data.none} zKey = {zKey} label = {label}/>
        {:else if (chart_data.hasOwnProperty("prev") & chart_compare_type == "prev")}
            <ProfileChart data = {chart_data.prev} zKey = {zKey} label = {label}/>
        {:else if (chart_data.hasOwnProperty("ni") & chart_compare_type == "ni")}
            <ProfileChart data = {chart_data.ni} zKey = {zKey} label = {label}/>
        {:else}
            <ProfileChart data = {chart_data} zKey = {zKey} label = {label}/>
        {/if}
    {:else if (content == "BarChart")}
        {#if (chart_data.hasOwnProperty("none") & chart_compare_type == null)}
            <BarChart data = {chart_data.none} zKey = {zKey} label = {label}/>
        {:else if (chart_data.hasOwnProperty("prev") & chart_compare_type == "prev")}
            <BarChart data = {chart_data.prev} zKey = {zKey} label = {label}/>
        {:else if (chart_data.hasOwnProperty("ni") & chart_compare_type == "ni")}
            <BarChart data = {chart_data.ni} zKey = {zKey} label = {label}/>
        {:else}
            <BarChart data = {chart_data} zKey = {zKey} label = {label}/>
        {/if}
    {:else if (content == "ColChart")}
        {#if (chart_data.hasOwnProperty("none") & chart_compare_type == null)}
            <ColChart data = {chart_data.none} zKey = {zKey}/>
        {:else if (chart_data.hasOwnProperty("prev") & chart_compare_type == "prev")}
            <ColChart data = {chart_data.prev} zKey = {zKey}/>
        {:else if (chart_data.hasOwnProperty("ni") & chart_compare_type == "ni")}
            <ColChart data = {chart_data.ni} zKey = {zKey}/>
        {:else}
            <ColChart data = {chart_data} zKey = {zKey}/>
        {/if}
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