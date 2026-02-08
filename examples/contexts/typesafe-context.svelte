<script lang="ts">
  import { getMessagesContext } from './typesafe-context.js'

  let { label } = $props()

  const messages = getMessagesContext()
</script>

<div role="status" aria-label={label}>
  {#each messages.current as message (message.id)}
    <p>{message.text}</p>
    <hr />
  {/each}
</div>
