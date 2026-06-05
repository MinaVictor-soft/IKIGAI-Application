const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, HeadingLevel, BorderStyle } = require('docx');
const fs = require('fs');

const users = [
  { role: 'SUPER_ADMIN', email: 'admin@ikigai.quest', name: 'Super Admin' },
  { role: 'ADMIN', email: 'admin1@ikigai.quest', name: 'Admin One' },
  { role: 'ADMIN', email: 'admin2@ikigai.quest', name: 'Admin Two' },
  { role: 'ADMIN', email: 'admin3@ikigai.quest', name: 'Admin Three' },
  { role: 'ADMIN', email: 'admin4@ikigai.quest', name: 'Admin Four' },
  { role: 'STAFF', email: 'staff1@ikigai.quest', name: 'Sarah Miller' },
  { role: 'STAFF', email: 'staff2@ikigai.quest', name: 'David Wilson' },
  { role: 'STAFF', email: 'staff3@ikigai.quest', name: 'Emily Davis' },
  { role: 'STAFF', email: 'staff4@ikigai.quest', name: 'Michael Brown' },
  { role: 'STAFF', email: 'staff5@ikigai.quest', name: 'Jessica Taylor' },
  { role: 'STAFF', email: 'staff6@ikigai.quest', name: 'Daniel Anderson' },
  { role: 'STAFF', email: 'staff7@ikigai.quest', name: 'Ashley Thomas' },
  { role: 'STAFF', email: 'staff8@ikigai.quest', name: 'Matthew Jackson' },
  { role: 'STAFF', email: 'staff9@ikigai.quest', name: 'Amanda White' },
  { role: 'STAFF', email: 'staff10@ikigai.quest', name: 'Christopher Harris' },
  { role: 'STAFF', email: 'staff11@ikigai.quest', name: 'Jennifer Martin' },
  { role: 'STAFF', email: 'staff12@ikigai.quest', name: 'Joshua Thompson' },
  { role: 'STAFF', email: 'staff13@ikigai.quest', name: 'Stephanie Garcia' },
  { role: 'STAFF', email: 'staff14@ikigai.quest', name: 'Andrew Martinez' },
  { role: 'STAFF', email: 'staff15@ikigai.quest', name: 'Nicole Robinson' },
  { role: 'STAFF', email: 'staff16@ikigai.quest', name: 'Ryan Clark' },
  { role: 'STAFF', email: 'staff17@ikigai.quest', name: 'Megan Lewis' },
  { role: 'STAFF', email: 'staff18@ikigai.quest', name: 'Justin Walker' },
  { role: 'STAFF', email: 'staff19@ikigai.quest', name: 'Rachel Hall' },
  { role: 'STAFF', email: 'staff20@ikigai.quest', name: 'Brandon Allen' },
  { role: 'ATTENDEE', email: 'attendee1@ikigai.quest', name: 'Mark Aziz' },
  { role: 'ATTENDEE', email: 'attendee2@ikigai.quest', name: 'Mina George' },
  { role: 'ATTENDEE', email: 'attendee3@ikigai.quest', name: 'Marina Samir' },
  { role: 'ATTENDEE', email: 'attendee4@ikigai.quest', name: 'Peter Fady' },
  { role: 'ATTENDEE', email: 'attendee5@ikigai.quest', name: 'Monica Hany' },
  { role: 'ATTENDEE', email: 'attendee6@ikigai.quest', name: 'John Emad' },
  { role: 'ATTENDEE', email: 'attendee7@ikigai.quest', name: 'Mary Magdy' },
  { role: 'ATTENDEE', email: 'attendee8@ikigai.quest', name: 'Joseph Nabil' },
  { role: 'ATTENDEE', email: 'attendee9@ikigai.quest', name: 'Christine Ashraf' },
  { role: 'ATTENDEE', email: 'attendee10@ikigai.quest', name: 'Andrew Maged' },
  { role: 'ATTENDEE', email: 'attendee11@ikigai.quest', name: 'Irene Sherif' },
  { role: 'ATTENDEE', email: 'attendee12@ikigai.quest', name: 'Samuel Wael' },
  { role: 'ATTENDEE', email: 'attendee13@ikigai.quest', name: 'Veronica Ramy' },
  { role: 'ATTENDEE', email: 'attendee14@ikigai.quest', name: 'George Karim' },
  { role: 'ATTENDEE', email: 'attendee15@ikigai.quest', name: 'Angela Tamer' },
  { role: 'ATTENDEE', email: 'attendee16@ikigai.quest', name: 'David Bassem' },
  { role: 'ATTENDEE', email: 'attendee17@ikigai.quest', name: 'Sarah Khaled' },
  { role: 'ATTENDEE', email: 'attendee18@ikigai.quest', name: 'Philip Youssef' },
  { role: 'ATTENDEE', email: 'attendee19@ikigai.quest', name: 'Nadia Ayman' },
  { role: 'ATTENDEE', email: 'attendee20@ikigai.quest', name: 'Thomas Mounir' },
];

const PASSWORD = 'Ikigai@2026';

const borders = {
  top: { style: BorderStyle.SINGLE, size: 1 },
  bottom: { style: BorderStyle.SINGLE, size: 1 },
  left: { style: BorderStyle.SINGLE, size: 1 },
  right: { style: BorderStyle.SINGLE, size: 1 },
};

function headerCell(text) {
  return new TableCell({
    borders,
    shading: { fill: '4F46E5' },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 20 })] })],
  });
}

function cell(text) {
  return new TableCell({
    borders,
    children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })],
  });
}

const headerRow = new TableRow({
  children: [headerCell('#'), headerCell('Role'), headerCell('Name'), headerCell('Email'), headerCell('Password')],
});

const rows = users.map((u, i) =>
  new TableRow({
    children: [cell(String(i + 1)), cell(u.role), cell(u.name), cell(u.email), cell(PASSWORD)],
  })
);

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({ text: 'IKIGAI Quest - User Credentials', heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
      new Paragraph({ text: `Generated: ${new Date().toLocaleDateString()}`, alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
      new Paragraph({ children: [new TextRun({ text: 'All users share the same password: ', size: 22 }), new TextRun({ text: PASSWORD, bold: true, size: 22 })] }),
      new Paragraph({ text: '', spacing: { after: 200 } }),
      new Table({ rows: [headerRow, ...rows], width: { size: 100, type: WidthType.PERCENTAGE } }),
      new Paragraph({ text: '', spacing: { before: 300 } }),
      new Paragraph({ text: 'Tribe Assignments (Attendees):', heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: '• attendee1-5 → Vision (Purple)' }),
      new Paragraph({ text: '• attendee6-10 → Impact (Cyan)' }),
      new Paragraph({ text: '• attendee11-15 → Unity (Yellow)' }),
      new Paragraph({ text: '• attendee16-20 → Grace (Green)' }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('IKIGAI_Users_Credentials.docx', buffer);
  console.log('✅ Word file created: IKIGAI_Users_Credentials.docx');
});
