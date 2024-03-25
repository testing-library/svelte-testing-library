<script>
  import { getContext } from 'svelte'

  const ctx = getContext('foo')
</script>

<div>{ctx.message}</div>
