import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

# Add scripts directory to path
sys.path.append(os.path.dirname(__file__))

from report_sections_frontmatter import build_frontmatter
from report_sections_chap1_4 import build_chapters_1_to_4
from report_sections_chap5_6 import build_chapters_5_and_6
from report_sections_chap7_10 import build_chapters_7_to_10

REPORT_DIR = r"C:\Users\cvenu\.gemini\antigravity\scratch\intelligent-research-assistant\INSIGHTLM_PHASE2_REPORT"
DOCX_PATH = os.path.join(REPORT_DIR, "INSIGHTLM_Phase2_Final_Report.docx")
PDF_PATH = os.path.join(REPORT_DIR, "INSIGHTLM_Phase2_Final_Report.pdf")

def add_header_footer(doc):
    """Add subtle running header and footer with page numbers."""
    section = doc.sections[0]
    
    # Running header
    header = section.header
    hp = header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hr = hp.add_run("INSIGHTLM: A LangChain-Powered Document Research System | Phase-2 Report")
    hr.font.name = 'Times New Roman'
    hr.font.size = Pt(8.5)
    hr.font.italic = True
    hr.font.color.rgb = RGBColor(100, 116, 139)

    # Running footer
    footer = section.footer
    fp = footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    fr = fp.add_run("Department of Computer Science & Engineering (Data Science), MVJCE, Bengaluru")
    fr.font.name = 'Times New Roman'
    fr.font.size = Pt(8.5)
    fr.font.color.rgb = RGBColor(100, 116, 139)

def generate_report():
    print("=" * 60)
    print("INSIGHTLM: PHASE 2 PROJECT REPORT GENERATOR")
    print("=" * 60)
    
    doc = docx.Document()

    # 1. Page Margins (Standard VTU dissertation: Left 1.25 in for binding, Top/Right/Bottom 1.0 in)
    section = doc.sections[0]
    section.page_width = Inches(8.27)   # A4
    section.page_height = Inches(11.69)  # A4
    section.left_margin = Inches(1.25)
    section.right_margin = Inches(1.0)
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)

    # 2. Base Normal Style Configuration
    style_normal = doc.styles['Normal']
    font_normal = style_normal.font
    font_normal.name = 'Times New Roman'
    font_normal.size = Pt(12)
    font_normal.color.rgb = RGBColor(15, 23, 42)

    add_header_footer(doc)

    # 3. Assemble Sections
    print("Step 1: Building Front Matter (Cover, Certificate, Declaration, Ack, Abstract, Lists)...")
    build_frontmatter(doc)

    print("Step 2: Building Chapters 1 to 4 (Intro, Literature Survey, Problem Statement, Requirements)...")
    build_chapters_1_to_4(doc)

    print("Step 3: Building Chapters 5 and 6 (System Architecture, Diagrams, Implementation Methodology)...")
    build_chapters_5_and_6(doc)

    print("Step 4: Building Chapters 7 to 10 and References (Results, QA Testing, Limitations, Conclusion)...")
    build_chapters_7_to_10(doc)

    # 4. Save DOCX
    os.makedirs(REPORT_DIR, exist_ok=True)
    doc.save(DOCX_PATH)
    docx_size = os.path.getsize(DOCX_PATH)
    print(f"\nSUCCESS: Generated DOCX at: {DOCX_PATH}")
    print(f"File size: {docx_size:,} bytes ({docx_size / (1024*1024):.2f} MB)")

    # 5. Convert to PDF using Word COM
    print("\nStep 5: Converting DOCX to PDF using Word COM Automation...")
    try:
        import win32com.client
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        wb = word.Documents.Open(os.path.abspath(DOCX_PATH))
        wb.SaveAs(os.path.abspath(PDF_PATH), FileFormat=17) # 17 = wdFormatPDF
        wb.Close()
        word.Quit()

        pdf_size = os.path.getsize(PDF_PATH)
        print(f"SUCCESS: Generated PDF at: {PDF_PATH}")
        print(f"File size: {pdf_size:,} bytes ({pdf_size / (1024*1024):.2f} MB)")

        # Verify page count of generated PDF
        import pypdf
        reader = pypdf.PdfReader(PDF_PATH)
        print(f"Total Rendered PDF Pages: {len(reader.pages)} pages")
        print("=" * 60)
    except Exception as e:
        print(f"Word COM Conversion Note: {e}")
        print("DOCX file is fully saved and valid.")

if __name__ == "__main__":
    generate_report()
