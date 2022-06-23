import { gql, ApolloServer } from "apollo-server";

const persons = [
	{
		name: "Joe",
		phone: "111-111",
		street: "street 11",
		city: "city_1",
		id: "001",
	},
	{
		name: "John",
		phone: "222-222",
		street: "street 22",
		city: "city_2",
		id: "002",
	},
	{
		name: "Bob",
		phone: "333-333",
		street: "street 33",
		city: "city_3",
		id: "003",
	},
];

// data description / definition

const typeDefs = gql`
	type Address {
		street: String!
		city: String!
	}

	type Person {
		name: String!
		phone: String
		check: String!
		address: Address!
		id: ID!
	}

	type Query {
		personCount: Int!
		allPersons: [Person]!
		findPerson(name: String!): Person
	}
`;

// data source / resolvers

const resolvers = {
	Query: {
		personCount: () => persons.length,
		allPersons: () => persons,
		findPerson: (root, args) => {
			const { name } = args;
			return persons.find((person) => person.name == name);
		},
	},
	Person: {
		address: (root) => {
			return {
				street: root.street,
				city: root.city,
			};
		},

		check: () => "Hello check",
	},
};

// server

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
