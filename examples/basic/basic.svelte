<script>
  let { name } = $props()

  let showGreeting = $state(false)

  const onclick = () => (showGreeting = true)
</script>

<button {onclick}>Greet</button>

{#if showGreeting}
  <p>Hello {name}</p>
{/if}
