/**
 * GQty: You can safely modify this file based on your needs.
 */

import { createReactClient } from '@gqty/react'
import {
  Cache,
  createClient,
  defaultResponseHandler,
  type QueryFetcher,
} from 'gqty'
import {
  generatedSchema,
  scalarsEnumsHash,
  type GeneratedSchema,
} from './schema.generated'

const queryFetcher: QueryFetcher = async function (
  { query, variables, operationName },
  fetchOptions,
) {
  // Modify "http://localhost:3000/graphql" if needed
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
    mode: 'cors',
    ...fetchOptions,
  })

  return await defaultResponseHandler(response)
}

const cache = new Cache(
  undefined,
  /**
   * Default option is immediate cache expiry but keep it for 5 minutes,
   * allowing soft refetches in background.
   */
  {
    maxAge: 0,
    staleWhileRevalidate: 5 * 60 * 1000,
    normalization: true,
  },
)

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
  },
})

// Core functions
export const { resolve, subscribe, schema } = client

// Legacy functions
export const {
  query,
  mutation,
  mutate,
  subscription,
  resolved,
  refetch,
  track,
} = client

export const {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    // Enable Suspense, you can override this option for each hook.
    suspense: true,
  },
})

export * from './schema.generated'
