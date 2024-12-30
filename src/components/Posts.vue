<template>
  <VNotification ref="notify" />

  <v-container class="posts fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="1200">
      <v-row class="posts__progress-row">
        <v-progress-circular
          v-if="postStore.isLoading"
          class="ma-auto"
          indeterminate
        ></v-progress-circular>
      </v-row>

      <v-row>
        <v-text-field
          v-model="searchVal"
          type="text"
          placeholder="Enter posts's name to find one"
          @input="onInputSearch"
        />
      </v-row>

      <v-row>
        <v-virtual-scroll
          class="mr-3"
          :height="300"
          :items="postStore.filteredByName"
        >
          <template #default="{ item }">
            <div @click="onEdit(item)">
              <div
                v-if="!item.isEditing"
                class="posts__post d-flex align-center"
              >
                <span class="pa-4">{{ item.id }}</span>

                <span class="pa-4 pl-6">{{ item.name }}</span>

                <v-btn
                  class="mx-2"
                  icon="mdi-delete-circle-outline"
                  @click.stop="onRemove(item.id)"
                />
              </div>
              <div
                v-else
                ref="editPost"
                class="posts__post d-flex align-center"
              >
                <span class="pa-4">{{ item.id }}</span>
                <v-text-field
                  v-model="item.name"
                  hide-details="auto"
                  class="posts__post-input mx-2"
                  type="text"
                />

                <v-btn
                  class="mx-2"
                  icon="mdi-check-circle-outline"
                  @click.stop="onSave(item)"
                />

                <v-btn
                  class="mx-2"
                  icon="mdi-arrow-left-circle"
                  @click.stop="onRollback()"
                />
              </div>
            </div>
          </template>
        </v-virtual-scroll>
      </v-row>

      <v-row class="align-center">
        <v-col cols="8">
          <v-text-field
            v-model="newPost.name"
            type="text"
            hide-details="auto"
            placeholder="Enter posts's name to add one"
            @input="onInputSearch"
          />
        </v-col>

        <v-col cols="2">
          <v-btn @click="onAdd()">Add post</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn @click="onReload()">Reload Posts from Json</v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import { ref } from "vue";
import VNotification from "@/components/base/VNotification.vue";
import { usePostStore } from "@/stores/PostStore";

import type { IPost } from "@/types/IPost";
import type { INotify } from "@/types/INotify";

export default defineComponent({
  components: {
    VNotification,
  },

  setup() {
    const postStore = usePostStore();
    const searchVal = ref<string>("");

    const newPost = ref<IPost>({ id: "", name: "" });
    const editingPost = ref<IPost>();

    const notify = ref<InstanceType<typeof VNotification> | any>(null);
    const editPost = ref<HTMLDivElement>();

    const onAdd = () => {
      if (!newPost.value?.name) {
        return notify.value.show("Enter post's name, please");
      }

      postStore
        .add(newPost.value.name)
        .then((response: INotify) => notify.value.show(response));
    };

    const onRemove = async (id: string) => {
      await postStore
        .remove(id)
        .then((response: INotify) => notify.value.show(response));
    };

    const onInputSearch = () => {
      postStore.setId(searchVal.value);
    };

    const onReload = async () => {
      await postStore.fetchData(true);
      postStore.name = "";
    };

    const onEdit = (post: IPost) => {
      postStore.toggleEdit(post);
      editingPost.value = { ...post };

      setTimeout(() => {
        if (editPost.value) {
          editPost.value.querySelector(".posts__post-input input").focus();
          editPost.value.classList.add("post--active");
        }
      }, 100);
    };

    const onSave = async (post: IPost) => {
      await postStore
        .update(post)
        .then((response: INotify) => notify.value.show(response));
      postStore.toggleEdit(post);
    };

    const onRollback = () => {
      if (!editingPost.value) {
        return notify.value.show();
      }
      postStore.rollback(editingPost.value);
    };

    onMounted(async () => {
      await postStore.fetchData();

      console.log("data", postStore.posts);
    });

    return {
      postStore,
      newPost,
      searchVal,
      onInputSearch,
      onRemove,
      onAdd,
      onEdit,
      onSave,
      onRollback,
      onReload,
      notify,
      editPost,
    };
  },
});
</script>

<style scoped>
.posts__progress-row {
  height: 60px;
}
.posts__post:hover {
  background-color: #4169e1;
}

.post--active {
  background-color: blue;
}
</style>
