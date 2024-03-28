<script>

import { base } from "$app/paths";
import GreyBox from "$lib/layout/GreyBox.svelte";

export let id;
export let img;
export let heading;
export let place;
export let sub_heading;
export let description;
export let grey_boxes;

let boxes = Object.keys(grey_boxes);

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

                {#each {length: boxes.length} as _, i}

                    {#if (grey_boxes["box_" + i].content.hasOwnProperty(place.type))}

                        <GreyBox
                            id = {grey_boxes["box_" + i].id}
                            style = {grey_boxes["box_" + i].style}
                            place = {place}
                            content = {grey_boxes["box_" + i].content[place.type]}
                            chart_data = {grey_boxes["box_" + i].chart_data}
                            zKey = {grey_boxes["box_" + i].zKey}
                            label = {grey_boxes["box_" + i].label}
                            topic_prev_available = {grey_boxes["box_" + i].topic_prev_available}
                        />

                    {:else}

                        <GreyBox
                            id = {grey_boxes["box_" + i].id}
                            style = {grey_boxes["box_" + i].style}
                            place = {place}
                            content = {grey_boxes["box_" + i].content}
                            chart_data = {grey_boxes["box_" + i].chart_data}
                            zKey = {grey_boxes["box_" + i].zKey}
                            label = {grey_boxes["box_" + i].label}
                            topic_prev_available = {grey_boxes["box_" + i].topic_prev_available}
                        />

                    {/if}
                {/each}

            </div>

        </div>

    </div>

</div>

