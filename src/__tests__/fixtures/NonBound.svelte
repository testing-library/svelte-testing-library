<script>
  // The text content of the paragraph is purposely not bound
  // with any svelte variable. The purpose of this exercise
  // is to reduce to the simplest form my use-case which is
  // to test changes done in html elements of a svelte component
  // by external helper class methods, which do not allow for
  // bindings to exist.
  const modify = () => {
    const par = document.querySelector(".info");
    par.innerText = "Modified by click";
  };
</script>

<div>
  <p class="info" data-testid="info">Click to modify</p>
  <button on:click={modify} label="button">Modify</button>
</div>
