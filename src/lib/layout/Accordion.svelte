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

    <h2 class="accordion-header s-OrSHbitiAkZX" id="panelsStayOpen-heading{id}">
        <button
            class="accordion-button collapsed s-OrSHbitiAkZX"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapse{id}"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapse{id}"
        >
            <span class="accordion-button-title s-OrSHbitiAkZX">
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
        class="accordion-collapse collapse s-OrSHbitiAkZX"
        aria-labelledby="panelsStayOpen-heading{id}"
    >

        <div class="accordion-body s-OrSHbitiAkZX">
            {sub_heading} - {place.name} -
            <span class="accordion-button-title-sub s-OrSHbitiAkZX"
                >{description}</span>

            <div class="grid mt s-OrSHbitiAkZX" bind:clientWidth={w}>

                {#each {length: boxes.length} as _, i}

                    {#if (grey_boxes["box_" + i].content.hasOwnProperty(place.type))}

                        <GreyBox
                            id = {grey_boxes["box_" + i].id}
                            style = {grey_boxes["box_" + i].style}
                            place = {place}
                            content = {grey_boxes["box_" + i].content[place.type]}
                        />

                    {:else}

                        <GreyBox
                            id = {grey_boxes["box_" + i].id}
                            style = {grey_boxes["box_" + i].style}
                            place = {place}
                            content = {grey_boxes["box_" + i].content}
                        />

                    {/if}
                {/each}

            </div>

        </div>

    </div>

</div>

