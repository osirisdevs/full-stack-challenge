from django.contrib.auth.models import User
from rest_framework import serializers
from performancereview.models import PerformanceReview, ReviewFeedback


class UserSerializerCreate(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'password')
    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'email', 'password')
    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class PerformanceReviewSerializerCreate(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PerformanceReview
        fields = ('url', 'reviewee')

class PerformanceReviewSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PerformanceReview
        fields = ('url',)

class ReviewFeedbackSerializerCreate(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReviewFeedback
        fields = ('url', 'reviewer', 'feedback', 'performanceReview')
    def validate(self, data):
        """
        Check that the reviewer is not an admin and not the reviewee
        """
        reviewer = data['reviewer']
        reviewee = data['performanceReview'].reviewee
        if reviewer.is_staff or reviewer.pk == reviewee.pk:
            raise serializers.ValidationError("Invalid reviewer")
        return data


class ReviewFeedbackSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReviewFeedback
        fields = ('url', 'feedback')
