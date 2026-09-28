import os
import re
from typing import Dict, Any

# Try importing google.genai if available
try:
    from google import genai
    from google.genai import types
    HAS_GEMINI_LIB = True
except ImportError:
    HAS_GEMINI_LIB = False

def generate_legal_document(document_type: str, parties: str, terms: str, effective_date: str, custom_title: str = None, jurisdiction: str = "Delaware, United States") -> str:
    """
    Generates a structured legal document. Uses Gemini API if GEMINI_API_KEY is configured,
    otherwise uses an intelligent rule-based legal generation engine.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if api_key and HAS_GEMINI_LIB:
        try:
            client = genai.Client(api_key=api_key)
            prompt = f"""
            You are a senior legal counsel specializing in formal contract drafting and legal tech.
            Generate a complete, highly professional, legally structured text document for a:
            DOCUMENT TYPE: {document_type}
            PARTIES INVOLVED: {parties}
            KEY TERMS & CLAUSES: {terms}
            EFFECTIVE DATE: {effective_date}
            JURISDICTION: {jurisdiction}
            
            Structure the document with:
            1. FULL OFFICIAL TITLE
            2. PREAMBLE & RECITALS ("WHEREAS...")
            3. SECTION 1: DEFINITIONS & INTERPRETATION
            4. SECTION 2: CORE OBLIGATIONS & SCOPE OF SERVICES / AGREEMENT
            5. SECTION 3: SPECIFIC TERMS & CONDITIONS (incorporating: {terms})
            6. SECTION 4: INTELLECTUAL PROPERTY & CONFIDENTIALITY (where applicable)
            7. SECTION 5: TERM AND TERMINATION
            8. SECTION 6: GOVERNING LAW & JURISDICTION
            9. SECTION 7: MISCELLANEOUS & ENTIRE AGREEMENT
            10. FORMAL DUAL SIGNATURE BLOCK (Party A & Party B lines, Names, Titles, Dates)
            
            Format clearly with numbered clauses (1.0, 1.1, 2.0, 2.1, etc.). Do not use Markdown styling like ** or ##, use clear plain capital headings and structured section numbers so it can be formatted into PDF/DOCX cleanly.
            """
            
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"[AI Service] Gemini API call failed or key invalid ({e}), falling back to legal generator engine.")

    # High-quality fallback rule-based legal generator engine
    return build_fallback_legal_document(document_type, parties, terms, effective_date, custom_title, jurisdiction)

def build_fallback_legal_document(document_type: str, parties: str, terms: str, effective_date: str, custom_title: str = None, jurisdiction: str = "Delaware, United States") -> str:
    # Clean up parties
    party_list = [p.strip() for p in parties.replace(" and ", ",").split(",") if p.strip()]
    party_a = party_list[0] if len(party_list) > 0 else "First Party"
    party_b = party_list[1] if len(party_list) > 1 else "Second Party"
    
    # Clean up terms into individual clauses
    raw_clauses = [t.strip() for t in terms.split(";") if t.strip()]
    if not raw_clauses:
        raw_clauses = [
            "Confidentiality must be strictly maintained by both parties",
            "Payment shall be executed within 30 calendar days of invoice receipt",
            "Either party may terminate this agreement with 15 days written notice"
        ]
        
    doc_title = custom_title or f"{document_type.upper()} AGREEMENT"
    
    formatted_clauses = ""
    for idx, clause in enumerate(raw_clauses, start=1):
        formatted_clauses += f"3.{idx} Clause {idx}: {clause}.\n"

    template = f"""{doc_title.upper()}

THIS {document_type.upper()} (the "Agreement") is entered into and made effective as of {effective_date} (the "Effective Date"), by and between the following undersigned parties:

PARTIES:
1. {party_a} (hereinafter referred to as "Party A")
2. {party_b} (hereinafter referred to as "Party B")

RECITALS:
WHEREAS, Party A and Party B desire to enter into this formal business arrangement regarding the matters set forth herein;
WHEREAS, both parties agree to adhere strictly to the rights, responsibilities, covenants, and conditions specified below;

NOW, THEREFORE, in consideration of the mutual promises, covenants, and obligations contained herein, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. DEFINITIONS AND INTERPRETATION
1.1 "Agreement" refers to this {document_type} document, including all attached schedules, exhibits, and amendments executed in writing by both parties.
1.2 "Effective Date" shall mean {effective_date}.
1.3 "Confidential Information" includes all non-public proprietary business, technical, financial, and operational information disclosed directly or indirectly by either party.

2. PURPOSE AND SCOPE
2.1 The purpose of this Agreement is to formalize the legal rights and responsibilities between {party_a} and {party_b} for {document_type} operations.
2.2 Both parties shall fulfill their obligations in good faith and in accordance with standard legal and commercial practices.

3. SPECIFIC TERMS & CONDITIONS
{formatted_clauses}

4. CONFIDENTIALITY AND PROPRIETARY RIGHTS
4.1 Each party agrees to hold all Confidential Information received from the other party in strict confidence and shall not disclose such information to any third party without prior written consent.
4.2 This confidentiality obligation shall survive the expiration or termination of this Agreement for a period of two (2) years.

5. TERM AND TERMINATION
5.1 Term: This Agreement commences on {effective_date} and shall remain in full force and effect until terminated by mutual written agreement or pursuant to Section 5.2.
5.2 Termination for Convenience: Either party may terminate this Agreement upon providing at least fifteen (15) calendar days prior written notice to the other party.
5.3 Effect of Termination: Upon termination, all outstanding obligations shall be fulfilled, and confidential material returned.

6. GOVERNING LAW AND JURISDICTION
6.1 This Agreement shall be governed by, construed, and enforced in accordance with the laws of {jurisdiction}, without giving effect to conflicts of law principles.
6.2 Any legal suit, action, or proceeding arising out of or related to this Agreement shall be instituted exclusively in the courts of {jurisdiction}.

7. MISCELLANEOUS
7.1 Entire Agreement: This document constitutes the entire agreement between the parties with respect to its subject matter and supersedes all prior agreements or representations.
7.2 Severability: If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall continue in full force and effect.
7.3 Amendments: No modification or amendment to this Agreement shall be effective unless executed in writing by authorized representatives of both parties.

IN WITNESS WHEREOF, the parties hereto have executed this {doc_title} as of the Effective Date written above.


____________________________________        ____________________________________
PARTY A SIGNATURE                           PARTY B SIGNATURE
Name: {party_a}                             Name: {party_b}
Title: Authorized Representative            Title: Authorized Representative
Date: {effective_date}                      Date: {effective_date}
"""
    return template.strip()
