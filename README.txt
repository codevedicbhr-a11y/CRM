# Code Vedic Agency CRM — Setup Guide

This is a lightweight HTML CRM for Code Vedic IT Solutions. It manages agency leads/clients for Social Media Management/Marketing, Web Design & Development, SEO, SMO, Digital Marketing and IT/computer training. Records are stored in a Google Sheet through Google Apps Script.

## Files
- `index.html` — CRM user interface and reports
- `Code.gs` — Google Apps Script API that reads/writes your Google Sheet

## Connect Google Sheets (one-time setup)
1. Create a new Google Sheet in the Google account where you want CRM data saved.
2. Open **Extensions → Apps Script**.
3. Replace the editor code with the full contents of `Code.gs`.
4. Save. From the function dropdown select `setupSheet`, then click **Run** and approve the requested Google permissions. This creates the `CRM_Leads` tab and its column headers.
5. Click **Deploy → New deployment**.
6. Select the gear/type icon and choose **Web app**.
7. Set **Execute as** to **Me**. Set **Who has access** to **Anyone** (or the most restrictive access option that works for your intended users and organization). Deploy and authorize if prompted.
8. Copy the Web app URL ending in `/exec`.
9. Open `index.html` in a text editor. Find:
   `const API_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";`
   Replace the placeholder with your `/exec` URL. Keep the quotation marks.
10. Host `index.html` on your website or open it in a browser, then click **Refresh**. The connection badge should show connected.

## How to use
- Add a lead/client with name, phone, service, status, follow-up date, expected value, notes and assigned team member.
- Use search and status filter to find records.
- Edit or delete records from the list.
- Dashboard and Reports show counts, potential pipeline value, follow-ups due, service-wise leads and status summaries.
- Export the loaded records as CSV for additional reporting.

## Important security notes
- The web app URL is an access endpoint. If deployed as **Anyone**, anyone who obtains the URL may be able to read, add, edit or delete CRM records. Do not publish it in public source code if your leads are sensitive. For internal/business use, consider restricting access and hosting behind an authenticated setup.
- This starter version does not include user accounts, role permissions, automated backups, or audit logs. Keep the Google Sheet private and make periodic copies.
- If you change Apps Script code after deployment, open **Deploy → Manage deployments → Edit** and deploy a new version.
- If a browser blocks a local file or requests behave inconsistently, host `index.html` on HTTPS (for example, your own domain or a static hosting provider).
