module.exports = {
  name: 'Kanban',
  doctype: 'DocType',
  naming: 'autoincrement',
  isSingle: 0,
  isChild: 0,
  "keywordFields": [],
  "fields": [
    {
      "fieldname": "kanbanName",
      "label": "Kanban Name",
      "fieldtype": "Data",
      "required": 1
    },
    {
      "fieldname": "referencedoctype",
      "label": "Reference Doctype",
      "fieldtype": "Select",
      "options": ["ToDo"],
      "default": "ToDo",
      "required": 1
    }
  ],
  layout: [
    {
      columns: [
        {
          fields: ["kanbanName","referencedoctype"]
        }
      ]
    }
  ]
};
