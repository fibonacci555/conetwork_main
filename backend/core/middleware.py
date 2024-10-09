import os
import requests
import jwt
from jwt.algorithms import RSAAlgorithm
from django.http import JsonResponse

# Replace this URL with your actual Clerk JWKS URL
CLERK_JWKS_URL = "https://heroic-peacock-51.clerk.accounts.dev/.well-known/jwks.json"  # Replace 'abcd123' with your Clerk subdomain

def clerk_auth_middleware(get_response):
    def middleware(request):
        # Get the token from the Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            print("Authorization header missing or not in Bearer format")
            return JsonResponse({'error': 'Unauthorized'}, status=401)

        token = auth_header.split(' ')[1]

        try:
            # Fetch the JWKS from Clerk
            print(f"Fetching JWKS from: {CLERK_JWKS_URL}")  # Debugging
            jwks_response = requests.get(CLERK_JWKS_URL)
            jwks_response.raise_for_status()  # Raise an exception for HTTP errors
            jwks = jwks_response.json()

            # Extract public keys from JWKS
            public_keys = {key['kid']: RSAAlgorithm.from_jwk(key) for key in jwks['keys']}

            # Extract the header from the JWT token
            unverified_header = jwt.get_unverified_header(token)
            kid = unverified_header.get('kid')

            if not kid or kid not in public_keys:
                print(f"KID not found in JWKS: {kid}")
                return JsonResponse({'error': 'Unauthorized'}, status=401)

            # Validate the JWT token using the public key
            public_key = public_keys[kid]
            decoded_token = jwt.decode(token, public_key, algorithms=["RS256"], audience=None)

            # Log success
            print("Token successfully validated. Payload:", decoded_token)

            # Attach the `user_id` to the request object
            request.user_id = decoded_token.get('sub')

        except requests.RequestException as e:
            print(f"Error fetching JWKS: {str(e)}")
            return JsonResponse({'error': 'Unable to validate token', 'details': str(e)}, status=500)

        except jwt.ExpiredSignatureError:
            print("Token expired.")
            return JsonResponse({'error': 'Token has expired'}, status=401)

        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {str(e)}")
            return JsonResponse({'error': 'Unauthorized'}, status=401)

        # Continue if the token is valid
        return get_response(request)

    return middleware
