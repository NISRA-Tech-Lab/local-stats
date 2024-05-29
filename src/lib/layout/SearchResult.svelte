<script>
    export let place;
    export let storage = localStorage;

    let result;

    function check_result() {
        return storage.hasOwnProperty("search_term");
    }

    function result_text () {
        result = storage.search_term;
        storage.removeItem("search_term");
        return true;
    };

    
</script>

{#if check_result() & storage.search_result == place.code & result_text()}
	<div id = "search-result">Search result for <strong>{result}</strong></div>
{/if}

<style>
    #search-result {
        background-color: bisque;
        margin: 5px;
    }
</style>