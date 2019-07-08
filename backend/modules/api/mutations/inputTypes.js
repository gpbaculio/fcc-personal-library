import { GraphQLNonNull, GraphQLString, GraphQLInputObjectType } from 'graphql';

export const createBookInputType = new GraphQLInputObjectType({
  name: 'CreateBookParams',
  description: 'Input book payload',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
