"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
admin.initializeApp();
async function checkCrewProfile() {
    var _a, _b;
    try {
        const userId = 'ozfTOauw44ZAI9FvCBkcpvAr5sy2';
        console.log(`Checking crew profile for user: ${userId}`);
        // Get crew profile document
        const crewDoc = await admin.firestore().collection('crewProfiles').doc(userId).get();
        if (!crewDoc.exists) {
            console.log('No crew profile found for user');
            return;
        }
        const crewData = crewDoc.data();
        console.log('Crew profile data:', JSON.stringify(crewData, null, 2));
        // Check for email in various locations
        console.log('Email in root:', crewData === null || crewData === void 0 ? void 0 : crewData.email);
        console.log('Email in contactInfo:', (_a = crewData === null || crewData === void 0 ? void 0 : crewData.contactInfo) === null || _a === void 0 ? void 0 : _a.email);
        console.log('Email in notificationPreferences:', (_b = crewData === null || crewData === void 0 ? void 0 : crewData.notificationPreferences) === null || _b === void 0 ? void 0 : _b.email);
    }
    catch (error) {
        console.error('Error checking crew profile:', error);
    }
    finally {
        // Close the connection
        process.exit();
    }
}
checkCrewProfile();
//# sourceMappingURL=checkCrewProfile.js.map