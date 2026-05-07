import {defineField, defineType} from 'sanity'

export const quoteType = defineType({
  name: 'quote',
  title: 'Quote',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      type: 'text',
      title: 'Quote Text'
    }),
    defineField({
      name: 'author',
      type: 'string',
      title: 'Author'
    }),
  ],
})
