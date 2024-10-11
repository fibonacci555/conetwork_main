from rest_framework import serializers
from .models import UserProfile,  FriendRequest




class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = serializers.StringRelatedField()
    to_user = serializers.StringRelatedField()

    class Meta:
        model = FriendRequest
        fields = '__all__'
        
class UserProfileSerializer(serializers.ModelSerializer):
    connects = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = UserProfile
        fields = ['user_id', 'first_name', 'last_name', 'phone', 'knowledges', 'connects']
        extra_kwargs = {
            'connects': {'read_only': True}  # Prevent modification through serializer
        }