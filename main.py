import io
from datetime import datetime
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from models import DocumentRequest, DocumentItem, DocumentUpdate, ExportRequest
from ai_service import generate_legal_document
from export_service import generate_txt_file, generate_docx_file, generate_pdf_file
from database import db

app = FastAPI(
    title="LegalEase API",
    description="AI-Powered Legal Document Generator SaaS Backend",
    version="1.0.0"
)

# Enable CORS for local dev frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "LegalEase AI-Powered Legal Document Generator API",
        "version": "1.0.0",
        "endpoints": [
            "/api/generate",
            "/api/documents",
            "/api/templates",
            "/api/export/txt",
            "/api/export/docx",
            "/api/export/pdf"
        ]
    }

# 1. AI Document Generation Endpoint
@app.post("/api/generate")
def generate_document_endpoint(req: DocumentRequest):
    try:
        content = generate_legal_document(
            document_type=req.document_type,
            parties=req.parties,
            terms=req.terms,
            effective_date=req.effective_date,
            custom_title=req.custom_title,
            jurisdiction=req.jurisdiction or "Delaware, United States"
        )
        
        doc_title = req.custom_title or f"{req.document_type.upper()} AGREEMENT"
        
        # Save generated document to database store
        doc_data = {
            "title": doc_title,
            "document_type": req.document_type,
            "parties": req.parties,
            "terms": req.terms,
            "effective_date": req.effective_date,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "status": "Draft",
            "content": content,
            "font_family": req.font_family or "Times New Roman",
            "logo_base64": req.logo_base64
        }
        
        created_doc = db.add_document(doc_data)
        
        return {
            "success": True,
            "document_id": created_doc["id"],
            "document": content,
            "doc_data": created_doc
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

# 2. Document CRUD Endpoints
@app.get("/api/documents")
def list_documents():
    return {"documents": db.list_documents()}

@app.post("/api/documents")
def create_document(doc: DocumentItem):
    created = db.add_document(doc.dict())
    return {"success": True, "document": created}

@app.get("/api/documents/{doc_id}")
def get_document(doc_id: str):
    doc = db.get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@app.put("/api/documents/{doc_id}")
def update_document(doc_id: str, req: DocumentUpdate):
    updated = db.update_document(doc_id, req.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"success": True, "document": updated}

@app.delete("/api/documents/{doc_id}")
def delete_document(doc_id: str):
    success = db.delete_document(doc_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"success": True, "message": "Document deleted"}

# 3. Templates Endpoint
@app.get("/api/templates")
def list_templates():
    return {"templates": db.list_templates()}

# 4. Export Endpoints (TXT, DOCX, PDF)
@app.post("/api/export/txt")
def export_txt(req: ExportRequest):
    buffer = generate_txt_file(title=req.title, content=req.content)
    filename = f"{req.title.replace(' ', '_')}.txt"
    return StreamingResponse(
        buffer,
        media_type="text/plain",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@app.post("/api/export/docx")
def export_docx(req: ExportRequest):
    buffer = generate_docx_file(
        title=req.title,
        document_type=req.document_type,
        parties=req.parties,
        effective_date=req.effective_date,
        content=req.content,
        terms=req.terms or "",
        font_name=req.font_family or "Times New Roman",
        logo_base64=req.logo_base64
    )
    filename = f"{req.title.replace(' ', '_')}.docx"
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@app.post("/api/export/pdf")
def export_pdf(req: ExportRequest):
    buffer = generate_pdf_file(
        title=req.title,
        document_type=req.document_type,
        parties=req.parties,
        effective_date=req.effective_date,
        content=req.content,
        terms=req.terms or "",
        font_name=req.font_family or "Times New Roman",
        logo_base64=req.logo_base64
    )
    filename = f"{req.title.replace(' ', '_')}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
