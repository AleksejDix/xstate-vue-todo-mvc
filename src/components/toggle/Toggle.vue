<template>
  <input type="checkbox" data-test="testinput" @change="send('TOGGLE')" />
</template>

<script>
import { useMachine } from "@xstate/vue";
import toggleMachine from "@/components/toggle/toggleMachine.js";
export default {
  setup() {
    const { state, send } = useMachine(toggleMachine);
    return { state, send };
  }
};
</script>

<style></style>
