<script>
    import Icon from "./Icon.svelte";
    const { name, disabledName = name, type = '', disabled = false } = $props()

</script>

<button class='{type}' disabled={disabled}>
    <Icon name={disabled ? disabledName : name} />
</button>

<style lang="scss">
    @use '$lib/styles/variables' as *;



    button {
        width: 32px;
        height: 32px;
        flex: 0 0 32px;
        border-radius: 50%;
        padding: 0;

        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>