import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from 'fs';

const domain = 'https://www.sou-yun.cn/';

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms)
    })
}

export async function getDynasty() {
    const resp = await fetch('https://www.sou-yun.cn/PoemIndex.aspx?');
    const html = await resp.text();
    const $ = cheerio.load(html);
    const result = []
    const authorAndPoemReg = /^(?<authorNum>\d+)\s*位作者，(?<poemNum>\d+)\s*首$/
    $("#content .inline1").map((idx, ele) => {
        const $a = $('a', ele);
        const $span = $('span', ele);
        const text = $span.text();
        const execResult = authorAndPoemReg.exec(text);
        result.push({
            dynasty: $a.text(),
            href: $a.attr('href'),
            authorNum: +execResult.groups.authorNum,
            poemNum: +execResult.groups.poemNum
        })
    });
    return result;
}

export async function getAuthorByDaynasty(dynastyHref) {
    const url = domain + dynastyHref;
    const resp = await fetch(url);
    const html = await resp.text();
    const $ = cheerio.load(html);
    const result = [];
    $('.list1 .inline1').map((idx, ele) => {
        const $a = $('a', ele);
        result.push({
            name: $a.text(),
            href: $a.attr('href')
        })
    })
    return result;
}

export async function getPoemByAuthor(authorHref) {
    const result = [];
    let i = 0;
    const pageNumReg = /共(?<poemNum>\d+)，分(?<pageNum>\d+)页显示/
    while (true) {
        const url = domain + authorHref + (i === 0 ? '' : '&type=All&page=' + i);
        console.log(url);
        const resp = await fetch(url);
        const html = await resp.text();
        const $ = cheerio.load(html);
        const execResult = pageNumReg.exec($('.poem').text());
        const { poemNum, pageNum } = execResult.groups || {};
        $('._poem').map((idx, ele) => {
            const $title = $('.poemCommentLink', ele);
            const titleHtml = $title.html();
            const title = titleHtml.replace(/<sup.+?\/sup>/g, '');
            const contents = $('.poemSentence', ele).toArray().map(e => $(e).text()).filter(v => v);
            result.push({
                title,
                contents
            })
        })
        if (i === Number(pageNum) - 1) {
            return result;
        } else {
            i ++;
        }
        await sleep(500)
    }
}

async function write(dataList, { name, dynasty, format }) {
    format = format || 'json';
    if (format === 'json') {
        fs.writeFileSync([['dist', dynasty, name].join('/'), format].join('.'), JSON.stringify(dataList, null, 2));
    }
}

// (async function () {
//     const dynastyList = await getDynasty();
//     const execDynastyList = dynastyList.slice(0, 1);
//     await Promise.all(execDynastyList.map(async dynasty => {
//         const authorList = await getAuthorByDaynasty(dynasty.href)
//         if (!fs.existsSync('./dist/' + dynasty.dynasty)) {
//             fs.mkdirSync('./dist/' + dynasty.dynasty);
//         }
//         const execAuthorList = authorList.slice(1, 2);
//         await Promise.all(execAuthorList.map(async author => {
//             const poemList = await getPoemByAuthor(author.href);
//             write(poemList, { name: author.name, dynasty: dynasty.dynasty })
//         }))
//     }))
// })()