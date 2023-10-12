<script lang="ts">

  import InfoPanel from '$lib/infoPanel.svelte';
  import MessageLayout from '$lib/messageLayout.svelte';
  import MenuBtn from '$lib/components/svg/menuBtn.svelte';
  import { AppBar, AppShell, Drawer, getDrawerStore, type DrawerSettings, Toast } from '@skeletonlabs/skeleton';

  const drawerSettings: DrawerSettings = {
    id: 'sidebar',
    bgDrawer: 'bg-surface-600 text-white',
    bgBackdrop: 'bg-gradient-to-tr from-indigo-500/50 via-purple-500/50 to-pink-500/50',
    width: 'w-[280px] md:w-[480px]',
    padding: 'p-4',
    rounded: 'rounded-xl',
  }
  const drawerStore = getDrawerStore();


  function drawerOpen(): void {
    drawerStore.open(drawerSettings);
  }
</script>

<!-- <div class="page-container h-screen w-screen grid sm:grid-cols-2 sm:grid-rows-1 grid-rows-2 gap-3">
  <div class="info-container bg-surface-600">
    <InfoPanel />
  </div>
  <div class="message-container flex flex-col justify-end pb-10">
    <MessageLayout />
  </div>
</div> -->


<Drawer class="drawer overflow-y-hidden">
  <InfoPanel />
</Drawer>

<Toast />

<AppShell slotSidebarLeft="bg-surface-600 w-0 lg:w-1/3 overflow-y-hidden">
  <svelte:fragment slot="header">
    <AppBar class="lg:hidden">
      <div class="flex items-center">
        <button class="btn btn-sm mr-4" on:click={drawerOpen}>
          <span>
            <MenuBtn />        
          </span>
        </button>
        <strong class="text-xl uppercase">Chatbot</strong>
      </div>
    </AppBar>
  </svelte:fragment>
  <svelte:fragment slot="sidebarLeft">
    <InfoPanel />
  </svelte:fragment>
  <div class="message-container">
    <MessageLayout />
  </div>
</AppShell>

