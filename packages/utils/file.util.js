import fs from "fs";

const jsonFormatter = (dataList, pretty) => {
  return pretty ? JSON.stringify(dataList, null, 2) : JSON.stringify(dataList);
};

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
