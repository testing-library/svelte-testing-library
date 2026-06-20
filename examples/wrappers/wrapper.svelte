<script>
  import { setContext } from 'svelte'

  let { messages, children } = $props()

  setContext('messages', {
    get current() {
      return messages
    },
  })
</script>

{@render children?.()}
