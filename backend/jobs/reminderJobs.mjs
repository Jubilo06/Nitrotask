import cron from "node-cron";
import Todo from "../models/Todomodel.mjs";
import { sendEmail } from "../utils/emailService.mjs";
const REMINDER_CONFIG = {
  // You can define multiple reminder intervals if needed
  // For simplicity, this example sends one reminder at 1 hour before.
  // To send multiple, you'd iterate through this array and check `lastReminderSentAt` more carefully.
  PRIMARY_REMINDER_MINUTES_BEFORE: 15, // Send a reminder 1 hour before the meeting
  // You could add a SECONDARY_REMINDER_DAYS_BEFORE: 1, etc.
};

// --- Email Content Helper ---
const createReminderEmailContent = (meeting, minutesUntilMeeting) => {
  const meetingDueDate = new Date(meeting.dueDate);
  const ownerName = meeting.user?.name || "Organizer"; // Assuming user is populated and has a name

  return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #333;">Meeting Reminder</h2>
            <p>Hi team,</p>
            <p>This is a reminder for your upcoming meeting:</p>
            <h3 style="color: #007bff;">${meeting.name}</h3>
            <p><strong>Scheduled For:</strong> ${meetingDueDate.toLocaleString(
              "en-US",
              { dateStyle: "full", timeStyle: "short" }
            )}</p>
            <p><strong>Time Remaining:</strong> Approximately ${minutesUntilMeeting} hour(s) from now.</p>
            <p><strong>Description:</strong> ${
              meeting.description || "No description provided."
            }</p>

            <p>Please ensure you are prepared. If you have any questions, please contact the organizer.</p>

            <p>Best regards,<br/>The Todo App Team</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.8em; color: #777;">This is an automated reminder. Please do not reply to this email.</p>
        </div>
    `;
};

// Function to check for and send reminders
const checkAndSendReminders = async () => {
  console.log(`[ReminderJob] Running check at ${new Date().toLocaleString()}`);
  const now = new Date();

  // Calculate the threshold for the primary reminder
  // We want to find meetings due exactly `PRIMARY_REMINDER_HOURS_BEFORE` hours from now,
  // or within a small window *after* that precise moment, but *before* the meeting actually starts.
  const targetDueDateForReminder = new Date(
    now.getTime() +
      REMINDER_CONFIG.PRIMARY_REMINDER_MINUTES_BEFORE * 60 * 1000
  );

  const reminderCheckWindowStart = now; // Meetings from now
  const reminderCheckWindowEnd = new Date(now.getTime() + 15 * 60 * 1000);
  console.log(
    `[ReminderJob] Looking for meetings between ${reminderCheckWindowStart.toLocaleString()} and ${reminderCheckWindowEnd.toLocaleString()} (UTC)`
  );

  try {
    // Find todos that are:
    // 1. Meetings (isMeeting: true)
    // 2. Not yet done (done: false)
    // 3. Have a dueDate
    // 4. Their dueDate falls within our specific reminder window
    // 5. AND no reminder has been sent for this todo yet (lastReminderSentAt is null)
    //    OR the last reminder was sent *before* this reminder window (meaning we can send a new one, if multiple intervals were configured)
    const query = {
      isMeeting: true,
      done: false,
      dueDate: {
        // $gt: now,
        $gt: reminderCheckWindowStart,
        $lte: reminderCheckWindowEnd, // Meeting is due on or before the end of our reminder window
      },
      $or: [
        { lastReminderSentAt: { $eq: null } }, // No reminder sent yet
        { lastReminderSentAt: { $lt: reminderCheckWindowStart } }, // Or last reminder was sent in the past (could be used for multiple reminders)
        // For a single reminder, this implies 'null' or a much older date
      ],
    };

    const upcomingMeetings = await Todo.find(query)
      .populate("user", "email name") // Populate user to get owner's email/name
      .lean(); // Use .lean() for faster queries if you're not saving the document again in the loop

    console.log(
      `[ReminderJob] Found ${upcomingMeetings.length} upcoming meetings requiring reminders.`
    );

    for (const meeting of upcomingMeetings) {
      const meetingDueDate = new Date(meeting.dueDate);
      const timeUntilMeetingMs = meetingDueDate.getTime() - now.getTime();
      const minutesUntilMeeting = Math.max(
        0,
        Math.round(timeUntilMeetingMs / (1000 * 60 ))
      ); // Don't show negative hours
      const subject = `Reminder: Your Meeting "${meeting.name}" is in ${minutesUntilMeeting} hour(s)!`;
      const htmlContent = createReminderEmailContent(
          meeting,
          minutesUntilMeeting 
      )
      if (
        minutesUntilMeeting > 0 &&
        minutesUntilMeeting <=
          REMINDER_CONFIG.PRIMARY_REMINDER_MINUTES_BEFORE + 5
      ) {
           console.log(
          `[ReminderJob] Skipping reminder for "${meeting.name}" (ID: ${meeting._id}). Not within precise ${REMINDER_CONFIG.PRIMARY_REMINDER_MINUTES_BEFORE} minute window.`
        );
        let reminderSentSuccessfully = false;
        for (const member of meeting.meetingMembers) {
          if (member.email && member.notificationMethod === "email") {
            console.log(
              `[ReminderJob] Attempting to send email to member ${member.email} for meeting "${meeting.name}"`
            );
            const success = await sendEmail(member.email, subject, htmlContent); // subject and htmlContent are now defined
            if (success) {
              reminderSentSuccessfully = true;
              console.log(
                `[ReminderJob] Successfully sent reminder to member ${member.email}`
              );
            }
          }
        }
        
        if (meeting.user && meeting.user.email) {
          console.log(
            `[ReminderJob] Attempting to send email to owner ${meeting.user.email} for meeting "${meeting.name}"`
          );
          const success = await sendEmail(
            meeting.user.email,
            subject,
            htmlContent // subject and htmlContent are now defined
          );
          if (success) {
            reminderSentSuccessfully = true;
            console.log(
              `[ReminderJob] Successfully sent reminder to owner ${meeting.user.email}`
            );
          }
        }
        if (reminderSentSuccessfully) {
          await Todo.findByIdAndUpdate(meeting._id, {
            $set: { lastReminderSentAt: now },
          });
          console.log(
            `[ReminderJob] Updated lastReminderSentAt for meeting "${
              meeting.name
            }" (${meeting._id}) to ${now.toLocaleString()}`
          );
        } else {
          console.log(
            `[ReminderJob] No reminders were sent for meeting "${meeting.name}" (${meeting._id}). Not updating lastReminderSentAt.`
          );
        }
        
        
      }else {
        console.log(
          `[ReminderJob] Skipping reminder for "${meeting.name}" (ID: ${meeting._id}). Not within the desired trigger window (currently ${minutesUntilMeeting} mins away).`
        );
      }
    
    console.log(`[ReminderJob] Reminder check completed.`);
      
    }
    console.log(`[ReminderJob] Reminder check completed.`);
  } catch (error) {
    console.error(`[ReminderJob] Error in checkAndSendReminders job:`, error);
  }
};

// Schedule the job to run every 15 minutes
export const startReminderJob = () => {
  cron.schedule("*/15 * * * *", checkAndSendReminders, {
    scheduled: true,
    timezone: "UTC", // Or "America/New_York", etc.
  });
  console.log("[ReminderJob] Scheduled to run every 15 minutes (UTC).");
};
