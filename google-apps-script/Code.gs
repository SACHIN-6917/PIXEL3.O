/**
 * PIXELO 3.O — Google Apps Script Backend
 * 
 * Spreadsheet Name: "PIXELO 3.O – Event Registrations 2026"
 * Tab Name: "Registrations"
 * 
 * Deployment Instructions:
 * 1. Open Google Sheets and create a spreadsheet named "PIXELO 3.O – Event Registrations 2026".
 * 2. Rename the first tab to "Registrations" (or let this script auto-create it).
 * 3. Go to Extensions > Apps Script.
 * 4. Paste this complete Code.gs file.
 * 5. Click "Deploy" > "New deployment".
 * 6. Select type "Web app".
 * 7. Description: "PIXELO 3.O Registration API".
 * 8. Execute as: "Me" (your Google account).
 * 9. Who has access: "Anyone".
 * 10. Click "Deploy", authorize access, and copy the Web App URL.
 * 11. Paste into your .env.local file as:
 *     VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 */

// Configuration constants
var CONFIG = {
  SHEET_NAME: "Registrations",
  FEE_PER_HEAD: 129,
  // Deadline: 13 October 2026, 10:00 PM IST (GMT+05:30)
  DEADLINE_EPOCH: new Date("2026-10-13T22:00:00+05:30").getTime(),
  HEADERS: [
    "Registration_ID",
    "Full_Name",
    "College",
    "Department",
    "Phone_Number",
    "Email_ID",
    "Technical_Event",
    "Technical_Member1",
    "Technical_Member2",
    "Technical_Member3",
    "Technical_Member4",
    "Non_Technical_Event",
    "Non_Technical_Member1",
    "Non_Technical_Member2",
    "Non_Technical_Member3",
    "Non_Technical_Member4",
    "Total_Members",
    "Fee_Per_Head",
    "Total_Amount",
    "Payment_Status",
    "Payment_ID",
    "Registration_Status",
    "Registered_AT"
  ]
};

/**
 * Handle HTTP POST requests from PIXELO website
 */
function doPost(e) {
  try {
    // 1. Enforce Registration Deadline
    var currentTime = new Date().getTime();
    if (currentTime > CONFIG.DEADLINE_EPOCH) {
      return createJsonResponse({
        success: false,
        error: "REGISTRATION_CLOSED",
        message: "Registration closed on 13 October 2026 at 10:00 PM IST."
      });
    }

    // 2. Parse Incoming Payload
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 3. Validate Required Participant Fields
    var fullName = cleanStr(data.fullName);
    var college = cleanStr(data.college);
    var department = cleanStr(data.department);
    var phone = cleanStr(data.phone);
    var email = cleanStr(data.email);
    var paymentId = cleanStr(data.paymentId);

    if (!fullName) return createErrorResponse("Full Name is required.");
    if (!college) return createErrorResponse("College Name is required.");
    if (!department) return createErrorResponse("Department is required.");
    if (!phone || !/^\d{10}$/.test(phone)) return createErrorResponse("A valid 10-digit Phone Number is required.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return createErrorResponse("A valid Email ID is required.");
    if (!paymentId) return createErrorResponse("Payment ID / UTR is required.");

    // 4. Validate Events Selection
    var techEvent = cleanStr(data.technicalEvent).toUpperCase();
    var nonTechEvent = cleanStr(data.nonTechnicalEvent).toUpperCase();

    // Normalize event names
    if (techEvent === "PAPERQUEST") techEvent = "PAPERQUEST";
    else if (techEvent === "AI FILMFORGE" || techEvent === "AI_FILMFORGE") techEvent = "AI FILMFORGE";
    else techEvent = "";

    if (nonTechEvent === "CHECKMATE") nonTechEvent = "CHECKMATE";
    else if (nonTechEvent === "MINE RELAY" || nonTechEvent === "MINE_RELAY") nonTechEvent = "MINE RELAY";
    else nonTechEvent = "";

    if (!techEvent && !nonTechEvent) {
      return createErrorResponse("At least one event (Technical or Non-Technical) must be selected.");
    }

    // 5. Structure & Validate Members
    // TECHNICAL EVENT:
    var techM1 = "", techM2 = "", techM3 = "", techM4 = "";
    if (techEvent === "PAPERQUEST") {
      techM1 = fullName;
      techM2 = cleanStr(data.technicalMember2);
      techM3 = cleanStr(data.technicalMember3);
      techM4 = ""; // Team size 3: Member 4 remains blank
      if (!techM2 || !techM3) {
        return createErrorResponse("PaperQuest requires Member 2 and Member 3 names (Team of 3).");
      }
    } else if (techEvent === "AI FILMFORGE") {
      techM1 = fullName; // Solo
      techM2 = ""; techM3 = ""; techM4 = "";
    }

    // NON-TECHNICAL EVENT:
    var nonTechM1 = "", nonTechM2 = "", nonTechM3 = "", nonTechM4 = "";
    if (nonTechEvent === "MINE RELAY") {
      nonTechM1 = fullName;
      nonTechM2 = cleanStr(data.nonTechnicalMember2);
      nonTechM3 = cleanStr(data.nonTechnicalMember3);
      nonTechM4 = cleanStr(data.nonTechnicalMember4);
      if (!nonTechM2 || !nonTechM3 || !nonTechM4) {
        return createErrorResponse("Mine Relay requires Member 2, Member 3, and Member 4 names (Team of 4).");
      }
    } else if (nonTechEvent === "CHECKMATE") {
      nonTechM1 = fullName; // Solo
      nonTechM2 = ""; nonTechM3 = ""; nonTechM4 = "";
    }

    // 6. Deduplicate Participants to Calculate Unique Members
    var allNames = [];
    if (techEvent) {
      if (techM1) allNames.push(techM1);
      if (techM2) allNames.push(techM2);
      if (techM3) allNames.push(techM3);
      if (techM4) allNames.push(techM4);
    }
    if (nonTechEvent) {
      if (nonTechM1) allNames.push(nonTechM1);
      if (nonTechM2) allNames.push(nonTechM2);
      if (nonTechM3) allNames.push(nonTechM3);
      if (nonTechM4) allNames.push(nonTechM4);
    }

    // Case-insensitive deduplication
    var uniqueMap = {};
    for (var i = 0; i < allNames.length; i++) {
      var norm = allNames[i].trim().toLowerCase();
      if (norm && !uniqueMap[norm]) {
        uniqueMap[norm] = allNames[i].trim();
      }
    }
    var totalMembers = Object.keys(uniqueMap).length;
    if (totalMembers < 1) {
      return createErrorResponse("No valid participants found.");
    }

    // Recalculate fee strictly on backend
    var feePerHead = CONFIG.FEE_PER_HEAD; // 129
    var totalAmount = totalMembers * feePerHead;

    // 7. Access Spreadsheet & Ensure Single "Registrations" Sheet
    var sheet = getOrCreateRegistrationsSheet();

    // 8. Prevent Duplicate Submissions (Concurrency-safe check)
    var lock = LockService.getScriptLock();
    // Wait up to 30 seconds for concurrent requests
    var hasLock = lock.tryLock(30000);
    if (!hasLock) {
      return createErrorResponse("Server is busy processing registrations. Please retry in a few seconds.");
    }

    var registrationId = "";
    try {
      // Check for identical recent submission (same phone and payment ID)
      var duplicateId = findDuplicateRegistration(sheet, phone, paymentId);
      if (duplicateId) {
        return createJsonResponse({
          success: true,
          duplicate: true,
          registrationId: duplicateId,
          totalMembers: totalMembers,
          totalAmount: totalAmount,
          feePerHead: feePerHead,
          paymentStatus: "Submitted",
          registrationStatus: "Confirmed",
          message: "Registration already recorded."
        });
      }

      // 9. Generate Concurrency-Safe Sequential Registration_ID
      // Format: PIXELO3.O-001, PIXELO3.O-002, ...
      var props = PropertiesService.getScriptProperties();
      var counterStr = props.getProperty("PIXELO_REG_COUNTER");
      var counter = counterStr ? parseInt(counterStr, 10) : 0;

      // Self-heal counter from sheet rows if property is unset
      if (counter === 0) {
        var lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          counter = lastRow - 1;
        }
      }

      counter += 1;
      props.setProperty("PIXELO_REG_COUNTER", counter.toString());

      registrationId = "PIXELO3.O-" + padZero(counter, 3);

      // Server Timestamp in IST
      var timestamp = Utilities.formatDate(new Date(), "GMT+05:30", "yyyy-MM-dd HH:mm:ss 'IST'");

      // 10. Save Exactly ONE ROW in "Registrations" Sheet (23 Columns)
      var row = [
        registrationId,         // 1. Registration_ID
        fullName,               // 2. Full_Name
        college,                // 3. College
        department,             // 4. Department
        phone,                  // 5. Phone_Number
        email,                  // 6. Email_ID
        techEvent,              // 7. Technical_Event
        techM1,                 // 8. Technical_Member1
        techM2,                 // 9. Technical_Member2
        techM3,                 // 10. Technical_Member3
        techM4,                 // 11. Technical_Member4
        nonTechEvent,           // 12. Non_Technical_Event
        nonTechM1,              // 13. Non_Technical_Member1
        nonTechM2,              // 14. Non_Technical_Member2
        nonTechM3,              // 15. Non_Technical_Member3
        nonTechM4,              // 16. Non_Technical_Member4
        totalMembers,           // 17. Total_Members
        feePerHead,             // 18. Fee_Per_Head
        totalAmount,            // 19. Total_Amount
        "Submitted",            // 20. Payment_Status
        paymentId,              // 21. Payment_ID
        "Confirmed",            // 22. Registration_Status
        timestamp               // 23. Registered_AT
      ];

      sheet.appendRow(row);

    } finally {
      lock.releaseLock();
    }

    // 11. Return Confirmed Response
    return createJsonResponse({
      success: true,
      registrationId: registrationId,
      fullName: fullName,
      totalMembers: totalMembers,
      feePerHead: feePerHead,
      totalAmount: totalAmount,
      techEvent: techEvent,
      nonTechEvent: nonTechEvent,
      paymentStatus: "Submitted",
      registrationStatus: "Confirmed",
      registeredAt: timestamp
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: "SERVER_ERROR",
      message: "An error occurred while saving registration: " + error.toString()
    });
  }
}

/**
 * Handle HTTP GET requests (Health check and API verification)
 */
function doGet(e) {
  var isDeadlinePassed = new Date().getTime() > CONFIG.DEADLINE_EPOCH;
  return createJsonResponse({
    status: "online",
    system: "PIXELO 3.O Registration API",
    feePerHead: CONFIG.FEE_PER_HEAD,
    deadlinePassed: isDeadlinePassed,
    timestamp: Utilities.formatDate(new Date(), "GMT+05:30", "yyyy-MM-dd HH:mm:ss 'IST'")
  });
}

// ─── HELPER FUNCTIONS ──────────────────────────────────────────

function cleanStr(val) {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

function padZero(num, size) {
  var s = String(num);
  while (s.length < (size || 3)) { s = "0" + s; }
  return s;
}

function getOrCreateRegistrationsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  // Ensure headers exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CONFIG.HEADERS);
    // Format header row
    var headerRange = sheet.getRange(1, 1, 1, CONFIG.HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#FF6A00");
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function findDuplicateRegistration(sheet, phone, paymentId) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;

  // Read columns: Registration_ID(1), Phone_Number(5), Payment_ID(21)
  var data = sheet.getRange(2, 1, lastRow - 1, 21).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    var rowPhone = cleanStr(data[i][4]);
    var rowPaymentId = cleanStr(data[i][20]);
    if (rowPhone === phone && rowPaymentId === paymentId && paymentId !== "") {
      return data[i][0]; // Registration_ID
    }
  }
  return null;
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(message) {
  return createJsonResponse({
    success: false,
    error: "VALIDATION_ERROR",
    message: message
  });
}
