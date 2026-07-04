<script>
    let { buttons, selected = $bindable() } = $props()
</script>

<div>
    {#if buttons.length > 0}
        {#each buttons as button, i}
            <button 
            class="{i === 0 ? 'left' : `${i === buttons.length-1 ? 'right' : ''}`} {selected === i ? 'button-primary selected' : 'button-secondary'}"
            onclick={() => {selected = i}}>{button.name}</button>
        {/each}
    {:else}
        <p>This Button Group is configured improperly</p>
    {/if}
</div>

<style lang="scss">
    @use "../styles/variables" as *;

    p {
        color: $error;
    }
    button {
        border-radius: 12px;
    }

    .left {
        border-top-left-radius: 40px;
        border-bottom-left-radius: 40px;
    }

    .right {
        border-top-right-radius: 40px;
        border-bottom-right-radius: 40px;
    }

    .selected {
        border-radius: 40px;
    }
</style>