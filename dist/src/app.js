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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
console.log("🚀 Initializing Express app...");
const app = (0, express_1.default)();
console.log("✅ Express app created");
// Error handling middleware - MUST be first
app.use((req, res, next) => {
    console.log(`📍 Incoming request: ${req.method} ${req.path}`);
    next();
});
// Middleware
try {
    console.log("🔄 Setting up middleware...");
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    console.log("✅ Middleware configured");
}
catch (error) {
    console.error("❌ Error setting up middleware:", error.message);
}
// Health Check
app.get("/", (req, res) => {
    console.log("✅ Health check endpoint hit");
    res.json({
        status: "ok",
        message: "API is running on Vercel! 🚀",
        timestamp: new Date().toISOString(),
    });
});
// Test Supabase route
app.get("/api/test-db", async (req, res) => {
    console.log("🔄 Testing Supabase connection...");
    try {
        const { supabase } = await Promise.resolve().then(() => __importStar(require("./db/supabase")));
        const { data, error } = await supabase.from("todos").select("*").limit(1);
        if (error) {
            console.error("❌ Supabase error:", error);
            return res.status(500).json({
                success: false,
                message: "Supabase error",
                error: error.message,
            });
        }
        console.log("✅ Supabase connection successful!");
        res.json({ success: true, message: "Supabase connected!", data });
    }
    catch (error) {
        console.error("❌ Test DB error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
// ... route lainnya (todos, dll)
// Global error handler - MUST be last
app.use((err, req, res, next) => {
    console.error("💥 UNHANDLED ERROR:", err);
    console.error("💥 Stack:", err.stack);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});
console.log("✅ Express app initialization complete!");
exports.default = app;
