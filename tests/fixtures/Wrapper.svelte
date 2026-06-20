<script>
  import { setContext } from 'svelte'

  export let greeting

  export const wrapperContext = {
    get greeting() {
      return greeting
    },
  }

  setContext('wrapperContext', wrapperContext)
</script>

<div data-testid="wrapper"><slot /></div>
