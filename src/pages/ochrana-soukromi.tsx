import React, {useEffect, useState} from "react";
import {NextPage} from "next";
import {ArticleDiv, ArticlePCard, ArticlePTitle} from "../components/article";
import PageTitle from "../components/PageTitle";
import PageHeaderDiv from "../components/PageHeaderDiv";
import PageHead from "../components/PageHead";

const PrivacyPolicy: NextPage = () =>  {
    const [hostname, setHostname] = useState("www.      .cz");
    useEffect(() => {
        if (typeof window !== "undefined") {
            setHostname(window.location.hostname);
        }
    }, [typeof window]);

    return (
        <ArticleDiv>
            <PageHead title={"Zásady ochrany soukromí"} description={"Zásady ochrany soukromí pro Intellify."} />
            <PageHeaderDiv>
                <PageTitle>Zásady ochrany soukromí</PageTitle>
            </PageHeaderDiv>

            <ArticlePCard>
                <ArticlePTitle>Zásady ochrany osobních údajů webu {hostname}</ArticlePTitle>

                <p>
                    Správa webu {hostname} se zavazuje dodržovat zásady ochrany Vašich osobních údajů na Internetu.
                    Klademe velký důraz na ochranu poskytovaných údajů. Naše zásady ochrany osobních údajů jsou založeny na
                    ustanoveních Všeobecných předpisů pro ochranu osobních údajů Evropské unie (GDPR). Účely, pro které
                    shromažďujeme osobní údaje, jsou tyto: zlepšení našich služeb, komunikace s návštěvníky tohoto webu,
                    poskytování služeb, souvisejících se zaměřením činnosti předmětné webové stránky, a také pro následující
                    úkony.
                </p>

                <ArticlePTitle>Shromažďování a používání osobních údajů</ArticlePTitle>

                <p>
                    Osobní údaje shromažďujeme a používáme pouze v případě vašeho dobrovolného souhlasu. Pokud s tím budete
                    souhlasit, povolujete nám shromažďovat a používat následující údaje: jméno a příjmení, e-mail, osobní
                    fotografie. Shromažďování a zpracování Vašich údajů probíhá v souladu s právními předpisy, platnými na
                    území Evropské unie a státu Česká Republika.
                </p>

                <ArticlePTitle>Ukládání, úprava a mazání dat</ArticlePTitle>

                <p>
                    Uživatel, který poskytl své osobní údaje webovým stránkám {hostname}, má oprávnění nadále je
                    upravovat i mazat, stejně jako odvolat svůj souhlas s jejich použitím. Doba, po kterou budou Vaše osobní
                    údaje uloženy: čas potřebný k využití údajů pro hlavní činnost webu. V případě ukončení používání Vašich
                    údajů je správa webu odstraní. Pro přístup k Vašim osobním údajům můžete kontaktovat správu webu na adrese:
                    info@intellify.cz. Vaše osobní údaje můžeme poskytnout třetím stranám pouze s Vaším dobrovolným
                    souhlasem, pokud však už byly převedeny, pak tyto údaje nemůžeme měnit, jsou-li už uvedené u jiných
                    organizací, které s námi nesouvisejí.
                </p>

                <ArticlePTitle>Využití technických údajů při návštěvě webu</ArticlePTitle>

                <p>
                    Když navštívíte web {hostname}, budou v databázi uloženy záznamy o Vaší IP adrese, čase návštěvy,
                    nastavení prohlížeče, operačním systému a dalších technických informacích, potřebných pro správné zobrazení
                    obsahu webu. Podle těchto údajů však identifikovat totožnost návštěvníka nemůžeme.
                </p>

                <ArticlePTitle>Poskytování informací dětmi</ArticlePTitle>

                <p>
                    Pokud jste rodičem, nebo opatrovníkem a zjistili jste, že Vaše děti nám poskytly své osobní údaje bez Vašeho
                    souhlasu, kontaktujte nás: info@intellify.cz. Naše služba zakazuje ukládat osobní údaje nezletilých bez
                    souhlasu rodičů nebo opatrovníků.
                </p>

                <ArticlePTitle>Využívání souborů cookies</ArticlePTitle>

                <p>
                    Pro správné zobrazení obsahu a pro usnadnění používání stránek {hostname} využíváme soubory cookies.
                    Jedná se o malé soubory, uložené ve Vašem zařízení. Tyto soubory pomáhají webu zapamatovat si informace o
                    Vás, například v jakém jazyce prohlížíte stránky a jaké stránky jste již navštívili, což jsou informace,
                    které budou pro Vaši příští návštěvu užitečné. Díky souborům cookies bude pro Vás prohlížení webu mnohem
                    pohodlnější. Více si o těchto souborech můžete přečíst zde. Prohlížeč můžete nastavit tak, aby přijímal,
                    nebo blokoval soubory cookie v prohlížeči samostatně. Nemožnost přijímat soubory cookie však může omezit
                    výkonnost webu.
                </p>

                <ArticlePTitle>Využití osobních údajů jinými službami</ArticlePTitle>

                <p>
                    Tato stránka používá internetové služby třetích stran, které sbírají informace nezávisle na nás: Google
                    Analytics.

                    Shromažďovaná data mohou být sdílena s dalšími službami uvnitř těchto organizací a mohou být použity při
                    personalizaci reklam v jejich vlastní reklamní síti. Uživatelské dohody těchto organizací si můžete přečíst
                    na jejich webových stránkách. Tam můžete také odmítnout shromažďování vašich osobních údajů, například zde
                    najdete blokátor služby Google Analytics.Osobní údaje nepředáváme jiným organizacím a službám, které nejsou
                    uvedeny v těchto zásadách ochrany osobních údajů. Jedinou výjimkou je předávání informací podle zákonných
                    požadavků státních orgánů, oprávněných k provádění takových úkonů.
                </p>

                <ArticlePTitle>Odkazy na jiné stránky</ArticlePTitle>

                <p>
                    Naše stránky {hostname} mohou obsahovat odkazy na jiné weby, které nejsou námi provozovány. Za jejich
                    obsah neneseme zodpovědnost. Doporučujeme, abyste si přečetli zásady ochrany osobních údajů na těch
                    stránkách, které jste navštívili, pokud jsou tam uvedeny.
                </p>

                <ArticlePTitle>Změny zásad ochrany osobních údajů</ArticlePTitle>

                <p>
                    Naše stránky {hostname} mohou občas aktualizovat své zásady ochrany osobních údajů. Všechny změny
                    oznamujeme formou zveřejňování nových zásad ochrany osobních údajů na této stránce. Sledujeme změny v
                    legislativě, týkající se ochrany osobních údajů v Evropské unii a ve státě Česká Republika. Pokud jste nám
                    svěřili své osobní údaje, upozorníme Vás na případnou změnu zásad ochrany osobních údajů. Pokud byly Vaše
                    kontaktní údaje zadány nesprávně, pak Vás kontaktovat nemůžeme.
                </p>

                <ArticlePTitle>Zpětná vazba, závěrečná ustanovení</ArticlePTitle>

                <p>
                    Máte-li jakékoliv dotazy, související se zásadami ochrany osobních údajů, kontaktujte správce webu
                    {hostname}, přes: info@intellify.cz, nebo využijte kontaktní formulář, uvedený v příslušné části
                    tohoto webu. Pokud s těmito zásadami ochrany osobních údajů nesouhlasíte, nemůžete nadále využívat služby
                    webu {hostname}. V takovém případě se musíte vzdát možnosti navštěvovat naše stránky.
                </p>
            </ArticlePCard>
        </ArticleDiv>
    );
}

export default PrivacyPolicy;