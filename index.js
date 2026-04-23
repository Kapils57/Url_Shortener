const express = require('express')
const {readFile, writeFile} = require("fs/promises")
const path = require('path')
const { json } = require('stream/consumers')
const app = express()

app.use(express.json())

const serve = async (res, filePath, contentType) => {
    try {

        const data = await readFile(filePath)
        res.setHeader("Content-Type" , contentType)
        res.status(200).send(data)
    } catch (err) {
        console.log(`Error: ${err}`)
        res.status(404).send("Error")
    }

}



app.get("/", async (req, res) => {
  

        serve(res, path.join(__dirname, 'url.html'), 'text/html')

      
})

app.get("/url.css", async (req, res) => {
 
        serve(res, path.join(__dirname, 'url.css'), 'text/css')

})


app.get("/url.js", async (req, res) => {
   
        serve(res, path.join(__dirname, 'url.js'), 'text/javascript')

    
})

const loadLinks = async () => {
    const filePath = path.join(__dirname, 'data', 'url.json')

    try {
        const data = await readFile(filePath, 'utf-8')
        
        console.log(data)
        return JSON.parse(data)
    } catch (error) {
        await writeFile(filePath, JSON.stringify({}))
        return {}
    }
}

const saveLinks = async (links) => {
    const filePath = path.join(__dirname, 'data', 'url.json')
    await writeFile(filePath, JSON.stringify(links))
}


app.post('/shorten', async (req, res) => {

    const links = await loadLinks()
    console.log(links)


    const {url , shortCode} = req.body
    console.log(`url: ${url} and shortCode: ${shortCode}`)

    if(links[shortCode]){

        return res.status(400).send({message:"link already exists", shortUrl: `http://localhost:3000/${shortCode}`})
    }

    links[shortCode] = url

    await saveLinks(links)
    


    res.status(200).send({ message: "success", shortUrl: `http://localhost:3000/${shortCode}` })
})

app.get('/:shortCode', async (req, res) => {
    const links = await loadLinks()
    const {shortCode} = req.params;

    if(!links[shortCode]){
        return res.status(400).send("Url Does not Exists")
    }

    const url = links[shortCode];

    return res.status(200).redirect(url)
})

app.listen(3000, () => console.log("Server running on port 3000"))
