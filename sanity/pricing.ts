// schemas/pricing.js
export default {
    name: 'pricing',
    title: 'Pricing',
    type: 'document',
    fields: [
      {
        name: 'level',
        title: 'Level',
        type: 'string',
        description: 'Title of the course',
      },
      {
        name: 'fullPrice',
        title: 'Full Price',
        type: 'string',
        description: 'The full price of the product (include currency)',
      },
      {
        name: 'earlyBirdPrice',
        title: 'Early Bird Price',
        type: 'string',
        description: 'Price shown when the early bird tab is clicked',
      },
      {
        name: 'earlyBirdDeadline',
        title: 'Early Bird Deadline',
        type: 'date',
        description: 'Last date for the early bird purchase deadline',
      },
      {
        name: 'threePayments',
        title: 'Three Payments',
        type: 'string',
        description: 'Price shown when the 3 Payments tab is clicked',
      },
      {
        name: 'fourPayments',
        title: 'Four Payments',
        type: 'string',
        description: 'Price shown when the 4 Payments tab is clicked',
      },
      {
        name: 'horarium',
        title: 'Horarium',
        type: 'string',
        description: 'Indicating hours of study',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'string',
        description: 'Description of the course',
      },
    ],
  };