import * as souYunApi from "./packages/sou-yun/index.js";
import { writeFile, url2Dirname } from "./packages/utils/index.js";
import path from "path";

async function main() {
  // 1. 第一步先拿到全部的朝代
  // 2. 第二步拿到朝代全部的作者
  // 3. 第三步根据作者拿到诗词页，解析诗词信息 + 作者信息
  const dynastyList = await souYunApi.getDynasty();

  console.log(dynastyList, url2Dirname(import.meta.url));
  console.log(dynastyList.reduce((pre, cur) => pre + cur.poemNum, 0));
  writeFile(dynastyList, {
    pretty: true,
    path: path.join(url2Dirname(import.meta.url), "dist/dynasty.json"),
  });

  const downloadDynasty = dynastyList[0];
  const authorList = await souYunApi.getAuthorByDaynasty(downloadDynasty.href);
  writeFile(authorList, {
    pretty: true,
    path: path.join(url2Dirname(import.meta.url), "dist/author.json"),
  });
}

main();
