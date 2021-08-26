export default {
  type: 'array',
	items:{
		type: 'object',
		required: [
			'count',
			'description',
			'id',
			'price',
			'title'
		],
		properties: {
			count: { type: 'integer' },
			description: { type: 'string' },
			id: { type: 'string' },
			price: { type: 'number' },
			title: { type: 'string' }
		}
	}
} as const;
