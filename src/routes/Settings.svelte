<script>
    let {use24Hour = $bindable(), fullTimeReq = $bindable()} = $props()
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
                    <label for="ftReq">Full Time Requirement:</label>
                    <input id="ftReq"  type="number" bind:value={fullTimeReq} min="0">
                </div>
            </div>
        </div>
    </div>

<style lang="scss">
    @use '$lib/styles/variables' as *;
</style>