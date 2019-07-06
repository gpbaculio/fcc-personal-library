import { GraphQLNonNull, GraphQLString, GraphQLInputObjectType } from 'graphql';

export const createBookInputType = new GraphQLInputObjectType({
  name: 'CreateBookInputs',
  description: 'Input book payload',
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});