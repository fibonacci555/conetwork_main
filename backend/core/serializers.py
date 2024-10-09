from rest_framework import serializers
from .models import UserProfile,  FriendRequest

class UserProfileSerializer(serializers.ModelSerializer):
    connects = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'


class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = serializers.StringRelatedField()
    to_user = serializers.StringRelatedField()

    class Meta:
        model = FriendRequest
        fields = '__all__'