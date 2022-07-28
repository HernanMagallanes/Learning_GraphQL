import { gql, UserInputError, ApolloServer } from "apollo-server";

// import axios from "axios";
// import { v1 as uuid } from "uuid";

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
		// persons.length,

		allPersons: async (root, args) => {
			// if (!args.phone) return persons;

			// const byPhone = (person) =>
			// 	args.phone === "YES" ? person.phone : !person.phone;

			// return persons.filter(byPhone);

			// ToDo phone filter
			if (!args.phone) return Person.find({});
			return Person.find({ phone: { $exists: args.phone === "YES" } });

			// return Person.find({});
		},
		findPerson: (root, args) => {
			const { name } = args;
			return Person.findOne({ name });
			// persons.find((person) => person.name == name);
		},
	},

	Mutation: {
		addPerson: (root, args) => {
			const person = new Person({ ...args });
			return person.save();
			// if (persons.find((p) => p.name === args.name)) {
			// 	throw new UserInputError("Name must be unique", {
			// 		invalidArgs: args.name,
			// 	});
			// }

			// const person = { ...args, id: uuid() };

			// // update DB
			// persons.push(person);

			// return person;
		},
		editNumber: async (root, args) => {
			// const personIndex = persons.findIndex((p) => p.name === args.name);

			// if (personIndex === -1) {
			// 	return null;
			// }

			// const person = persons[personIndex];

			// const updatePerson = { ...person, phone: args.phone };
			// persons[personIndex] = updatePerson;

			// return updatePerson;

			const person = await Person.findOne({ name: args.name });
			person.phone = args.phone;
			return person.save();
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
