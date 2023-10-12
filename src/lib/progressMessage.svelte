<script lang="ts">
  import { ProgressBar } from "@skeletonlabs/skeleton";

  export let message: string = '';

</script>

<div class="progress-message flex flex-col gap-2">
  <p class="loading-text text-primary-300">{message}</p>
  <ProgressBar label="progress" value={undefined} meter="bg-primary-500" track="bg-primary-500/30"></ProgressBar>
</div>