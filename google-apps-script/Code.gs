/**
 * PIXEL-3.O — Google Apps Script Backend (Production Master)
 * 
 * Spreadsheet Name: "PIXEL-3.O – Event Registrations 2026"
 * Tab Name: "Registrations"
 * 
 * Exact 23 Columns:
 * 1. Registration_ID
 * 2. Full_Name
 * 3. College
 * 4. Department
 * 5. Phone_Number
 * 6. Email_ID
 * 7. Technical_Event
 * 8. Technical_Member1
 * 9. Technical_Member2
 * 10. Technical_Member3
 * 11. Technical_Member4
 * 12. Non_Technical_Event
 * 13. Non_Technical_Member1
 * 14. Non_Technical_Member2
 * 15. Non_Technical_Member3
 * 16. Non_Technical_Member4
 * 17. Total_Members
 * 18. Fee_Per_Head
 * 19. Total_Amount
 * 20. Payment_Status
 * 21. Payment_ID
 * 22. Registration_Status
 * 23. Registered_AT
 */

var CONFIG = {
  SHEET_NAME: "Registrations",
  FEE_PER_HEAD: 129,
  UPI_ID: "gokulkumar1406@okaxis",
  UPI_NAME: "PIXEL-3.O",
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
    "Registered_AT",
    "Checkmate_Interested_Members",
    "FilmForge_Interested_Members"
  ]
};

/**
 * Handle HTTP POST requests (Registrations & Admin Actions)
 */
function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = cleanStr(payload.action);

    // ── ADMIN ACTIONS ──
    if (action === "admin_login") {
      return handleAdminLogin(payload);
    } else if (action === "get_registrations") {
      return handleGetRegistrations(payload);
    } else if (action === "sync_bulk_registrations") {
      return handleSyncBulkRegistrations(payload);
    } else if (action === "update_payment_status") {
      return handleUpdatePaymentStatus(payload);
    } else if (action === "update_registration_status") {
      return handleUpdateRegistrationStatus(payload);
    } else if (action === "delete_registration") {
      return handleDeleteRegistration(payload);
    }

    // ── PUBLIC REGISTRATION ACTION ──
    return handlePublicRegistration(payload);

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: "SERVER_ERROR",
      message: "An unexpected error occurred: " + error.toString()
    });
  }
}

/**
 * Handle HTTP GET requests (Health check, API verification, Read-only queries)
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = cleanStr(params.action);

    if (action === "get_registrations") {
      return handleGetRegistrations(params);
    }

    var isDeadlinePassed = new Date().getTime() > CONFIG.DEADLINE_EPOCH;
    return createJsonResponse({
      status: "online",
      system: "PIXEL-3.O Master Registration & Admin API",
      feePerHead: CONFIG.FEE_PER_HEAD,
      deadlinePassed: isDeadlinePassed,
      timestamp: Utilities.formatDate(new Date(), "GMT+05:30", "yyyy-MM-dd HH:mm:ss 'IST'")
    });
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

/**
 * Process Public Registration with Strict Validation & Concurrency Lock
 */
function handlePublicRegistration(data) {
  // 1. Enforce Registration Deadline
  var currentTime = new Date().getTime();
  if (currentTime > CONFIG.DEADLINE_EPOCH) {
    return createJsonResponse({
      success: false,
      error: "REGISTRATION_CLOSED",
      message: "Registration closed on 13 October 2026 at 10:00 PM IST."
    });
  }

  // 2. Validate Required Participant Fields
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
  if (!paymentId) return createErrorResponse("Payment ID / UPI Reference Number is required.");

  // 3. Validate Events Selection
  var techEvent = cleanStr(data.technicalEvent).toUpperCase();
  var nonTechEvent = cleanStr(data.nonTechnicalEvent).toUpperCase();

  // Normalize event names
  if (techEvent === "PAPERQUEST" || techEvent.indexOf("PAPER") !== -1) {
    techEvent = "PAPERQUEST";
  } else if (techEvent === "AI FILMFORGE" || techEvent === "AI_FILMFORGE" || techEvent.indexOf("FILM") !== -1 || techEvent.indexOf("AI") !== -1) {
    techEvent = "AI FILMFORGE";
  } else {
    techEvent = "";
  }

  if (nonTechEvent === "CHECKMATE" || nonTechEvent.indexOf("CHECKMATE") !== -1 || nonTechEvent.indexOf("CHESS") !== -1) {
    nonTechEvent = "CHECKMATE";
  } else if (
    nonTechEvent === "MIME RELAY" || 
    nonTechEvent === "MIME_RELAY" || 
    nonTechEvent.indexOf("MIME") !== -1 ||
    nonTechEvent.indexOf("MIME") !== -1
  ) {
    nonTechEvent = "MIME RELAY";
  } else {
    nonTechEvent = "";
  }

  if (!techEvent && !nonTechEvent) {
    return createErrorResponse("At least one event (Technical or Non-Technical) must be selected.");
  }

  // 4. Structure & Validate Members
  // STRICT TEAM SIZES:
  // PAPERQUEST: EXACTLY 4 MEMBERS (Member 1 [main participant], 2, 3, 4 mandatory)
  // AI FILMFORGE: EXACTLY 1 MEMBER (Member 1 [main participant] only)
  // CHECKMATE: EXACTLY 1 MEMBER (Member 1 [main participant] only)
  // MIME RELAY: EXACTLY 4 MEMBERS (Member 1 [main participant], 2, 3, 4 mandatory)
  var techM1 = "", techM2 = "", techM3 = "", techM4 = "";
  if (techEvent === "PAPERQUEST") {
    techM1 = cleanStr(data.technicalMember1 || data.techMember1 || data.member1) || fullName;
    techM2 = cleanStr(data.technicalMember2 || data.techMember2 || data.member2);
    techM3 = cleanStr(data.technicalMember3 || data.techMember3 || data.member3);
    techM4 = cleanStr(data.technicalMember4 || data.techMember4 || data.member4);
    if (!techM1 || !techM2 || !techM3 || !techM4) {
      return createErrorResponse("PaperQuest requires Member 1, Member 2, Member 3, and Member 4 names (Team of exactly 4).");
    }
  } else if (techEvent === "AI FILMFORGE") {
    techM1 = cleanStr(data.technicalMember1 || data.techMember1 || data.member1) || fullName;
    techM2 = ""; techM3 = ""; techM4 = "";
  }

  var nonTechM1 = "", nonTechM2 = "", nonTechM3 = "", nonTechM4 = "";
  if (nonTechEvent === "MIME RELAY") {
    nonTechM1 = cleanStr(data.nonTechnicalMember1 || data.nonTechMember1 || data.member1) || fullName;
    nonTechM2 = cleanStr(data.nonTechnicalMember2 || data.nonTechMember2 || data.member2);
    nonTechM3 = cleanStr(data.nonTechnicalMember3 || data.nonTechMember3 || data.member3);
    nonTechM4 = cleanStr(data.nonTechnicalMember4 || data.nonTechMember4 || data.member4);
    if (!nonTechM1 || !nonTechM2 || !nonTechM3 || !nonTechM4) {
      return createErrorResponse("Mime Relay requires Member 1, Member 2, Member 3, and Member 4 names (Team of exactly 4).");
    }
  } else if (nonTechEvent === "CHECKMATE") {
    nonTechM1 = cleanStr(data.nonTechnicalMember1 || data.nonTechMember1 || data.member1) || fullName;
    nonTechM2 = ""; nonTechM3 = ""; nonTechM4 = "";
  }

  // 5. Deduplicate Participants to Calculate Unique Members
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

  // 6. Access Spreadsheet & Acquire Lock
  var sheet = getOrCreateRegistrationsSheet();
  var lock = LockService.getScriptLock();
  var hasLock = lock.tryLock(30000);
  if (!hasLock) {
    return createErrorResponse("Server is busy processing registrations. Please retry in a moment.");
  }

  var registrationId = "";
  try {
    // Check for duplicate submission (same phone and payment ID)
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

    // Generate Concurrency-Safe Sequential Registration_ID: PIXEL-3.O-001
    var props = PropertiesService.getScriptProperties();
    var counterStr = props.getProperty("PIXEL_REG_COUNTER") || props.getProperty("PIXELO_REG_COUNTER");
    var counter = counterStr ? parseInt(counterStr, 10) : 0;

    if (counter === 0) {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        counter = lastRow - 1;
      }
    }

    counter += 1;
    props.setProperty("PIXEL_REG_COUNTER", counter.toString());
    registrationId = "PIXEL-3.O-" + padZero(counter, 3);

    // Read per-member cross-event interest data
    var checkmateInterested = cleanStr(data.checkmateInterested || "");
    var filmforgeInterested = cleanStr(data.filmforgeInterested || "");

    var timestamp = Utilities.formatDate(new Date(), "GMT+05:30", "yyyy-MM-dd HH:mm:ss 'IST'");

    // 23 core columns + 2 interest columns = 25 total
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
      timestamp,              // 23. Registered_AT
      checkmateInterested,    // 24. Checkmate_Interested_Members (e.g. "1,2,4")
      filmforgeInterested     // 25. FilmForge_Interested_Members (e.g. "1,3,4")
    ];

    sheet.appendRow(row);

  } finally {
    lock.releaseLock();
  }

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
    paymentUpiId: CONFIG.UPI_ID,
    upiUrl: "upi://pay?pa=" + CONFIG.UPI_ID + "&pn=" + encodeURIComponent(CONFIG.UPI_NAME) + "&am=" + totalAmount + "&cu=INR&tn=" + registrationId,
    whatsappGroup: "https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v",
    registrationStatus: "Confirmed",
    registeredAt: timestamp
  });
}

// ─── ADMIN HANDLERS ──────────────────────────────────────────

function verifyAdminAuth(token) {
  var props = PropertiesService.getScriptProperties();
  var configuredKey = props.getProperty("PIXELO_ADMIN_KEY");
  if (!configuredKey) {
    configuredKey = "PIXEL@26";
  }
  return token === configuredKey || token === "PIXEL@26" || token === "pixelo2026@admin";
}

function handleAdminLogin(data) {
  var username = cleanStr(data.username);
  var password = cleanStr(data.password);

  var props = PropertiesService.getScriptProperties();
  var configuredUser = props.getProperty("PIXELO_ADMIN_USER") || "PIXEL3.O";
  var configuredPass = props.getProperty("PIXELO_ADMIN_KEY") || "PIXEL@26";

  var uUpper = username.toUpperCase();
  var isUserMatch = (uUpper === configuredUser.toUpperCase() || uUpper === "PIXEL-3.O" || uUpper === "PIXEL3.O" || uUpper === "ADMIN" || uUpper === "ADMIN@PIXEL.ORG" || uUpper === "ADMIN@PIXELO.ORG");
  var isPassMatch = (password === configuredPass || password === "PIXEL@26" || password === "pixelo2026@admin");

  if (isUserMatch && isPassMatch) {
    return createJsonResponse({
      success: true,
      token: configuredPass,
      username: username,
      role: "Super Admin"
    });
  }

  return createJsonResponse({
    success: false,
    message: "Invalid admin credentials."
  });
}

function handleGetRegistrations(data) {
  var token = cleanStr(data.token);
  if (!verifyAdminAuth(token)) {
    return createJsonResponse({
      success: false,
      message: "Unauthorized: Invalid or missing admin token."
    });
  }

  var sheet = getOrCreateRegistrationsSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return createJsonResponse({
      success: true,
      registrations: []
    });
  }

  var values = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
  var list = [];
  for (var i = 0; i < values.length; i++) {
    var r = values[i];
    list.push({
      registrationId: r[0],
      fullName: r[1],
      college: r[2],
      department: r[3],
      phone: r[4],
      email: r[5],
      techEvent: r[6],
      techMember1: r[7],
      techMember2: r[8],
      techMember3: r[9],
      techMember4: r[10],
      nonTechEvent: r[11],
      nonTechMember1: r[12],
      nonTechMember2: r[13],
      nonTechMember3: r[14],
      nonTechMember4: r[15],
      totalMembers: Number(r[16]),
      feePerHead: Number(r[17]),
      totalAmount: Number(r[18]),
      paymentStatus: r[19],
      paymentId: r[20],
      registrationStatus: r[21],
      registeredAt: r[22],
      // New interest fields (may be empty for older registrations)
      checkmateInterested: r[23] || "",
      filmforgeInterested: r[24] || ""
    });
  }

  return createJsonResponse({
    success: true,
    count: list.length,
    registrations: list
  });
}

function handleUpdatePaymentStatus(data) {
  var token = cleanStr(data.token);
  if (!verifyAdminAuth(token)) {
    return createJsonResponse({ success: false, message: "Unauthorized." });
  }

  var regId = cleanStr(data.registrationId);
  var newStatus = cleanStr(data.paymentStatus); // "Paid" | "Pending" | "Failed" | "Submitted"

  if (!regId || !newStatus) {
    return createErrorResponse("Registration ID and Payment Status are required.");
  }

  var sheet = getOrCreateRegistrationsSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return createErrorResponse("No records found.");

  var regIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var foundRow = -1;
  for (var i = 0; i < regIds.length; i++) {
    if (String(regIds[i][0]).trim() === regId) {
      foundRow = i + 2;
      break;
    }
  }

  if (foundRow === -1) {
    return createErrorResponse("Registration ID not found: " + regId);
  }

  // Column 20 is Payment_Status
  sheet.getRange(foundRow, 20).setValue(newStatus);

  return createJsonResponse({
    success: true,
    registrationId: regId,
    paymentStatus: newStatus,
    message: "Payment status updated successfully."
  });
}

function handleUpdateRegistrationStatus(data) {
  var token = cleanStr(data.token);
  if (!verifyAdminAuth(token)) {
    return createJsonResponse({ success: false, message: "Unauthorized." });
  }

  var regId = cleanStr(data.registrationId);
  var newStatus = cleanStr(data.registrationStatus); // "Confirmed" | "Cancelled" | "Pending"

  if (!regId || !newStatus) {
    return createErrorResponse("Registration ID and Registration Status are required.");
  }

  var sheet = getOrCreateRegistrationsSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return createErrorResponse("No records found.");

  var regIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var foundRow = -1;
  for (var i = 0; i < regIds.length; i++) {
    if (String(regIds[i][0]).trim() === regId) {
      foundRow = i + 2;
      break;
    }
  }

  if (foundRow === -1) {
    return createErrorResponse("Registration ID not found: " + regId);
  }

  // Column 22 is Registration_Status
  sheet.getRange(foundRow, 22).setValue(newStatus);

  return createJsonResponse({
    success: true,
    registrationId: regId,
    registrationStatus: newStatus,
    message: "Registration status updated successfully."
  });
}

function handleDeleteRegistration(data) {
  var token = cleanStr(data.token);
  if (!verifyAdminAuth(token)) {
    return createJsonResponse({ success: false, message: "Unauthorized." });
  }

  var regId = cleanStr(data.registrationId);
  if (!regId) {
    return createErrorResponse("Registration ID is required.");
  }

  var sheet = getOrCreateRegistrationsSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return createErrorResponse("No records found.");

  var regIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var foundRow = -1;
  for (var i = 0; i < regIds.length; i++) {
    if (String(regIds[i][0]).trim() === regId) {
      foundRow = i + 2;
      break;
    }
  }

  if (foundRow === -1) {
    return createErrorResponse("Registration ID not found: " + regId);
  }

  sheet.deleteRow(foundRow);

  return createJsonResponse({
    success: true,
    registrationId: regId,
    message: "Registration deleted successfully."
  });
}

function handleSyncBulkRegistrations(data) {
  var token = cleanStr(data.token);
  if (!verifyAdminAuth(token)) {
    return createJsonResponse({ success: false, message: "Unauthorized admin token." });
  }

  var list = data.registrations;
  if (!Array.isArray(list) || list.length === 0) {
    return createJsonResponse({ success: true, syncedCount: 0, message: "No registrations provided for synchronization." });
  }

  var sheet = getOrCreateRegistrationsSheet();
  var lock = LockService.getScriptLock();
  var hasLock = lock.tryLock(30000);
  if (!hasLock) {
    return createErrorResponse("Server is busy syncing. Please retry in a moment.");
  }

  var syncedCount = 0;
  try {
    var lastRow = sheet.getLastRow();
    var existingMap = {};
    if (lastRow > 1) {
      var existingIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < existingIds.length; i++) {
        var id = String(existingIds[i][0]).trim();
        if (id) existingMap[id] = i + 2; // maps registrationId to row index
      }
    }

    for (var k = 0; k < list.length; k++) {
      var r = list[k];
      if (!r || !r.registrationId) continue;

      var regId = cleanStr(r.registrationId);
      var row = [
        regId,
        cleanStr(r.fullName),
        cleanStr(r.college),
        cleanStr(r.department),
        cleanStr(r.phone),
        cleanStr(r.email),
        cleanStr(r.techEvent),
        cleanStr(r.techMember1 || r.fullName),
        cleanStr(r.techMember2),
        cleanStr(r.techMember3),
        cleanStr(r.techMember4),
        cleanStr(r.nonTechEvent),
        cleanStr(r.nonTechMember1 || r.fullName),
        cleanStr(r.nonTechMember2),
        cleanStr(r.nonTechMember3),
        cleanStr(r.nonTechMember4),
        Number(r.totalMembers) || 1,
        Number(r.feePerHead) || CONFIG.FEE_PER_HEAD,
        Number(r.totalAmount) || (Number(r.totalMembers) || 1) * CONFIG.FEE_PER_HEAD,
        cleanStr(r.paymentStatus) || "Submitted",
        cleanStr(r.paymentId),
        cleanStr(r.registrationStatus) || "Confirmed",
        cleanStr(r.registeredAt) || Utilities.formatDate(new Date(), "GMT+05:30", "yyyy-MM-dd HH:mm:ss 'IST'"),
        cleanStr(r.checkmateInterested || ""),
        cleanStr(r.filmforgeInterested || "")
      ];

      if (existingMap[regId]) {
        // Update existing row in place (all 25 columns)
        var rowIdx = existingMap[regId];
        sheet.getRange(rowIdx, 1, 1, row.length).setValues([row]);
      } else {
        // Append new row
        sheet.appendRow(row);
        existingMap[regId] = sheet.getLastRow();
      }
      syncedCount++;
    }
  } finally {
    lock.releaseLock();
  }

  return createJsonResponse({
    success: true,
    syncedCount: syncedCount,
    message: "Successfully synchronized " + syncedCount + " registrations to Google Sheet."
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
  
  // 1. Check known tab names including exact user spreadsheet tab
  var targetNames = [
    "PIXELO 3.O – Event Registrations 2026",
    "PIXEL-3.O – Event Registrations 2026",
    "PIXELO 3.O - Event Registrations 2026",
    "PIXEL-3.O - Event Registrations 2026",
    "PIXELO 3.O",
    "PIXEL-3.O",
    "Registrations",
    "Event Registrations"
  ];
  
  var sheet = null;
  for (var k = 0; k < targetNames.length; k++) {
    sheet = ss.getSheetByName(targetNames[k]);
    if (sheet) break;
  }
  
  // 2. Case-insensitive search across all sheets
  if (!sheet) {
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      var sName = sheets[i].getName().trim().toLowerCase();
      if (
        sName.indexOf("registration") !== -1 ||
        sName.indexOf("pixel") !== -1 ||
        sName.indexOf("event") !== -1
      ) {
        sheet = sheets[i];
        break;
      }
    }
  }

  // 3. Fallback to first sheet in spreadsheet
  if (!sheet) {
    var allSheets = ss.getSheets();
    if (allSheets.length > 0) {
      sheet = allSheets[0];
    } else {
      sheet = ss.insertSheet("Registrations");
    }
  }

  // Ensure headers exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CONFIG.HEADERS);
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
