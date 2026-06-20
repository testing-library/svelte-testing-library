<script>
  import { getContext } from 'svelte'

  export let name
  export let punctuation = '.'
  export let value = ''

  export const wrappedContext = getContext('wrapperContext')
</script>

<p data-testid="context">{wrappedContext.greeting} {name}{punctuation}</p>
<input type="text" bind:value />
