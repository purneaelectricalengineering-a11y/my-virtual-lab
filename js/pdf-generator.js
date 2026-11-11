/**
 * MY VIRTUAL LAB - Laboratory Record Report Generator
 * Generates downloadable multi-page PDF observation reports with student credentials,
 * custom observation tables, theoretical formulations, and verification statements.
 */

class LabReportGenerator {
  generate(expId, readings = []) {
    const exp = window.EXPERIMENTS_DATA.find(e => e.id === expId) || window.EXPERIMENTS_DATA[0];
    const student = this.getStudentProfile();

    if (window.jspdf && window.jspdf.jsPDF) {
      try {
        this.generateWithJsPdf(exp, student, readings);
        return;
      } catch (err) {
        console.warn('jsPDF error, falling back to printable view:', err);
      }
    }

    this.generatePrintableReportWindow(exp, student, readings);
  }

  getStudentProfile() {
    try {
      const saved = JSON.parse(localStorage.getItem('mvl_student_profile') || '{}');
      return {
        name: saved.name || "Govind Kumar",
        rollNo: saved.rollNo || "EE-2025-01",
        branch: saved.branch || "Electrical Engineering",
        batch: saved.batch || "Batch 2025–2029"
      };
    } catch (e) {
      return {
        name: "Govind Kumar",
        rollNo: "EE-2025-01",
        branch: "Electrical Engineering",
        batch: "Batch 2025–2029"
      };
    }
  }

  generateWithJsPdf(exp, student, readings) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [13, 21, 39];     // Deep Navy
    const accentColor = [2, 132, 199];      // Cyber Cyan
    const darkGray = [51, 65, 85];
    const lightBg = [248, 250, 252];

    // Page Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 26, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text("MY VIRTUAL LAB — LABORATORY OBSERVATION REPORT", 105, 11, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(186, 230, 253);
    doc.text("ENGINEERING CIRCUIT ANALYSIS & EXPERIMENTAL RECORD", 105, 18, { align: "center" });

    // Student Credentials Card
    doc.setFillColor(...lightBg);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, 32, 182, 26, 3, 3, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT CREDENTIALS", 18, 38);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...darkGray);
    doc.text(`Student Name: ${student.name}`, 18, 45);
    doc.text(`Roll / ID No: ${student.rollNo}`, 18, 51);

    doc.text(`Branch: ${student.branch}`, 115, 45);
    doc.text(`Date of Observation: ${new Date().toLocaleDateString('en-IN')}`, 115, 51);

    // Experiment Title Banner
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 62, 182, 12, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...primaryColor);
    doc.text(`EXPERIMENT: ${exp.title.en.toUpperCase()}`, 18, 70);

    // Aim
    let curY = 80;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text("1. AIM OF EXPERIMENT:", 14, curY);

    curY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...darkGray);
    const splitAim = doc.splitTextToSize(exp.aim.en, 180);
    doc.text(splitAim, 18, curY);
    curY += splitAim.length * 4.5 + 4;

    // Theory Formulation
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text("2. THEORETICAL FORMULATION & GOVERNING EQUATIONS:", 14, curY);

    curY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...darkGray);
    const splitTheory = doc.splitTextToSize(exp.theory.en.replace(/\s+/g, ' '), 180);
    doc.text(splitTheory.slice(0, 8), 18, curY);
    curY += Math.min(8, splitTheory.length) * 3.8 + 6;

    // Observation Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text("3. STUDENT OBSERVATION TABLE (DIGITAL TWIN MEASUREMENTS):", 14, curY);

    curY += 5;

    doc.setFillColor(...primaryColor);
    doc.rect(14, curY, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);

    const isMPTT = exp.id === 'max-power-transfer-theorem';
    if (isMPTT) {
      doc.text("Trial #", 18, curY + 4.5);
      doc.text("Source Ri", 42, curY + 4.5);
      doc.text("Load RL", 72, curY + 4.5);
      doc.text("Voltage V (V)", 105, curY + 4.5);
      doc.text("Current I (mA)", 135, curY + 4.5);
      doc.text("Power P (mW)", 165, curY + 4.5);
    } else {
      doc.text("Trial #", 18, curY + 4.5);
      doc.text("Input V1", 42, curY + 4.5);
      doc.text("Input V2", 72, curY + 4.5);
      doc.text("Current I1 (mA)", 102, curY + 4.5);
      doc.text("Current I2 (mA)", 132, curY + 4.5);
      doc.text("Current I3 (mA)", 162, curY + 4.5);
    }

    curY += 7;

    const tableRows = readings.length > 0 ? readings : this.getDefaultReadings(exp.id);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkGray);

    tableRows.forEach((r, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248);
      doc.rect(14, curY, 182, 6.5, 'F');
      doc.rect(14, curY, 182, 6.5, 'S');

      if (isMPTT) {
        doc.text(String(r.trial || idx + 1), 18, curY + 4.5);
        doc.text(String(r.Ri || "100 Ω"), 42, curY + 4.5);
        doc.text(String(r.RL || "100 Ω"), 72, curY + 4.5);
        doc.text(String(r.V || "6.00 V"), 105, curY + 4.5);
        doc.text(String(r.I || "60.00 mA"), 135, curY + 4.5);
        doc.text(String(r.Power || "360.00 mW"), 165, curY + 4.5);
      } else {
        doc.text(String(r.trial || idx + 1), 18, curY + 4.5);
        doc.text(String(r.V1 || "12.0 V"), 42, curY + 4.5);
        doc.text(String(r.V2 || "5.0 V"), 72, curY + 4.5);
        doc.text(String(r.I1 || "191.4 mA"), 102, curY + 4.5);
        doc.text(String(r.I2 || "242.8 mA"), 132, curY + 4.5);
        doc.text(String(r.I3 || "51.5 mA"), 162, curY + 4.5);
      }
      curY += 6.5;
    });

    curY += 8;

    // Conclusion
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text("4. CONCLUSION & RESULT:", 14, curY);

    curY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...darkGray);
    doc.text(
      "The theoretical calculations and simulation measurements confirm the network theorem principles. " +
      "Experimental practice reinforces analytical circuit solving capabilities.",
      18,
      curY,
      { maxWidth: 180 }
    );

    // Signatures
    const footerY = 265;
    doc.setDrawColor(203, 213, 225);
    doc.line(14, footerY, 196, footerY);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Student Signature", 30, footerY + 8);
    doc.text("Evaluator / Verifier Signature", 130, footerY + 8);

    const filename = `${student.name.replace(/\s+/g, '_')}_${exp.id}_Report.pdf`;
    doc.save(filename);
  }

  getDefaultReadings(expId) {
    if (expId === 'max-power-transfer-theorem') {
      return [
        { trial: 1, Ri: "100 Ω", RL: "25 Ω", V: "2.40 V", I: "96.0 mA", Power: "230.4 mW" },
        { trial: 2, Ri: "100 Ω", RL: "50 Ω", V: "4.00 V", I: "80.0 mA", Power: "320.0 mW" },
        { trial: 3, Ri: "100 Ω", RL: "100 Ω", V: "6.00 V", I: "60.0 mA", Power: "360.0 mW" },
        { trial: 4, Ri: "100 Ω", RL: "200 Ω", V: "8.00 V", I: "40.0 mA", Power: "320.0 mW" },
        { trial: 5, Ri: "100 Ω", RL: "400 Ω", V: "9.60 V", I: "24.0 mA", Power: "230.4 mW" }
      ];
    } else {
      return [
        { trial: 1, V1: "12.0 V", V2: "0.0 V (Shorted)", I1: "205.7 mA", I2: "171.4 mA", I3: "34.2 mA" },
        { trial: 2, V1: "0.0 V (Shorted)", V2: "5.0 V", I1: "14.3 mA", I2: "71.4 mA", I3: "85.7 mA" },
        { trial: 3, V1: "12.0 V", V2: "5.0 V", I1: "191.4 mA", I2: "242.8 mA", I3: "51.5 mA" }
      ];
    }
  }

  generatePrintableReportWindow(exp, student, readings) {
    const tableRows = readings.length > 0 ? readings : this.getDefaultReadings(exp.id);
    const isMPTT = exp.id === 'max-power-transfer-theorem';

    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${student.name} - ${exp.title.en} Lab Report</title>
        <style>
          body { font-family: 'Inter', -apple-system, sans-serif; padding: 24px; color: #0F172A; max-width: 800px; margin: auto; }
          .header { border-bottom: 3px solid #0284C7; padding-bottom: 12px; margin-bottom: 16px; text-align: center; }
          .title { font-size: 18px; font-weight: bold; }
          .card { background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; padding: 12px; margin-bottom: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
          th { background: #0F172A; color: white; padding: 8px; text-align: left; }
          td { border: 1px solid #CBD5E1; padding: 8px; }
          tr:nth-child(even) { background: #F1F5F9; }
          .stamp { margin-top: 32px; display: flex; justify-content: space-between; font-size: 13px; border-top: 1px solid #94A3B8; padding-top: 12px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px;">
          <button onclick="window.print()" style="padding: 8px 16px; background: #0284C7; color: white; border: none; border-radius: 6px; cursor: pointer;">🖨️ Print / Save as PDF</button>
        </div>
        <div class="header">
          <div class="title">MY VIRTUAL LAB — LABORATORY OBSERVATION REPORT</div>
          <div style="font-size: 13px; color: #475569;">Circuit Analysis & Engineering Measurement Record</div>
        </div>
        <div class="card">
          <div><strong>Student Name:</strong> ${student.name}</div>
          <div><strong>Branch:</strong> ${student.branch}</div>
          <div><strong>Roll / ID:</strong> ${student.rollNo}</div>
          <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
        </div>
        <h3>Experiment: ${exp.title.en}</h3>
        <p><strong>Aim:</strong> ${exp.aim.en}</p>
        
        <h4>Student Observation Table:</h4>
        <table>
          <thead>
            <tr>
              <th>Trial #</th>
              ${isMPTT ? `
                <th>Source Ri</th>
                <th>Load RL</th>
                <th>Voltage V</th>
                <th>Current I</th>
                <th>Power P</th>
              ` : `
                <th>Input V1</th>
                <th>Input V2</th>
                <th>Branch I1</th>
                <th>Branch I2</th>
                <th>Branch I3</th>
              `}
            </tr>
          </thead>
          <tbody>
            ${tableRows.map((r, i) => `
              <tr>
                <td>#${r.trial || i + 1}</td>
                ${isMPTT ? `
                  <td>${r.Ri || '100 Ω'}</td>
                  <td>${r.RL || '100 Ω'}</td>
                  <td>${r.V || '6.0 V'}</td>
                  <td>${r.I || '60.0 mA'}</td>
                  <td>${r.Power || '360 mW'}</td>
                ` : `
                  <td>${r.V1 || '12.0 V'}</td>
                  <td>${r.V2 || '5.0 V'}</td>
                  <td>${r.I1 || '191.4 mA'}</td>
                  <td>${r.I2 || '242.8 mA'}</td>
                  <td>${r.I3 || '51.5 mA'}</td>
                `}
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="stamp">
          <div>Student Signature</div>
          <div>Verifier / Evaluator Signature</div>
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(reportHtml);
      printWin.document.close();
    }
  }
}

window.pdfReportGenerator = new LabReportGenerator();
