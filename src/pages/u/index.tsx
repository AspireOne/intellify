import PageHead from "../../components/PageHead";
import PageHeaderDiv from "../../components/PageHeaderDiv";
import PageTitle from "../../components/PageTitle";
import Subtitle from "../../components/Subtitle";
import React from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {trpc} from "../../lib/trpc";
import {notifications} from "@mantine/notifications";

export default function UrlShortener() {
    const [url, setUrl] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [shortenedUrls, setShortenedUrls] = React.useState<string[]>([]);

    const shortenerMutation = trpc.urlShortener.shortenUrl.useMutation({
        onSuccess: () => {
            notifications.show({
                title: 'Hotovo!',
                message: 'Odkaz zkrácen, bitch!',
                color: 'green',
            });

            setShortenedUrls([...shortenedUrls, slug]);
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
                    <div className={"mx-auto text-lg text-gray-300 flex flex-col gap-1"}>
                        {
                            shortenedUrls.map(slug => <a href={"https://intellify.cz/" + slug}>{"https://intellify.cz/" + slug}</a>)
                        }
                    </div>
                }
            </div>
        </div>
    )
}