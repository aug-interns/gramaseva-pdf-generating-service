const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)

const getHtmlTemplate = async (templateId) => {
    try {
        let templatePath = path.join(__dirname, "..", "assets", "templates", String(templateId), "index.html")
        return await readFile(templatePath, 'utf-8')
    } catch (error) {
        console.error(error)
        throw error
    }
}

const getTemplates = async () => {
    try {
        let templatesPath = path.join(__dirname, "..", "assets", "templates")
        return await (await fs.promises.readdir(templatesPath, { withFileTypes: true })).filter(elm => elm.isDirectory()).map(elm => elm.name)
    } catch (error) {
        throw error
    }
}

const getPreviewImage = (templateId) => {
    return path.join(__dirname, "..", "assets", "templates", String(templateId), "preview.jpg")
}

const generatePdf = async (templateId, data) => {
    try {
        // Prepare HTML template
        const raw_html = await getHtmlTemplate(templateId)
        const template = hb.compile(raw_html, { strict: true })
        const html = template(data)

        // Init headless browser
        const browser = await puppeteer.launch({ 
            args: ['--no-sandbox'], 
            headless: true, 
            executablePath: '/usr/bin/google-chrome' 
        })
        const page = await browser.newPage()
        await page.setContent(html)

        // Convert to PDF
        let savePath = path.join(__dirname, "..", "generated", `${data.id}.pdf`)
        await page.pdf({ path: savePath, format: 'A4', printBackground: true })
        await browser.close()
        return savePath;
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = { generatePdf, getTemplates, getPreviewImage }