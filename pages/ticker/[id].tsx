import { GetServerSideProps, NextPage } from 'next';
import getConfig from 'next/config'
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import { Page, Text, Card, Link, Tabs } from '@geist-ui/core';
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
            <Text h1>{ticker?.name} {ticker?.currency_name}</Text>
            
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
