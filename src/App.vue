<template>
  <div>
    <Toggle />
    <Todos />
  </div>
</template>

<script>
import Todos from "@/components/todos/Todos";
import Toggle from "@/components/toggle/Toggle";

export default {
  name: "App",
  components: {
    Todos,
    Toggle
  }
};
</script>

<style></style>
