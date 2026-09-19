"""
EDUVA AI - Real Transactional Email Verification Service
=========================================================
Integrates Resend transactional email API via EMAIL_API_KEY.
Features:
1. Direct HTTPS REST API to https://api.resend.com/emails (no third-party library needed).
2. Authoritative HTML email verification template.
3. Safe fallback mode for local development when EMAIL_API_KEY is not configured,
   logging the verification link cleanly without exposing secrets.
"""

import os
import json
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, Optional

logger = logging.getLogger("eduva.email_service")


class EmailService:
    def __init__(self):
        self.api_key = os.getenv("EMAIL_API_KEY", "").strip()
        self.from_email = os.getenv("EMAIL_FROM", "Eduva AI <onboarding@resend.dev>").strip()
        self.app_url = os.getenv("APP_URL", "http://localhost:5173").rstrip("/")

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.startswith("re_"))

    def send_verification_email(self, to_email: str, student_name: str, verification_token: str) -> Dict[str, Any]:
        """
        Sends an account verification email containing the one-time activation link.
        """
        clean_email = to_email.strip().lower()
        clean_name = (student_name or "Student").strip()
        verification_url = f"{self.app_url}/verify?token={verification_token}"

        subject = "Verify your Eduva AI Account"
        html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify your Eduva AI Account</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FBFBFB; margin: 0; padding: 24px; color: #191B1F; }}
    .container {{ max-width: 540px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E1DA; border-radius: 16px; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }}
    .logo {{ font-size: 20px; font-weight: 800; color: #4F46E5; letter-spacing: -0.03em; }}
    .badge {{ display: inline-block; background: #E7F5F1; color: #0F766E; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; }}
    h1 {{ font-size: 22px; font-weight: 800; color: #191B1F; margin: 16px 0 8px; }}
    p {{ font-size: 14px; line-height: 1.6; color: #5C5852; margin: 8px 0; }}
    .btn-container {{ text-align: center; margin: 32px 0; }}
    .btn {{ display: inline-block; background: #4F46E5; color: #FFFFFF !important; text-decoration: none; padding: 13px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; }}
    .link-box {{ background: #F7F6F2; border: 1px solid #E5E1DA; border-radius: 8px; padding: 12px; font-size: 12px; color: #7E7972; word-break: break-all; margin-top: 24px; }}
    .footer {{ margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5E1DA; font-size: 12px; color: #9CA3AF; text-align: center; }}
  </style>
</head>
<body>
  <div class="container">
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:24px;">
      <span class="logo">EDUVA AI</span>
      <span class="badge">Official Verification</span>
    </div>
    <h1>Namaste, {clean_name}!</h1>
    <p>Thank you for registering on <strong>Eduva AI</strong> - Nepal's autonomous higher education intelligence platform.</p>
    <p>Please confirm your email address to activate your student admissions profile, track entrance deadlines, and unlock personalized counselor memory.</p>
    
    <div class="btn-container">
      <a href="{verification_url}" target="_blank" class="btn">Verify My Email Address</a>
    </div>

    <p style="font-size: 12px; color: #7E7972;">This verification link will expire in 24 hours. If you did not create this account, you can safely disregard this message.</p>
    
    <div class="link-box">
      If the button does not work, copy and paste this link into your browser:<br>
      <a href="{verification_url}" style="color: #4F46E5;">{verification_url}</a>
    </div>

    <div class="footer">
      Eduva AI Intelligence Platform  Bagbazar / Pulchowk, Kathmandu, Nepal<br>
      Direct inquiries to support@eduva.ai
    </div>
  </div>
</body>
</html>"""

        if not self.is_configured:
            logger.info(
                f"[EMAIL_SERVICE DEV MODE] Transactional email not sent via Resend (EMAIL_API_KEY not configured). "
                f"Recipient: {clean_email}, Verification Link: {verification_url}"
            )
            return {
                "status": "SENT_DEV_MODE",
                "message": "Verification link generated (development mode).",
                "recipient": clean_email,
                "verification_url": verification_url,
                "delivered": False
            }

        # Send via Resend REST API
        payload = {
            "from": self.from_email,
            "to": [clean_email],
            "subject": subject,
            "html": html_content
        }

        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "User-Agent": "EduvaAI/1.0"
            },
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                resp_data = json.loads(resp.read().decode("utf-8"))
                logger.info(f"Verification email dispatched via Resend to {clean_email}: {resp_data.get('id')}")
                return {
                    "status": "SENT",
                    "message": "Verification email successfully dispatched.",
                    "recipient": clean_email,
                    "id": resp_data.get("id"),
                    "delivered": True
                }
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            logger.error(f"Resend API error ({e.code}): {err_body}")
            return {
                "status": "FAILED",
                "error": f"Email service error: {e.code}",
                "recipient": clean_email,
                "delivered": False
            }
        except Exception as ex:
            logger.error(f"Failed to deliver verification email: {ex}")
            return {
                "status": "FAILED",
                "error": str(ex),
                "recipient": clean_email,
                "delivered": False
            }


global_email_service = EmailService()
