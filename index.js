import { gql, ApolloServer, UserInputError } from "apollo-server";

import "./db.js";
import Person from "./models/person.js";

// data description / definition

const typeDefs = gql`
	enum YesNo {
		YES
		NO
	}

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
		allPersons(phone: YesNo): [Person]!
		findPerson(name: String!): Person
	}

	type Mutation {
		addPerson(
			name: String!
			phone: String
			street: String!
			city: String!
		): Person

		editNumber(name: String!, phone: String!): Person
	}
`;

// data source / resolvers

const resolvers = {
	Query: {
		personCount: () => Person.collection.countDocuments(),

		allPersons: async (root, args) => {
			if (!args.phone) return Person.find({});
			return Person.find({ phone: { $exists: args.phone === "YES" } });
		},
		findPerson: (root, args) => {
			const { name } = args;
			return Person.findOne({ name });
		},
	},

	Mutation: {
		addPerson: async (root, args) => {
			const person = new Person({ ...args });

			try {
				await person.save();
			} catch (error) {
				throw new UserInputError(error.message, { invalidArgs: args });
			}

			return person;
		},

		editNumber: async (root, args) => {
			const person = await Person.findOne({ name: args.name });

			if (!person) return;

			person.phone = args.phone;

			try {
				await person.save();
			} catch (error) {
				throw new UserInputError(error.message, { invalidArgs: args });
			}

			return person;
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
