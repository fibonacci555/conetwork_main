from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile, FriendRequest
from .serializers import UserProfileSerializer, FriendRequestSerializer

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
class FriendRequestView(APIView):
    def post(self, request):
        from_user_id = request.data.get('from_user_id')
        to_user_id = request.data.get('to_user_id')

        if not from_user_id or not to_user_id:
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from_user = UserProfile.objects.get(user_id=from_user_id)
            to_user = UserProfile.objects.get(user_id=to_user_id)

            # Evitar enviar pedido de amizade se já existir uma conexão
            if from_user.connects.filter(user_id=to_user_id).exists():
                return Response({'error': 'Users are already connected'}, status=status.HTTP_400_BAD_REQUEST)

            # Criar o pedido de amizade
            friend_request, created = FriendRequest.objects.get_or_create(from_user=from_user, to_user=to_user)

            if created:
                serializer = FriendRequestSerializer(friend_request)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Friend request already sent'}, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        user_id = request.headers.get('User-Id')
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_profile = UserProfile.objects.get(user_id=user_id)
            friend_requests = FriendRequest.objects.filter(to_user=user_profile)
            serializer = FriendRequestSerializer(friend_requests, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

# View para aceitar pedidos de amizade
class AcceptFriendRequestView(APIView):
    def post(self, request):
        request_id = request.data.get('request_id')

        try:
            friend_request = FriendRequest.objects.get(id=request_id)
            from_user = friend_request.from_user
            to_user = friend_request.to_user

            # Adicionar a conexão em ambos perfis
            from_user.connects.add(to_user)
            to_user.connects.add(from_user)

            # Remover o pedido de amizade após aceitar
            friend_request.delete()

            return Response({'message': 'Friend request accepted'}, status=status.HTTP_200_OK)
        except FriendRequest.DoesNotExist:
            return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)
