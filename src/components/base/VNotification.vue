<template>
  <div class="notification-container">
    <v-slide-y-transition group>
      <v-alert
        v-for="notification in notifications"
        :key="notification[0]"
        :color="color"
        theme="dark"
      >
        {{ notification[1] }}
      </v-alert>
    </v-slide-y-transition>
  </div>
</template>

<script lang="ts">
import type { INotify } from "@/types/INotify";

export default defineComponent({
  setup() {
    const notifications = ref<Map<string, string>>(new Map());
    const color = ref<string>("");

    const show = (response: INotify | string) => {
      const id = self.crypto.randomUUID();

      notifications.value.set(id, getMsg(response));
      setTimeout(() => remove(id), 3000);
    };

    const getMsg = (response: INotify | string) => {
      if (typeof response === "string") {
        return response;
      }

      const { status, msg } = response;
      if (status === 1) {
        color.value = "success";
        return msg;
      } else {
        color.value = "error";
        return "ERROR: " + msg;
      }
    };

    const remove = (id: string) => {
      notifications.value.delete(id);
    };

    return {
      notifications,
      color,
      show,
      remove,
    };
  },
});
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 10px;
  right: 10px;
  display: grid;
  grid-gap: 0.5em;
  z-index: 99;
}
</style>
