import migrate from 'mongo-to-postgres';

migrate({
  // Define connection strings
  connections: {
    mongo: 'mongodb+srv://Mhmd:Mhmd123@cluster0.8xdx0.mongodb.net/dev-articles',
    postgres: 'postgres://postgres:mysecretpassword@localhost:5433/dev-articles'
  },
  // Define your database migration settings
  collections: [
    {
    collectionName: 'users',  // collection name in Mongo
    tableName: 'users',      // table name in Postgres
    fieldsRename: [
      ['createdAt', 'created_at'], // set new name for field (optional)
    ],
    fieldsRedefine: [
      ['dep_type', 1]              // force to set value for all records (optional)
    ]
  },
  {
		collectionName: 'categories',       // collection name in Mongo
    tableName: 'categories',           // table name in Postgres
		foreignKeys: {
      userId: 'categories',    // foreign keys (field: collection) (optional)
    },
  },
  {
		collectionName: 'topics',    // collection name in Mongo
    tableName: 'topics',        // table name in Postgres
    foreignKeys: {
      userId: 'users',    // foreign keys (field: collection) (optional)
      categoryId: 'categories',    // foreign keys (field: collection) (optional)
    },
    links: {                       // "many-to-many" links
      awards: ['emplyees__awards', 'employee_id', 'award_id']
    }
  },
	{
	collectionName: 'articleposts',  // collection name in Mongo
	tableName: 'articles',      // table name in Postgres
	fieldsRename: [
		['created', 'created_at'], // set new name for field (optional)
	],
	fieldsRedefine: [
		['dep_type', 1]              // force to set value for all records (optional)
	],
	foreignKeys: {
		topicId: 'topics',    // foreign keys (field: collection) (optional)
		autherId: 'users',    // foreign keys (field: collection) (optional)
	},
},
  ]
});