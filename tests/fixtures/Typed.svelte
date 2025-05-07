<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let name: string
  export let count: number

  export const hello: string = 'hello'

  const dispatch = createEventDispatcher<{ greeting: string }>()
</script>

<h1>hello {name}</h1>
<p>count: {count}</p>
<button on:click={() => dispatch('greeting', 'hello')}>greet</button>
