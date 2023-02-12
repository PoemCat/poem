import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

/**
 * 简单JSON格式化方法
 * @param {*} dataList 
 * @param {*} pretty 
 * @returns 
 */
const jsonFormatter = (dataList, pretty) => {
  return pretty ? JSON.stringify(dataList, null, 2) : JSON.stringify(dataList);
};

/**
 * 一个简单的JSON转CSV
 * @param {*} dataList 
 * @returns 
 */
const json2csv = (dataList) => {
  const headerKeys = dataList
    .map((dv) => Object.keys(dv))
    .reduce((pre, cur) => pre.concat(cur));
  const headerString = headerKeys.join(",");
  const jsonString = dataList
    .map((dv) => headerKeys.map((hKey) => dv[hKey]).join(","))
    .join("\n");
  return [headerString, jsonString].join("\n");
};

export function writeFile(dataList, options) {
  const path = options.path;
  const format = options.format || "json";
  const pretty = options.pretty || false;
  if (format === "json") {
    fs.writeFileSync(path, jsonFormatter(dataList, pretty));
  } else if (format === "csv") {
    fs.writeFileSync(path, json2csv(dataList)); 
  }
}

export function url2Filname(url) {
  return fileURLToPath(url);
}

export function url2Dirname(url) {
  return path.dirname(url2Filname(url));
}