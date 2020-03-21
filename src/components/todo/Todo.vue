<template>
  <li
    :class="{
      editing: state.matches('editing'),
      completed: state.context.completed
    }"
    :data-todo-state="state.context.completed ? 'completed' : 'active'"
  >
    <div class="view">
      <input
        class="toggle"
        type="checkbox"
        :checked="state.context.completed"
        @change="send('TOGGLE')"
      />
      <label @dblclick="send('EDIT')">
        {{ state.context.title }}
      </label>
      <button class="destroy" @click="() => send('DESTROY')" />
    </div>
    <input
      type="text"
      class="edit"
      v-model="state.context.title"
      @blur="send('UPDATE')"
      @keydown.enter="send('UPDATE')"
      @keydown.esc="send('CANCEL')"
      ref="inputRef"
    />
  </li>
</template>

<script>
import { watch, ref } from "@vue/composition-api";
import { useService } from "@xstate/vue";

export default {
  props: {
    todoRef: {
      type: Object,
      required: true
    }
  },
  setup({ todoRef }) {
    const { state, send } = useService(todoRef);

    const inputRef = ref(null);

    watch(
      () => state.value,
      state => {
        todoRef.execute(state, {
          focusInput() {
            inputRef.value.select();
          }
        });
      }
    );

    return {
      state,
      send,
      inputRef
    };
  }
};
</script>
