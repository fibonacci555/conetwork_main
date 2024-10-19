from rest_framework import serializers
from .models import UserProfile,  FriendRequest
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'phone_number', 'profile_image']

class UserProfileSerializer(serializers.ModelSerializer):
    connects = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    photo = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = UserProfile
        fields = ['user_id', 'first_name', 'last_name', 'phone', 'knowledges', 'connects','photo']
        extra_kwargs = {
            'connects': {'read_only': True}  # Prevent modification through serializer
        }

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserProfileSerializer()
    to_user = UserProfileSerializer()

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'timestamp', 'status']
        
