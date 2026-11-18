const { success, error } = require("../utils/response");
const { recordAudit } = require("../middleware/audit");
const store = require("../services/store");

/**
 * Request an Appointment
 * POST /api/appointments
 */
async function requestAppointment(req, res, next) {
  try {
    const { doctorId, hospitalId, appointmentDate, timeSlot, reason } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return error(res, "doctorId, appointmentDate, and timeSlot are required.", 400);
    }

    const doctor = store.doctors.find(d => d.id === doctorId);
    if (!doctor) {
      return error(res, `Doctor '${doctorId}' not found.`, 404);
    }

    const patientId = req.user?.id || "guest-patient";

    const appointment = {
      id: `apt-${Date.now()}`,
      patientId,
      doctorId,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospitalId: hospitalId || doctor.hospitalId,
      appointmentDate,
      timeSlot,
      reason: reason || "General Consultation",
      status: "CONFIRMED",
      createdAt: new Date().toISOString()
    };

    store.appointments.push(appointment);

    await recordAudit(patientId, "REQUEST_APPOINTMENT", "APPOINTMENT", appointment.id, req, { doctorId, timeSlot });

    return success(res, appointment, "Appointment consultation request confirmed.", 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Get Patient's Appointments
 * GET /api/appointments
 */
async function getMyAppointments(req, res, next) {
  try {
    const patientId = req.user?.id;
    const list = store.appointments.filter(a => a.patientId === patientId);
    return success(res, list, `Retrieved ${list.length} appointments.`);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  requestAppointment,
  getMyAppointments
};
