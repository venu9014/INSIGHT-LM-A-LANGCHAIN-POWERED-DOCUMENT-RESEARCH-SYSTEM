import pytest
import requests
import json
import os

BASE_URL = "http://127.0.0.1:8000"

INDIAN_TEST_ACCOUNTS = [
    {
        "name": "Aarav Sharma",
        "role": "Student",
        "username": "aarav_student",
        "email": "aarav.sharma@research.edu.in",
        "password": "Aarav#Student2026",
        "institution": "Indian Institute of Technology (IIT) Delhi",
        "user_id": "usr-aarav-sharma"
    },
    {
        "name": "Priya Patel",
        "role": "Student",
        "username": "priya_student",
        "email": "priya.patel@research.edu.in",
        "password": "Priya#Student2026",
        "institution": "BITS Pilani",
        "user_id": "usr-priya-patel"
    },
    {
        "name": "Prof. Rahul Verma",
        "role": "Teacher",
        "username": "rahul_prof",
        "email": "rahul.verma@faculty.edu.in",
        "password": "Rahul#Teacher2026",
        "institution": "Indian Institute of Technology (IIT) Bombay",
        "user_id": "usr-rahul-verma"
    },
    {
        "name": "Prof. Sneha Iyer",
        "role": "Teacher",
        "username": "sneha_prof",
        "email": "sneha.iyer@faculty.edu.in",
        "password": "Sneha#Teacher2026",
        "institution": "Indian Institute of Science (IISc) Bangalore",
        "user_id": "usr-sneha-iyer"
    },
    {
        "name": "Dr. Arjun Reddy",
        "role": "Researcher",
        "username": "arjun_research",
        "email": "arjun.reddy@lab.edu.in",
        "password": "Arjun#Research2026",
        "institution": "Indian Institute of Technology (IIT) Madras",
        "user_id": "usr-arjun-reddy"
    },
    {
        "name": "Dr. Ananya Nair",
        "role": "Researcher",
        "username": "ananya_research",
        "email": "ananya.nair@lab.edu.in",
        "password": "Ananya#Research2026",
        "institution": "IIIT Hyderabad",
        "user_id": "usr-ananya-nair"
    }
]

def test_users_database_passwords_are_scrypt_hashed():
    """Verify backend/data/users.json stores all 6 users with salted scrypt hashes and never plaintext."""
    users_file = os.path.join(os.path.dirname(__file__), "..", "backend", "data", "users.json")
    assert os.path.exists(users_file), f"Users file not found at {users_file}"
    
    with open(users_file, "r", encoding="utf-8") as f:
        users = json.load(f)
        
    usernames = {u["username"] for u in users}
    expected_usernames = {"aarav_student", "priya_student", "rahul_prof", "sneha_prof", "arjun_research", "ananya_research"}
    assert expected_usernames.issubset(usernames)
    assert len(users) >= 6
    
    for u in users:
        # Check required fields
        assert "password_hash" in u
        assert "id" in u
        assert "role" in u
        assert "institution" in u
        
        # Verify hash security
        pw_hash = u["password_hash"]
        assert pw_hash.startswith("scrypt:"), f"Password hash for {u['username']} is not scrypt: {pw_hash}"
        # Ensure raw password string is NOT in the database file
        for acc in INDIAN_TEST_ACCOUNTS:
            assert acc["password"] != pw_hash
            assert acc["password"] not in pw_hash

def test_get_auth_users_returns_all_6_sanitized_accounts():
    """Verify GET /api/auth/users returns all 6 Indian user accounts without password hashes."""
    resp = requests.get(f"{BASE_URL}/api/auth/users", timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert "users" in data
    users = data["users"]
    usernames = {u["username"] for u in users}
    expected_accounts = {"aarav_student", "priya_student", "rahul_prof", "sneha_prof", "arjun_research", "ananya_research"}
    assert expected_accounts.issubset(usernames)
    assert len(users) >= 6
    
    # Verify no password_hash leaks in API response
    for u in users:
        assert "password_hash" not in u
        assert "password" not in u
        assert "username" in u
        assert "email" in u
        assert "role" in u

def test_login_all_6_indian_accounts_by_username():
    """Verify all 6 Indian accounts can authenticate using their unique username and password."""
    for acc in INDIAN_TEST_ACCOUNTS:
        payload = {
            "emailOrUsername": acc["username"],
            "password": acc["password"]
        }
        resp = requests.post(f"{BASE_URL}/api/auth/login", json=payload, timeout=5)
        assert resp.status_code == 200, f"Login failed for {acc['username']}: {resp.text}"
        data = resp.json()
        assert data["success"] is True
        assert "token" in data
        assert data["user"]["role"] == acc["role"]
        assert data["user"]["username"] == acc["username"]
        assert data["user"]["name"] == acc["name"]
        assert "password_hash" not in data["user"]

def test_login_all_6_indian_accounts_by_email():
    """Verify all 6 Indian accounts can authenticate using their academic email address."""
    for acc in INDIAN_TEST_ACCOUNTS:
        payload = {
            "emailOrUsername": acc["email"],
            "password": acc["password"]
        }
        resp = requests.post(f"{BASE_URL}/api/auth/login", json=payload, timeout=5)
        assert resp.status_code == 200, f"Login by email failed for {acc['email']}: {resp.text}"
        data = resp.json()
        assert data["success"] is True
        assert data["user"]["username"] == acc["username"]
        assert data["user"]["email"] == acc["email"]

def test_login_invalid_password_returns_401():
    """Verify incorrect password fails with HTTP 401 Unauthorized."""
    payload = {
        "emailOrUsername": "aarav_student",
        "password": "WrongPassword#2026"
    }
    resp = requests.post(f"{BASE_URL}/api/auth/login", json=payload, timeout=5)
    assert resp.status_code == 401
    data = resp.json()
    assert "error" in data

def test_login_unknown_user_returns_401():
    """Verify non-existent username fails with HTTP 401."""
    payload = {
        "emailOrUsername": "unknown_academic_persona",
        "password": "SomePassword#2026"
    }
    resp = requests.post(f"{BASE_URL}/api/auth/login", json=payload, timeout=5)
    assert resp.status_code == 401
    data = resp.json()
    assert "error" in data

def test_rbac_student_users_denied_teacher_endpoints():
    """Verify both Student accounts (Aarav and Priya) receive 403 Forbidden on Teacher endpoints."""
    students = [acc for acc in INDIAN_TEST_ACCOUNTS if acc["role"] == "Student"]
    assert len(students) == 2
    
    for student in students:
        headers = {
            "X-User-Id": student["user_id"],
            "X-User-Role": "Student",
            "Content-Type": "application/json"
        }
        
        # Teacher question generation endpoint
        resp = requests.post(
            f"{BASE_URL}/api/teacher/questions/generate",
            json={"topic": "Quantum Computing"},
            headers=headers,
            timeout=5
        )
        assert resp.status_code == 403, f"{student['name']} should be blocked from teacher questions"
        assert resp.json().get("code") == "FORBIDDEN"
        
        # Teacher question papers endpoint
        resp = requests.get(
            f"{BASE_URL}/api/teacher/question-papers",
            headers=headers,
            timeout=5
        )
        assert resp.status_code == 403, f"{student['name']} should be blocked from teacher papers"

def test_rbac_teacher_users_allowed_teacher_endpoints():
    """Verify both Teacher accounts (Prof. Rahul and Prof. Sneha) can access Teacher endpoints."""
    teachers = [acc for acc in INDIAN_TEST_ACCOUNTS if acc["role"] == "Teacher"]
    assert len(teachers) == 2
    
    for teacher in teachers:
        headers = {
            "X-User-Id": teacher["user_id"],
            "X-User-Role": "Teacher",
            "Content-Type": "application/json"
        }
        
        # Teacher question papers list
        resp = requests.get(
            f"{BASE_URL}/api/teacher/question-papers",
            headers=headers,
            timeout=5
        )
        assert resp.status_code == 200, f"{teacher['name']} should access question papers"
        assert "question_papers" in resp.json()

def test_auth_me_resolves_profile_via_user_id_and_role():
    """Verify GET /api/auth/me resolves the active user profile from X-User-Id or X-User-Role."""
    # Test for Researcher Dr. Arjun Reddy
    resp = requests.get(
        f"{BASE_URL}/api/auth/me",
        headers={"X-User-Id": "usr-arjun-reddy"},
        timeout=5
    )
    assert resp.status_code == 200
    user = resp.json()["user"]
    assert user["name"] == "Dr. Arjun Reddy"
    assert user["role"] == "Researcher"
    
    # Test for Student Priya Patel
    resp = requests.get(
        f"{BASE_URL}/api/auth/me",
        headers={"X-User-Id": "usr-priya-patel"},
        timeout=5
    )
    assert resp.status_code == 200
    user = resp.json()["user"]
    assert user["name"] == "Priya Patel"
    assert user["role"] == "Student"

def test_login_empty_fields_returns_400():
    """Verify login with empty credentials returns HTTP 400."""
    resp = requests.post(f"{BASE_URL}/api/auth/login", json={}, timeout=5)
    assert resp.status_code == 400
    assert resp.json()["code"] == "MISSING_CREDENTIALS"

def test_registration_valid_student_and_duplicate_prevention():
    """Verify new user registration, scrypt password hashing, and duplicate prevention."""
    import uuid
    suffix = uuid.uuid4().hex[:6]
    test_user = {
        "name": f"Dev Test Student {suffix}",
        "username": f"dev_student_{suffix}",
        "email": f"dev.student.{suffix}@testing.edu.in",
        "password": "SecurePassword#2026",
        "role": "Student",
        "institution": "IIT Roorkee",
        "department": "Computer Science"
    }
    
    try:
        # 1. Register valid user
        resp = requests.post(f"{BASE_URL}/api/auth/register", json=test_user, timeout=5)
        assert resp.status_code == 201
        data = resp.json()
        assert data["success"] is True
        assert "token" in data
        assert data["user"]["username"] == test_user["username"]
        assert "password_hash" not in data["user"]
        
        # 2. Duplicate username should return 409 Conflict
        resp_dup_user = requests.post(f"{BASE_URL}/api/auth/register", json=test_user, timeout=5)
        assert resp_dup_user.status_code == 409
        assert resp_dup_user.json()["code"] == "DUPLICATE_USERNAME"
        
        # 3. Duplicate email with different username should also return 409 Conflict
        test_user_dup_email = dict(test_user, username=f"alt_user_{suffix}")
        resp_dup_email = requests.post(f"{BASE_URL}/api/auth/register", json=test_user_dup_email, timeout=5)
        assert resp_dup_email.status_code == 409
        assert resp_dup_email.json()["code"] == "DUPLICATE_EMAIL"
    finally:
        # Clean up database to preserve the canonical 6 Indian accounts
        users_file = os.path.join(os.path.dirname(__file__), "..", "backend", "data", "users.json")
        try:
            with open(users_file, "r", encoding="utf-8") as f:
                all_u = json.load(f)
            cleaned = [u for u in all_u if u.get("username") != test_user["username"] and u.get("username") != f"alt_user_{suffix}"]
            with open(users_file, "w", encoding="utf-8") as f:
                json.dump(cleaned, f, indent=2)
        except Exception:
            pass

def test_registration_invalid_data_rejections():
    """Verify registration rejects invalid roles, emails, and short passwords with HTTP 400."""
    # 1. Unauthorized role
    bad_role = {
        "name": "Intruder",
        "username": "intruder_user",
        "email": "intruder@evil.com",
        "password": "Password#123",
        "role": "SuperAdmin"
    }
    resp = requests.post(f"{BASE_URL}/api/auth/register", json=bad_role, timeout=5)
    assert resp.status_code == 400
    assert resp.json()["code"] == "INVALID_ROLE"
    
    # 2. Invalid email format
    bad_email = {
        "name": "Test User",
        "username": "bad_email_user",
        "email": "not-an-email",
        "password": "Password#123",
        "role": "Student"
    }
    resp = requests.post(f"{BASE_URL}/api/auth/register", json=bad_email, timeout=5)
    assert resp.status_code == 400
    assert resp.json()["code"] == "INVALID_EMAIL"
    
    # 3. Password too short (< 6 characters)
    short_pw = {
        "name": "Short Password",
        "username": "short_pw_user",
        "email": "shortpw@test.com",
        "password": "123",
        "role": "Student"
    }
    resp = requests.post(f"{BASE_URL}/api/auth/register", json=short_pw, timeout=5)
    assert resp.status_code == 400
    assert resp.json()["code"] == "PASSWORD_TOO_SHORT"

def test_password_reset_and_change_workflows():
    """Verify reset password instructions and password change endpoints."""
    # 1. Reset password request for Aarav Sharma
    resp = requests.post(
        f"{BASE_URL}/api/auth/reset-password",
        json={"emailOrUsername": "aarav_student"},
        timeout=5
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "reset_token" in data
    
    # 2. Reset password for non-existent user returns 404
    resp_404 = requests.post(
        f"{BASE_URL}/api/auth/reset-password",
        json={"emailOrUsername": "nonexistent_user_999"},
        timeout=5
    )
    assert resp_404.status_code == 404
    
    # 3. Change password with incorrect current password returns 401
    bad_change = requests.post(
        f"{BASE_URL}/api/auth/change-password",
        json={
            "emailOrUsername": "aarav_student",
            "currentPassword": "WrongCurrentPassword#2026",
            "newPassword": "BrandNewPassword#2026"
        },
        timeout=5
    )
    assert bad_change.status_code == 401
    assert bad_change.json()["code"] == "INVALID_PASSWORD"

def test_logout_endpoint():
    """Verify POST /api/auth/logout succeeds with 200."""
    resp = requests.post(f"{BASE_URL}/api/auth/logout", timeout=5)
    assert resp.status_code == 200
    assert resp.json()["success"] is True
