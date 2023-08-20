var express = require('express');
const { generatePdf, getTemplates, getPreviewImage } = require('../services/pdfService');
var router = express.Router();

// Generate PDF
router.post('/generate', async (req, res) => {
    try {
        console.log(`New Certificate generate request for ${req.body.templateId}`)
        console.log(req.body)
        const savePath = await generatePdf(req.body.templateId, req.body)
        console.log("Finished creating template")
        res.download(savePath)
        console.log("Sent download")
    } catch (error) {
        console.log(error)
        res.send("❌ Error")
    }
})

//Routes will go here
module.exports = router;