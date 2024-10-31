import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile, FriendRequest
from .serializers import UserProfileSerializer, FriendRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile, FriendRequest
from .serializers import FriendRequestSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSearchSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
import requests
import os
from .decorators import ensure_user_profile

User = get_user_model()
clerk_secret_key = "sk_test_AXdvYfhBfFqutEoJ6M7fsUybc22tZRU2ShU5h7dS6Y"
class UserSearchAPIView(APIView):
    @ensure_user_profile
    def get(self, request):
        query = request.query_params.get('query', '')
        current_user_clerk_id = request.query_params.get('user_id')
        
        if not query:
            return Response({'error': 'Parâmetro de consulta ausente.'}, status=status.HTTP_400_BAD_REQUEST)
        
        clerk_api_url = 'https://api.clerk.dev/v1/users'
        
        # Armazene sua Secret Key em uma variável de ambiente

        headers = {
        'Authorization': f'Bearer {clerk_secret_key}',
        'Content-Type': 'application/json'
        }

        results = []
        user_ids = set()
        print(UserProfile.objects.get(user_id=current_user_clerk_id).connects.all())
        
        search_fields = ['email_address', 'phone_number', 'username', 'first_name', 'last_name']

        for field in search_fields:
            params = {
                'limit': 10,
                f'filter[{field}]': query
            }
        try:
            response = requests.get(clerk_api_url, headers=headers, params=params)
            if response.status_code == 200:
                users = response.json()
                if isinstance(users, list) and users:
                    for user in users:
                        # Excluir o usuário atual dos resultados
                        if user['id'] == current_user_clerk_id:
                            continue
                        
                        if user['id'] not in user_ids:
                            user_ids.add(user['id'])
                            email_addresses = user.get('email_addresses', [])
                            email = email_addresses[0]['email_address'] if email_addresses else None

                            phone_numbers = user.get('phone_numbers', [])
                            phone_number = phone_numbers[0]['phone_number'] if phone_numbers else None

                            results.append({
                                'id': user.get('id'),
                                'first_name': user.get('first_name'),
                                'last_name': user.get('last_name'),
                                'email': email,
                                'phone_number': phone_number,
                                'username': user.get('username'),
                                'profile_image_url': user.get('profile_image_url'),
                            })
                else:
                    print(f"Nenhum usuário encontrado para o campo {field} com o valor '{query}'.")
            else:
                print(f'Erro ao buscar usuários no Clerk pelo campo {field}:', response.text)
        except Exception as e:
            print(f'Erro ao conectar à API do Clerk para {field}:', e)
            return Response({'error': 'Erro interno do servidor.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not results:
            return Response({'message': 'Nenhum usuário encontrado.'}, status=status.HTTP_200_OK)
    
        return Response(results, status=status.HTTP_200_OK)

class UserConnectionsView(APIView):
    @ensure_user_profile
    def get(self, request, user_id):
        user_profile = get_object_or_404(UserProfile, user_id=user_id)
        connections = user_profile.connects.all()

        # Lists to store the user data
        serialized_connections = []

        # For connections that start with 'manual', get info from local database
        manual_connections = connections.filter(user_id__startswith='manual')
        manual_serializer = UserProfileSerializer(manual_connections, many=True)
        serialized_connections.extend(manual_serializer.data)

        # For other connections, fetch info from Clerk
        clerk_connections = connections.exclude(user_id__startswith='manual')

        if clerk_connections.exists():
            clerk_user_ids = clerk_connections.values_list('user_id', flat=True)

            # Fetch user info from Clerk API
            clerk_users_info = []
            clerk_api_url = 'https://api.clerk.dev/v1/users'
            clerk_secret_key = "sk_test_AXdvYfhBfFqutEoJ6M7fsUybc22tZRU2ShU5h7dS6Y"
            if not clerk_secret_key:
                return Response({'error': 'Clerk Secret Key not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            headers = {
                'Authorization': f'Bearer {clerk_secret_key}',
                'Content-Type': 'application/json'
            }

            # Since Clerk doesn't support fetching multiple users at once via API, we'll need to fetch them individually
            for clerk_user_id in clerk_user_ids:
                try:
                    response = requests.get(f'{clerk_api_url}/{clerk_user_id}', headers=headers)
                    if response.status_code == 200:
                        user = response.json()

                        # Extract phone number and email from Clerk data
                        email_addresses = user.get('email_addresses', [])
                        email = email_addresses[0]['email_address'] if email_addresses else None

                        phone_numbers = user.get('phone_numbers', [])
                        
                        phone_number = phone_numbers[0]['phone_number'] if phone_numbers else None
                        

                        # Fetch 'knowledges' from local database using user_id
                        try:
                            profile = UserProfile.objects.get(user_id=clerk_user_id)
                            knowledges = profile.knowledges
                        except UserProfile.DoesNotExist:
                            # If no profile exists, 'knowledges' is empty
                            knowledges = []

                        serialized_user = {
                            'user_id': user.get('id'),
                            'first_name': user.get('first_name'),
                            'last_name': user.get('last_name'),
                            'email': email,
                            'phone_number': phone_number,
                            'username': user.get('username'),
                            'profile_photo': user.get('profile_image_url'),
                            'knowledges': knowledges,
                        }
                        
                        serialized_connections.append(serialized_user)
                    else:
                        print(f'Failed to fetch user {clerk_user_id} from Clerk: {response.text}')
                except Exception as e:
                    print(f'Error fetching user {clerk_user_id} from Clerk: {e}')
                    continue  # Skip this user and continue with the next

        return Response(serialized_connections, status=status.HTTP_200_OK)
    @ensure_user_profile
    def delete(self, request, user_id, connection_id):
        user_profile = get_object_or_404(UserProfile, user_id=user_id)
        connection = get_object_or_404(UserProfile, user_id=connection_id)

        # Remove the connection from the user's connections
        user_profile.connects.remove(connection)
        return Response({'message': 'Connection removed successfully.'}, status=status.HTTP_200_OK)
    @ensure_user_profile
    def put(self, request, user_id, connection_id):
        user_profile = get_object_or_404(UserProfile, user_id=user_id)
        connection = get_object_or_404(UserProfile, user_id=connection_id)

        if not connection.user_id.startswith('manual'):
            return Response({'error': 'Cannot edit this connection.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserProfileSerializer(connection, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Connection updated successfully.', 'connection': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserConnectionsCountView(APIView):
    @ensure_user_profile
    def get(self, request, user_id):
        print(f"User making the request: {request.user}")  # Debugging statement

        # Optional: Ensure that users can only access their own connection count
        
        user_profile = get_object_or_404(UserProfile, user_id=user_id)
        connections_count = user_profile.connects.count()
        return Response({'connections_count': connections_count}, status=status.HTTP_200_OK)

class AddManualConnectView(APIView):
    @ensure_user_profile
    def get(self, request):
        return Response({'message': 'This is a GET request'}, status=status.HTTP_200_OK)
    @ensure_user_profile
    def post(self, request):
        # Extrair o ID do usuário atual do payload
        current_user_id = request.data.get("user_id")
        current_user = get_object_or_404(UserProfile, user_id=current_user_id)

        # Gerar um user_id único para o novo perfil
        new_user_id = f"manual_{random.randint(10000, 99999)}"
        
        # Preparar os dados para o serializer
        new_connection_data = {
            "user_id": new_user_id,
            "first_name": request.data.get("first_name"),
            "last_name": request.data.get("last_name"),
            "phone": request.data.get("phone_number"),
            "knowledges": [knowledge.strip() for knowledge in request.data.get("knowledges", "").split(",")],
            "profile_photo": request.FILES.get("photo")  # Capturar a imagem enviada
        }
        
        
        

        serializer = UserProfileSerializer(data=new_connection_data)
        if serializer.is_valid():
            new_profile = serializer.save()
            
            # Adicionar a nova conexão às conexões do usuário atual
            current_user.connects.add(new_profile)
            current_user.save()  # Salvar as alterações no usuário atual

            # Preparar os dados de resposta, incluindo a URL da foto
            response_data = serializer.data
            if new_profile.profile_photo:
                request_scheme = request.scheme
                request_host = request.get_host()
                photo_url = f"{request_scheme}://{request_host}{new_profile.profile_photo.url}"
              
                response_data["profile_photo"] = photo_url
                
            else:
                response_data["profile_photo"] = None

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class KnowledgeView(APIView):
    @ensure_user_profile
    def get(self, request):
        # Obter o user_id do middleware
        user_id = getattr(request, 'user_id', None)
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_profile, created = UserProfile.objects.get_or_create(user_id=user_id)
            return Response(user_profile.knowledges, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
    @ensure_user_profile
    def put(self, request):
        # Obter o user_id do middleware
        user_id = getattr(request, 'user_id', None)
        knowledge = request.data.get('knowledge')
        if not user_id or not knowledge:
            return Response({'error': 'User ID and knowledge are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_profile, created = UserProfile.objects.get_or_create(user_id=user_id)
            if knowledge in user_profile.knowledges:
                return Response({'error': 'Knowledge already exists'}, status=status.HTTP_400_BAD_REQUEST)
            user_profile.knowledges.append(knowledge)
            user_profile.save()
            return Response({'message': 'Knowledge added successfully', 'knowledges': user_profile.knowledges}, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
    @ensure_user_profile
    def delete(self, request):
        # Obter o user_id do middleware
        user_id = getattr(request, 'user_id', None)
        knowledge = request.data.get('knowledge')
        if not user_id or not knowledge:
            return Response({'error': 'User ID and knowledge are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_profile = UserProfile.objects.get(user_id=user_id)
            if knowledge in user_profile.knowledges:
                user_profile.knowledges.remove(knowledge)
                user_profile.save()
                return Response({'message': 'Knowledge removed successfully', 'knowledges': user_profile.knowledges}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Knowledge not found in user profile'}, status=status.HTTP_404_NOT_FOUND)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(APIView):
    @ensure_user_profile
    def get(self, request):
        user_id = getattr(request, 'user_id', None)
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile, created = UserProfile.objects.get_or_create(user_id=user_id)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    @ensure_user_profile
    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendFriendRequestView(APIView):
    @ensure_user_profile
    def post(self, request):
        from_user_id = request.data.get('from_user_id')
        to_user_id = request.data.get('to_user_id')

        if not from_user_id or not to_user_id:
            return Response({'error': 'Both from_user_id and to_user_id are required.'}, status=status.HTTP_400_BAD_REQUEST)

        from_user = get_object_or_404(UserProfile, user_id=from_user_id)
        to_user = get_object_or_404(UserProfile, user_id=to_user_id)

        # Verificar se o pedido já existe
        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user, status='pending').exists():
            return Response({'message': 'Friend request already sent.'}, status=status.HTTP_200_OK)

        # Criar pedido de amizade
        friend_request = FriendRequest.objects.create(from_user=from_user, to_user=to_user)
        serializer = FriendRequestSerializer(friend_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RespondToFriendRequestView(APIView):
    @ensure_user_profile
    def post(self, request, request_id):
        action = request.data.get('action')
        friend_request = get_object_or_404(FriendRequest, id=request_id)

        if action == 'accept':
            friend_request.status = 'accepted'
            # Adicionar ambos os usuários às conexões um do outro
            friend_request.from_user.connects.add(friend_request.to_user)
            friend_request.to_user.connects.add(friend_request.from_user)
            friend_request.from_user.save()
            friend_request.to_user.save()
            friend_request.save()
            return Response({'message': 'Friend request accepted.'}, status=status.HTTP_200_OK)
        elif action == 'decline':
            friend_request.status = 'rejected'
            friend_request.save()
            return Response({'message': 'Friend request declined.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

class ListFriendRequestsView(APIView):
    @ensure_user_profile
    def get(self, request, user_id):
        user = get_object_or_404(UserProfile, user_id=user_id)
        friend_requests = FriendRequest.objects.filter(to_user=user, status='pending')
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


