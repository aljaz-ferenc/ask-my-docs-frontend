# AskMyDocs
## AI Document Query Assistant

Ask My Docs is an intelligent document assistant that allows users to upload and interact with their personal or organizational documents using natural language. It leverages retrieval-augmented generation (RAG) to deliver precise, source-cited answers directly from uploaded files — no more manual searching through PDFs, Word docs, or spreadsheets.

### Tech Stack
**Backend**: Python, FastAPI, LangChain, ChromaDB, Appwrite

**Frontend**: NextJS, TailwindCSS, ShadcnUI

## How it Works
Ask My Docs uses a **Retrieval-Augmented Generation (RAG)** workflow to answer user questions based on uploaded documents:

1. **Upload & Preprocessing**
   - Users upload documents in supported formats (PDF, TXT).
   - The backend extracts text from each file, cleans it, and organizes it for embedding.


2. **Chunking & Embedding**
   - Extracted text is split into manageable chunks using a text splitter.
   - Each chunk is converted into a vector embedding using an LLM embedding model.
   - Chunks and metadata are stored in a vector database (ChromaDB).


3. **Query & Retrieval**
   - When a user asks a question, the system converts the query into a vector.
   - The vector database is searched for the most semantically similar chunks across all uploaded documents.
   

4. **Answer Generation**
    - The retrieved chunks are passed to an LLM to generate a concise, clear answer.
    - The model uses the retrieved text as its factual basis, ensuring responses are grounded in the documents.


This workflow allows Ask My Docs to provide accurate, source-backed answers while handling multiple documents efficiently.