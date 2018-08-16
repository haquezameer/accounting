<template v-if="doctype === 'todo'">
<div>
  <div class="kanban-list" v-for="list in Object.keys(lists)" :id="list" :key="list" v-on:dragover="$emit('dragging',$event)" v-on:drop="$emit('dropped',$event)">
    <div class="list-name">
      {{list}}
      <button @click="showModal=true">Add Todo</button>
    </div>
      <div v-for="(item,index) in lists[list]" :key="index">
        <div class="card-item" draggable="true" :subject="item.subject" v-on:dragstart="$emit('drag-start',$event)">
          <span class="card-title">{{item.subject}}</span>
        </div>
      </div>
  </div>
</div>
</template>

<script>
export default {
  name: "KanbanTodo",
  props: ["doctype", "lists"]
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.kanban-list {
  margin: 1rem 0;
  border-radius: 5px;
  min-height: 400px;
  min-width: 300px;
  background-color: #e8ebed;
  box-shadow: -1px 1px 16px -3px rgba(0, 0, 0, 0.75);
}
.list-name {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}
.card-item {
  background: #fff;
  margin: 0.5rem;
  padding: 1rem;
  border-radius: 5px;
}
.card-item:hover {
  box-shadow: -1px 10px 12px -7px rgba(0, 0, 0, 0.75);
}
.card-title {
  color: #2066d6;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
