<script lang="ts">
  const { name, count }: { name: string; count: number } = $props()

  export const hello = 'hello'
</script>

<h1>hello {name}</h1>
<p>count: {count}</p>
