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


class UserConnectionsView(APIView):
    

    def get(self, request, user_id):
        user_profile = get_object_or_404(UserProfile, user_id=user_id)
        connections = user_profile.connects.all()
        serializer = UserProfileSerializer(connections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, user_id, connection_id):
        user_profile = get_object_or_404(UserProfile, user_id=user_id)
        connection = get_object_or_404(UserProfile, user_id=connection_id)

        # Remove the connection from the user's connections
        user_profile.connects.remove(connection)
        return Response({'message': 'Connection removed successfully.'}, status=status.HTTP_200_OK)

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

    def get(self, request, user_id):
        print(f"User making the request: {request.user}")  # Debugging statement

        # Optional: Ensure that users can only access their own connection count
        
        user_profile = get_object_or_404(UserProfile, user_id=user_id)
        connections_count = user_profile.connects.count()
        return Response({'connections_count': connections_count}, status=status.HTTP_200_OK)


class AddManualConnectView(APIView):
    def get(self, request):
        return Response({'message': 'This is a GET request'}, status=status.HTTP_200_OK)
    
    
    def post(self, request):
        
        # Extract the current user's ID from the headers (after being authenticated by the middleware)
      
        current_user_id = request.data.get("user_id")
        current_user = get_object_or_404(UserProfile, user_id=current_user_id)

        # Generate a unique user_id for the new profile
        new_user_id = f"manual_{random.randint(10000, 99999)}"
        new_connection_data = {
            "user_id": new_user_id,
            "first_name": request.data.get("first_name"),
            "last_name": request.data.get("last_name"),
            "phone": request.data.get("phone_number"),
            "knowledges": request.data.get("knowledges", "").split(","),
        }

        serializer = UserProfileSerializer(data=new_connection_data)
        if serializer.is_valid():
            new_profile = serializer.save()

            # Add the new connection to the current user's connections
            current_user.connects.add(new_profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class KnowledgeView(APIView):
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

    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Views for managing friend requests remain unchanged unless needed
class SendFriendRequestView(APIView):
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

# View para responder ao pedido de conexão (aceitar ou recusar)
class RespondToFriendRequestView(APIView):
    def post(self, request, request_id):
        action = request.data.get('action')
        friend_request = get_object_or_404(FriendRequest, id=request_id)

        if action == 'accept':
            friend_request.status = 'accepted'
            friend_request.from_user.connects.add(friend_request.to_user)
            friend_request.to_user.connects.add(friend_request.from_user)
            friend_request.save()
            return Response({'message': 'Friend request accepted.'}, status=status.HTTP_200_OK)
        elif action == 'decline':
            friend_request.status = 'rejected'
            friend_request.save()
            return Response({'message': 'Friend request declined.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

# View para listar pedidos pendentes
class ListFriendRequestsView(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(UserProfile, user_id=user_id)
        friend_requests = FriendRequest.objects.filter(to_user=user, status='pending')
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
