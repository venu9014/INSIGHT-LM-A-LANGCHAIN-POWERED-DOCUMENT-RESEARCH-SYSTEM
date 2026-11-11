import os
import sys

# Ensure backend directory is in the Python search path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(parent_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Import the initialized Flask application
from server import app

# Vercel Serverless Function entrypoint
# Vercel automatically invokes 'app' as the WSGI callable
