<script>
  import { setContext } from 'svelte'

  const { greeting, children } = $props()

  export const wrapperContext = {
    get greeting() {
      return greeting
    },
  }

  setContext('wrapperContext', wrapperContext)
</script>

<div data-testid="wrapper-runes">
  {@render children?.()}
</div>
