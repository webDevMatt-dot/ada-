from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['department']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    department = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'profile', 'department']

    def create(self, validated_data):
        department = validated_data.pop('department', 'HQ')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(**validated_data, password=password)
        UserProfile.objects.create(user=user, department=department)
        return user

    def update(self, instance, validated_data):
        department = validated_data.pop('department', None)
        password = validated_data.pop('password', None)

        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)

        if password:
            instance.set_password(password)

        if department:
            if hasattr(instance, 'profile'):
                instance.profile.department = department
                instance.profile.save()
            else:
                UserProfile.objects.create(user=instance, department=department)

        instance.save()
        return instance
