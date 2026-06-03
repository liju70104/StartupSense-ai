from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime
import os

def generate_report(analysis):
    os.makedirs("reports", exist_ok=True)

    filename = f"reports/startup_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    y = height - 50

    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, y, "StartupSense-AI Report")

    y -= 40
    c.setFont("Helvetica", 12)

    for key, value in analysis.items():
        text = f"{key}: {value}"
        c.drawString(50, y, text[:90])
        y -= 22

        if y < 60:
            c.showPage()
            y = height - 50
            c.setFont("Helvetica", 12)

    c.save()

    return filename