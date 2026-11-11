import os
import time
from playwright.sync_api import sync_playwright

OUT_DIR = r"C:\Users\cvenu\.gemini\antigravity\scratch\intelligent-research-assistant\INSIGHTLM_PHASE2_REPORT\INSIGHTLM_Screenshots"
os.makedirs(OUT_DIR, exist_ok=True)

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        context = browser.new_context(viewport={"width": 1400, "height": 900})
        page = context.new_page()

        # 1. Login Portal
        print("1. Capturing Login Portal...")
        page.goto("http://localhost:5173/")
        time.sleep(1)
        # Force logout to show the login screen
        page.evaluate("() => { sessionStorage.setItem('ira_logged_out', 'true'); window.location.reload(); }")
        time.sleep(2)
        page.wait_for_selector('button:has-text("Sign In to Workspace")')
        page.screenshot(path=os.path.join(OUT_DIR, "fig_login_portal.png"))
        print("Saved fig_login_portal.png")

        # 2. Login as Aarav Sharma (Student)
        print("2. Logging in as Student (Aarav Sharma)...")
        page.click('button:has-text("Sign In to Workspace")')
        time.sleep(3)
        page.screenshot(path=os.path.join(OUT_DIR, "fig_student_dashboard.png"))
        print("Saved fig_student_dashboard.png")

        # 3. Documents Tab
        print("3. Capturing My Documents tab...")
        page.click('button:has-text("My Documents")')
        time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "fig_doc_management.png"))
        print("Saved fig_doc_management.png")

        # 4. RAG Assistant Tab
        print("4. Capturing Research Assistant tab...")
        page.click('button:has-text("Ask AI Assistant")')
        time.sleep(2)
        try:
            inp = page.query_selector('textarea, input[type="text"]')
            if inp:
                inp.fill("Explain the transformer architecture, self-attention, and how ChromaDB retrieves document chunks.")
                page.keyboard.press("Enter")
                time.sleep(4)
        except Exception as e:
            print("Note on RAG query:", e)
        page.screenshot(path=os.path.join(OUT_DIR, "fig_rag_assistant.png"))
        print("Saved fig_rag_assistant.png")

        # 5. Student Assessment Tab
        print("5. Capturing Student Assessment tab...")
        page.click('button:has-text("Assigned Tests & Quizzes")')
        time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "fig_student_assessment.png"))
        print("Saved fig_student_assessment.png")

        # 6. YouTube Learning & Projects Tab
        print("6. Capturing YouTube Learning tab...")
        page.click('button:has-text("YouTube Learning & Projects")')
        time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "fig_youtube_research.png"))
        print("Saved fig_youtube_research.png")

        # Switch to Teacher (Prof. Rahul Verma)
        print("7. Switching to Teacher (Prof. Rahul Verma)...")
        # Click on user profile dropdown or role button
        user_btn = page.query_selector('button:has-text("Aarav Sharma")')
        if user_btn:
            user_btn.click()
            time.sleep(1)
            page.click('text="Prof. Rahul Verma"')
            time.sleep(2)
        else:
            # Try clicking Teacher role pill in header
            page.click('button:has-text("Teacher")')
            time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "fig_teacher_dashboard.png"))
        print("Saved fig_teacher_dashboard.png")

        # 8. Teacher Question Paper Studio (8 Formats)
        print("8. Capturing Question Paper Studio & Bank (8 Formats)...")
        page.click('button:has-text("Question Paper Studio & Bank")')
        time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "fig_question_gen_8formats.png"))
        print("Saved fig_question_gen_8formats.png")

        # 9. Auto-Grading & Assessment Evaluation
        print("9. Capturing Assessment Evaluation / Auto-grading...")
        sub_btn = page.query_selector('button:has-text("Submissions"), button:has-text("Grading"), button:has-text("Auto-Grade"), button:has-text("Evaluat")')
        if sub_btn:
            sub_btn.click()
            time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "fig_auto_grading.png"))
        print("Saved fig_auto_grading.png")

        # Switch to Researcher (Dr. Arjun Reddy)
        print("10. Switching to Researcher (Dr. Arjun Reddy)...")
        teacher_btn = page.query_selector('button:has-text("Prof. Rahul Verma")')
        if teacher_btn:
            teacher_btn.click()
            time.sleep(1)
            page.click('text="Dr. Arjun Reddy"')
            time.sleep(2)
        else:
            page.click('button:has-text("Researcher")')
            time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "fig_researcher_dashboard.png"))
        print("Saved fig_researcher_dashboard.png")

        # 11. Multi-Document Comparison Matrix
        print("11. Capturing Compare Papers tab...")
        comp_btn = page.query_selector('button:has-text("Compare")')
        if comp_btn:
            comp_btn.click()
            time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "fig_compare_papers.png"))
        print("Saved fig_compare_papers.png")

        # 12. Citation Generator
        print("12. Capturing Citation Generator tab...")
        cit_btn = page.query_selector('button:has-text("Citation"), button:has-text("Reference")')
        if cit_btn:
            cit_btn.click()
            time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "fig_citation_generator.png"))
        print("Saved fig_citation_generator.png")

        browser.close()
        print("ALL 12 SCREENSHOTS CAPTURED SUCCESSFULLY!")

if __name__ == "__main__":
    run()
