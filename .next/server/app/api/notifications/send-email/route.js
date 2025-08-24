(()=>{var a={};a.id=6980,a.ids=[6980],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},10930:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>C,patchFetch:()=>B,routeModule:()=>x,serverHooks:()=>A,workAsyncStorage:()=>y,workUnitAsyncStorage:()=>z});var d={};c.r(d),c.d(d,{POST:()=>w});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190),v=c(49526);async function w(a){try{let{to:b,notification:c,customData:d}=await a.json();if(!b||!c)return u.NextResponse.json({error:"Email address and notification are required"},{status:400});let e=v.createTransport({host:process.env.SMTP_HOST||"smtp.gmail.com",port:parseInt(process.env.SMTP_PORT||"587"),secure:!1,auth:{user:process.env.SMTP_USER||"tgarrick@westendworkforce.com",pass:process.env.SMTP_PASS||"ixan edkv dsde clou"},tls:{rejectUnauthorized:!1}}),f=function(a,b){let c={companyName:"West End Workforce",logoUrl:"https://westendworkforce.com/logo.png",supportEmail:"support@westendworkforce.com",...b};switch(a){case"timesheet_submitted":return{subject:`Timesheet Submitted - ${c.employeeName||"Employee"}`,htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; text-align: center;">
              <h2 style="color: #333; margin: 0;">${c.companyName}</h2>
              <p style="color: #666; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #333; margin-bottom: 20px;">Timesheet Submitted for Approval</h3>
              <p>Hello ${c.managerName||"Manager"},</p>
              <p>A new timesheet has been submitted and requires your approval:</p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Employee:</strong> ${c.employeeName||"Employee"}</p>
                <p><strong>Period:</strong> ${c.period||"Current Period"}</p>
                <p><strong>Total Hours:</strong> ${c.totalHours||"N/A"}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p>Please review and approve or reject this timesheet as soon as possible.</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          Timesheet Submitted - ${c.employeeName||"Employee"}
          
          Hello ${c.managerName||"Manager"},
          
          A new timesheet has been submitted and requires your approval:
          
          Employee: ${c.employeeName||"Employee"}
          Period: ${c.period||"Current Period"}
          Total Hours: ${c.totalHours||"N/A"}
          Submitted: ${new Date().toLocaleDateString()}
          
          Please review and approve or reject this timesheet as soon as possible.
          
          Best regards,
          ${c.companyName} Team
        `};case"expense_submitted":return{subject:`Expense Submitted - $${c.amount||0}`,htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; text-align: center;">
              <h2 style="color: #333; margin: 0;">${c.companyName}</h2>
              <p style="color: #666; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #333; margin-bottom: 20px;">💰 Expense Submitted for Approval</h3>
              <p>Hello ${c.managerName||"Manager"},</p>
              <p>A new expense has been submitted and requires your approval:</p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Employee:</strong> ${c.employeeName||"Employee"}</p>
                <p><strong>Amount:</strong> $${c.amount||0}</p>
                <p><strong>Description:</strong> ${c.description||"N/A"}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p>Please review and approve or reject this expense as soon as possible.</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          Expense Submitted - $${c.amount||0}
          
          Hello ${c.managerName||"Manager"},
          
          A new expense has been submitted and requires your approval:
          
          Employee: ${c.employeeName||"Employee"}
          Amount: $${c.amount||0}
          Description: ${c.description||"N/A"}
          Submitted: ${new Date().toLocaleDateString()}
          
          Please review and approve or reject this expense as soon as possible.
          
          Best regards,
          ${c.companyName} Team
        `};case"timesheet_approved":return{subject:"Timesheet Approved",htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #d4edda; padding: 20px; text-align: center;">
              <h2 style="color: #155724; margin: 0;">${c.companyName}</h2>
              <p style="color: #155724; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #333; margin-bottom: 20px;">✅ Timesheet Approved</h3>
              <p>Hello ${c.employeeName||"Employee"},</p>
              <p>Great news! Your timesheet has been approved:</p>
              <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Period:</strong> ${c.period||"Current Period"}</p>
                <p><strong>Total Hours:</strong> ${c.totalHours||"N/A"}</p>
                <p><strong>Approved:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p>Your timesheet is now complete for this period. Thank you for your timely submission!</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          Timesheet Approved
          
          Hello ${c.employeeName||"Employee"},
          
          Great news! Your timesheet has been approved:
          
          Period: ${c.period||"Current Period"}
          Total Hours: ${c.totalHours||"N/A"}
          Approved: ${new Date().toLocaleDateString()}
          
          Your timesheet is now complete for this period. Thank you for your timely submission!
          
          Best regards,
          ${c.companyName} Team
        `};case"timesheet_rejected":return{subject:"Timesheet Rejected - Action Required",htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8d7da; padding: 20px; text-align: center;">
              <h2 style="color: #721c24; margin: 0;">${c.companyName}</h2>
              <p style="color: #721c24; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #721c24; margin-bottom: 20px;">❌ Timesheet Rejected</h3>
              <p>Hello ${c.employeeName||"Employee"},</p>
              <p>Your timesheet has been rejected and requires your attention:</p>
              <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Period:</strong> ${c.period||"Current Period"}</p>
                <p><strong>Reason:</strong> ${c.reason||"Please review and correct issues"}</p>
                <p><strong>Rejected:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p>Please review the feedback, make necessary corrections, and resubmit your timesheet.</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          Timesheet Rejected - Action Required
          
          Hello ${c.employeeName||"Employee"},
          
          Your timesheet has been rejected and requires your attention:
          
          Period: ${c.period||"Current Period"}
          Reason: ${c.reason||"Please review and correct issues"}
          Rejected: ${new Date().toLocaleDateString()}
          
          Please review the feedback, make necessary corrections, and resubmit your timesheet.
          
          Best regards,
          ${c.companyName} Team
        `};case"expense_approved":return{subject:"Expense Approved",htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #d4edda; padding: 20px; text-align: center;">
              <h2 style="color: #155724; margin: 0;">${c.companyName}</h2>
              <p style="color: #155724; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #333; margin-bottom: 20px;">✅ Expense Approved</h3>
              <p>Hello ${c.employeeName||"Employee"},</p>
              <p>Great news! Your expense has been approved:</p>
              <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Amount:</strong> $${c.amount||0}</p>
                <p><strong>Description:</strong> ${c.description||"N/A"}</p>
                <p><strong>Approved:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p>Your expense is now approved and will be processed for reimbursement.</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          Expense Approved
          
          Hello ${c.employeeName||"Employee"},
          
          Great news! Your expense has been approved:
          
          Amount: $${c.amount||0}
          Description: ${c.description||"N/A"}
          Approved: ${new Date().toLocaleDateString()}
          
          Your expense is now approved and will be processed for reimbursement.
          
          Best regards,
          ${c.companyName} Team
        `};case"expense_rejected":return{subject:"Expense Rejected - Action Required",htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8d7da; padding: 20px; text-align: center;">
              <h2 style="color: #721c24; margin: 0;">${c.companyName}</h2>
              <p style="color: #721c24; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #721c24; margin-bottom: 20px;">❌ Expense Rejected</h3>
              <p>Hello ${c.employeeName||"Employee"},</p>
              <p>Your expense has been rejected and requires your attention:</p>
              <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Amount:</strong> $${c.amount||0}</p>
                <strong>Description:</strong> ${c.description||"N/A"}</p>
                <p><strong>Reason:</strong> ${c.reason||"Please review and correct issues"}</p>
                <p><strong>Rejected:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p>Please review the feedback, make necessary corrections, and resubmit your expense.</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          Expense Rejected - Action Required
          
          Hello ${c.employeeName||"Employee"},
          
          Your expense has been rejected and requires your attention:
          
          Amount: $${c.amount||0}
          Description: ${c.description||"N/A"}
          Reason: ${c.reason||"Please review and correct issues"}
          Rejected: ${new Date().toLocaleDateString()}
          
          Please review the feedback, make necessary corrections, and resubmit your expense.
          
          Best regards,
          ${c.companyName} Team
        `};case"timesheet_overdue":return{subject:"⚠️ Timesheet Overdue - Urgent Action Required",htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #fff3cd; padding: 20px; text-align: center;">
              <h2 style="color: #856404; margin: 0;">${c.companyName}</h2>
              <p style="color: #856404; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #856404; margin-bottom: 20px;">⚠️ Timesheet Overdue</h3>
              <p>Hello ${c.employeeName||"Employee"},</p>
              <p><strong>Your timesheet is overdue and requires immediate attention!</strong></p>
              <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Period:</strong> ${c.period||"Current Period"}</p>
                <p><strong>Days Overdue:</strong> ${c.daysOverdue||"Multiple days"}</p>
                <p><strong>Due Date:</strong> ${c.dueDate||"N/A"}</p>
              </div>
              <p>Please submit your timesheet immediately to avoid any delays in processing.</p>
              <p>If you have any questions or need assistance, please contact support at ${c.supportEmail} immediately.</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an urgent automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          ⚠️ Timesheet Overdue - Urgent Action Required
          
          Hello ${c.employeeName||"Employee"},
          
          Your timesheet is overdue and requires immediate attention!
          
          Period: ${c.period||"Current Period"}
          Days Overdue: ${c.daysOverdue||"Multiple days"}
          Due Date: ${c.dueDate||"N/A"}
          
          Please submit your timesheet immediately to avoid any delays in processing.
          
          If you have any questions or need assistance, please contact support at ${c.supportEmail} immediately.
          
          Best regards,
          ${c.companyName} Team
        `};case"period_complete":return{subject:"\uD83C\uDF89 Period Complete - Congratulations!",htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #d4edda; padding: 20px; text-align: center;">
              <h2 style="color: #155724; margin: 0;">${c.companyName}</h2>
              <p style="color: #155724; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #333; margin-bottom: 20px;">🎉 Period Complete!</h3>
              <p>Hello ${c.employeeName||"Employee"},</p>
              <p>Congratulations! Your timesheet and expenses for this period have been fully approved:</p>
              <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Period:</strong> ${c.period||"Current Period"}</p>
                <p><strong>Timesheet Status:</strong> ✅ Approved</p>
                <p><strong>Expenses Status:</strong> ✅ Approved</p>
                <p><strong>Completed:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p>Great job staying on top of your reporting! Your period is now complete and will be processed for payroll.</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          🎉 Period Complete - Congratulations!
          
          Hello ${c.employeeName||"Employee"},
          
          Congratulations! Your timesheet and expenses for this period have been fully approved:
          
          Period: ${c.period||"Current Period"}
          Timesheet Status: ✅ Approved
          Expenses Status: ✅ Approved
          Completed: ${new Date().toLocaleDateString()}
          
          Great job staying on top of your reporting! Your period is now complete and will be processed for payroll.
          
          Best regards,
          ${c.companyName} Team
        `};case"deadline_reminder":return{subject:`⏰ Deadline Reminder - ${c.type||"Action Required"}`,htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #fff3cd; padding: 20px; text-align: center;">
              <h2 style="color: #856404; margin: 0;">${c.companyName}</h2>
              <p style="color: #856404; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #856404; margin-bottom: 20px;">⏰ Deadline Reminder</h3>
              <p>Hello ${c.employeeName||"Employee"},</p>
              <p>This is a friendly reminder about an upcoming deadline:</p>
              <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Type:</strong> ${c.type||"Action Required"}</p>
                <p><strong>Deadline:</strong> ${c.deadline||"N/A"}</p>
                <p><strong>Days Until Due:</strong> ${c.daysUntil||"N/A"}</p>
              </div>
              <p>Please ensure you complete this action before the deadline to avoid any delays.</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          ⏰ Deadline Reminder - ${c.type||"Action Required"}
          
          Hello ${c.employeeName||"Employee"},
          
          This is a friendly reminder about an upcoming deadline:
          
          Type: ${c.type||"Action Required"}
          Deadline: ${c.deadline||"N/A"}
          Days Until Due: ${c.daysUntil||"N/A"}
          
          Please ensure you complete this action before the deadline to avoid any delays.
          
          Best regards,
          ${c.companyName} Team
        `};case"payroll_cutoff":return{subject:"\uD83D\uDCB0 Payroll Cutoff Reminder",htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #d1ecf1; padding: 20px; text-align: center;">
              <h2 style="color: #0c5460; margin: 0;">${c.companyName}</h2>
              <p style="color: #0c5460; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #333; margin-bottom: 20px;">💰 Payroll Cutoff Reminder</h3>
              <p>Hello ${c.employeeName||"Employee"},</p>
              <p>This is a reminder about the upcoming payroll cutoff:</p>
              <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Cutoff Date:</strong> ${c.cutoffDate||"N/A"}</p>
                <p><strong>Days Until Cutoff:</strong> ${c.daysUntil||"N/A"}</p>
                <p><strong>Action Required:</strong> Submit timesheet and expenses</p>
              </div>
              <p>Please ensure your timesheet and expenses are submitted and approved before the cutoff to ensure timely payment processing.</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          💰 Payroll Cutoff Reminder
          
          Hello ${c.employeeName||"Employee"},
          
          This is a reminder about the upcoming payroll cutoff:
          
          Cutoff Date: ${c.cutoffDate||"N/A"}
          Days Until Cutoff: ${c.daysUntil||"N/A"}
          Action Required: Submit timesheet and expenses
          
          Please ensure your timesheet and expenses are submitted and approved before the cutoff to ensure timely payment processing.
          
          Best regards,
          ${c.companyName} Team
        `};case"manager_pending_reminder":return{subject:"\uD83D\uDCCB Pending Approvals - Action Required",htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8d7da; padding: 20px; text-align: center;">
              <h2 style="color: #721c24; margin: 0;">${c.companyName}</h2>
              <p style="color: #721c24; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #333; margin-bottom: 20px;">📋 Pending Approvals</h3>
              <p>Hello ${c.managerName||"Manager"},</p>
              <p>You have pending items that require your approval:</p>
              <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Pending Timesheets:</strong> ${c.pendingTimesheets||0}</p>
                <p><strong>Pending Expenses:</strong> ${c.pendingExpenses||0}</p>
                <p><strong>Total Pending:</strong> ${c.pendingCount||0}</p>
              </div>
              <p>Please review and process these pending items as soon as possible to avoid delays for your team members.</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          📋 Pending Approvals - Action Required
          
          Hello ${c.managerName||"Manager"},
          
          You have pending items that require your approval:
          
          Pending Timesheets: ${c.pendingTimesheets||0}
          Pending Expenses: ${c.pendingExpenses||0}
          Total Pending: ${c.pendingCount||0}
          
          Please review and process these pending items as soon as possible to avoid delays for your team members.
          
          Best regards,
          ${c.companyName} Team
        `};default:return{subject:"Notification from West End Workforce",htmlBody:`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; text-align: center;">
              <h2 style="color: #333; margin: 0;">${c.companyName}</h2>
              <p style="color: #666; margin: 10px 0 0 0;">Timesheet & Expense Management</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              <h3 style="color: #333; margin-bottom: 20px;">System Notification</h3>
              <p>Hello,</p>
              <p>You have received a notification from the West End Workforce system.</p>
              <p>If you have any questions, please contact support at ${c.supportEmail}.</p>
              <p>Best regards,<br>${c.companyName} Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an automated notification from the West End Workforce system.</p>
            </div>
          </div>
        `,textBody:`
          Notification from West End Workforce
          
          Hello,
          
          You have received a notification from the West End Workforce system.
          
          If you have any questions, please contact support at ${c.supportEmail}.
          
          Best regards,
          ${c.companyName} Team
        `}}}(c.type,d),g={from:`${process.env.EMAIL_FROM_NAME||"West End Workforce"} <${process.env.EMAIL_FROM||"notifications@westendworkforce.com"}>`,to:b,replyTo:process.env.EMAIL_REPLY_TO||"support@westendworkforce.com",subject:f.subject,html:f.htmlBody,text:f.textBody},h=await e.sendMail(g);return u.NextResponse.json({success:!0,messageId:h.messageId,message:"Email sent successfully"})}catch(a){return console.error("Failed to send email:",a),u.NextResponse.json({error:"Failed to send email"},{status:500})}}let x=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/notifications/send-email/route",pathname:"/api/notifications/send-email",filename:"route",bundlePath:"app/api/notifications/send-email/route"},distDir:".next",projectDir:"",resolvedPagePath:"/Users/virtual24/Projects/west-end-workforce/src/app/api/notifications/send-email/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:y,workUnitAsyncStorage:z,serverHooks:A}=x;function B(){return(0,g.patchFetch)({workAsyncStorage:y,workUnitAsyncStorage:z})}async function C(a,b,c){var d;let e="/api/notifications/send-email/route";"/index"===e&&(e="/");let g=await x.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:y,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!y){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||x.isDev||y||(G="/index"===(G=D)?"/":G);let H=!0===x.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>x.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>x.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await x.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await x.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),y&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await x.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},14985:a=>{"use strict";a.exports=require("dns")},21820:a=>{"use strict";a.exports=require("os")},27910:a=>{"use strict";a.exports=require("stream")},28354:a=>{"use strict";a.exports=require("util")},29021:a=>{"use strict";a.exports=require("fs")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:a=>{"use strict";a.exports=require("path")},34631:a=>{"use strict";a.exports=require("tls")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{"use strict";a.exports=require("crypto")},55591:a=>{"use strict";a.exports=require("https")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:a=>{"use strict";a.exports=require("zlib")},78335:()=>{},79551:a=>{"use strict";a.exports=require("url")},79646:a=>{"use strict";a.exports=require("child_process")},81630:a=>{"use strict";a.exports=require("http")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},91645:a=>{"use strict";a.exports=require("net")},94735:a=>{"use strict";a.exports=require("events")},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[4985,6055,9526],()=>b(b.s=10930));module.exports=c})();