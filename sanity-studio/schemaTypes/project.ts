import {defineField, defineType} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          {title: 'wide', value: 'wide'},
          {title: 'tall', value: 'tall'}
        ]
      },
      initialValue: 'wide',
      description: 'The aspect ratio of the hero image'
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      of: [{type: 'image'}],
      title: 'Project Gallery'
    }),
    defineField({
      name: 'videos',
      type: 'array',
      of: [{type: 'file'}],
      title: 'Project Videos'
    }),
    defineField({
      name: 'tags',
      type: 'string',
    }),
    defineField({
      name: 'tagsV2',
      type: 'array',
      title: 'Tags v2',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'role',
      type: 'string',
      title: 'Role',
      description: 'My role in the project'
    }),
    defineField({
      name: 'year',
      type: 'string',
      title: 'Project Year/Date',
      description: 'The year or date range of the project (e.g. 2024 or 2023 - 2024)'
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
        name: 'website',
        type: 'url',
        title: 'Website URL'
    }),
  ],
})
