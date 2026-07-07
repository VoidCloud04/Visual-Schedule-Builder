<script>
    import { snackbar } from './scripts/snackbar.svelte.js'
</script>

{#if snackbar.visible}
    <div class="snackbar snackbar-{snackbar.type}">
        {snackbar.content}
    </div>
{/if}
<style lang="scss">
    @use '$lib/styles/variables' as *;

    .snackbar {
        position: fixed;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%);

        z-index: 1000;

        min-width: 250px;
        max-width: 500px;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    @mixin snackbar($bg,$fg) {
        height: 48px;
        background-color: $bg;
        color: $fg;
        border: 2px solid $bg;
        border-radius: 8px;
        padding: 4px 12px 4px 12px;
    }

    .snackbar-base {
        @include snackbar($surface4, $onSurface4)
    }
    .snackbar-error {
        @include snackbar($error, $onPrimary)
    }
    .snackbar-warning {
        @include snackbar($warning, $onPrimary)
    }
    .snackbar-success {
        @include snackbar($success, $onPrimary)
    }
    .snackbar-info {
        @include snackbar($info, $onPrimary)
    }

    
</style>