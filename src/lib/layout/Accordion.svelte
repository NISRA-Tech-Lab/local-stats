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
            {place.name} {place.type.toLocaleUpperCase()}. {@html sub_heading}
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
                            i_button = {boxes[box_list[i]].i_button}
                            compare_content = {boxes[box_list[i]].compare_content}
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
                            i_button = {boxes[box_list[i]].i_button}
                            compare_content = {boxes[box_list[i]].compare_content}
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

    .collapse:not(.show){
        display:none
    }
    .accordion-button{
        position:relative;
        display:flex;
        align-items:center;
        width:100%;
        padding:var(--bs-accordion-btn-padding-y) var(--bs-accordion-btn-padding-x);
        font-size:1rem;
        color:var(--bs-accordion-btn-color);
        text-align:left;
        background-color:#f5f5f6;
        box-shadow: 0 2px #4140424d;
        border-radius:0;
        overflow-anchor:none;
        transition:var(--bs-accordion-transition);
        cursor:pointer;
        margin-bottom:0px;
    }
    @media (prefers-reduced-motion:reduce){
        .accordion-button{
            transition:none
        }
    }
    .accordion-button:not(.collapsed){
        color:var(--bs-accordion-active-color);
        background-color: rgb(0, 32, 91, 0.1);
        box-shadow:inset 0 calc(-1 * var(--bs-accordion-border-width)) 0 var(--bs-accordion-border-color)
    }
    .accordion-button:not(.collapsed)::after{
        background-image:var(--bs-accordion-btn-active-icon);
        transform:var(--bs-accordion-btn-icon-transform)
    }
    .accordion-button::after{
        flex-shrink:0;
        width:var(--bs-accordion-btn-icon-width);
        height:var(--bs-accordion-btn-icon-width);
        margin-left:auto;
        content:"";
        background-image:var(--bs-accordion-btn-icon);
        background-repeat:no-repeat;
        background-size:var(--bs-accordion-btn-icon-width);
        transition:var(--bs-accordion-btn-icon-transition)
    }
    @media (prefers-reduced-motion:reduce){
        .accordion-button::after{
            transition:none
        }
    }
    .accordion-button:hover{
        z-index:2
    }
    .accordion-button:focus{
        z-index:3;
        border-color:var(--bs-accordion-btn-focus-border-color);
        outline:0;
        box-shadow:var(--bs-accordion-btn-focus-box-shadow)
    }
    .accordion-header{
        margin-bottom:0
    }
    .accordion-item{
        color:var(--bs-accordion-color);
        background-color:var(--bs-accordion-bg);
        border:var(--bs-accordion-border-width) solid var(--bs-accordion-border-color)
    }
    .accordion-item:first-of-type{
        border-top-left-radius:var(--bs-accordion-border-radius);
        border-top-right-radius:var(--bs-accordion-border-radius)
    }
    .accordion-item:first-of-type .accordion-button{
        border-top-left-radius:var(--bs-accordion-inner-border-radius);
        border-top-right-radius:var(--bs-accordion-inner-border-radius)
    }
    .accordion-item:not(:first-of-type){
        border-top:0
    }
    .accordion-item:last-of-type{
        border-bottom-right-radius:var(--bs-accordion-border-radius);
        border-bottom-left-radius:var(--bs-accordion-border-radius)
    }
    .accordion-item:last-of-type .accordion-button.collapsed{
        border-bottom-right-radius:var(--bs-accordion-inner-border-radius);
        border-bottom-left-radius:var(--bs-accordion-inner-border-radius)
    }
    .accordion-item:last-of-type .accordion-collapse{
        border-bottom-right-radius:var(--bs-accordion-border-radius);
        border-bottom-left-radius:var(--bs-accordion-border-radius)
    }
    .accordion-body{
        padding:var(--bs-accordion-body-padding-y) var(--bs-accordion-body-padding-x);
        background-color: #fcfcfc;
        border: 1px solid #4140424d;
    }

    .accordion-button-title {
        margin-right:10px;
        font-weight:bold;
    }

    .accordion-button-title-sub {
        color: black;
    }


</style>

