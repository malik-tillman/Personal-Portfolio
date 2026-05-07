import {defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'about',
      type: 'text',
      title: 'About Me'
    }),
    defineField({
      name: 'email',
      type: 'string',
    }),
    defineField({
      name: 'successMedia',
      type: 'array',
      of: [{type: 'image'}, {type: 'file'}],
      title: 'Success Media'
    }),
    defineField({
      name: 'errorMedia',
      type: 'array',
      of: [{type: 'image'}, {type: 'file'}],
      title: 'Error Media'
    }),
    defineField({
        name: 'socialLinks',
        type: 'array',
        of: [
            {
                type: 'object',
                fields: [
                    {name: 'platform', type: 'string'},
                    {name: 'url', type: 'url'}
                ]
            }
        ]
    })
  ],
})
