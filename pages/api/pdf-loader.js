import fs from 'fs/promises';
import pdf from 'pdf-parse';
import { Pinecone } from "@pinecone-database/pinecone";
import { HuggingFaceTransformersEmbeddings } from "langchain/embeddings/hf_transformers";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Document } from "langchain/document";

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

export default async function handler(req, res) {
    const pdfPath = './assets/outurance.pdf';

    try {
        console.log(`Parsing PDF...`);
        const result = await extractTextFromPDF(pdfPath);
        const { text: pageText, numPages } = result;
        console.log(`PDF parsed successfully. Number of pages: ${numPages}`);
        // console.log('pageText.text', pageText);

        for (let i = 1; i <= numPages; i++) {
            console.log(`Processing Page ${i}...`);
            if (!pageText) {
                throw new Error('Text not available in the parsed PDF');
            }
            const textForPage = await extractTextFromPage(pageText, i);
            console.log(`Text extracted from Page ${i}:`, textForPage);

            if (!textForPage) {
                console.error(`Text for Page ${i} is undefined or null`);
                continue;  // Skip the current iteration and proceed to the next page
            }

            const chunks = splitTextIntoChunks(textForPage);
            console.log(`Splitting text into ${chunks.length} chunks.`);
            if (chunks?.length === 0) {
                console.error(`No chunks found for Page ${i}`);
                continue;  // Skip the current iteration and proceed to the next page
            }
            for (let k = 0; k < chunks?.length; k++) {
                const chunk = chunks[k];
                console.log('k nnumber', i);
                const docs = [
                    new Document({
                        metadata: { page: i },
                        pageContent: chunk.toString()
                    }),
                ]
                console.log('docs', docs)
                console.log(`Processing Chunk ${k + 1} from Page ${i}...`);

                console.log('Upserting chunk into pinecone')

                await PineconeStore.fromDocuments(docs, new HuggingFaceTransformersEmbeddings(), {
                    pineconeIndex,
                    maxConcurrency: 5,
                });

                console.log(`Embedding: Chunks from Page ${i} embedded successfully.`);
                try {

                } catch (embeddingError) {
                    console.error('Error embedding documents:', embeddingError);
                    res.status(500).json({ error: embeddingError.message });
                    return;  // Stop further processing in case of an error with embeddings
                }
            }

            console.log(`Processing of Page ${i} completed successfully.`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

async function extractTextFromPDF(filePath) {
    try {
        console.log(`Reading PDF file...`);
        const fileBuffer = await fs.readFile(filePath);
        const parsedPdf = await pdf(fileBuffer);

        if (!parsedPdf || parsedPdf.err) {
            console.error('Error parsing PDF:', parsedPdf.err);
            throw new Error("Unable to parse PDF");
        }

        if (!parsedPdf.text) {
            throw new Error('Text not available in the parsed PDF');
        }

        console.log('parsedPdf:', parsedPdf);
        console.log('numPages:', parsedPdf.numpages);

        return { text: parsedPdf.text, numPages: parsedPdf.numpages };
    } catch (error) {
        throw new Error(`Error parsing/extracting text from PDF: ${error.message}`);
    }
}




async function extractTextFromPage(parsedPdf, pageNum) {
    // console.log('parsedPdf.text:', parsedPdf.text);

    if (!parsedPdf) {
        throw new Error('Text not available in the parsed PDF');
    }

    const textPages = parsedPdf.split(/(?:\r?\n){2,}/);
    // console.log('textPages:', textPages);

    // Ensure the requested pageNum is within the valid range
    if (pageNum < 1 || pageNum > textPages.length) {
        throw new Error(`Invalid page number: ${pageNum}`);
    }

    return textPages[pageNum - 1];  // Adjust index since pageNum is 1-based
}

function splitTextIntoChunks(text) {
    // Split text into chunks based on some criteria (e.g., newlines, punctuation)
    // Modify this function based on your specific needs
    return text.split(/(?:\r?\n\r?\n)/);
}
