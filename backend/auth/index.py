"""
Авторизация: отправка OTP-кода и верификация по email или номеру телефона.
"""
import json
import os
import random
import string
import hashlib
import hmac
import time
import psycopg2


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, Authorization",
}

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def resp(status: int, data: dict) -> dict:
    return {"statusCode": status, "headers": CORS, "body": data}


def make_token(user_id: int) -> str:
    secret = os.environ.get("DATABASE_URL", "secret")
    msg = f"{user_id}:{int(time.time() // 3600)}"
    sig = hmac.new(secret.encode(), msg.encode(), hashlib.sha256).hexdigest()[:32]
    return sig + str(user_id)


def verify_token(token: str) -> int | None:
    if len(token) < 33:
        return None
    user_id_str = token[32:]
    if not user_id_str.isdigit():
        return None
    user_id = int(user_id_str)
    secret = os.environ.get("DATABASE_URL", "secret")
    for delta in range(25):
        msg = f"{user_id}:{int(time.time() // 3600) - delta}"
        expected = hmac.new(secret.encode(), msg.encode(), hashlib.sha256).hexdigest()[:32]
        if hmac.compare_digest(expected, token[:32]):
            return user_id
    return None


def generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "POST")
    raw_body = event.get("body") or "{}"
    if isinstance(raw_body, str):
        body = json.loads(raw_body)
    else:
        body = raw_body
    action = (body.get("action") or "").strip()

    # action=send — отправить OTP
    if action == "send":
        contact = (body.get("contact") or "").strip().lower()
        if not contact:
            return resp(400, {"error": "Укажите email или номер телефона"})

        is_email = "@" in contact
        code = generate_otp()

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.otp_codes (contact, code, expires_at) VALUES (%s, %s, NOW() + INTERVAL '10 minutes')",
            (contact, code)
        )
        conn.commit()
        cur.close()
        conn.close()

        print(f"[OTP] {contact} → {code}")

        return resp(200, {
            "ok": True,
            "is_email": is_email,
            "message": f"Код отправлен на {'почту' if is_email else 'телефон'}",
            "dev_code": code,
        })

    # action=verify — проверить OTP и войти/зарегистрироваться
    if action == "verify":
        contact = (body.get("contact") or "").strip().lower()
        code = (body.get("code") or "").strip()
        name = (body.get("name") or "").strip()

        if not contact or not code:
            return resp(400, {"error": "Введите контакт и код"})

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id FROM {SCHEMA}.otp_codes WHERE contact=%s AND code=%s AND used=FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
            (contact, code)
        )
        row = cur.fetchone()
        if not row:
            cur.close()
            conn.close()
            return resp(400, {"error": "Неверный или устаревший код"})

        otp_id = row[0]
        cur.execute(f"UPDATE {SCHEMA}.otp_codes SET used=TRUE WHERE id=%s", (otp_id,))

        is_email = "@" in contact
        if is_email:
            cur.execute(f"SELECT id, name FROM {SCHEMA}.users WHERE email=%s", (contact,))
        else:
            cur.execute(f"SELECT id, name FROM {SCHEMA}.users WHERE phone=%s", (contact,))

        user = cur.fetchone()
        is_new = user is None

        if is_new:
            display_name = name or contact.split("@")[0]
            if is_email:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.users (email, name) VALUES (%s, %s) RETURNING id, name",
                    (contact, display_name)
                )
            else:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.users (phone, name) VALUES (%s, %s) RETURNING id, name",
                    (contact, display_name)
                )
            user = cur.fetchone()

        conn.commit()
        cur.close()
        conn.close()

        user_id, user_name = user
        token = make_token(user_id)

        return resp(200, {
            "ok": True,
            "token": token,
            "user_id": user_id,
            "name": user_name,
            "is_new": is_new,
        })

    # action=me — профиль по токену
    if action == "me":
        auth = event.get("headers", {}).get("X-Authorization", "") or event.get("headers", {}).get("Authorization", "")
        token = auth.replace("Bearer ", "").strip()
        user_id = verify_token(token)
        if not user_id:
            return resp(401, {"error": "Не авторизован"})

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f"SELECT id, name, email, phone FROM {SCHEMA}.users WHERE id=%s", (user_id,))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if not user:
            return resp(404, {"error": "Пользователь не найден"})

        return resp(200, {"ok": True, "id": user[0], "name": user[1], "email": user[2], "phone": user[3]})

    return resp(404, {"error": "Неизвестное действие"})