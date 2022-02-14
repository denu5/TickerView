import { GetServerSideProps, NextPage } from 'next';
import getConfig from 'next/config'
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Page, Text, Card, Link, Tabs, Breadcrumbs } from '@geist-ui/core';
import { ITickerDetails, referenceClient } from '@polygon.io/client-js';
import { FundamentalData } from "react-ts-tradingview-widgets";

const { publicRuntimeConfig } = getConfig();
const polygonClient = referenceClient(publicRuntimeConfig.POLYGON_KEY);

// Server
export const getServerSideProps: GetServerSideProps<ITickerDetails, { id: string }> = async (context) => {
    // 1.
    const data = await polygonClient.tickerDetails(context.params?.id!);
    return { props: data };
};

// Client Browser
const TickerDetailsPage: NextPage<ITickerDetails> = ({ results: ticker }) => {
    const { query } = useRouter();

    // 2.
    const { data } = useQuery(['ticker-news', query.id], () => polygonClient.tickerNews({ ticker: query.id as string }))

    return (
        <Page>
            <Breadcrumbs my={2}>
                <NextLink href="/">
                    <Breadcrumbs.Item nextLink>Home</Breadcrumbs.Item>
                </NextLink>
                {ticker?.market &&
                    <NextLink href={`/?market=${ticker?.market}`}>
                        <Breadcrumbs.Item nextLink>{ticker?.market?.toUpperCase()}</Breadcrumbs.Item>
                    </NextLink>
                }
                {ticker?.type &&
                    <NextLink href={`/?type=${ticker?.type}`}>
                        <Breadcrumbs.Item nextLink>{ticker?.type?.toUpperCase()}</Breadcrumbs.Item>
                    </NextLink>
                }
                <Breadcrumbs.Item>{ticker?.name}</Breadcrumbs.Item>
            </Breadcrumbs>

            <Card my={2}>
                <Text h1>{ticker?.ticker}</Text>
                <Text h3>{ticker?.name}</Text>
            </Card>

            <Tabs initialValue="1">

                {/* 1. Data from serverside requests */}
                <Tabs.Item value="1" label="Description" >
                    <Text>{ticker?.description}</Text>
                </Tabs.Item>


                {/* 2. Data from clientside requests using react-query */}
                <Tabs.Item value="2" label="News">

                    {data?.results.map((news) =>
                        <Card width="100%" shadow mb={2} key={news.id}>
                            <Text h4 my={0}>{news.title}</Text>
                            <Text>{news.description}</Text>
                            <Card.Footer>
                                <Link target="_blank" href={news.article_url}>Open Link</Link>
                            </Card.Footer>
                        </Card>
                    )}

                </Tabs.Item>

                {/* 3. External component */}
                <Tabs.Item value="3" label="Fundamental Data">
                    <FundamentalData displayMode='compact' symbol={query.id as string} height={500} width="100%" />
                </Tabs.Item>
            </Tabs>
        </Page>
    )
}

export default TickerDetailsPage;
