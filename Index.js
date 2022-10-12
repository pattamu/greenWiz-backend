const Axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const mime = require('mime-types')
const http = require('https')

//returns all images src links from url
async function getImagesFromUrl() {  
  const url = 'https://www.growpital.com/'
  const response = await Axios.get(url)
  
  const $ = cheerio.load(response.data);
  let temp = [];
  $("img").each((i, e) => {
    temp.push($(e).attr('src'))
  })
  return [...new Set(temp)]
}

//Downloading Each image from url
async function downloadFile(url) {
  try {
    var resource = http.get(url, (res, err) => {
      if (err) return console.log(err.message);
      let contentType = mime.extension(res.headers["content-type"]);
      console.log(contentType)
      let fileType = res.headers["content-type"].split("/")
      if (fileType[0] != "image") return console.log("Invalid Url");
      let rootePath = `./Downloads/imageFile_${new Date().getTime()}.${contentType}`
      console.log("Images downloaded successfully")
      return res.pipe(fs.createWriteStream(rootePath))
    })
  } catch (err) {
    return console.log(err)
  }
}

async function root() {
  let arr = await getImagesFromUrl()
  console.log(arr);
  for (let img of arr) {
    await downloadFile(img)
  }
}
root()