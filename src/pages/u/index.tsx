import PageHead from "../../components/PageHead";
import PageHeaderDiv from "../../components/PageHeaderDiv";
import PageTitle from "../../components/PageTitle";
import Subtitle from "../../components/Subtitle";
import React from "react";
import Input from "../../components/Input";
import Button, {Style} from "../../components/Button";
import {trpc} from "../../lib/trpc";
import {notifications} from "@mantine/notifications";

const lsKey = "intellify.shortened-urls";

export default function UrlShortener() {
    const [url, setUrl] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [shortenedUrls, setShortenedUrls] = React.useState<string[]>([]);
    const [copied, setCopied] = React.useState(false);

    function setCopiedTrue() {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    React.useEffect(() => {
        const ls = localStorage.getItem(lsKey);
        if (ls) setShortenedUrls(JSON.parse(ls));
    }, []);

    const shortenerMutation = trpc.urlShortener.shortenUrl.useMutation({
        onSuccess: () => {
            notifications.show({
                title: 'Hotovo!',
                message: 'Odkaz zkrácen, bitch!',
                color: 'green',
            });

            setShortenedUrls([...shortenedUrls, slug]);
            // save shortenedUrls array to localstorage.
            localStorage.setItem(lsKey, JSON.stringify([...shortenedUrls, slug]));
            setUrl("");
            setSlug("");
        },
        onError: (e) => {
            notifications.show({
                title: 'Ajaj',
                message: 'Někde se stala chyba. ' + e.message,
                color: 'red',
            });
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    function handleSubmit() {
        shortenerMutation.mutate({slug: slug, url: url});
    }

    function getFormattedLinkText(slug: string) {
        let text = "u.intellify.cz/" + slug;
        text = text.length > 35 ? text.substring(0, 30) + "..." : text;
        return text;
    }

    return (
        <div className={"max-w-4xl mx-auto"}>
            <PageHead title={"URL Shortener"}
                      description="Zkraťte své odkazy."/>

            <PageHeaderDiv>
                <PageTitle>
                    URL Shortener
                </PageTitle>
                <Subtitle className="sm:text-xl">
                    Shorten yo URLs my dude. Filler text so that the text is longer and looks better aesthetics-wise.
                </Subtitle>
            </PageHeaderDiv>

            <div className={"max-w-xl mx-auto"}>
                <div className={"flex flex-col gap-4 mb-4"}>
                    <Input value={url} loading={loading} onChange={setUrl} placeholder={"Place yo URL"}/>
                    <div className={"flex flex-row gap-4"}>
                        <Input value={slug} loading={loading} onChange={setSlug} placeholder={"Slug"}/>
                        <Button className={"min-w-max"} loading={loading} onClick={handleSubmit}>Submit it yo</Button>
                    </div>
                </div>

                {
                    shortenedUrls.length > 0 &&
                    <div className={"mx-auto text-lg text-gray-300 flex flex-col gap-2"}>
                        {
                            shortenedUrls.map(slug => (
                                <div className={"justify-between flex flex-row gap-2 rounded-lg border-2 p-2 border-indigo-600"}>
                                    <Button style={Style.OUTLINE} className={"border-none py-1 px-3 max-w-full overflow-ellipsis"}
                                            onClick={() => {
                                                window.location.href = "https://intellify.cz/u/" + slug;
                                            }}
                                    >
                                        {getFormattedLinkText(slug)}
                                    </Button>
                                    <Button style={Style.OUTLINE} className={"border-none py-1 px-3 text-sm"}
                                            onClick={() => {
                                                navigator.clipboard.writeText("https://intellify.cz/u/" + slug);
                                                setCopiedTrue();
                                            }}
                                    >
                                        {copied ? "Zkopírováno!" : "Kopírovat"}
                                    </Button>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}