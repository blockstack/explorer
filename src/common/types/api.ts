// this is here due to a limited type in the @stacks/stacks-blockchain-api-client library
export interface ApiResponseWithResultsOffset<Data> {
  limit: number;
  offset: number;
  total: number;
  results: Data[];
}
