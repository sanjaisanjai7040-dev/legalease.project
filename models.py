import os
from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

class DocumentRequest(BaseModel):
    document_type: str = Field(..., example="NDA")
    parties: str = Field(..., example="Jane Doe (Service Provider), TechNova Inc. (Client)")
    terms: str = Field(..., example="Payment to be made within 30 days; Confidentiality maintained for 2 years.")
    effective_date: str = Field(..., example="2026-09-24")
    custom_title: Optional[str] = None
    jurisdiction: Optional[str] = "Delaware, United States"
    font_family: Optional[str] = "Times New Roman"
    logo_base64: Optional[str] = None

class DocumentItem(BaseModel):
    id: str
    title: str
    document_type: str
    parties: str
    terms: str
    effective_date: str
    created_at: str
    status: str = "Draft" # Draft, Finalized, Active, Archived
    content: str
    font_family: Optional[str] = "Times New Roman"
    logo_base64: Optional[str] = None

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[str] = None
    terms: Optional[str] = None
    parties: Optional[str] = None

class ExportRequest(BaseModel):
    document_id: Optional[str] = None
    title: str
    document_type: str
    parties: str
    effective_date: str
    content: str
    terms: Optional[str] = ""
    font_family: Optional[str] = "Times New Roman"
    logo_base64: Optional[str] = None

class TemplateItem(BaseModel):
    id: str
    title: str
    type: str
    description: str
    category: str
    parties_example: str
    terms_example: str
    icon_name: str
