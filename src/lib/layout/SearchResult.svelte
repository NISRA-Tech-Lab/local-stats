<script>
    export let place;

    function check_result() {
        return localStorage.hasOwnProperty("search_term");
    }

    function result_text () {
        let result = "Search result for <strong>" + localStorage.search_term + "</strong>";
        localStorage.removeItem("search_term");   
        return result;
    };
</script>

{#if check_result() & localStorage.search_result == place.code}
		<div id = "search-result">{@html result_text()}</div>
{/if}

<style>
    #search-result {
        background-color: bisque;
        margin: 5px;
    }
</style>