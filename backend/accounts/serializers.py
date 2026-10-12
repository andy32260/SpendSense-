from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

    def validate(self, data):
        try:
            user = User(
                username=data['username'],
            )
            validate_password(data['password'], user=user)
        except ValidationError as e:
            raise serializers.ValidationError({'password': e.messages})
        return data

