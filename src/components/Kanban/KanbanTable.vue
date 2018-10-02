<template>
  <table class="datatable-wrapper">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column['name']">
          {{ column['name'] | capitalize }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="board in kanbanBoards" :key="board['name']" @click="editKanban" :boardname="board['name']">
        <td v-for="(column, key) in columns" :key="key">
          {{board[column['field']]}}
        </td>
        <td @click="showKanban($event,board.name)">Show Kanban</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import frappe from 'frappejs';

export default {
  name: 'KanbanTable',
  async created() {
    const kanbanBoards = await frappe.db.getAll({
      doctype: 'Kanban',
      fields: ['name', ...this.meta.keywordFields]
    });
    this.kanbanBoards = kanbanBoards;
    console.log(this.kanbanBoards);
    console.log(this.meta);
  },
  computed: {
    meta() {
      return frappe.getMeta('Kanban');
    }
  },
  data() {
    return {
      kanbanBoards: [],
      columns: [
        { name: 'name', field: 'kanbanname' },
        { name: 'reference doctype', field: 'referencedoctype' }
      ]
    };
  },
  filters: {
    capitalize: function(value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  methods: {
    editKanban(e) {
      const name = e.currentTarget.getAttribute('boardname');
      this.$router.push(`/Kanban/${name}`);
    },
    showKanban(e, name) {
      e.stopPropagation();
      console.log('name', name);
      this.$router.push(`/Kanban/view/${name}`);
    }
  }
};
</script>

<style scoped>
table {
  border: 2px solid #6c757d;
  border-radius: 3px;
  background-color: #fff;
  width: 80%;
  margin: 1rem auto;
  height: 100%;
}

th {
  background-color: #6c757d;
  color: rgba(255, 255, 255);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

tr:hover {
  cursor: pointer;
  border: 1px solid #6c757d;
}

td {
  background-color: #f9f9f9;
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;
}
</style>
