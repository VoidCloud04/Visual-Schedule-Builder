<script>
    import Chip from "../lib/components/Chip.svelte";

    let {use24Hour = $bindable(), minConflictTime = $bindable()} = $props()
</script>

    <div class="flexCol" style="margin: 5vh 0 5vh 0">
        <div class="surface-base flexRow">
            <div class="flexCol surface-1">
                <h3>Calendar Display Settings</h3>
                <div class="flexRow">
                    <label for="24hrBox">24 hour time:</label>
                    <input id="24hrBox" type="checkbox" bind:checked={use24Hour}>
                </div>
            </div>
            <div class="flexCol surface-1">
                <h3>General Settings</h3>
                <div class="flexRow">
                    <label for="minConfTime">Minimum Time for a Conflict to Occur (exclusive):</label>
                    <input id="minConfTime"  type="number" bind:value={minConflictTime} min="0">
                </div>
            </div>
        </div>
    </div>

<style lang="scss">
    @use '$lib/styles/variables' as *;
</style>