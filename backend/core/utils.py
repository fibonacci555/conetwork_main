# utils.py (ou outro arquivo adequado)

import requests
from django.conf import settings
from .models import UserProfile
clerk_secret_key = "sk_test_AXdvYfhBfFqutEoJ6M7fsUybc22tZRU2ShU5h7dS6Y"
def create_user_profile(user_id):
    # Verifica se o usuário já existe
    if UserProfile.objects.filter(user_id=user_id).exists():
        return  # Usuário já existe, não faz nada

    # Configuração da API do Clerk
    clerk_api_url = f'https://api.clerk.dev/v1/users/{user_id}'
    

    if not clerk_secret_key:
        print('Clerk Secret Key não configurada')
        return

    headers = {
        'Authorization': f'Bearer {clerk_secret_key}',
        'Content-Type': 'application/json'
    }

    try:
        response = requests.get(clerk_api_url, headers=headers)
        if response.status_code == 200:
            user_data = response.json()

            # Extrair as informações necessárias
            first_name = user_data.get('first_name', '')
            last_name = user_data.get('last_name', '')

            email_addresses = user_data.get('email_addresses', [])
            email = email_addresses[0]['email_address'] if email_addresses else None

            phone_numbers = user_data.get('phone_numbers', [])
            phone_number = phone_numbers[0]['phone_number'] if phone_numbers else None

            profile_photo = user_data.get('profile_image_url', '')

            # Criar o UserProfile
            user_profile = UserProfile.objects.create(
                user_id=user_id,
                first_name=first_name,
                last_name=last_name,
                phone=phone_number,
                profile_photo=profile_photo,
                # Adicione outros campos se necessário
            )
        else:
            print(f'Falha ao buscar usuário {user_id} no Clerk: {response.text}')
    except Exception as e:
        print(f'Erro ao conectar à API do Clerk: {e}')
