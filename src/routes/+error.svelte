<script>
    import { base } from '$app/paths'

    let { status, message } = $props()

    const homeHref = base || '/'

    function goBack() {
        history.back()
    }
</script>

<svelte:head>
    <title>{status ?? 'Error'} - Visual Schedule Builder</title>
</svelte:head>

<main class="flexCol" style="min-height: 100vh; justify-content: center; padding: 2rem;">
    <section class="surface-1 flexCol" style="max-width: 32rem; padding: 2rem;">
        <h1>{status ?? '404'}</h1>

        <h2>{status === 404 ? 'Page Not Found' : 'Something went wrong'}</h2>

        <hr style="width: 100%;">

        <p>
            {#if status === 404}
                Sorry, the page you're looking for doesn't exist or has been moved.
            {:else}
                {message}
            {/if}
        </p>

        <div class="flexRow">
            <a href={homeHref}>
                <button class="button-primary" type="button">Home</button>
            </a>

            <button class="button-septenary" type="button" onclick={goBack}>
                Go Back
            </button>
        </div>
    </section>
</main>