import dotenv from "dotenv";
import { format } from "date-fns";
import Twitter from "twitter";
import fetch from "node-fetch";
import puppeteet from "puppeteer";

dotenv.config();

const client = new Twitter({

    consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY as string,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,

});

const GITHUHB_URL = "https://github.com/users/YourUsernameHere/contributions?from=2021-01-01"
async function grabGithubData(): Promise<string> {

    const browser = await puppeteet.launch();
    const page = await browser.newPage();

    await page.goto(GITHUHB_URL)

    let contributions = await page.$$eval("[data-count]", (val) =>
    val.reduce((acc,val)=> acc + +(val.getAttribute("data-count")!), 0)
    )
    const currentYear = format(new Date, "yyyy");

    await browser.close();

    return `${currentYear} Github Contributions: ${contributions}`
}

async function base(){
    const githubData = await grabGithubData();
    const url = `SetAnyLinkHere`

    const params = {
        location: githubData,
        url
    }

    await client.post("account/update_profile")
}
