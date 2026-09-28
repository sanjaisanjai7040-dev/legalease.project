import json
import os
import uuid
from typing import List, Optional
from models import DocumentItem, TemplateItem

STORAGE_FILE = os.path.join(os.path.dirname(__file__), "storage.json")

# Pre-populated templates
DEFAULT_TEMPLATES: List[TemplateItem] = [
    TemplateItem(
        id="tmpl_1",
        title="Mutual Non-Disclosure Agreement (NDA)",
        type="NDA",
        description="Comprehensive standard dual-party NDA to safeguard sensitive commercial, financial, and technical proprietary information.",
        category="Confidentiality",
        parties_example="TechNova Systems Inc. (Disclosing Party), Quantum Innovations LLC (Receiving Party)",
        terms_example="Confidential Information valid for 3 years; IP rights remain with Disclosing Party; Disputes subject to Delaware arbitration; Permitted disclosures only to authorized personnel.",
        icon_name="ShieldCheck"
    ),
    TemplateItem(
        id="tmpl_2",
        title="Commercial & Residential Lease Agreement",
        type="Lease Agreement",
        description="Legally binding lease agreement outlining rental terms, security deposits, property maintenance, and tenant responsibilities.",
        category="Real Estate",
        parties_example="Apex Real Estate Corp (Landlord), Horizon Creative Studio LLC (Tenant)",
        terms_example="Monthly rent $4,500 due on 1st of each month; Security deposit $9,000; Lease duration 12 months; No structural modifications without landlord consent.",
        icon_name="Building"
    ),
    TemplateItem(
        id="tmpl_3",
        title="Executive Employment Offer Letter",
        type="Employment Offer Letter",
        description="Formal offer letter detailing base salary, stock options, equity vesting, benefits package, and employment start date.",
        category="HR & Hiring",
        parties_example="LegalEase Technologies Inc. (Employer), Alex Vance (Employee)",
        terms_example="Annual base salary $165,000 payable bi-weekly; 20,000 Stock Options vesting over 4 years; At-will employment terms; Target start date October 15, 2026.",
        icon_name="UserCheck"
    ),
    TemplateItem(
        id="tmpl_4",
        title="Freelance Master Services Contract",
        type="Freelance Work Contract",
        description="Contract for independent contractors, freelancers, and consultants defining deliverables, hourly/project rates, and IP ownership.",
        category="Contracting",
        parties_example="Studio Apex (Client), Marcus Thorne Consulting (Independent Contractor)",
        terms_example="Project rate $85/hour capped at 40 hrs/week; Invoices paid Net 15; Work product owned exclusively by Client upon payment; 10 days termination notice.",
        icon_name="Briefcase"
    ),
    TemplateItem(
        id="tmpl_5",
        title="Software & Service Level Agreement (SLA)",
        type="Agreement",
        description="SaaS enterprise service agreement specifying 99.9% uptime guarantees, support response tiers, and data security standards.",
        category="SaaS & Cloud",
        parties_example="CloudSphere Inc. (Provider), Global Logistics Corp (Customer)",
        terms_example="99.9% Uptime Guarantee; 2-hour critical response SLA; Data backup executed daily; Annual recurring subscription fee $36,000.",
        icon_name="FileCode"
    ),
    TemplateItem(
        id="tmpl_6",
        title="General Partnership & Business Agreement",
        type="Contract",
        description="Formal agreement governing partner equity split, profit distribution, voting rights, and liability terms.",
        category="Corporate",
        parties_example="Samantha Reed (Partner A), David Miller (Partner B)",
        terms_example="50/50 Equity and profit allocation; Capital contribution $50,000 each; Decisions exceeding $10,000 require unanimous consent.",
        icon_name="Handshake"
    ),
    TemplateItem(
        id="tmpl_7",
        title="General Purpose Legal Agreement",
        type="Other",
        description="Flexible general-purpose legal document framework for custom commercial agreements and memorandum of understanding.",
        category="General",
        parties_example="Alpha Corp (Party A), Beta Corp (Party B)",
        terms_example="Scope defined in Exhibit A; Mutual indemnification; Governing jurisdiction New York.",
        icon_name="FileText"
    )
]

# Initial Seed Documents
INITIAL_DOCUMENTS: List[dict] = [
    {
        "id": "doc_nda_sample_01",
        "title": "MUTUAL NON-DISCLOSURE AGREEMENT",
        "document_type": "NDA",
        "parties": "TechNova Inc. (Client), Jane Doe (Service Provider)",
        "terms": "Confidentiality maintained for 3 years; IP rights belong to Client; 15 days termination notice.",
        "effective_date": "2026-09-24",
        "created_at": "2026-09-24 10:15",
        "status": "Active",
        "content": """MUTUAL NON-DISCLOSURE AGREEMENT

THIS NON-DISCLOSURE AGREEMENT (the "Agreement") is entered into on September 24, 2026, by and between TechNova Inc. ("Client") and Jane Doe ("Service Provider").

RECITALS:
WHEREAS, the parties contemplate engaging in business discussions concerning software engineering and legal automation technology; and
WHEREAS, in connection with such discussions, either party may disclose confidential and proprietary information to the other.

1. CONFIDENTIAL INFORMATION
1.1 "Confidential Information" shall mean all trade secrets, source code, business strategies, and customer data disclosed by either party.

2. OBLIGATIONS AND RESTRICTIONS
2.1 Both parties agree to protect Confidential Information with the same degree of care used for their own proprietary data.
2.2 Confidential Information shall not be disclosed to any third party without prior written consent.

3. TERM AND GOVERNING LAW
3.1 This Agreement shall remain in effect for three (3) years from September 24, 2026.
3.2 Governed by the laws of the State of Delaware.

IN WITNESS WHEREOF, the parties hereto execute this Agreement.

______________________          ______________________
TechNova Inc.                   Jane Doe
Date: September 24, 2026        Date: September 24, 2026""",
        "font_family": "Times New Roman"
    },
    {
        "id": "doc_lease_sample_02",
        "title": "COMMERCIAL PROPERTY LEASE AGREEMENT",
        "document_type": "Lease Agreement",
        "parties": "Apex Real Estate Corp (Landlord), Horizon Creative Studio LLC (Tenant)",
        "terms": "Monthly rent $4,500 due on 1st; Security deposit $9,000; Lease duration 12 months.",
        "effective_date": "2026-10-01",
        "created_at": "2026-09-22 14:30",
        "status": "Finalized",
        "content": """COMMERCIAL PROPERTY LEASE AGREEMENT

THIS LEASE AGREEMENT is made effective October 1, 2026, between Apex Real Estate Corp ("Landlord") and Horizon Creative Studio LLC ("Tenant").

1. PREMISES AND TERM
1.1 Landlord leases to Tenant the commercial suite located at 500 Technology Way, Suite 400.
1.2 The initial lease term shall be twelve (12) months starting October 1, 2026.

2. RENT AND DEPOSIT
2.1 Tenant agrees to pay Landlord $4,500 per month on or before the 1st of each calendar month.
2.2 Tenant shall deposit $9,000 as security for performance under this Lease.

IN WITNESS WHEREOF, Landlord and Tenant sign below.

______________________          ______________________
Apex Real Estate Corp           Horizon Creative Studio LLC""",
        "font_family": "Times New Roman"
    }
]

def load_documents() -> List[dict]:
    if not os.path.exists(STORAGE_FILE):
        save_documents(INITIAL_DOCUMENTS)
        return INITIAL_DOCUMENTS
    try:
        with open(STORAGE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return INITIAL_DOCUMENTS

def save_documents(docs: List[dict]):
    with open(STORAGE_FILE, "w", encoding="utf-8") as f:
        json.dump(docs, f, indent=2, ensure_ascii=False)

class DatabaseStore:
    def list_documents(self) -> List[dict]:
        return load_documents()

    def get_document(self, doc_id: str) -> Optional[dict]:
        docs = load_documents()
        for d in docs:
            if d["id"] == doc_id:
                return d
        return None

    def add_document(self, doc_data: dict) -> dict:
        docs = load_documents()
        if "id" not in doc_data or not doc_data["id"]:
            doc_data["id"] = f"doc_{uuid.uuid4().hex[:8]}"
        docs.insert(0, doc_data)
        save_documents(docs)
        return doc_data

    def update_document(self, doc_id: str, updates: dict) -> Optional[dict]:
        docs = load_documents()
        for idx, d in enumerate(docs):
            if d["id"] == doc_id:
                docs[idx].update({k: v for k, v in updates.items() if v is not None})
                save_documents(docs)
                return docs[idx]
        return None

    def delete_document(self, doc_id: str) -> bool:
        docs = load_documents()
        initial_len = len(docs)
        docs = [d for d in docs if d["id"] != doc_id]
        if len(docs) < initial_len:
            save_documents(docs)
            return True
        return False

    def list_templates(self) -> List[TemplateItem]:
        return DEFAULT_TEMPLATES

db = DatabaseStore()
