<template>
  <li
    :class="{
      editing: state.matches('editing'),
      completed
    }"
    :data-todo-state="completed ? 'completed' : 'active'"
  >
    <div class="view">
      <input
        class="toggle"
        type="checkbox"
        @change="send('TOGGLE_COMPLETE')"
        :value="completed"
        :checked="completed"
      />
      <label @dblclick="send('EDIT')">
        {{ title }}
      </label>
      <button class="destroy" @click="() => send('DELETE')" />
    </div>
    <input
      class="edit"
      :value="title"
      @blur="send('BLUR')"
      @change="send('CHANGE', { value: $event.target.value })"
      @keypress.enter="send('COMMIT')"
      @keydown.esc="send('CANCEL')"
      ref="inputRef"
    />
  </li>
</template>

<script>
// import { watch, ref } from "@vue/composition-api";
import { useService } from "@xstate/vue";

export default {
  props: {
    todoRef: Object
  },
  setup({ todoRef }) {
    const { state, send } = useService(todoRef);
    const { id, title, completed } = state.value.context;
    // const inputRef = ref(null);

    // watch(() => {
    //   todoRef.execute(state, {
    //     focusInput() {
    //       inputRef.current && inputRef.current.select();
    //     }
    //   });
    // });

    return {
      state,
      send,
      id,
      title,
      completed
    };
  }
};
</script>
