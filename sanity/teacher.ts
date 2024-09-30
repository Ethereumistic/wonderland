// studio/schemas/teacher.ts
import { Rule } from 'sanity';

export default {
  name: 'teacher',
  title: 'Teacher',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Profile Picture',
      type: 'image',
      options: {
        hotspot: true, // Enables the user to crop the image
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: Rule) => Rule.required(), // Removed min and max
    },
    {
        name: 'experience',
        title: 'Experience',
        type: 'array', // Changed to an array
        of: [{ type: 'string' }], // Specifies that the array contains strings
      },
  ],
};