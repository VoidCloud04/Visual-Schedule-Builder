<script>
    import Icon from "./Icon.svelte";
    const { name, type = 'primary', disabled = false } = $props()

</script>

<button class='button-{type}' disabled={disabled}>
    <Icon name={name} />
</button>

<style>
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