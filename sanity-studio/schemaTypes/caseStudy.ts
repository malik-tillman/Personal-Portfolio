import {defineField, defineType} from 'sanity'

export const caseStudyType = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'The URL slug of the case study'
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
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
          {title: 'wide', value: '16/9'},
          {title: 'tall', value: '7/8'}
        ]
      },
      initialValue: '16/9',
      description: 'The aspect ratio of the hero image'
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
      description: 'Tags for the case study'
    }),
    defineField({
      name: 'role',
      type: 'string',
      title: 'Role',
      description: 'My role in the project'
    }),
    defineField({
      name: 'body',
      title: 'Body (Portable Text)',
      type: 'array',
      of: [
        {
          type: 'block'
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessiblity.',
            }
          ]
        }
      ],
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
      description: 'A short description of the case study'
    })
  ]
})
