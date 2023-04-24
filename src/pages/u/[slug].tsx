import { useRouter } from 'next/router'
import {GetServerSidePropsContext, InferGetStaticPropsType} from "next";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import {appRouter} from "../../server/routers/_app";
import {createContext} from "../../server/context";



/*export async function getServerSideProps(
    context: GetServerSidePropsContext<{}>,
) {
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: await createContext(),
    });
    await ssg.offers.getOffers.prefetch();
    // Make sure to return { props: { trpcState: ssg.dehydrate() } }
    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
        /!*revalidate: 1,*!/
    };
}*/

export async function getServerSideProps(
    context: GetServerSidePropsContext<{}>,
) {
    const {slug} = context.query;
    if (!slug) return {props: {}}

    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: await createContext(),
    });
    const url = await ssg.urlShortener.getUrl.fetch({slug: slug as string});
    if (!url) return {props: {}};

    return {
        redirect: {
            destination: url,
            permanent: false,
        }
    }

    /*const { res } = context;
        res.writeHead(301, { location: '/hello' });
        res.end();
        return {props: {},}*/
}

export default function UrlShortener(props: InferGetStaticPropsType<typeof getServerSideProps>) {
    return (
        <div>
            Přepojování...
        </div>
    )
}