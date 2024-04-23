<script>

import { base } from "$app/paths";
import GreyBox from "$lib/layout/GreyBox.svelte";

export let id;
export let img;
export let heading;
export let place;
export let sub_heading;
export let description;
export let boxes;
export let more;
export let chart_compare_type;

let box_list = Object.keys(boxes);

let w, cols;

</script>

<div class = "accordion-item">

    <h2 class="accordion-header" id="panelsStayOpen-heading{id}">
        <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapse{id}"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapse{id}"
        >
            <span class="accordion-button-title">
                <img
                    src="{base}/img/{img}"
                    alt="logo"
                    height="40"
                    class="accordion-dept-logo"
                />
                {heading}</span>
        </button>
    </h2>

    <div
        id="panelsStayOpen-collapse{id}"
        class="accordion-collapse collapse"
        aria-labelledby="panelsStayOpen-heading{id}"
    >

        <div class="accordion-body">
            <!-- change order -->
            {place.name} {place.type.toLocaleUpperCase()} - {@html sub_heading}
            <span class="accordion-button-title-sub"
                >{description}</span>

            <div class="grid mt" bind:clientWidth={w}>

                {#each {length: box_list.length} as _, i}

                    {#if (boxes[box_list[i]].hasOwnProperty("show"))}

                        {#if (boxes[box_list[i]].show.includes(place.type))}

                        <GreyBox
                            id = {boxes[box_list[i]].id}
                            style = {boxes[box_list[i]].style}
                            place = {place}
                            year = {boxes[box_list[i]].year}
                            content = {boxes[box_list[i]].content}
                            chart_data = {boxes[box_list[i]].chart_data}
                            zKey = {boxes[box_list[i]].zKey}
                            label = {boxes[box_list[i]].label}
                            topic_prev_available = {boxes[box_list[i]].topic_prev_available}
                            chart_compare_type = {chart_compare_type}
                        />

                        {/if}

                    {/if}

                    {#if (!boxes[box_list[i]].hasOwnProperty("show"))}

                        <GreyBox
                            id = {boxes[box_list[i]].id}
                            style = {boxes[box_list[i]].style}
                            place = {place}
                            year = {boxes[box_list[i]].year}
                            content = {boxes[box_list[i]].content}
                            chart_data = {boxes[box_list[i]].chart_data}
                            zKey = {boxes[box_list[i]].zKey}
                            label = {boxes[box_list[i]].label}
                            topic_prev_available = {boxes[box_list[i]].topic_prev_available}
                            chart_compare_type = {chart_compare_type}
                        />

                    {/if}

                {/each}

            </div>

            {#if more != ""}
                <h3>More Statistics</h3>
                <div class = "accordion-more">{@html more}</div>
            {/if}

        </div>

    </div>

</div>

<style>

    .accordion-more {
        margin-top: 1em;
    }

    .grid {
		display: grid;
		width: 100%;
		grid-gap: 10px;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		justify-content: stretch;
		page-break-inside: avoid;
	}

    .mt {
		margin-top: 20px;
	}

</style>

