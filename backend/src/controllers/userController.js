const { success, error } = require("../utils/response");
const store = require("../services/store");

/**
 * Get Current User Profile
 * GET /api/users/profile
 */
async function getProfile(req, res, next) {
  try {
    const user = store.users.find(u => u.id === req.user.id);
    if (!user) {
      return error(res, "User not found.", 404);
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
 * Update Current User Profile
 * PUT /api/users/profile
 */
async function updateProfile(req, res, next) {
  try {
    const user = store.users.find(u => u.id === req.user.id);
    if (!user) {
      return error(res, "User not found.", 404);
    }

    const { fullName, address, pinCode, preferredLanguage, gender } = req.body;

    if (!user.profile) user.profile = {};
    if (fullName) user.profile.fullName = fullName;
    if (address) user.profile.address = address;
    if (pinCode) user.profile.pinCode = pinCode;
    if (preferredLanguage) user.profile.preferredLanguage = preferredLanguage;
    if (gender) user.profile.gender = gender;

    return success(res, {
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      cityId: user.cityId,
      profile: user.profile
    }, "Profile updated successfully.");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile
};
