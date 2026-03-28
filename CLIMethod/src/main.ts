// TODO Provide Functionality that allows users to select specific tags to be parsed by the LLM and leave other content alone (for example, additional prompt which allows the user to provide input: "links" = scrape all links
// present recursively and pass links found straight to the user (don't pass to the LLM), "text" = only parse and pass text tags to the LLM (only h1-h6, p, span, etc.), "images" for images only, and if no input is provided, it scrapes everything and passes
// it to the LLM, etc.)
// TODO Functionality that allows the user to choose if they want to recursively scrape/follow links and whether or not they want to pass all this data to the LLM
// TODO Error handling in all steps
// TODO DB Functionality (Allow storage of scraped data to be stored in a DB (as well as images/objects to be stored in an object storage (S3, etc.)))

import 'dotenv/config';
import chalk from 'chalk';
import { input } from '@inquirer/prompts';
import {oraPromise} from 'ora';
import {fetchWebsiteContent} from './scraping/scraping.ts';
import {analyzeWebsiteContentLLM} from './ai/ai.ts';


let log = console.log;
let warningColor = chalk.black.bgYellowBright
let errorColor = chalk.black.bgRedBright;
let standardColor = chalk.whiteBright;
let aiColor = chalk.black.bgCyanBright


async function main() {
    log(standardColor('\nWelcome to the contextual scraper. Use LLM\'s to quickly understand a website.\n'));
    log(warningColor('Please make sure to provide a valid URL. The string will NOT be validated.'));
    log(standardColor('e.g. `http://www.xyz.com`\n'));

    let userURL = await input({message: 'Please provide a valid URL'});
    log(`\nUser has chosen -> ${userURL}\n`);

    let fetchResult: string;
    try {        
        fetchResult = await oraPromise(fetchWebsiteContent(userURL), {text: `Currently fetching ${userURL}`,
        color: 'cyan', successText: `Successfully fetched ${userURL}`, failText: 'Failed to fetch. Try again later.'});
    } catch (error) {
        log(errorColor('An error has occurred when fetching the URL. Please try again later!'));
        process.exit(0);
    }

    log(standardColor(`Here is some sample data: ${fetchResult.slice(0, 200)}...\n\n`));

    let userQuestion = await input({message: 'Would you like to know anything specific about this website? Leave blank if not.'});
    log(standardColor(`Response received -> ${userQuestion}\n\n`));

    try {
        log(aiColor(`AI RESPONSE HAS STARTED:\n\n`))
        analyzeWebsiteContentLLM(fetchResult, userQuestion);
    } catch (error) {
        console.error(errorColor(`An error occurred during the AI generation portion of this script -> ${error}`));
    }



}

main();