<template>
<div class="kanban-container">
    <!-- <form @submit.prevent="onSubmit">
      <select v-model="doctype" name="doctype" id="doctype">
        <option value="ToDo">Todo</option>
        <option value="Party">Party</option>
      </select>
      <select v-model="field" name="field">
        <option value="status">Status</option>
      </select>
      <input type="submit" />
      {{doctype}}
      {{field}}
    </form> -->
<kanban-board v-if="doctype==='ToDo'" :doctype="doctype" :lists="lists" @update="updateItem" @drag-start="dragstart" 
@dropped="drophandler" @dragging="dragover" />
</div>
</template>

<script>
import frappe from 'frappejs';
import KanbanBoard from './KanbanBoard.vue';
import Vue from 'vue';

export default {
  name: 'Kanban',
  components: {
    KanbanBoard
  },
  data: function() {
    return {
      lists: {},
      draggedItem: '',
      doctype: '',
      field: '',
      kanbanList: []
    };
  },
  computed: {
    meta() {
      return frappe.getMeta('ToDo');
    }
  },
  created() {
    this.updateKanbanList();
  },
  methods: {
    dragstart: function(e) {
      e.dataTransfer.effectAllowed = 'move';
      let attribute, draggedItemName;
      if (e.target.getAttribute('subject')) {
        draggedItemName = e.target.getAttribute('subject');
        console.log('draggedItemName: ', draggedItemName);
        attribute = 'subject';
      } else {
        if (e.target.getAttribute('name')) {
          draggedItemName = e.target.getAttribute('name');
          attribute = 'name';
        }
      }
      let draggedItem;
      var currentLists = this.lists,
        list;
      for (list in currentLists) {
        draggedItem = currentLists[list].find(
          item => item[attribute] === draggedItemName
        );
        if (typeof draggedItem !== 'undefined') {
          break;
        }
      }
      Object.keys(currentLists).map(list => {
        currentLists[list] = currentLists[list].filter(
          item => item[attribute] !== draggedItemName
        );
      });
      this.lists = Object.assign({}, currentLists);
      this.draggedItem = draggedItem;
    },
    drophandler: function(e) {
      const dropDestination = e.target.id;
      const draggedItem = this.draggedItem;
      this.lists[dropDestination].push(draggedItem);
      console.log(this.lists);
      this.updateItem(draggedItem, dropDestination);
    },
    dragover: function(e) {
      e.preventDefault();
    },
    async updateListsForTodos() {
      const all = await frappe.db.getAll({
        doctype: this.doctype,
        fields: ['name', ...this.meta.keywordFields, 'status']
      });
      const Open = all.filter(item => item.status === 'Open');
      const Closed = all.filter(item => item.status === 'Closed');
      this.lists = Object.assign({});
      this.lists.Open = Open;
      this.lists.Closed = Closed;
      console.log('this.lists: ', this.lists);
    },
    async updateListsForParty() {
      console.log('fetching party items');
      const all = await frappe.db.getAll({
        doctype: this.doctype,
        fields: ['name', 'customer', 'supplier']
      });
      console.log(all);
      const customer = all.filter(item => item.customer === 1);
      const supplier = all.filter(item => item.supplier === 1);
      console.log(customer, supplier);
      this.lists = Object.assign({});
      this.lists.customer = customer;
      this.lists.supplier = supplier;
      console.log(this.lists);
    },
    async updateItem(draggedItem, dropDestination) {
      const CLOSED = 'Closed',
        OPEN = 'Open',
        CUSTOMER = 'customer',
        SUPPLIER = 'supplier';
      switch (dropDestination) {
        case CLOSED:
        case OPEN:
          draggedItem = await frappe.getDoc('ToDo', draggedItem.name);
          draggedItem.status = dropDestination;
          break;
        case CUSTOMER:
        case SUPPLIER:
          draggedItem = await frappe.getDoc('Party', draggedItem.name);
          draggedItem[dropDestination] = 1;
          if (dropDestination === 'customer') draggedItem.supplier = null;
          else draggedItem.customer = null;
          break;
        default:
          console.log('nothing matched');
      }
      draggedItem.update();
    },
    onSubmit: function() {
      console.log(this.doctype, this.field);
      if (this.doctype === 'ToDo') this.updateListsForTodos();
      else if (this.doctype === 'Party') this.updateListsForParty();
    },
    async updateKanbanList() {
      const allKanbans = await frappe.db.getAll({ doctype: 'Kanban' });
      this.kanbanList = allKanbans;
      console.log(this.kanbanList);
    }
  }
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
.kanban-container {
  display: flex;
  margin: 0 auto;
  justify-content: space-around;
}
</style>
