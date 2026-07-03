<script>
	import favicon from '$lib/assets/favicon.png';
	import "$lib/styles/global.scss"
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Visual Schedule Builder</title>
</svelte:head>

{@render children()}
