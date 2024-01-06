# Pinecone Vector Uploader JS

This project provides a simple web application for uploading PDF files and embedding their content into a Pinecone vector index. The application is built using Next.js and includes a serverless API endpoint for handling the PDF processing.

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

4. **Open your browser and visit [http://localhost:3000](http://localhost:3000) to use the Vector Uploader.**

## Usage

### Uploading a PDF

1. Navigate to the home page.
2. Click on the "Submit" button to upload the default PDF located at `./assets/llms.pdf`.
3. The PDF content will be parsed and processed, and the chunks will be embedded into the Pinecone vector index.

### Adding Custom PDFs

To add your custom PDFs, follow these steps:

1. Place your PDF files in the `./assets/` directory.
2. Open `./pages/api/pdf-loader.js`.
3. Update the `pdfPath` variable with the path to your PDF file.

   ```javascript
   const pdfPath = './assets/your-custom-file.pdf';
Save the file.

Run the application and use the "Submit" button as described in the "Uploading a PDF" section.

Dependencies
Next.js
pdf-parse
@pinecone-database/pinecone
langchain
License
This project is licensed under the MIT License - see the LICENSE file for details.


### Screenshoot app

|Screenshot|
|---|
| ![SS Chat](https://github.com/PaulGwamanda/NextJS-Pinecone-PDF-Vector-Upload/blob/main/assets/screenshot.png?raw=true "ss nextjs chat ") | ![SS Chats](https://github.com/PaulGwamanda/NextJS-LM-Studio-Chatbot/blob/main/public/image/chat-window.png?raw=true "ss nextjs chat ") |