import { GetServerSideProps, NextPage } from 'next';
import getConfig from 'next/config'
import NextLink from 'next/link';

import { Page, Text, Card, Badge, Spacer, ButtonGroup, Button, Divider } from '@geist-ui/core';
import { ITickers, ITickersQuery, referenceClient, } from '@polygon.io/client-js';

const { publicRuntimeConfig } = getConfig();
const polygonClient = referenceClient(publicRuntimeConfig.POLYGON_KEY);

enum MarketType {
  stocks = 'stocks',
  crypto = 'crypto',
  fx = 'fx'
}

// Server
export const getServerSideProps: GetServerSideProps<ITickers, { q?: string, market: ITickersQuery['market'], type: ITickersQuery['type'] }> = async ({ query }) => {
  // 1.
  const data = await polygonClient.tickers(query);
  return { props: data };
};


const Home: NextPage<ITickers> = ({ results }) => {
  return (
    <Page>
      <Text h1>Tickers</Text>

      <ButtonGroup mb={2}>
        {Object.keys(MarketType).map((type) => <NextLink key={type} href={`/?market=${type}`} passHref><a><Button >{type}</Button></a></NextLink>)}
      </ButtonGroup>

      <Divider mb={2} /> 

      {results.map(({ ticker, name, market, composite_figi, type }, k) => (
        <NextLink key={k + ticker} href={`/ticker/${ticker}`} passHref>
          <a>
            <Card shadow mb={2} width="100%">
              <Text h4 my={0}>{ticker}</Text>
              <Text my={0}>{name}</Text>
              <Card.Footer>
                {[market, type, composite_figi].map((feature,k) => (feature && <Badge key={k} type="secondary" mr={1}>{feature.toUpperCase()}</Badge>))}
              </Card.Footer>
            </Card>
          </a>
        </NextLink>
      ))}
    </Page >
  )
}

export default Home
