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

let box_list = Object.keys(boxes);

let w, cols;

</script>

<div class = "accordion-item">

    <h2 class="accordion-header s-Vk7w7Sfe-0Fk" id="panelsStayOpen-heading{id}">
        <button
            class="accordion-button collapsed s-Vk7w7Sfe-0Fk"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapse{id}"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapse{id}"
        >
            <span class="accordion-button-title s-Vk7w7Sfe-0Fk">
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
        class="accordion-collapse collapse s-Vk7w7Sfe-0Fk"
        aria-labelledby="panelsStayOpen-heading{id}"
    >

        <div class="accordion-body s-Vk7w7Sfe-0Fk">
            {sub_heading} - {place.name} -
            <span class="accordion-button-title-sub s-Vk7w7Sfe-0Fk"
                >{description}</span>

            <div class="grid mt s-Vk7w7Sfe-0Fk" bind:clientWidth={w}>

                {#each {length: box_list.length} as _, i}


                    <GreyBox
                        id = {boxes[box_list[i]].id}
                        style = {boxes[box_list[i]].style}
                        place = {place}
                        content = {boxes[box_list[i]].content}
                        chart_data = {boxes[box_list[i]].chart_data}
                        zKey = {boxes[box_list[i]].zKey}
                        label = {boxes[box_list[i]].label}
                        topic_prev_available = {boxes[box_list[i]].topic_prev_available}
                    />

                {/each}

            </div>

            {#if more != ""}
                <h3>More Statistics</h3>
                <div class = "accordion-more s-Vk7w7Sfe-0Fk">{@html more}</div>
            {/if}

        </div>

    </div>

</div>

<style>

    .accordion-more {
        margin-top: 1em;
    }

</style>

