<script>
  import { getContext } from 'svelte'

  let { label } = $props()

  const messages = getContext('messages')
</script>

<div role="status" aria-label={label}>
  {#each messages.current as message (message.id)}
    <p>{message.text}</p>
    <hr />
  {/each}
</div>
