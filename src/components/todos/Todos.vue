<template>
  <section class="todoapp" :data-state="state.toStrings()">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        @keypress.enter="send('NEWTODO.COMMIT', { value: $event.target.value })"
        @change="send('NEWTODO.CHANGE', { value: $event.target.value })"
        :value="state.context.todo"
      />
    </header>
    <section class="main">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        :checked="allCompleted"
        @change="send(markEvent)"
      />
      <label for="toggle-all" :title="`Mark all as ${mark}`">
        Mark all as {{ mark }}
      </label>

      <ul class="todo-list">
        <Todo
          :key="todo.id"
          :todoRef="todo.ref"
          :random="Math.random()"
          v-for="todo in filteredTodos"
        />
      </ul>
    </section>
    <footer class="footer">
      <span class="todo-count">
        <strong>{{ numActiveTodos }}</strong> item
        {{ numActiveTodos === 1 ? "" : "s" }} left
      </span>
      <ul class="filters">
        <li>
          <a
            :class="{
              selected: state.matches('all')
            }"
            href="#/"
          >
            All
          </a>
        </li>
        <li>
          <a
            :class="{
              selected: state.matches('active')
            }"
            href="#/active"
          >
            Active
          </a>
        </li>
        <li>
          <a
            :class="{
              selected: state.matches('completed')
            }"
            href="#/completed"
          >
            Completed
          </a>
        </li>
      </ul>

      <button
        v-if="numActiveTodos < state.context.todos.length"
        @click="send('CLEAR_COMPLETED')"
        class="clear-completed"
      >
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
import Todo from "@/components/todo/Todo";
import { useHashChange } from "@/use/useHashChange";
import { useMachine } from "@xstate/vue";
import { persistedTodosMachine } from "./persistedTodoMachine";
import { computed } from "@vue/composition-api";

function filterTodos(state, todos) {
  if (state.value.matches("active")) {
    return todos.filter(todo => !todo.completed);
  }

  if (state.value.matches("completed")) {
    return todos.filter(todo => todo.completed);
  }

  return todos;
}

export default {
  components: {
    Todo
  },
  setup() {
    const { state, send } = useMachine(persistedTodosMachine);

    useHashChange(() => send(`SHOW.${window.location.hash.slice(2) || "all"}`));

    const numActiveTodos = computed(
      () => state.value.context.todos.filter(todo => !todo.completed).length
    );

    const allCompleted = computed(
      () => state.value.context.todos.length > 0 && numActiveTodos.value === 0
    );

    const mark = computed(() => (!allCompleted.value ? "completed" : "active"));

    const markEvent = computed(() => `MARK.${mark.value}`);

    const filteredTodos = computed(() =>
      filterTodos(state, state.value.context.todos)
    );

    return {
      state,
      send,
      numActiveTodos,
      allCompleted,
      filteredTodos,
      markEvent,
      mark
    };
  }
};
</script>
