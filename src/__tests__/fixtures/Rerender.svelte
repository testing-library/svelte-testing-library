<script>
  import { getContext, onMount } from 'svelte'

  export let name

  const mountCounter = getContext('mountCounter')

  onMount(() => {
    mountCounter.update((i) => i + 1)
  })
</script>

<h1 data-testid="test">Hello {name}!</h1>

<div data-testid="mount-counter">{$mountCounter}</div>
