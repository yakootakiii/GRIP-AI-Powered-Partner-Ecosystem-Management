#uvicorn clause:app --reload 
#use http://127.0.0.1:8000/docs
# source env/bin/activate 

from fastapi import FastAPI, Request
from pydantic import BaseModel
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings # Optional to replace later
from langchain_community.vectorstores import Chroma
from langchain.chains import ConversationalRetrievalChain, LLMChain
from langchain.memory import ConversationBufferMemory
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
import os

os.environ["GOOGLE_API_KEY"] = "AIzaSyAAzH7Oya2FSQxDuWfiYYix-oTXgVUkt1Y"
loader = PyPDFLoader("SampleContract-Shuttle.pdf")
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
chunks = splitter.split_documents(docs)

embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
db = Chroma.from_documents(chunks, embedding, persist_directory="vector_store")
retriever = db.as_retriever()

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True,
    output_key="answer"  # 👈 Tells memory what to store
)

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.2,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

clause_prompt = PromptTemplate.from_template(
    """You are a legal assistant. Given the following contract, extract the {clause_type} clause verbatim. 
If it's missing, say 'Clause not found'.

Contract:
--------
{document}
"""
)

clause_chain = LLMChain(llm=llm, prompt=clause_prompt)

class ClauseQuery(BaseModel):
    clause_type: str


qa_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory,
    return_source_documents=True,
    output_key="answer"
)

# FastAPI app
app = FastAPI()

class Query(BaseModel):
    question: str

# @app.post("/ask")
# async def ask_question(query: Query):
#     result = qa_chain.invoke({"question": query.question})
#     return {
#         "answer": result["answer"],
#         "sources": [doc.metadata for doc in result["source_documents"]]
#     }

@app.post("/extract_clause")
async def extract_clause(query: ClauseQuery):
    # Get the whole contract (we’ll use the first loaded doc for now)
    full_text = docs[0].page_content
    response = clause_chain.invoke({
        "clause_type": query.clause_type,
        "document": full_text
    })
    return {"clause": response["text"]}