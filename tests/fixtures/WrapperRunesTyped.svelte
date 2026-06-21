<script lang="ts">
  import { setContext, type Snippet } from 'svelte'

  const { greeting, children } = $props<{
    greeting: string
    children: Snippet
  }>()

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
