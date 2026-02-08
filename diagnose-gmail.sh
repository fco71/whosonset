#!/bin/bash

echo "🔍 Gmail SMTP Diagnostics Script"
echo "=================================="
echo ""

# Check if gcloud is available
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud command not found. Please run this from Google Cloud Shell or install gcloud CLI."
    exit 1
fi

echo "📋 Step 1: Checking Secret Values"
echo "---------------------------------"

echo "SMTP_USER:"
SMTP_USER=$(gcloud secrets versions access latest --secret="SMTP_USER" --project=my-film-jobs)
echo "Value: '$SMTP_USER'"
echo "Length: ${#SMTP_USER}"
echo "Has quotes: $(echo "$SMTP_USER" | grep -q '"' && echo 'YES ❌' || echo 'NO ✅')"
echo "Has newline: $(echo -n "$SMTP_USER" | wc -l | grep -q '^0$' || echo 'YES ❌')"
echo ""

echo "SMTP_PASS:"
SMTP_PASS=$(gcloud secrets versions access latest --secret="SMTP_PASS" --project=my-film-jobs)
echo "Value: '${SMTP_PASS:0:4}****${SMTP_PASS: -4}'"
echo "Length: ${#SMTP_PASS}"
echo "Has spaces: $(echo "$SMTP_PASS" | grep -q ' ' && echo 'YES ❌ (should be 16 chars, no spaces)' || echo 'NO ✅')"
echo "Expected length: 16 (actual: ${#SMTP_PASS})"
echo ""

echo "EMAIL_FROM:"
EMAIL_FROM=$(gcloud secrets versions access latest --secret="EMAIL_FROM" --project=my-film-jobs)
echo "Value: '$EMAIL_FROM'"
echo "Has quotes: $(echo "$EMAIL_FROM" | grep -q '"' && echo 'YES ❌' || echo 'NO ✅')"
echo ""

echo "📋 Step 2: Testing Gmail SMTP Connection"
echo "----------------------------------------"
echo "Using credentials from secrets..."
echo ""

# Create a temporary Python test script
cat > /tmp/test_gmail_smtp.py << 'PYTHON_SCRIPT'
import smtplib
import sys
from email.mime.text import MIMEText

smtp_user = sys.argv[1]
smtp_pass = sys.argv[2]
email_from = sys.argv[3]

print(f"Attempting connection...")
print(f"  Host: smtp.gmail.com:587")
print(f"  User: {smtp_user}")
print(f"  Pass: {smtp_pass[:4]}****")
print("")

try:
    # Create SMTP connection
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.set_debuglevel(0)
    server.starttls()

    print("✅ TLS connection established")

    # Attempt login
    print("Attempting authentication...")
    server.login(smtp_user, smtp_pass)

    print("✅ Authentication successful!")

    # Try sending a test email
    msg = MIMEText('This is a test email from Gmail SMTP diagnostics.')
    msg['Subject'] = '✅ Gmail SMTP Diagnostic Test'
    msg['From'] = f'My Film Jobs <{email_from}>'
    msg['To'] = 'franciscovaldez@yahoo.com'

    print("Sending test email to franciscovaldez@yahoo.com...")
    server.send_message(msg)

    print("✅ Email sent successfully!")
    print("")
    print("🎉 All tests passed! Gmail SMTP is working correctly.")

    server.quit()
    sys.exit(0)

except smtplib.SMTPAuthenticationError as e:
    print(f"❌ Authentication failed: {e}")
    print("")
    print("Common causes:")
    print("1. App Password is incorrect")
    print("2. App Password has spaces or extra characters")
    print("3. 2-Step Verification is not enabled on the Google account")
    print("4. App Password was revoked or expired")
    print("")
    print("To fix:")
    print("1. Go to: https://myaccount.google.com/apppasswords")
    print("2. Generate a NEW App Password")
    print("3. Copy the 16-character password (no spaces)")
    print("4. Update the secret:")
    print("   echo 'your-new-app-password' | gcloud secrets versions add SMTP_PASS --data-file=-")
    sys.exit(1)

except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
PYTHON_SCRIPT

# Run the Python test
python3 /tmp/test_gmail_smtp.py "$SMTP_USER" "$SMTP_PASS" "$EMAIL_FROM"

EXIT_CODE=$?

# Clean up
rm /tmp/test_gmail_smtp.py

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "=================================="
    echo "✅ DIAGNOSTICS COMPLETE - ALL GOOD"
    echo "=================================="
    echo ""
    echo "Your Firebase Functions should now be able to send emails."
    echo "The functions may need 30-60 seconds to pick up the new secret values."
else
    echo ""
    echo "=================================="
    echo "❌ DIAGNOSTICS FAILED"
    echo "=================================="
    echo ""
    echo "Please follow the fix instructions above."
fi

exit $EXIT_CODE
