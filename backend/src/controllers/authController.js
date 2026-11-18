const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { success, error } = require("../utils/response");
const { recordAudit } = require("../middleware/audit");
const store = require("../services/store");

const JWT_SECRET = process.env.JWT_SECRET || "caresphere-dev-secret-key-32chars-min-security-test";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Register User
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { email, mobile, password, role = "PATIENT", fullName, address, pinCode, cityId = "bengaluru", gender } = req.body;

    if (!mobile || !password || !fullName || !address) {
      return error(res, "Missing required fields: mobile, password, fullName, address are required.", 400);
    }

    if (password.length < 6) {
      return error(res, "Password must be at least 6 characters.", 400);
    }

    // Check existing
    const existing = store.users.find(u => u.mobile === mobile || (email && u.email === email));
    if (existing) {
      return error(res, "A user with this mobile number or email already exists.", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const normalizedRole = String(role).toUpperCase();

    const newUser = {
      id: `usr-${Date.now()}`,
      email: email || null,
      mobile,
      passwordHash,
      role: normalizedRole,
      cityId,
      isVerified: normalizedRole === "PATIENT",
      createdAt: new Date().toISOString(),
      profile: {
        fullName,
        gender: gender || "Not specified",
        address,
        pinCode: pinCode || "560001",
        preferredLanguage: "en"
      }
    };

    store.users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, mobile: newUser.mobile, cityId: newUser.cityId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    await recordAudit(newUser.id, "USER_REGISTER", "USER", newUser.id, req, { role: newUser.role });

    return success(res, {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        cityId: newUser.cityId,
        profile: newUser.profile
      }
    }, "Account successfully created.", 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Login User
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { identifier, password } = req.body; // identifier can be mobile or email

    if (!identifier || !password) {
      return error(res, "Mobile/email identifier and password are required.", 400);
    }

    const user = store.users.find(u => u.mobile === identifier || u.email === identifier);
    if (!user) {
      return error(res, "Invalid credentials.", 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return error(res, "Invalid credentials.", 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, mobile: user.mobile, cityId: user.cityId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    await recordAudit(user.id, "USER_LOGIN", "USER", user.id, req);

    return success(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        cityId: user.cityId,
        profile: user.profile
      }
    }, "Login successful.");
  } catch (err) {
    next(err);
  }
}

/**
 * Get Authenticated User Profile
 * GET /api/auth/me
 */
async function me(req, res, next) {
  try {
    const user = store.users.find(u => u.id === req.user.id);
    if (!user) {
      return error(res, "User profile not found.", 404);
    }

    return success(res, {
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      cityId: user.cityId,
      profile: user.profile
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Logout
 * POST /api/auth/logout
 */
async function logout(req, res, next) {
  try {
    if (req.user?.id) {
      await recordAudit(req.user.id, "USER_LOGOUT", "USER", req.user.id, req);
    }
    return success(res, null, "Logged out successfully.");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  me,
  logout
};
